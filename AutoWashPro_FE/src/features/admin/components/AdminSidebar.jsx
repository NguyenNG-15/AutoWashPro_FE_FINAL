import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../app/store/authStore';
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCircle,
  Award,
  DollarSign,
  FileText,
  Shield,
  Settings,
  Plus,
  LifeBuoy,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/staff', label: 'Staff', icon: Users },
  { to: '/admin/customers', label: 'Customers', icon: UserCircle },
  { to: '/admin/loyalty', label: 'Loyalty', icon: Award },
  { to: '/admin/finance', label: 'Finance', icon: DollarSign },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: FileText },
  { to: '/admin/roles', label: 'Roles', icon: Shield },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login-internal', { replace: true });
  };

  return (
    <aside className="w-[260px] shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#0047AB] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#181c1e] font-bold text-base leading-tight">AutoWash Pro</span>
            <span className="text-[#848a9c] text-xs">Enterprise Admin</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {menuItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#E6F0FF] text-[#0047AB]'
                  : 'text-[#434654] hover:bg-gray-50 hover:text-[#181c1e]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0047AB] rounded-r-full" />
                )}
                <Icon className="w-5 h-5 shrink-0" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-5 border-t border-gray-100 flex flex-col gap-3">
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-[#434654] hover:text-[#181c1e] transition-colors">
          <LifeBuoy className="w-4 h-4" />
          Support
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-[#434654] hover:text-[#181c1e] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
