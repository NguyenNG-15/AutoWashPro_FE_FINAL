import { useMemo, useState } from 'react';
import { CalendarClock, Car, Search } from 'lucide-react';

const bookingHistory = [
  {
    id: 'BK-240610',
    plate: '51A-123.45',
    service: 'Rửa xe cao cấp + Phủ Nano',
    date: '10/06/2024',
    time: '14:00',
    amount: '890.000đ',
    status: 'Hoàn thành',
    statusClass: 'bg-[#d1fae5] text-[#065f46]',
  },
  {
    id: 'BK-240602',
    plate: '29C-987.65',
    service: 'Bảo dưỡng định kỳ',
    date: '02/06/2024',
    time: '09:30',
    amount: '450.000đ',
    status: 'Hoàn thành',
    statusClass: 'bg-[#d1fae5] text-[#065f46]',
  },
  {
    id: 'BK-240520',
    plate: '51A-123.45',
    service: 'Rửa xe tiêu chuẩn',
    date: '20/05/2024',
    time: '16:30',
    amount: '150.000đ',
    status: 'Hoàn thành',
    statusClass: 'bg-[#d1fae5] text-[#065f46]',
  },
  {
    id: 'BK-240515',
    plate: '51A-123.45',
    service: 'Rửa xe chi tiết',
    date: '15/05/2024',
    time: '11:00',
    amount: '550.000đ',
    status: 'Đã hủy',
    statusClass: 'bg-[#fee2e2] text-[#991b1b]',
  },
];

const filters = ['Tất cả', 'Hoàn thành', 'Đã hủy'];

export default function CustomerBookingHistoryPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  const filteredBookings = useMemo(() => {
    return bookingHistory.filter((booking) => {
      const matchesFilter = activeFilter === 'Tất cả' || booking.status === activeFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        booking.id.toLowerCase().includes(query) ||
        booking.plate.toLowerCase().includes(query) ||
        booking.service.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter]);

  return (
    <div className="p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-[#181c1e] text-3xl font-bold">Lịch sử booking</h1>
          <p className="text-[#434654] mt-2">Xem lại các lần đặt lịch và dịch vụ đã sử dụng.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <p className="text-sm text-[#434654]">Tổng lượt đặt</p>
            <p className="text-3xl font-bold text-[#181c1e] mt-1">{bookingHistory.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <p className="text-sm text-[#434654]">Hoàn thành</p>
            <p className="text-3xl font-bold text-[#065f46] mt-1">
              {bookingHistory.filter((b) => b.status === 'Hoàn thành').length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <p className="text-sm text-[#434654]">Tổng chi tiêu</p>
            <p className="text-3xl font-bold text-[#0047AB] mt-1">2.040.000đ</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-[0px_4px_10px_rgba(31,41,55,0.08)] overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo mã, biển số, dịch vụ..."
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
              />
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f7fafd] text-[#434654]">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Mã booking</th>
                  <th className="text-left px-4 py-3 font-semibold">Xe</th>
                  <th className="text-left px-4 py-3 font-semibold">Dịch vụ</th>
                  <th className="text-left px-4 py-3 font-semibold">Thời gian</th>
                  <th className="text-left px-4 py-3 font-semibold">Số tiền</th>
                  <th className="text-left px-4 py-3 font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-[#848a9c]">
                      Không tìm thấy booking phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                      <td className="px-6 py-4 font-semibold text-[#181c1e]">{booking.id}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#ebeef1] flex items-center justify-center">
                            <Car className="w-4 h-4 text-[#434654]" />
                          </div>
                          <span className="font-medium">{booking.plate}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[#434654]">{booking.service}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-[#434654]">
                          <CalendarClock className="w-4 h-4" />
                          {booking.date} · {booking.time}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#181c1e]">{booking.amount}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${booking.statusClass}`}
                        >
                          {booking.status}
                        </span>
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
