import { createBrowserRouter, Navigate } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import CustomerLayout from '../../layouts/CustomerLayout';
import StaffLayout from '../../layouts/StaffLayout';
import AdminLayout from '../../layouts/AdminLayout';
import CustomerRoute from '../../routes/CustomerRoute';
import StaffRoute from '../../routes/StaffRoute';
import AdminRoute from '../../routes/AdminRoute';

// Pages
import HomePage from '../../features/home/pages/HomePage';
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import DashboardPage from '../../features/customer/pages/DashboardPage';
import CustomerBookingPage from '../../features/customer/pages/CustomerBookingPage';
import CustomerProfilePage from '../../features/customer/pages/CustomerProfilePage';
import CustomerBookingHistoryPage from '../../features/customer/pages/CustomerBookingHistoryPage';
import CustomerFeedbackPage from '../../features/customer/pages/CustomerFeedbackPage';
import StaffDashboardPage from '../../features/staff/pages/StaffDashboardPage';
import StaffTasksPage from '../../features/staff/pages/StaffTasksPage';
import StaffCompletedPage from '../../features/staff/pages/StaffCompletedPage';
import StaffNotificationsPage from '../../features/staff/pages/StaffNotificationsPage';
import StaffReportsPage from '../../features/staff/pages/StaffReportsPage';
import AdminDashboardPage from '../../features/admin/pages/AdminDashboardPage';
import AdminBookingsPage from '../../features/admin/pages/AdminBookingsPage';
import AdminCustomersPage from '../../features/admin/pages/AdminCustomersPage';
import AdminStaffPage from '../../features/admin/pages/AdminStaffPage';
import AdminFinancePage from '../../features/admin/pages/AdminFinancePage';
import LoyaltyTierRulesPage from '../../features/admin/pages/LoyaltyTierRulesPage';
import AdminAuditLogsPage from '../../features/admin/pages/AdminAuditLogsPage';
import AdminSettingsPage from '../../features/admin/pages/AdminSettingsPage';
import AdminRolesPage from '../../features/admin/pages/AdminRolesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'login-internal',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/customer',
    element: (
      <CustomerRoute>
        <CustomerLayout />
      </CustomerRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/customer/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'booking',
        element: <CustomerBookingPage />,
      },
      {
        path: 'profile',
        element: <CustomerProfilePage />,
      },
      {
        path: 'history',
        element: <CustomerBookingHistoryPage />,
      },
      {
        path: 'feedback',
        element: <CustomerFeedbackPage />,
      },
    ],
  },
  {
    path: '/staff',
    element: (
      <StaffRoute>
        <StaffLayout />
      </StaffRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/staff/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <StaffDashboardPage />,
      },
      {
        path: 'tasks',
        element: <StaffTasksPage />,
      },
      {
        path: 'completed',
        element: <StaffCompletedPage />,
      },
      {
        path: 'notifications',
        element: <StaffNotificationsPage />,
      },
      {
        path: 'reports',
        element: <StaffReportsPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'bookings',
        element: <AdminBookingsPage />,
      },
      {
        path: 'staff',
        element: <AdminStaffPage />,
      },
      {
        path: 'customers',
        element: <AdminCustomersPage />,
      },
      {
        path: 'loyalty',
        element: <LoyaltyTierRulesPage />,
      },
      {
        path: 'finance',
        element: <AdminFinancePage />,
      },
      {
        path: 'audit-logs',
        element: <AdminAuditLogsPage />,
      },
      {
        path: 'roles',
        element: <AdminRolesPage />,
      },
      {
        path: 'settings',
        element: <AdminSettingsPage />,
      },
    ],
  },
]);

export default router;
