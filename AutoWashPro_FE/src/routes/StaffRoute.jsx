import { Navigate } from 'react-router-dom';
import useAuthStore from '../app/store/authStore';
import { isAdminUser, isCustomerUser, isFieldStaffUser } from '../features/auth/utils/roleUtils';

export default function StaffRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const roles = useAuthStore((state) => state.roles);

  if (!isAuthenticated) {
    return <Navigate to="/login-internal" replace />;
  }

  if (isAdminUser(roles)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isCustomerUser(roles) && !isFieldStaffUser(roles)) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
}
