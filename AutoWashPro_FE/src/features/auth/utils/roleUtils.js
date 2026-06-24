const normalizeRole = (role) => String(role ?? '').toUpperCase().replace(/^ROLE_/, '');

export function getNormalizedRoles(roles = []) {
  if (!Array.isArray(roles)) return [];
  return roles.map(normalizeRole);
}

export function isCustomerUser(roles = []) {
  const normalized = getNormalizedRoles(roles);
  return normalized.some((role) => role === 'CUSTOMER' || role === 'USER');
}

export function isAdminUser(roles = []) {
  const normalized = getNormalizedRoles(roles);
  return normalized.some((role) => ['ADMIN', 'MANAGER', 'SUPER_ADMIN'].includes(role));
}

export function isFieldStaffUser(roles = []) {
  const normalized = getNormalizedRoles(roles);
  return normalized.some((role) =>
    ['STAFF', 'EMPLOYEE', 'TECHNICIAN', 'WORKER'].includes(role),
  );
}

/** @deprecated use isAdminUser or isFieldStaffUser */
export function isStaffUser(roles = []) {
  return isAdminUser(roles) || isFieldStaffUser(roles);
}

export function getDefaultRouteForRoles(roles = []) {
  if (isAdminUser(roles)) return '/admin/dashboard';
  if (isFieldStaffUser(roles)) return '/staff/dashboard';
  if (isCustomerUser(roles)) return '/customer/dashboard';
  return '/customer/dashboard';
}
