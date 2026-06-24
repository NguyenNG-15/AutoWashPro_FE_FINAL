import { useEffect, useState } from 'react';
import {
  Shield,
  Users,
  FileWarning,
  ShieldCheck,
  Download,
  Search,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import useRoleStore from '../store/roleStore';

const inputClass =
  'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-[#181c1e] bg-gray-50 focus:outline-none';
const labelClass = 'text-sm font-medium text-[#434654] mb-1.5 block';

function StatCard({ label, value, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-[#848a9c] text-sm font-medium">{label}</span>
          <span className="text-[#181c1e] text-3xl font-bold tracking-tight">{value}</span>
        </div>
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

function EditPermissionsModal({ isOpen, role, permissions, isSaving, onClose, onSubmit }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && role) {
      setSelectedIds([...role.permissions]);
      setError('');
    }
  }, [isOpen, role]);

  if (!isOpen || !role) return null;

  const permissionGroups = permissions.reduce((groups, perm) => {
    if (!groups[perm.group]) groups[perm.group] = [];
    groups[perm.group].push(perm);
    return groups;
  }, {});

  const togglePermission = (permId) => {
    setSelectedIds((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      setError('Role phải có ít nhất một permission.');
      return;
    }
    try {
      await onSubmit(selectedIds);
    } catch (err) {
      setError(err.message ?? 'Không thể cập nhật permissions.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Đóng" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-start justify-between gap-4 z-10">
          <div>
            <h2 className="text-[#181c1e] text-xl font-bold">Edit Permissions</h2>
            <p className="text-[#848a9c] text-sm mt-1">{role.name}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-[#434654]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tên role</label>
              <input type="text" value={role.name} readOnly className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Mô tả</label>
              <textarea rows={2} value={role.description} readOnly className={`${inputClass} resize-none`} />
            </div>
          </div>

          <div>
            <h3 className="text-[#181c1e] text-sm font-bold mb-4">Permissions</h3>
            {permissions.length === 0 ? (
              <p className="text-sm text-[#848a9c]">Không có permission nào từ API.</p>
            ) : (
              <div className="flex flex-col gap-5">
                {Object.entries(permissionGroups).map(([group, perms]) => (
                  <div key={group}>
                    <p className="text-xs font-bold text-[#848a9c] uppercase tracking-wide mb-2">
                      {group}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {perms.map((perm) => (
                        <label
                          key={perm.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(perm.id)}
                            onChange={() => togglePermission(perm.id)}
                            className="w-4 h-4 rounded border-gray-300 text-[#0047AB] focus:ring-[#0047AB]"
                          />
                          <div className="min-w-0">
                            <span className="text-sm text-[#434654] block">{perm.label}</span>
                            <span className="text-[10px] font-mono text-[#848a9c]">{perm.code}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 text-sm font-medium text-[#434654] border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-60"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg disabled:opacity-60 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminRolesPage() {
  const roles = useRoleStore((state) => state.roles);
  const permissions = useRoleStore((state) => state.permissions);
  const isLoading = useRoleStore((state) => state.isLoading);
  const isSaving = useRoleStore((state) => state.isSaving);
  const error = useRoleStore((state) => state.error);
  const lastAction = useRoleStore((state) => state.lastAction);
  const fetchRolesAndPermissions = useRoleStore((state) => state.fetchRolesAndPermissions);
  const updateRolePermissions = useRoleStore((state) => state.updateRolePermissions);
  const clearLastAction = useRoleStore((state) => state.clearLastAction);
  const clearError = useRoleStore((state) => state.clearError);

  const [searchQuery, setSearchQuery] = useState('');
  const [editRole, setEditRole] = useState(null);

  useEffect(() => {
    fetchRolesAndPermissions();
  }, [fetchRolesAndPermissions]);

  useEffect(() => {
    if (!lastAction) return undefined;
    const timer = setTimeout(clearLastAction, 4000);
    return () => clearTimeout(timer);
  }, [lastAction, clearLastAction]);

  const filteredRoles = roles.filter((role) => {
    const q = searchQuery.toLowerCase();
    const permissionLabels = permissions
      .filter((perm) => role.permissions.includes(perm.id))
      .map((perm) => `${perm.label} ${perm.code}`.toLowerCase())
      .join(' ');

    return (
      role.name.toLowerCase().includes(q) ||
      role.description.toLowerCase().includes(q) ||
      permissionLabels.includes(q)
    );
  });

  const totalStaff = roles.reduce((sum, role) => sum + role.staffCount, 0);

  const handleEdit = async (permissionIds) => {
    if (!editRole) return;
    await updateRolePermissions(editRole.id, permissionIds);
    setEditRole(null);
  };

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {lastAction && (
          <div className="fixed top-6 right-6 z-[60] flex items-center gap-3 bg-white border border-[#16a34a]/30 shadow-lg rounded-xl px-4 py-3">
            <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#181c1e]">Cập nhật thành công</p>
              <p className="text-xs text-[#848a9c]">
                Permissions của &quot;{lastAction.roleName}&quot; đã được lưu.
              </p>
            </div>
            <button type="button" onClick={clearLastAction} className="text-[#848a9c] hover:text-[#181c1e]">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-[#181c1e] text-3xl font-bold tracking-tight">
              Role Management &amp; Access Control
            </h1>
            <p className="text-[#434654] text-base mt-1">
              Configure system-wide administrative roles and granular employee access levels.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={fetchRolesAndPermissions}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-medium text-[#434654] hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-medium text-[#434654] hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Roles
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start justify-between gap-4">
            <p className="text-sm text-red-700">{error}</p>
            <button type="button" onClick={clearError} className="text-red-500 hover:text-red-700 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            label="Total Roles"
            value={isLoading ? '—' : roles.length}
            icon={Shield}
            iconBg="bg-[#E6F0FF]"
            iconColor="text-[#0047AB]"
          />
          <StatCard
            label="Total Permissions"
            value={isLoading ? '—' : permissions.length}
            icon={Users}
            iconBg="bg-[#f0fdf4]"
            iconColor="text-[#16a34a]"
          />
          <StatCard
            label="Assigned Staff"
            value={isLoading ? '—' : totalStaff}
            icon={FileWarning}
            iconBg="bg-[#fff7ed]"
            iconColor="text-[#ea580c]"
          />
          <StatCard
            label="MFA Compliance"
            value="98%"
            icon={ShieldCheck}
            iconBg="bg-[#E6F0FF]"
            iconColor="text-[#0047AB]"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-[#181c1e] text-lg font-bold">System Roles</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
              <input
                type="text"
                placeholder="Search roles, permissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-80 bg-[#f7fafd] border border-gray-200 rounded-lg text-sm text-[#181c1e] placeholder:text-[#848a9c] focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-[#848a9c]">
              <Loader2 className="w-5 h-5 animate-spin text-[#0047AB]" />
              <span className="text-sm">Đang tải roles từ API...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#f7fafd]">
                      <th className="text-left px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                        Role Name
                      </th>
                      <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide min-w-[200px]">
                        Scope &amp; Description
                      </th>
                      <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                        Permissions
                      </th>
                      <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                        Assigned Staff
                      </th>
                      <th className="text-left px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-[#848a9c]">
                          Không tìm thấy role phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredRoles.map((role) => {
                        const Icon = role.icon;
                        const permCount = role.permissions.length;
                        return (
                          <tr
                            key={role.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 rounded-lg ${role.iconBg} flex items-center justify-center shrink-0`}
                                >
                                  <Icon className={`w-4 h-4 ${role.iconColor}`} />
                                </div>
                                <div>
                                  <p className="text-[#181c1e] font-semibold">{role.name}</p>
                                  {role.isSystem && (
                                    <span className="text-[10px] font-bold text-[#0047AB] bg-[#E6F0FF] px-1.5 py-0.5 rounded">
                                      SYSTEM
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-[#434654] text-sm leading-relaxed max-w-xs">
                              {role.description}
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E6F0FF] text-[#0047AB]">
                                {permCount} permissions
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${role.staffBadgeClass}`}
                              >
                                {role.staffCount} Active
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                type="button"
                                onClick={() => setEditRole(role)}
                                className="px-3 py-1.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-xs font-semibold rounded-lg transition-colors"
                              >
                                Edit Permissions
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-[#848a9c]">
                  Showing {filteredRoles.length} of {roles.length} Roles
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                    disabled
                  >
                    <ChevronLeft className="w-4 h-4 text-[#434654]" />
                  </button>
                  <button type="button" className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <ChevronRight className="w-4 h-4 text-[#434654]" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <EditPermissionsModal
        isOpen={Boolean(editRole)}
        role={editRole}
        permissions={permissions}
        isSaving={isSaving}
        onClose={() => setEditRole(null)}
        onSubmit={handleEdit}
      />
    </div>
  );
}
