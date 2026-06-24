import { Link } from 'react-router-dom';
import {
  Bell,
  Car,
  CheckCircle2,
  ClipboardList,
  Clock,
  PlayCircle,
  TrendingUp,
} from 'lucide-react';
import useAuthStore from '../../../app/store/authStore';

const todayTasks = [
  {
    id: 'TSK-1042',
    plate: '51A-123.45',
    service: 'Rửa xe chi tiết',
    bay: 'Bay 02',
    time: '09:30',
    status: 'Đang xử lý',
    statusClass: 'bg-[#E6F0FF] text-[#0047AB]',
  },
  {
    id: 'TSK-1043',
    plate: '29C-987.65',
    service: 'Rửa xe cao cấp',
    bay: 'Bay 01',
    time: '11:00',
    status: 'Chờ bắt đầu',
    statusClass: 'bg-[#fef3c7] text-[#92400e]',
  },
  {
    id: 'TSK-1044',
    plate: '43B-555.88',
    service: 'Phủ Nano',
    bay: 'Bay 03',
    time: '14:00',
    status: 'Chờ bắt đầu',
    statusClass: 'bg-[#fef3c7] text-[#92400e]',
  },
];

const statCards = [
  {
    label: 'Nhiệm vụ hôm nay',
    value: '5',
    sub: '2 đang xử lý',
    icon: ClipboardList,
  },
  {
    label: 'Đã hoàn thành',
    value: '3',
    sub: 'Trong ca sáng',
    icon: CheckCircle2,
  },
  {
    label: 'Thời gian trung bình',
    value: '42p',
    sub: 'Mỗi xe',
    icon: Clock,
  },
  {
    label: 'Hiệu suất tuần',
    value: '96%',
    sub: '+4% so với tuần trước',
    icon: TrendingUp,
  },
];

export default function StaffDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const displayName = user?.fullName ?? user?.name ?? user?.username ?? 'Nhân viên';

  return (
    <div className="p-8">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-[#181c1e] text-[40px] font-bold tracking-[-0.8px] leading-[56px]">
            Xin chào, {displayName} 👋
          </h1>
          <p className="text-[#434654] text-lg">Đây là tổng quan công việc của bạn trong ngày hôm nay.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map(({ label, value, sub, icon: Icon }) => (
            <div
              key={label}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#434654]">{label}</p>
                  <p className="text-3xl font-bold text-[#181c1e] mt-1">{value}</p>
                  <p className="text-xs text-[#848a9c] mt-1">{sub}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#E6F0FF] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#0047AB]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-[0px_4px_10px_rgba(31,41,55,0.08)] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#181c1e]">Nhiệm vụ ưu tiên</h2>
              <Link to="/staff/tasks" className="text-sm font-medium text-[#0047AB] hover:underline">
                Xem tất cả
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {todayTasks.map((task) => (
                <div key={task.id} className="p-5 flex items-center gap-4 hover:bg-gray-50/60 transition">
                  <div className="w-12 h-12 rounded-lg bg-[#ebeef1] flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-[#434654]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#181c1e]">{task.plate}</span>
                      <span className="text-xs text-[#848a9c]">{task.id}</span>
                    </div>
                    <p className="text-sm text-[#434654] truncate">{task.service}</p>
                    <p className="text-xs text-[#848a9c] mt-0.5">
                      {task.bay} · {task.time}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${task.statusClass}`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
              <h2 className="text-lg font-semibold text-[#181c1e] mb-4">Thao tác nhanh</h2>
              <div className="flex flex-col gap-3">
                <Link
                  to="/staff/tasks"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#0047AB] hover:bg-[#E6F0FF]/40 transition"
                >
                  <PlayCircle className="w-5 h-5 text-[#0047AB]" />
                  <span className="text-sm font-medium text-[#181c1e]">Bắt đầu nhiệm vụ tiếp theo</span>
                </Link>
                <Link
                  to="/staff/completed"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#0047AB] hover:bg-[#E6F0FF]/40 transition"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#065f46]" />
                  <span className="text-sm font-medium text-[#181c1e]">Xem công việc đã hoàn thành</span>
                </Link>
                <Link
                  to="/staff/reports"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#0047AB] hover:bg-[#E6F0FF]/40 transition"
                >
                  <TrendingUp className="w-5 h-5 text-[#0047AB]" />
                  <span className="text-sm font-medium text-[#181c1e]">Gửi báo cáo ca làm</span>
                </Link>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-[#181c1e]" />
                <h2 className="text-lg font-semibold text-[#181c1e]">Thông báo mới</h2>
              </div>
              <div className="bg-[rgba(0,61,155,0.05)] border border-[rgba(0,61,155,0.1)] rounded-lg p-4">
                <p className="text-sm font-semibold text-[#181c1e]">Ca chiều bổ sung 2 nhiệm vụ</p>
                <p className="text-sm text-[#434654] mt-1">
                  Quản lý đã giao thêm 2 booking cho Bay 02. Vui lòng kiểm tra danh sách nhiệm vụ.
                </p>
                <Link to="/staff/notifications" className="text-xs text-[#0047AB] font-medium mt-2 inline-block hover:underline">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
