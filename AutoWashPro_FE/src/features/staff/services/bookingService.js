import axiosClient from '../../../app/api/axiosClient';
import {
  formatCurrency,
  getApiErrorMessage,
  getAvatarBg,
  getInitials,
  getTierClass,
} from '../../admin/services/customerService';

export { getApiErrorMessage, formatCurrency };

function unwrapData(response) {
  return response.data?.data ?? response.data;
}

export function getBookingStatusClass(status = '', statusLabel = '') {
  const value = `${status} ${statusLabel}`.toUpperCase();

  if (value.includes('UNPAID') || value.includes('PENDING') || value.includes('CHỜ')) {
    return 'bg-[#fff7ed] text-[#ea580c]';
  }
  if (value.includes('CONFIRMED') || value.includes('PROCESSING') || value.includes('ĐANG')) {
    return 'bg-[#E6F0FF] text-[#0047AB]';
  }
  if (value.includes('PAID') || value.includes('COMPLETED') || value.includes('HOÀN')) {
    return 'bg-[#f0fdf4] text-[#16a34a]';
  }
  if (value.includes('CANCEL')) {
    return 'bg-[#fef2f2] text-[#dc2626]';
  }

  return 'bg-gray-100 text-[#848a9c]';
}

function formatBookingType(bookingType = '') {
  const value = bookingType.toLowerCase();
  if (value.includes('walk')) return 'Walk-in';
  return 'Appt';
}

function formatSlot(booking) {
  if (booking.timeSlotLabel) return booking.timeSlotLabel;
  if (booking.slotLabel) return booking.slotLabel;
  if (booking.scheduledTime) return booking.scheduledTime;
  if (booking.bookingDate && booking.startTime) {
    return `${booking.bookingDate} ${booking.startTime}`;
  }
  if (booking.bookingDate) return booking.bookingDate;
  return '—';
}

export function getBookingNextAction(booking) {
  const paymentStatus = (booking.paymentStatusRaw ?? '').toUpperCase();
  const bookingStatus = (booking.bookingStatusRaw ?? booking.statusRaw ?? '').toUpperCase();
  const statusLabel = (booking.status ?? '').toUpperCase();
  const combined = `${paymentStatus} ${bookingStatus} ${statusLabel}`;

  if (
    bookingStatus.includes('COMPLETED') ||
    bookingStatus.includes('CANCEL') ||
    statusLabel.includes('COMPLETED') ||
    statusLabel.includes('HOÀN') ||
    statusLabel.includes('CANCEL')
  ) {
    return null;
  }

  const apiAction = mapApiAction(booking.apiAction);
  if (apiAction) return apiAction;

  if (paymentStatus.includes('UNPAID') || combined.includes('PENDING_PAYMENT')) {
    return { label: 'Pay', action: 'pay' };
  }
  if (['PENDING', 'AWAITING_CONFIRMATION', 'WAITING'].some((s) => bookingStatus.includes(s))) {
    return { label: 'Confirm', action: 'accept' };
  }
  if (paymentStatus.includes('PAID') || bookingStatus.includes('PAID')) {
    if (!booking.staffId && !booking.assignedStaffId && !booking.technicianId) {
      return { label: 'Assign Technician', action: 'assign' };
    }
    if (bookingStatus.includes('PROCESSING')) {
      return { label: 'Complete', action: 'complete' };
    }
    return { label: 'Start Service', action: 'start' };
  }
  if (bookingStatus.includes('PROCESSING')) {
    return { label: 'Complete', action: 'complete' };
  }

  return null;
}

function mapApiAction(action = '') {
  const value = String(action).toUpperCase();
  if (!value || value === 'NONE') return null;
  if (value.includes('PAY')) return { label: 'Pay', action: 'pay' };
  if (value.includes('ASSIGN')) return { label: 'Assign Technician', action: 'assign' };
  if (value.includes('START')) return { label: 'Start Service', action: 'start' };
  if (value.includes('COMPLETE') || value.includes('FINISH')) {
    return { label: 'Complete', action: 'complete' };
  }
  if (value.includes('ACCEPT') || value.includes('CONFIRM')) {
    return { label: 'Confirm', action: 'accept' };
  }
  return null;
}

