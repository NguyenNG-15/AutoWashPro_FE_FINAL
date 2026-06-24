import { Navigate } from 'react-router-dom';
import useAuthStore from '../app/store/authStore';
import { isAdminUser, isCustomerUser, isFieldStaffUser } from '../features/auth/utils/roleUtils';

export default function CustomerRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const roles = useAuthStore((state) => state.roles);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdminUser(roles)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isFieldStaffUser(roles) && !isCustomerUser(roles)) {
    return <Navigate to="/staff/dashboard" replace />;
  }

  return children;
}
