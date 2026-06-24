import { Bell } from 'lucide-react';
import useAuthStore from '../../../app/store/authStore';

function getDisplayName(user) {
  if (!user) return 'Khách hàng';
  return user.fullName ?? user.name ?? user.username ?? 'Khách hàng';
}

function getInitials(name) {
  const parts = String(name).trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function CustomerHeader() {
  const user = useAuthStore((state) => state.user);
  const displayName = getDisplayName(user);

  return (
    <header className="h-16 shrink-0 bg-white border-b border-gray-200 px-6 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#848a9c]">Cổng khách hàng</p>
        <p className="text-sm font-semibold text-[#181c1e]">Quản lý dịch vụ rửa xe của bạn</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors relative"
          aria-label="Thông báo"
        >
          <Bell className="w-5 h-5 text-[#434654]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0047AB] to-[#0066cc] flex items-center justify-center text-white text-sm font-bold">
            {getInitials(displayName)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#181c1e] leading-tight">{displayName}</p>
            <p className="text-xs text-[#848a9c]">Thành viên</p>
          </div>
        </div>
      </div>
    </header>
  );
}
