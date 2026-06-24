import axiosClient from '../../../app/api/axiosClient';
import { Shield } from 'lucide-react';

function unwrapData(response) {
  return response.data?.data ?? response.data;
}

const roleStyleMap = {
  ROLE_FACILITY_ADMIN: {
    iconBg: 'bg-[#E6F0FF]',
    iconColor: 'text-[#0047AB]',
    staffBadgeClass: 'bg-[#E6F0FF] text-[#0047AB]',
  },
  ROLE_SHIFT_SUPERVISOR: {
    iconBg: 'bg-[#f0fdf4]',
    iconColor: 'text-[#16a34a]',
    staffBadgeClass: 'bg-[#f0fdf4] text-[#16a34a]',
  },
  ROLE_ADMIN: {
    iconBg: 'bg-[#E6F0FF]',
    iconColor: 'text-[#0047AB]',
    staffBadgeClass: 'bg-[#E6F0FF] text-[#0047AB]',
  },
};

const defaultRoleStyle = {
  iconBg: 'bg-[#E6F0FF]',
  iconColor: 'text-[#0047AB]',
  staffBadgeClass: 'bg-gray-100 text-[#848a9c]',
};

export function normalizePermission(permission) {
  const code = permission.code ?? permission.permissionCode ?? permission.name;
  return {
    id: permission.id ?? code,
    code,
    label:
      permission.name ??
      permission.label ??
      permission.description ??
      permission.code ??
      'Unknown Permission',
    group: permission.group ?? permission.module ?? permission.category ?? 'General',
  };
}

export function normalizeRole(role) {
  const code = role.code ?? role.roleCode ?? '';
  const style = roleStyleMap[code] ?? defaultRoleStyle;
  const rawPermissions = role.permissions ?? [];

  const permissions = rawPermissions.map((perm) => {
    if (typeof perm === 'object' && perm !== null) {
      return perm.id ?? perm.code ?? perm.permissionCode;
    }
    return perm;
  });

  return {
    id: role.id ?? role.roleId,
    name: role.name ?? role.roleName ?? 'Unnamed Role',
    code,
    description: role.description ?? role.scope ?? role.note ?? '—',
    staffCount: role.staffCount ?? role.assignedStaffCount ?? role.userCount ?? 0,
    permissions,
    isSystem: Boolean(role.isSystem ?? role.system ?? role.isDefault),
    icon: Shield,
    ...style,
  };
}

export async function fetchPermissions() {
  const response = await axiosClient.get('/api/v1/permissions');
  const data = unwrapData(response);
  return Array.isArray(data) ? data.map(normalizePermission) : [];
}

export async function fetchRoles() {
  const response = await axiosClient.get('/api/v1/roles');
  const data = unwrapData(response);
  return Array.isArray(data) ? data.map(normalizeRole) : [];
}

export async function updateRolePermissions(roleId, permissionIds) {
  const response = await axiosClient.put(`/api/v1/roles/${roleId}/permissions`, {
    permissionIds,
  });
  return unwrapData(response);
}

export function getApiErrorMessage(error, fallback = 'Đã xảy ra lỗi. Vui lòng thử lại.') {
  return (
    error.response?.data?.message ??
    error.response?.data?.error ??
    error.message ??
    fallback
  );
}
