import {
  Shield,
  UserCog,
  Wrench,
  Banknote,
  ClipboardList,
} from 'lucide-react';

export const allPermissions = [
  { id: 'dashboard', label: 'View Dashboard', group: 'Operations' },
  { id: 'bookings_read', label: 'View Bookings', group: 'Operations' },
  { id: 'bookings_write', label: 'Manage Bookings', group: 'Operations' },
  { id: 'staff_read', label: 'View Staff', group: 'People' },
  { id: 'staff_write', label: 'Manage Staff', group: 'People' },
  { id: 'loyalty_read', label: 'View Loyalty Rules', group: 'Loyalty' },
  { id: 'loyalty_write', label: 'Edit Loyalty Rules', group: 'Loyalty' },
  { id: 'finance_read', label: 'View Finance', group: 'Finance' },
  { id: 'finance_write', label: 'Shift Closure & Reconciliation', group: 'Finance' },
  { id: 'audit_read', label: 'View Audit Logs', group: 'Security' },
  { id: 'roles_manage', label: 'Manage Roles & Permissions', group: 'Security' },
  { id: 'settings_write', label: 'System Settings', group: 'Security' },
];

export const initialRoles = [
  {
    id: 1,
    name: 'Facility Admin',
    code: 'ROLE_FACILITY_ADMIN',
    description:
      'Full facility oversight including staff scheduling, bay operations, and daily revenue targets.',
    staffCount: 12,
    staffBadgeClass: 'bg-[#E6F0FF] text-[#0047AB]',
    icon: Shield,
    iconBg: 'bg-[#E6F0FF]',
    iconColor: 'text-[#0047AB]',
    permissions: allPermissions.map((p) => p.id),
    isSystem: true,
  },
  {
    id: 2,
    name: 'Shift Supervisor',
    code: 'ROLE_SHIFT_SUPERVISOR',
    description:
      'Manages shift handovers, staff assignments, and real-time queue prioritization during peak hours.',
    staffCount: 24,
    staffBadgeClass: 'bg-[#f0fdf4] text-[#16a34a]',
    icon: UserCog,
    iconBg: 'bg-[#f0fdf4]',
    iconColor: 'text-[#16a34a]',
    permissions: [
      'dashboard',
      'bookings_read',
      'bookings_write',
      'staff_read',
      'staff_write',
      'finance_read',
    ],
    isSystem: false,
  },
  {
    id: 3,
    name: 'Lead Technician',
    code: 'ROLE_LEAD_TECHNICIAN',
    description:
      'Oversees bay quality standards, service completion, and technician performance metrics.',
    staffCount: 8,
    staffBadgeClass: 'bg-[#E6F0FF] text-[#0047AB]',
    icon: Wrench,
    iconBg: 'bg-[#fff7ed]',
    iconColor: 'text-[#ea580c]',
    permissions: ['dashboard', 'bookings_read', 'bookings_write', 'staff_read'],
    isSystem: false,
  },
  {
    id: 4,
    name: 'Cashier',
    code: 'ROLE_CASHIER',
    description:
      'Handles POS transactions, walk-in bookings, and drawer reconciliation at checkout.',
    staffCount: 18,
    staffBadgeClass: 'bg-[#f0fdf4] text-[#16a34a]',
    icon: Banknote,
    iconBg: 'bg-[#E6F0FF]',
    iconColor: 'text-[#0047AB]',
    permissions: ['dashboard', 'bookings_read', 'bookings_write', 'finance_read'],
    isSystem: false,
  },
  {
    id: 5,
    name: 'Audit Manager',
    code: 'ROLE_AUDIT_MANAGER',
    description:
      'Read-only access to financial ledgers, shift audits, and immutable system event logs.',
    staffCount: 3,
    staffBadgeClass: 'bg-[#E6F0FF] text-[#0047AB]',
    icon: ClipboardList,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    permissions: ['dashboard', 'finance_read', 'audit_read'],
    isSystem: false,
  },
];

export function generateRoleCode(name) {
  return `ROLE_${name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '')}`;
}
