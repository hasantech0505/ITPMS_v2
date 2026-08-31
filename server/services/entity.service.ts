import { EntityRepository } from "../repositories/entity.repository";
import { UserRepository } from "../repositories/user.repository";
import { ResidentRepository } from "../repositories/resident.repository";

export class EntityService {
  static async getFullState() {
    return await EntityRepository.getFullState();
  }

  static async getCollection(entityName: string) {
    if (entityName === "users") {
      return await UserRepository.getAllUsers();
    }
    if (entityName === "residents") {
      return await ResidentRepository.getAllResidents();
    }
    return await EntityRepository.getCollection(entityName);
  }

  static async getItemById(entityName: string, id: string) {
    if (entityName === "users") {
      return await UserRepository.findById(id);
    }
    if (entityName === "residents") {
      return await ResidentRepository.findById(id);
    }
    return await EntityRepository.getItemById(entityName, id);
  }

  static async createItem(entityName: string, itemData: any, userContext?: { id: string; name: string; role: string }) {
    if (entityName === "residents") {
      const created = await ResidentRepository.createResident(itemData);
      if (userContext) {
        EntityRepository.appendActivityLog({
          id: `act-${Date.now()}`,
          userId: userContext.id,
          userName: userContext.name,
          userRole: userContext.role,
          action: `CREATE_${entityName.toUpperCase()}`,
          entity: entityName,
          entityId: created.id,
          timestamp: new Date().toISOString(),
          details: `Created new ${entityName} record #${created.id}`,
        }).catch(() => {});
      }
      return created;
    }

    const newItem = {
      ...itemData,
      id: itemData.id || `${entityName.slice(0, 3)}-${Date.now()}`,
    };

    const created = await EntityRepository.createItem(entityName, newItem);

    if (userContext) {
      EntityRepository.appendActivityLog({
        id: `act-${Date.now()}`,
        userId: userContext.id,
        userName: userContext.name,
        userRole: userContext.role,
        action: `CREATE_${entityName.toUpperCase()}`,
        entity: entityName,
        entityId: created.id,
        timestamp: new Date().toISOString(),
        details: `Created new ${entityName} record #${created.id}`,
      }).catch(() => {});
    }

    return created;
  }

  static async updateItem(entityName: string, id: string, updates: any, userContext?: { id: string; name: string; role: string }) {
    let updated;
    if (entityName === "users") {
      updated = await UserRepository.updateUser(id, updates);
    } else if (entityName === "residents") {
      updated = await ResidentRepository.updateResident(id, updates);
    } else {
      updated = await EntityRepository.updateItem(entityName, id, updates);
    }

    if (!updated) {
      throw { statusCode: 404, message: `Record in ${entityName} with id ${id} not found` };
    }

    if (userContext) {
      EntityRepository.appendActivityLog({
        id: `act-${Date.now()}`,
        userId: userContext.id,
        userName: userContext.name,
        userRole: userContext.role,
        action: `UPDATE_${entityName.toUpperCase()}`,
        entity: entityName,
        entityId: id,
        timestamp: new Date().toISOString(),
        details: `Updated ${entityName} record #${id}`,
      }).catch(() => {});
    }

    return updated;
  }

  static async deleteItem(entityName: string, id: string, userContext?: { id: string; name: string; role: string }) {
    let success = false;
    if (entityName === "users") {
      success = await UserRepository.deleteUser(id);
    } else if (entityName === "residents") {
      success = await ResidentRepository.deleteResident(id);
    } else {
      success = await EntityRepository.deleteItem(entityName, id);
    }

    if (!success) {
      throw { statusCode: 404, message: `Record in ${entityName} with id ${id} not found` };
    }

    if (userContext) {
      EntityRepository.appendActivityLog({
        id: `act-${Date.now()}`,
        userId: userContext.id,
        userName: userContext.name,
        userRole: userContext.role,
        action: `DELETE_${entityName.toUpperCase()}`,
        entity: entityName,
        entityId: id,
        timestamp: new Date().toISOString(),
        details: `Deleted ${entityName} record #${id}`,
      }).catch(() => {});
    }

    return { success: true, message: `Successfully deleted ${id} from ${entityName}` };
  }
}
