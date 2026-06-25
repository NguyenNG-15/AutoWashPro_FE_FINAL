export const workStatusOptions = [
  { value: 'IDLE', label: 'Idle' },
  { value: 'BUSY', label: 'Busy' },
  { value: 'ON_BREAK', label: 'On Break' },
  { value: 'OFF', label: 'Off Duty' },
];

export const accountStatusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Locked' },
  { value: 'PENDING_ACTIVATION', label: 'Pending Activation' },
  { value: 'DELETED', label: 'Deleted' },
];

export const inputClass =
  'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#181c1e] bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]';

export const labelClass = 'text-[#434654] text-sm font-medium mb-1.5 block';

export function emptyCreateStaffForm() {
  return {
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    roleIds: [],
  };
}

export function staffToProfileForm(staff) {
  if (!staff) {
    return {
      fullName: '',
      username: '',
      email: '',
      phoneNumber: '',
    };
  }

  return {
    fullName: staff.name === '—' ? '' : staff.name,
    username: staff.username === '—' ? '' : staff.username,
    email: staff.email === '—' ? '' : staff.email,
    phoneNumber: staff.phone === '—' ? '' : staff.phone,
  };
}

export function getWorkStatusLabel(value = '') {
  return workStatusOptions.find((opt) => opt.value === value)?.label ?? (value || '—');
}

export function getAccountStatusLabel(value = '') {
  return accountStatusOptions.find((opt) => opt.value === value)?.label ?? (value || '—');
}
