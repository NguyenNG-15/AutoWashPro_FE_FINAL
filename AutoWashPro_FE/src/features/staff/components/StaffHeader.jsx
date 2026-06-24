import { Bell, Clock } from 'lucide-react';
import useAuthStore from '../../../app/store/authStore';

function getDisplayName(user) {
  if (!user) return 'Nhân viên';
  return user.fullName ?? user.name ?? user.username ?? 'Nhân viên';
}

function getInitials(name) {
  const parts = String(name).trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function StaffHeader() {
  const user = useAuthStore((state) => state.user);
  const displayName = getDisplayName(user);

  return (
    <header className="h-16 shrink-0 bg-white border-b border-gray-200 px-6 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-[#848a9c]">Cổng nhân viên</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#181c1e]">Ca làm việc hôm nay</p>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#065f46] bg-[#d1fae5] px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            Đang làm việc
          </span>
        </div>
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
            <p className="text-xs text-[#848a9c]">Kỹ thuật viên</p>
          </div>
        </div>
      </div>
    </header>
  );
}
