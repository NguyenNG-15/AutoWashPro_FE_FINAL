import { useMemo, useState } from 'react';
import { CalendarClock, Car, Search, Star } from 'lucide-react';

const completedTasks = [
  {
    id: 'TSK-1038',
    plate: '51G-888.99',
    service: 'Rửa xe tiêu chuẩn',
    customer: 'Hoàng Văn E',
    completedAt: '10/06/2024 · 08:45',
    duration: '28 phút',
    bay: 'Bay 01',
    rating: 5,
  },
  {
    id: 'TSK-1039',
    plate: '60A-321.00',
    service: 'Rửa xe cao cấp',
    customer: 'Võ Thị F',
    completedAt: '10/06/2024 · 10:15',
    duration: '55 phút',
    bay: 'Bay 02',
    rating: 4,
  },
  {
    id: 'TSK-1040',
    plate: '77B-456.12',
    service: 'Rửa xe chi tiết',
    customer: 'Đặng Văn G',
    completedAt: '09/06/2024 · 16:20',
    duration: '82 phút',
    bay: 'Bay 03',
    rating: 5,
  },
  {
    id: 'TSK-1041',
    plate: '92C-111.22',
    service: 'Phủ Nano',
    customer: 'Bùi Minh H',
    completedAt: '09/06/2024 · 14:00',
    duration: '115 phút',
    bay: 'Bay 03',
    rating: 5,
  },
];

export default function StaffCompletedPage() {
  const [search, setSearch] = useState('');

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return completedTasks;
    return completedTasks.filter(
      (task) =>
        task.id.toLowerCase().includes(query) ||
        task.plate.toLowerCase().includes(query) ||
        task.service.toLowerCase().includes(query) ||
        task.customer.toLowerCase().includes(query),
    );
  }, [search]);

  const avgDuration = '70 phút';
  const totalCompleted = completedTasks.length;

  return (
    <div className="p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-[#181c1e] text-3xl font-bold">Lịch sử công việc đã hoàn thành</h1>
          <p className="text-[#434654] mt-2">Xem lại các nhiệm vụ bạn đã hoàn thành và đánh giá từ khách hàng.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <p className="text-sm text-[#434654]">Tổng đã hoàn thành</p>
            <p className="text-3xl font-bold text-[#181c1e] mt-1">{totalCompleted}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <p className="text-sm text-[#434654]">Thời gian trung bình</p>
            <p className="text-3xl font-bold text-[#0047AB] mt-1">{avgDuration}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <p className="text-sm text-[#434654]">Đánh giá trung bình</p>
            <p className="text-3xl font-bold text-[#065f46] mt-1">4.8/5</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-[0px_4px_10px_rgba(31,41,55,0.08)] overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo mã, biển số, dịch vụ..."
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f7fafd] text-[#434654]">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Mã nhiệm vụ</th>
                  <th className="text-left px-4 py-3 font-semibold">Xe / Khách</th>
                  <th className="text-left px-4 py-3 font-semibold">Dịch vụ</th>
                  <th className="text-left px-4 py-3 font-semibold">Hoàn thành</th>
                  <th className="text-left px-4 py-3 font-semibold">Thời gian</th>
                  <th className="text-left px-4 py-3 font-semibold">Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[#848a9c]">
                      Không tìm thấy công việc phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                      <td className="px-6 py-4 font-semibold text-[#181c1e]">{task.id}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#ebeef1] flex items-center justify-center">
                            <Car className="w-4 h-4 text-[#434654]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#181c1e]">{task.plate}</p>
                            <p className="text-xs text-[#848a9c]">{task.customer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#434654]">
                        <p>{task.service}</p>
                        <p className="text-xs text-[#848a9c]">{task.bay}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-[#434654]">
                          <CalendarClock className="w-4 h-4" />
                          {task.completedAt}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium text-[#181c1e]">{task.duration}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <Star
                              key={value}
                              className={`w-3.5 h-3.5 ${
                                value <= task.rating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
