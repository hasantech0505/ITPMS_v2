import React, { useState, useEffect } from "react";
import { 
  UserCheck2, 
  Search, 
  UserPlus, 
  Filter, 
  ShieldCheck, 
  Key, 
  Trash2, 
  Edit3, 
  Power, 
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { UserRole } from "../../types";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  avatarUrl?: string;
  active?: boolean;
}

interface UserManagementModuleProps {
  userRole: UserRole;
  onSyncState?: () => void;
}

export default function UserManagementModule({ userRole, onSyncState }: UserManagementModuleProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "MANAGER",
    department: "IT Park General",
    active: true,
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const savedUser = localStorage.getItem("itpms_user");
      let currentUserContext = { id: "u-1", role: userRole, name: "User" };
      if (savedUser) {
        try {
          currentUserContext = JSON.parse(savedUser);
          currentUserContext.role = userRole; // Override with active sandbox role
        } catch (e) {}
      }

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.append("search", search);
      if (roleFilter !== "ALL") params.append("role", roleFilter);
      if (statusFilter !== "ALL") params.append("active", statusFilter);

      const token = localStorage.getItem("itpms_access_token");
      const headers: Record<string, string> = {
        "x-user-context": JSON.stringify(currentUserContext),
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/users?${params.toString()}`, { headers });
      const data = await res.json();

      if (res.ok && data.success) {
        setUsers(data.data.users || []);
        setTotal(data.data.total || 0);
        setTotalPages(data.data.totalPages || 1);
      } else {
        setError(data.message || data.error || "Failed to load users");
      }
    } catch (err: any) {
      setError(err.message || "Network error fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, statusFilter, userRole]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      const savedUser = localStorage.getItem("itpms_user");
      let currentUserContext = { id: "u-1", role: userRole, name: "User" };
      if (savedUser) {
        try {
          currentUserContext = JSON.parse(savedUser);
          currentUserContext.role = userRole;
        } catch (e) {}
      }

      const token = localStorage.getItem("itpms_access_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-user-context": JSON.stringify(currentUserContext),
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/users", {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(`User '${data.data.email}' created successfully!`);
        setShowCreateModal(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "MANAGER",
          department: "IT Park General",
          active: true,
        });
        fetchUsers();
        if (onSyncState) onSyncState();
      } else {
        setError(data.message || data.error || "Failed to create user");
      }
    } catch (err: any) {
      setError(err.message || "Network error creating user");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setError(null);
    setSuccessMsg(null);

    try {
      const savedUser = localStorage.getItem("itpms_user");
      let currentUserContext = { id: "u-1", role: userRole, name: "User" };
      if (savedUser) {
        try {
          currentUserContext = JSON.parse(savedUser);
          currentUserContext.role = userRole;
        } catch (e) {}
      }

      const token = localStorage.getItem("itpms_access_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-user-context": JSON.stringify(currentUserContext),
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        active: formData.active,
      };
      if (formData.password) payload.password = formData.password;

      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(`User '${editingUser.id}' updated successfully!`);
        setEditingUser(null);
        fetchUsers();
        if (onSyncState) onSyncState();
      } else {
        setError(data.message || data.error || "Failed to update user");
      }
    } catch (err: any) {
      setError(err.message || "Network error updating user");
    }
  };

  const handleToggleStatus = async (user: User) => {
    setError(null);
    setSuccessMsg(null);

    try {
      const savedUser = localStorage.getItem("itpms_user");
      let currentUserContext = { id: "u-1", role: userRole, name: "User" };
      if (savedUser) {
        try {
          currentUserContext = JSON.parse(savedUser);
          currentUserContext.role = userRole;
        } catch (e) {}
      }

      const token = localStorage.getItem("itpms_access_token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-user-context": JSON.stringify(currentUserContext),
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const newStatus = !(user.active ?? true);
      const res = await fetch(`/api/users/${user.id}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ active: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(`User '${user.name}' is now ${newStatus ? "ACTIVE" : "INACTIVE"}`);
        fetchUsers();
        if (onSyncState) onSyncState();
      } else {
        setError(data.message || data.error || "Failed to update user status");
      }
    } catch (err: any) {
      setError(err.message || "Network error updating user status");
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete user account '${user.name}' (${user.email})?`)) return;

    setError(null);
    setSuccessMsg(null);

    try {
      const savedUser = localStorage.getItem("itpms_user");
      let currentUserContext = { id: "u-1", role: userRole, name: "User" };
      if (savedUser) {
        try {
          currentUserContext = JSON.parse(savedUser);
          currentUserContext.role = userRole;
        } catch (e) {}
      }

      const token = localStorage.getItem("itpms_access_token");
      const headers: Record<string, string> = {
        "x-user-context": JSON.stringify(currentUserContext),
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(`User '${user.name}' deleted successfully.`);
        fetchUsers();
        if (onSyncState) onSyncState();
      } else {
        setError(data.message || data.error || "Failed to delete user account");
      }
    } catch (err: any) {
      setError(err.message || "Network error deleting user");
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      department: user.department || "IT Park General",
      active: user.active ?? true,
    });
  };

  const canCreate = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.MANAGER;
  const canDelete = userRole === UserRole.SUPER_ADMIN;

  return (
    <div id="users-tab" className="space-y-6 max-w-6xl mx-auto text-xs font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <UserCheck2 className="w-6 h-6 text-indigo-600" />
            PostgreSQL RBAC User Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage user accounts, assign roles, configure access permissions, and toggle status in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 cursor-pointer transition-all"
            title="Refresh Users List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-600" : ""}`} />
          </button>
          
          {canCreate && (
            <button
              id="create-user-btn"
              onClick={() => {
                setEditingUser(null);
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  role: "MANAGER",
                  department: "IT Park General",
                  active: true,
                });
                setShowCreateModal(true);
              }}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New User</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="flex-1">{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg cursor-pointer transition-all"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-500 text-[11px]">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="MANAGER">MANAGER</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <span className="font-semibold text-slate-500 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Role Authorization</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold">
                    Loading users directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold">
                    No user accounts match the current filter criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isActive = u.active ?? true;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-all">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
                            alt={u.name}
                            className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-800 block">{u.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                          u.role === "SUPER_ADMIN" ? "bg-purple-50 text-purple-700 border-purple-200" :
                          u.role === "MANAGER" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          <ShieldCheck className="w-3 h-3" />
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {u.department || "IT Park General"}
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                          }`}
                          title="Click to toggle account status"
                        >
                          <Power className="w-3 h-3" />
                          {isActive ? "ACTIVE" : "INACTIVE"}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-all"
                            title="Edit User Role/Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {canDelete && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-all"
                              title="Delete User Account"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-slate-500">
          <span className="text-[11px] font-medium">
            Showing {users.length} of {total} total user accounts (Page {page} of {totalPages})
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-bold text-slate-700 text-xs">{page}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Creating / Editing Users */}
      {(showCreateModal || editingUser) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h2 className="font-bold text-sm tracking-tight flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                {editingUser ? `Edit Account (${editingUser.email})` : "Create New User Account"}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingUser(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alisher Navoi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alisher@itpark.uz"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500 font-medium font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Password {editingUser && <span className="text-slate-400 font-normal">(Leave blank to keep unchanged)</span>}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder={editingUser ? "••••••••" : "Minimum 6 characters"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500 font-medium font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Assigned RBAC Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500 font-bold text-slate-800"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Executive Board"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="account-active-check"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="account-active-check" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Account is Active & Permitted to Log In
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg cursor-pointer shadow-sm"
                >
                  {editingUser ? "Save Changes" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Matrix & Sandbox Guide */}
      <div className="bg-slate-900 text-white border border-slate-800 p-5 rounded-xl space-y-4">
        <h3 className="font-bold text-sm tracking-tight flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          System Permission Matrix Reference
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          The table below maps platform role classes to backend permission privileges enforced on PostgreSQL data layers:
        </p>

        <div className="border border-slate-800 rounded-lg overflow-hidden font-mono text-[11px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <th className="py-2.5 px-3">Role Class</th>
                <th className="py-2.5 px-3">Read</th>
                <th className="py-2.5 px-3">Create</th>
                <th className="py-2.5 px-3">Update</th>
                <th className="py-2.5 px-3">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr>
                <td className="py-2 px-3 font-bold text-purple-400">SUPER_ADMIN</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">ALL</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">ALL</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">ALL</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">ALL</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-bold text-blue-400">MANAGER</td>
                <td className="py-2 px-3 text-emerald-400">YES</td>
                <td className="py-2 px-3 text-emerald-400">YES</td>
                <td className="py-2 px-3 text-emerald-400">YES</td>
                <td className="py-2 px-3 text-rose-400">LIMITED (no user.delete)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