export function normalizeBooking(booking) {
  const name =
    booking.customerName ??
    booking.fullName ??
    booking.customer?.fullName ??
    'Customer';

  const bookingStatusRaw = (booking.bookingStatus ?? '').toUpperCase();
  const paymentStatusRaw = (booking.paymentStatus ?? '').toUpperCase();
  const statusRaw = bookingStatusRaw || paymentStatusRaw || (booking.status ?? '').toUpperCase();
  const statusLabel =
    booking.bookingStatusLabel ??
    booking.paymentStatusLabel ??
    booking.statusLabel ??
    booking.statusName ??
    statusRaw;

  const staffId =
    booking.technicianId ?? booking.staffId ?? booking.assignedStaffId;
  const staffName =
    booking.technicianName ?? booking.staffName ?? booking.assignedStaffName ?? '—';

  const normalized = {
    id: booking.bookingId ?? booking.id,
    name,
    membership: booking.membership ?? booking.tierName ?? booking.membershipTier ?? 'Guest',
    membershipClass: getTierClass(booking.membership ?? booking.tierName ?? booking.membershipTier),
    initials: getInitials(name),
    avatarBg: getAvatarBg(name),
    plate: booking.licensePlate ?? booking.plate ?? '—',
    slot: formatSlot(booking),
    type: formatBookingType(booking.bookingType ?? booking.type),
    service: booking.serviceName ?? booking.service?.name ?? '—',
    serviceId: booking.serviceId ?? booking.service?.id,
    status: statusLabel,
    statusRaw,
    bookingStatusRaw,
    paymentStatusRaw,
    paymentStatusLabel: booking.paymentStatusLabel ?? paymentStatusRaw,
    statusClass: getBookingStatusClass(statusRaw, statusLabel),
    staffId,
    technicianId: staffId,
    staffName,
    phone: booking.customerPhone ?? booking.phoneNumber ?? booking.phone ?? '—',
    carType: booking.carType ?? booking.vehicleType ?? '—',
    price: booking.totalAmount ?? booking.amount ?? booking.price ?? 0,
    notes: booking.notes ?? booking.note ?? '',
    scheduledDate: booking.bookingDate ?? booking.scheduledDate,
    createdAt: booking.createdAt,
    customerId: booking.customerId,
    apiAction: booking.action,
  };

  return {
    ...normalized,
    nextAction: getBookingNextAction(normalized),
  };
}

export function normalizeBookingStats(stats = {}) {
  return {
    todayTotal: stats.todayTotal ?? stats.totalBookingsToday ?? stats.totalToday ?? 0,
    walkInCount: stats.todayWalkIns ?? stats.walkInCount ?? stats.walkInsToday ?? 0,
    queueTimeMinutes: stats.queueTimeMinutes ?? stats.avgQueueTime ?? stats.averageWaitMinutes ?? 0,
    todayRevenue: stats.todayRevenue ?? stats.totalRevenueToday ?? stats.revenueToday ?? 0,
    pendingCount: stats.pendingPayment ?? stats.pendingCount ?? stats.unpaidCount ?? 0,
    processingCount: stats.inProgress ?? stats.processingCount ?? stats.inProgressCount ?? 0,
    growthPercent: stats.growthPercent ?? stats.changePercent ?? null,
  };
}

export function normalizeService(service) {
  return {
    id: service.id ?? service.serviceId,
    name: service.name ?? service.serviceName ?? 'Service',
    price: service.price ?? service.basePrice ?? service.amount ?? 0,
    duration:
      service.durationMinutes != null
        ? `${service.durationMinutes} min`
        : (service.duration ?? service.durationLabel ?? '—'),
    durationMinutes: service.durationMinutes,
  };
}

