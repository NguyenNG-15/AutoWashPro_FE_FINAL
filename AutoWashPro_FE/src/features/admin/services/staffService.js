import axiosClient from '../../../app/api/axiosClient';
import { getApiErrorMessage, getAvatarBg, getInitials } from './customerService';
import { getAccountStatusLabel, getWorkStatusLabel } from '../data/staffFormOptions';

export { getApiErrorMessage };

function unwrapData(response) {
  return response.data?.data ?? response.data;
}

export function getWorkStatusClass(workStatus = '') {
  const value = workStatus.toUpperCase();

  if (value === 'BUSY') return 'bg-[#E6F0FF] text-[#0047AB]';
  if (value === 'IDLE') return 'bg-[#f0fdf4] text-[#16a34a]';
  if (value === 'ON_BREAK') return 'bg-[#fff7ed] text-[#ea580c]';
  if (value === 'OFF') return 'bg-gray-100 text-[#848a9c]';

  return 'bg-[#E6F0FF] text-[#0047AB]';
}

export function getAccountStatusClass(accountStatus = '') {
  const value = accountStatus.toUpperCase();

  if (value === 'ACTIVE') return 'bg-[#f0fdf4] text-[#16a34a]';
  if (value === 'INACTIVE') return 'bg-[#fef2f2] text-[#dc2626]';

  return 'bg-gray-100 text-[#848a9c]';
}

function extractRoleIds(staff) {
  const roles = staff.roles ?? staff.roleList ?? [];
  if (!Array.isArray(roles)) return staff.roleIds ?? [];

  return roles.map((role) => {
    if (typeof role === 'object' && role !== null) {
      return role.id ?? role.roleId;
    }
    return role;
  }).filter(Boolean);
}

function extractRoleNames(staff) {
  const roles = staff.roles ?? staff.roleList ?? [];
  if (Array.isArray(roles) && roles.length > 0) {
    return roles
      .map((role) => {
        if (typeof role === 'object' && role !== null) {
          return role.name ?? role.roleName ?? role.code;
        }
        return role;
      })
      .filter(Boolean)
      .join(', ');
  }

  return staff.roleName ?? staff.primaryRoleName ?? '—';
}

export function normalizeStaff(staff) {
  const name = staff.fullName ?? staff.name ?? 'Staff Member';
  const accountStatus = (staff.accountStatus ?? staff.status ?? 'ACTIVE').toUpperCase();
  const workStatus = (staff.workStatus ?? staff.shiftStatus ?? 'IDLE').toUpperCase();

  const jobs =
    staff.completedJobCount ??
    staff.jobCount ??
    staff.totalJobs ??
    staff.jobsCompleted ??
    staff.completedBookings ??
    0;

  const efficiency = Math.min(
    100,
    Math.max(0, staff.efficiency ?? staff.efficiencyRate ?? staff.efficiencyPercent ?? 0),
  );

  const rating = staff.rating ?? staff.averageRating ?? staff.serviceRating ?? 0;
  const roleIds = extractRoleIds(staff);

  return {
    id: staff.staffId ?? staff.id,
    name,
    initials: getInitials(name),
    avatarBg: getAvatarBg(name),
    username: staff.username ?? '—',
    role: extractRoleNames(staff),
    roleIds,
    accountStatus,
    accountStatusLabel: staff.accountStatusLabel ?? getAccountStatusLabel(accountStatus),
    accountStatusClass: getAccountStatusClass(accountStatus),
    workStatus,
    workStatusLabel: staff.workStatusLabel ?? getWorkStatusLabel(workStatus),
    workStatusClass: getWorkStatusClass(workStatus),
    jobs,
    efficiency,
    rating: typeof rating === 'number' ? Number(rating.toFixed(1)) : rating,
    phone: staff.phoneNumber ?? staff.phone ?? '—',
    email: staff.email ?? '—',
    createdAt: staff.createdAt,
  };
}

export function normalizeStaffStats(stats = {}) {
  const avgEfficiency =
    stats.averageEfficiency ??
    stats.avgEfficiency ??
    stats.avgEfficiencyPercent ??
    0;

  const avgRating =
    stats.averageRating ??
    stats.avgRating ??
    stats.teamScore ??
    0;

  const topPerformers = (stats.topPerformers ?? stats.topStaff ?? []).map(normalizeStaff);

  return {
    totalStaff: stats.totalStaff ?? stats.totalActiveStaff ?? stats.activeStaffCount ?? 0,
    avgEfficiency: Math.round(Number(avgEfficiency) * 10) / 10,
    avgRating: Math.round(Number(avgRating) * 100) / 100,
    onBreakCount: stats.onBreakCount ?? stats.staffOnBreak ?? stats.onBreakNow ?? 0,
    offDutyCount: stats.offDutyCount ?? stats.offCount ?? stats.inactiveCount ?? 0,
    newThisMonth: stats.newThisMonth ?? stats.addedThisMonth ?? 0,
    topPerformers,
  };
}

export async function fetchStaff({ page = 0, size = 10, search = '' } = {}) {
  const params = { page, size };
  if (search.trim()) {
    params.search = search.trim();
  }

  const response = await axiosClient.get('/api/v1/admin/staffs', { params });
  const data = unwrapData(response);

  return {
    staff: (data.content ?? []).map(normalizeStaff),
    page: data.page ?? page,
    size: data.size ?? size,
    totalElements: data.totalElements ?? 0,
    totalPages: data.totalPages ?? 0,
  };
}

export async function fetchStaffStats() {
  const response = await axiosClient.get('/api/v1/admin/staffs/stats');
  return normalizeStaffStats(unwrapData(response));
}

export async function fetchStaffById(id) {
  const response = await axiosClient.get(`/api/v1/admin/staffs/${id}`);
  return normalizeStaff(unwrapData(response));
}

export async function createStaff(payload) {
  const response = await axiosClient.post('/api/v1/admin/staffs', payload);
  return normalizeStaff(unwrapData(response));
}

export async function updateStaff(id, payload) {
  const response = await axiosClient.put(`/api/v1/admin/staffs/${id}`, payload);
  return normalizeStaff(unwrapData(response));
}

export async function resetStaffPassword(id, payload = {}) {
  const response = await axiosClient.post(`/api/v1/admin/staffs/${id}/reset-password`, payload);
  return unwrapData(response);
}

export async function updateStaffAccountStatus(id, status) {
  const response = await axiosClient.patch(`/api/v1/admin/staffs/${id}/status`, { status });
  return normalizeStaff(unwrapData(response));
}

export async function updateStaffWorkStatus(id, workStatus) {
  const response = await axiosClient.patch(`/api/v1/admin/staffs/${id}/work-status`, { workStatus });
  return normalizeStaff(unwrapData(response));
}

export async function assignStaffRoles(staffId, roleIds) {
  const response = await axiosClient.put(`/api/v1/admin/staffs/${staffId}/roles`, { roleIds });
  return normalizeStaff(unwrapData(response));
}
