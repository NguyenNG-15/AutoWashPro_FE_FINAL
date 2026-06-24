import { useState } from 'react';
import { Bell, CheckCheck, ClipboardList, Info, Megaphone } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'task',
    icon: ClipboardList,
    title: 'Nhiệm vụ mới được giao',
    message: 'Bạn được phân công nhiệm vụ TSK-1044 — Phủ Nano cho xe 43B-555.88 lúc 14:00.',
    time: '10 phút trước',
    read: false,
  },
  {
    id: 2,
    type: 'announcement',
    icon: Megaphone,
    title: 'Thông báo ca làm chiều',
    message: 'Ca chiều hôm nay tăng cường 1 kỹ thuật viên tại Bay 02 do lượng khách tăng.',
    time: '45 phút trước',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    icon: Info,
    title: 'Cập nhật quy trình',
    message: 'Vui lòng kiểm tra checklist mới trước khi bàn giao xe cho khách.',
    time: '2 giờ trước',
    read: true,
  },
  {
    id: 4,
    type: 'task',
    icon: ClipboardList,
    title: 'Nhắc nhở nhiệm vụ',
    message: 'Nhiệm vụ TSK-1043 sẽ bắt đầu trong 15 phút tại Bay 01.',
    time: '3 giờ trước',
    read: true,
  },
];

const filters = ['Tất cả', 'Chưa đọc', 'Đã đọc'];

export default function StaffNotificationsPage() {
  const [items, setItems] = useState(notifications);
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'Chưa đọc') return !item.read;
    if (activeFilter === 'Đã đọc') return item.read;
    return true;
  });

  const unreadCount = items.filter((item) => !item.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const markRead = (id) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  return (
    <div className="p-8">
      <div className="max-w-[900px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-[#181c1e] text-3xl font-bold">Thông báo</h1>
            <p className="text-[#434654] mt-2">
              Cập nhật nhiệm vụ, thông báo nội bộ và nhắc nhở ca làm việc.
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-2 text-sm font-medium text-[#0047AB] hover:underline self-start"
            >
              <CheckCheck className="w-4 h-4" />
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <p className="text-sm text-[#434654]">Chưa đọc</p>
            <p className="text-3xl font-bold text-[#0047AB] mt-1">{unreadCount}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <p className="text-sm text-[#434654]">Tổng thông báo</p>
            <p className="text-3xl font-bold text-[#181c1e] mt-1">{items.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                activeFilter === filter
                  ? 'bg-[#0047AB] text-white border-[#0047AB]'
                  : 'bg-white text-[#434654] border-gray-200 hover:border-[#0047AB]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-[0px_4px_10px_rgba(31,41,55,0.08)] overflow-hidden divide-y divide-gray-100">
          {filteredItems.length === 0 ? (
            <div className="p-10 text-center text-[#848a9c] flex flex-col items-center gap-2">
              <Bell className="w-8 h-8 text-gray-300" />
              Không có thông báo nào.
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => markRead(item.id)}
                  className={`w-full text-left p-5 flex gap-4 hover:bg-gray-50/60 transition ${
                    !item.read ? 'bg-[#E6F0FF]/30' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      !item.read ? 'bg-[#E6F0FF]' : 'bg-[#f3f4f6]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${!item.read ? 'text-[#0047AB]' : 'text-[#434654]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#181c1e]">{item.title}</p>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#0047AB] shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-[#434654] mt-1">{item.message}</p>
                    <p className="text-xs text-[#848a9c] mt-2">{item.time}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
