import { Navigate } from 'react-router-dom';
import useAuthStore from '../app/store/authStore';
import { isAdminUser, isCustomerUser, isFieldStaffUser } from '../features/auth/utils/roleUtils';

export default function AdminRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const roles = useAuthStore((state) => state.roles);

  if (!isAuthenticated) {
    return <Navigate to="/login-internal" replace />;
  }

  if (isFieldStaffUser(roles) && !isAdminUser(roles)) {
    return <Navigate to="/staff/dashboard" replace />;
  }

  if (isCustomerUser(roles) && !isAdminUser(roles)) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
}
