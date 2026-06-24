import axiosClient from '../../../app/api/axiosClient';

const avatarColors = [
  'bg-[#0047AB]',
  'bg-[#6366f1]',
  'bg-[#0ea5e9]',
  'bg-[#16a34a]',
  'bg-[#f59e0b]',
  'bg-[#ec4899]',
  'bg-[#8b5cf6]',
];

function unwrapData(response) {
  return response.data?.data ?? response.data;
}

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const status = error.response?.status;
  const data = error.response?.data;

  const validationMessage = parseValidationErrors(data);
  if (validationMessage) {
    const generic = data?.message ?? data?.error ?? '';
    if (generic && generic.toLowerCase().includes('validation') && generic !== validationMessage) {
      return `${generic}: ${validationMessage}`;
    }
    return validationMessage;
  }

  if (status === 401) {
    return (
      data?.message ??
      'Your session has expired. Please sign in again.'
    );
  }

  if (status === 403) {
    return (
      data?.message ??
      data?.error ??
      'You do not have permission to access this feature. Please sign in again or contact an admin.'
    );
  }

  return (
    data?.message ??
    data?.error ??
    data?.data?.message ??
    error.message ??
    fallback
  );
}

function parseValidationErrors(data) {
  if (!data) return null;

  const nested = data.data ?? data;
  const errors =
    nested.errors ??
    nested.validationErrors ??
    nested.fieldErrors ??
    data.errors ??
    data.validationErrors;

  if (Array.isArray(errors) && errors.length > 0) {
    return errors
      .map((item) => {
        if (typeof item === 'string') return item;
        const field = item.field ?? item.property ?? item.name ?? '';
        const message = item.message ?? item.defaultMessage ?? item.reason ?? '';
        return field ? `${field}: ${message}` : message;
      })
      .filter(Boolean)
      .join(' · ');
  }

  if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
    const mapped = Object.entries(errors)
      .map(([field, message]) => {
        if (typeof message === 'string') return `${field}: ${message}`;
        if (message?.message) return `${field}: ${message.message}`;
        return null;
      })
      .filter(Boolean);
    if (mapped.length > 0) return mapped.join(' · ');
  }

  const details = nested.details ?? data.details;
  if (Array.isArray(details) && details.length > 0) {
    return details.join(' · ');
  }

  return null;
}

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'NA';
}

export function getAvatarBg(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + hash * 31;
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export function getTierClass(tierName = '') {
  const tier = tierName.toLowerCase();
  if (tier.includes('diamond') || tier.includes('vip')) {
    return 'bg-[#181c1e] text-white';
  }
  if (tier.includes('platinum') || tier.includes('gold')) {
    return 'bg-[#E6F0FF] text-[#0047AB]';
  }
  if (tier.includes('silver')) {
    return 'bg-gray-100 text-[#434654]';
  }
  return 'bg-gray-100 text-[#848a9c]';
}

export function getStatusClass(status = '', statusLabel = '') {
  const value = `${status} ${statusLabel}`.toLowerCase();
  if (value.includes('active') || value.includes('hoạt động')) {
    return 'bg-[#f0fdf4] text-[#16a34a]';
  }
  if (value.includes('risk') || value.includes('rủi ro')) {
    return 'bg-[#fef2f2] text-[#dc2626]';
  }
  if (value.includes('inactive') || value.includes('không hoạt động')) {
    return 'bg-gray-100 text-[#848a9c]';
  }
  return 'bg-[#E6F0FF] text-[#0047AB]';
}

export function formatLastVisit(isoDate) {
  if (!isoDate) return '—';

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US');
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}

export function normalizeCustomer(customer) {
  const name = customer.fullName ?? customer.name ?? 'Customer';
  const statusLabel = customer.statusLabel ?? customer.status ?? '—';

  return {
    id: customer.customerId ?? customer.id,
    name,
    initials: getInitials(name),
    avatarBg: getAvatarBg(name),
    membership: customer.tierName ?? 'Member',
    membershipClass: getTierClass(customer.tierName),
    phone: customer.phoneNumber ?? '—',
    email: customer.email ?? '—',
    plate: customer.licensePlate ?? '—',
    carType: customer.carType ?? '—',
    visits: customer.visitCount ?? 0,
    points: customer.loyaltyPoints ?? 0,
    totalSpending: customer.totalSpending ?? 0,
    lastVisit: formatLastVisit(customer.lastCompletedBookingAt),
    lastVisitAt: customer.lastCompletedBookingAt,
    status: statusLabel,
    statusClass: getStatusClass(customer.status, statusLabel),
    createdAt: customer.createdAt,
  };
}

export async function fetchCustomers({ page = 0, size = 10, search = '' } = {}) {
  const params = { page, size };
  if (search.trim()) {
    params.search = search.trim();
  }

  const response = await axiosClient.get('/api/v1/admin/customers', { params });
  const data = unwrapData(response);

  return {
    customers: (data.content ?? []).map(normalizeCustomer),
    page: data.page ?? page,
    size: data.size ?? size,
    totalElements: data.totalElements ?? 0,
    totalPages: data.totalPages ?? 0,
  };
}

export async function createCustomer(payload) {
  const response = await axiosClient.post('/api/v1/admin/customers', payload);
  const data = unwrapData(response);
  return normalizeCustomer(data);
}

export async function updateCustomer(id, payload) {
  const response = await axiosClient.put(`/api/v1/admin/customers/${id}`, payload);
  const data = unwrapData(response);
  return normalizeCustomer(data);
}
