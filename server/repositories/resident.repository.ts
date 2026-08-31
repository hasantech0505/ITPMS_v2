import { saveDocToPostgres, deleteDocFromPostgres, getPool, getCollectionFromPostgres } from "../postgres";
import fs from "fs/promises";
import path from "path";
import { Resident, ResidentStatus } from "../../src/types";
import { deriveDistrictFromAddress } from "../../src/utils/districtFromAddress";

const dbPath = path.join(process.cwd(), "server", "db_store.json");

async function readDB(): Promise<any> {
  try {
    const content = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return { residents: [] };
  }
}

async function writeDB(data: any): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing db_store.json:", error);
  }
}

export interface ResidentFilterOptions {
  search?: string;
  status?: string;
  district?: string;
  industry?: string;
  exportRange?: string; // ALL, ZERO, LOW (<50k), MED (50k-1M), HIGH (1M+)
  staffRange?: string; // ALL, SMALL (<20), MED (20-100), LARGE (100+)
  year?: string;
  potentialStage?: string;
  upcomingStage?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ResidentPaginatedResult {
  residents: Resident[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statistics: {
    totalResidents: number;
    activeCount: number;
    pendingCount: number;
    potentialCount: number;
    removedCount: number;
    suspendedCount: number;
    totalExportVolume: number;
    totalDomesticVolume: number;
    totalEmployees: number;
  };
}

export class ResidentRepository {
  static async getAllResidents(): Promise<Resident[]> {
    if (getPool()) {
      const fromPg = await getCollectionFromPostgres("residents");
      if (fromPg !== null) return fromPg as Resident[];
    }
    const db = await readDB();
    return db.residents || [];
  }

  static async findById(id: string): Promise<Resident | null> {
    const residents = await this.getAllResidents();
    return residents.find(r => r.id === id) || null;
  }

  static async findByRegistrationNumber(registrationNumber: string): Promise<Resident | null> {
    const residents = await this.getAllResidents();
    return residents.find(r => r.registrationNumber === registrationNumber) || null;
  }

  static async getResidentsFiltered(options: ResidentFilterOptions): Promise<ResidentPaginatedResult> {
    const all = await this.getAllResidents();

    // 1. Calculate overall global statistics across dataset
    const registered = all.filter(r => r.status !== ResidentStatus.POTENTIAL && r.status !== ResidentStatus.REMOVED);
    const statistics = {
      totalResidents: registered.length,
      activeCount: all.filter(r => r.status === ResidentStatus.ACTIVE).length,
      pendingCount: all.filter(r => r.status === ResidentStatus.PENDING).length,
      potentialCount: all.filter(r => r.status === ResidentStatus.POTENTIAL).length,
      removedCount: all.filter(r => r.status === ResidentStatus.REMOVED).length,
      suspendedCount: all.filter(r => r.status === ResidentStatus.SUSPENDED).length,
      totalExportVolume: registered.reduce((acc, r) => acc + (Number(r.exportVolume) || 0), 0),
      totalDomesticVolume: registered.reduce((acc, r) => acc + (Number(r.domesticVolume) || 0), 0),
      totalEmployees: registered.reduce((acc, r) => acc + (Number(r.employeesCount) || 0), 0),
    };

    let filtered = [...all];

    // Search filter
    if (options.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      filtered = filtered.filter(r => 
        (r.companyName && r.companyName.toLowerCase().includes(q)) ||
        (r.director && r.director.toLowerCase().includes(q)) ||
        (r.registrationNumber && r.registrationNumber.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.legalAddress && r.legalAddress.toLowerCase().includes(q)) ||
        (r.district && r.district.toLowerCase().includes(q)) ||
        (r.industry && r.industry.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (options.status && options.status.toUpperCase() !== "ALL") {
      filtered = filtered.filter(r => r.status === options.status?.toUpperCase());
    }

    // District filter
    if (options.district && options.district.toUpperCase() !== "ALL") {
      filtered = filtered.filter(r => r.district === options.district);
    }

    // Industry filter
    if (options.industry && options.industry.toUpperCase() !== "ALL") {
      filtered = filtered.filter(r => r.industry === options.industry);
    }

    // Export Range filter
    if (options.exportRange && options.exportRange.toUpperCase() !== "ALL") {
      const mode = options.exportRange.toUpperCase();
      if (mode === "ZERO") {
        filtered = filtered.filter(r => (r.exportVolume || 0) === 0);
      } else if (mode === "LOW") {
        filtered = filtered.filter(r => (r.exportVolume || 0) > 0 && (r.exportVolume || 0) < 50000);
      } else if (mode === "MED" || mode === "MEDIUM") {
        filtered = filtered.filter(r => (r.exportVolume || 0) >= 50000 && (r.exportVolume || 0) < 1000000);
      } else if (mode === "HIGH") {
        filtered = filtered.filter(r => (r.exportVolume || 0) >= 1000000);
      }
    }

    // Staff Range filter
    if (options.staffRange && options.staffRange.toUpperCase() !== "ALL") {
      const mode = options.staffRange.toUpperCase();
      if (mode === "SMALL") {
        filtered = filtered.filter(r => (r.employeesCount || 0) < 20);
      } else if (mode === "MED" || mode === "MEDIUM") {
        filtered = filtered.filter(r => (r.employeesCount || 0) >= 20 && (r.employeesCount || 0) < 100);
      } else if (mode === "LARGE") {
        filtered = filtered.filter(r => (r.employeesCount || 0) >= 100);
      }
    }

    // Year filter (based on appliedAt or approvedAt year)
    if (options.year && options.year.toUpperCase() !== "ALL") {
      filtered = filtered.filter(r => {
        const dateStr = r.appliedAt || r.approvedAt || "";
        return dateStr.startsWith(options.year!);
      });
    }

    // Potential stage filter
    if (options.potentialStage && options.potentialStage.toUpperCase() !== "ALL") {
      filtered = filtered.filter(r => r.potentialStage === options.potentialStage);
    }

    // Upcoming stage filter
    if (options.upcomingStage && options.upcomingStage.toUpperCase() !== "ALL") {
      filtered = filtered.filter(r => r.upcomingStage === options.upcomingStage);
    }

    // Sorting
    const sortBy = (options.sortBy || "companyName") as keyof Resident;
    const sortOrder = options.sortOrder || "asc";

    filtered.sort((a, b) => {
      let valA: any = a[sortBy] ?? "";
      let valB: any = b[sortBy] ?? "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Pagination
    const total = filtered.length;
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 50);
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedResidents = filtered.slice(startIndex, startIndex + limit);

    return {
      residents: paginatedResidents,
      total,
      page,
      limit,
      totalPages,
      statistics,
    };
  }

  static async getStatistics() {
    const all = await this.getAllResidents();
    const registered = all.filter(r => r.status !== ResidentStatus.POTENTIAL && r.status !== ResidentStatus.REMOVED);

    const activeCount = all.filter(r => r.status === ResidentStatus.ACTIVE).length;
    const pendingCount = all.filter(r => r.status === ResidentStatus.PENDING).length;
    const potentialCount = all.filter(r => r.status === ResidentStatus.POTENTIAL).length;
    const removedCount = all.filter(r => r.status === ResidentStatus.REMOVED).length;
    const suspendedCount = all.filter(r => r.status === ResidentStatus.SUSPENDED).length;

    const totalExportVolume = registered.reduce((acc, r) => acc + (Number(r.exportVolume) || 0), 0);
    const totalDomesticVolume = registered.reduce((acc, r) => acc + (Number(r.domesticVolume) || 0), 0);
    const totalEmployees = registered.reduce((acc, r) => acc + (Number(r.employeesCount) || 0), 0);

    // District breakdown
    const districtBreakdown: Record<string, { count: number; exportVolume: number; employees: number }> = {};
    registered.forEach(r => {
      const dist = r.district || deriveDistrictFromAddress(r.legalAddress) || "Qarshi";
      if (!districtBreakdown[dist]) {
        districtBreakdown[dist] = { count: 0, exportVolume: 0, employees: 0 };
      }
      districtBreakdown[dist].count += 1;
      districtBreakdown[dist].exportVolume += Number(r.exportVolume) || 0;
      districtBreakdown[dist].employees += Number(r.employeesCount) || 0;
    });

    // Industry breakdown
    const industryBreakdown: Record<string, { count: number; exportVolume: number; employees: number }> = {};
    registered.forEach(r => {
      const ind = r.industry || "Software Development";
      if (!industryBreakdown[ind]) {
        industryBreakdown[ind] = { count: 0, exportVolume: 0, employees: 0 };
      }
      industryBreakdown[ind].count += 1;
      industryBreakdown[ind].exportVolume += Number(r.exportVolume) || 0;
      industryBreakdown[ind].employees += Number(r.employeesCount) || 0;
    });

    return {
      totalResidents: registered.length,
      activeCount,
      pendingCount,
      potentialCount,
      removedCount,
      suspendedCount,
      totalExportVolume,
      totalDomesticVolume,
      totalEmployees,
      districtBreakdown,
      industryBreakdown,
    };
  }

  static async createResident(data: Omit<Resident, "id"> & { id?: string }): Promise<Resident> {
    const db = await readDB();
    db.residents = db.residents || [];

    const newId = data.id || `res-${Date.now()}`;
    const newResident: Resident = {
      ...data,
      id: newId,
      status: data.status || ResidentStatus.ACTIVE,
      appliedAt: data.appliedAt || new Date().toISOString().split("T")[0],
      benefitsApplied: data.benefitsApplied || ["0% Corporate Income Tax", "7.5% Personal Income Tax"],
      notes: data.notes || [],
      documents: data.documents || [],
      docFiles: data.docFiles || [],
      quarterlyReports: data.quarterlyReports || [],
      monitoringHistory: data.monitoringHistory || [],
      meetings: data.meetings || [],
      tasks: data.tasks || [],
      historyLogs: data.historyLogs || [],
      photos: data.photos || []
    };

    db.residents.push(newResident);
    await writeDB(db);

    await saveDocToPostgres("residents", newId, newResident);
    return newResident;
  }

  static async updateResident(id: string, updates: Partial<Resident>): Promise<Resident | null> {
    const db = await readDB();
    db.residents = db.residents || [];

    const index = db.residents.findIndex((r: Resident) => r.id === id);
    if (index === -1) return null;

    const existing = db.residents[index];
    const updated: Resident = {
      ...existing,
      ...updates,
      id: existing.id // preserve ID
    };

    db.residents[index] = updated;
    await writeDB(db);

    await saveDocToPostgres("residents", id, updated);
    return updated;
  }

  static async deleteResident(id: string): Promise<boolean> {
    const db = await readDB();
    db.residents = db.residents || [];

    const lenBefore = db.residents.length;
    db.residents = db.residents.filter((r: Resident) => r.id !== id);

    if (db.residents.length === lenBefore) return false;

    await writeDB(db);
    await deleteDocFromPostgres("residents", id);
    return true;
  }
}