export function normalizeSlot(slot) {
  const id = slot.slotId ?? slot.id ?? slot.value;
  const label =
    slot.label ??
    (slot.startTime && slot.endTime
      ? `${slot.startTime} – ${slot.endTime}`
      : null) ??
    slot.timeSlotLabel ??
    slot.displayTime ??
    slot.startTime ??
    slot.time ??
    String(id);

  return { id, label, available: slot.available !== false };
}

export async function fetchBookings({ page = 0, size = 10, search = '' } = {}) {
  const params = { page, size };
  if (search.trim()) params.search = search.trim();

  const response = await axiosClient.get('/api/v1/admin/bookings', { params });
  const data = unwrapData(response);

  return {
    bookings: (data.content ?? []).map(normalizeBooking),
    page: data.page ?? page,
    size: data.size ?? size,
    totalElements: data.totalElements ?? 0,
    totalPages: data.totalPages ?? 0,
  };
}

export async function fetchBookingStats() {
  const response = await axiosClient.get('/api/v1/admin/bookings/stats');
  return normalizeBookingStats(unwrapData(response));
}

export async function fetchBookingById(id) {
  const response = await axiosClient.get(`/api/v1/admin/bookings/${id}`);
  return normalizeBooking(unwrapData(response));
}

export async function createBooking(payload) {
  const response = await axiosClient.post('/api/v1/admin/bookings', payload);
  return normalizeBooking(unwrapData(response));
}

export async function acceptBooking(id) {
  const response = await axiosClient.patch(`/api/v1/admin/bookings/${id}/accept`);
  return normalizeBooking(unwrapData(response));
}

export async function payBooking(id, payload = {}) {
  const response = await axiosClient.post(`/api/v1/admin/bookings/${id}/pay`, payload);
  return normalizeBooking(unwrapData(response));
}

export async function assignBookingStaff(id, technicianId) {
  const response = await axiosClient.patch(`/api/v1/admin/bookings/${id}/assign-staff`, {
    technicianId,
  });
  return normalizeBooking(unwrapData(response));
}

export async function startBooking(id) {
  const response = await axiosClient.patch(`/api/v1/admin/bookings/${id}/start`);
  return normalizeBooking(unwrapData(response));
}

export async function completeBooking(id) {
  const response = await axiosClient.patch(`/api/v1/admin/bookings/${id}/complete`);
  return normalizeBooking(unwrapData(response));
}

export async function deleteBooking(id) {
  const response = await axiosClient.delete(`/api/v1/admin/bookings/${id}`);
  return response.data;
}

export async function fetchBookingServices() {
  const response = await axiosClient.get('/api/v1/admin/bookings/catalog/services');
  const data = unwrapData(response);
  return (Array.isArray(data) ? data : data?.content ?? []).map(normalizeService);
}

export async function fetchBookingSlots() {
  const response = await axiosClient.get('/api/v1/admin/bookings/catalog/slots');
  const data = unwrapData(response);
  return (Array.isArray(data) ? data : data?.content ?? []).map(normalizeSlot);
}

export function buildCreateBookingPayload(form) {
  const isWalkIn = form.bookingType === 'walk-in';
  const today = new Date().toISOString().split('T')[0];
  const serviceId = Number(form.serviceId);
  const slotId = Number(form.slotId);

  const payload = {
    bookingType: isWalkIn ? 'walk-in' : 'appt',
    customerName: form.customerName.trim(),
    plate: form.plate.trim().toUpperCase(),
    serviceId,
    slotId,
    bookingDate: isWalkIn ? today : (form.bookingDate || today),
  };

  const phone = form.phone?.trim();
  const email = form.email?.trim();
  const notes = form.notes?.trim();
  const vehicleType = form.vehicleType?.trim();

  if (phone) payload.phone = phone;
  if (email) payload.email = email;
  if (notes) payload.notes = notes;
  if (vehicleType) payload.vehicleType = vehicleType.toUpperCase();

  if (form.customerId && form.customerId !== 'new') {
    payload.customerId = Number(form.customerId);
  }

  return payload;
}
