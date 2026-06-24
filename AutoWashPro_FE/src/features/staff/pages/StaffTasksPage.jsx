import { useMemo, useState } from 'react';
import { Car, CheckCircle2, Clock, Play, Search } from 'lucide-react';

const assignedTasks = [
  {
    id: 'TSK-1042',
    plate: '51A-123.45',
    customer: 'Nguyễn Văn A',
    service: 'Rửa xe chi tiết',
    bay: 'Bay 02',
    scheduledTime: '09:30',
    duration: '90 phút',
    status: 'Đang xử lý',
    statusClass: 'bg-[#E6F0FF] text-[#0047AB]',
    priority: 'Cao',
    priorityClass: 'bg-[#fee2e2] text-[#991b1b]',
  },
  {
    id: 'TSK-1043',
    plate: '29C-987.65',
    customer: 'Trần Thị B',
    service: 'Rửa xe cao cấp',
    bay: 'Bay 01',
    scheduledTime: '11:00',
    duration: '60 phút',
    status: 'Chờ bắt đầu',
    statusClass: 'bg-[#fef3c7] text-[#92400e]',
    priority: 'Trung bình',
    priorityClass: 'bg-[#fef3c7] text-[#92400e]',
  },
  {
    id: 'TSK-1044',
    plate: '43B-555.88',
    customer: 'Lê Văn C',
    service: 'Phủ Nano',
    bay: 'Bay 03',
    scheduledTime: '14:00',
    duration: '120 phút',
    status: 'Chờ bắt đầu',
    statusClass: 'bg-[#fef3c7] text-[#92400e]',
    priority: 'Cao',
    priorityClass: 'bg-[#fee2e2] text-[#991b1b]',
  },
  {
    id: 'TSK-1045',
    plate: '30F-222.11',
    customer: 'Phạm Minh D',
    service: 'Rửa xe tiêu chuẩn',
    bay: 'Bay 04',
    scheduledTime: '15:30',
    duration: '30 phút',
    status: 'Chờ bắt đầu',
    statusClass: 'bg-[#fef3c7] text-[#92400e]',
    priority: 'Thấp',
    priorityClass: 'bg-[#f3f4f6] text-[#434654]',
  },
];

const filters = ['Tất cả', 'Chờ bắt đầu', 'Đang xử lý'];

export default function StaffTasksPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [tasks, setTasks] = useState(assignedTasks);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter = activeFilter === 'Tất cả' || task.status === activeFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        task.id.toLowerCase().includes(query) ||
        task.plate.toLowerCase().includes(query) ||
        task.customer.toLowerCase().includes(query) ||
        task.service.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter, tasks]);

  const handleStart = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: 'Đang xử lý', statusClass: 'bg-[#E6F0FF] text-[#0047AB]' }
          : task,
      ),
    );
  };

  const handleComplete = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <div className="p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-[#181c1e] text-3xl font-bold">Danh sách nhiệm vụ được giao</h1>
          <p className="text-[#434654] mt-2">Theo dõi và cập nhật tiến độ các công việc được phân công.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <p className="text-sm text-[#434654]">Tổng nhiệm vụ</p>
            <p className="text-3xl font-bold text-[#181c1e] mt-1">{tasks.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <p className="text-sm text-[#434654]">Đang xử lý</p>
            <p className="text-3xl font-bold text-[#0047AB] mt-1">
              {tasks.filter((t) => t.status === 'Đang xử lý').length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <p className="text-sm text-[#434654]">Chờ bắt đầu</p>
            <p className="text-3xl font-bold text-[#92400e] mt-1">
              {tasks.filter((t) => t.status === 'Chờ bắt đầu').length}
            </p>
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
                placeholder="Tìm theo mã, biển số, khách hàng..."
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

          <div className="divide-y divide-gray-100">
            {filteredTasks.length === 0 ? (
              <div className="p-10 text-center text-[#848a9c]">Không có nhiệm vụ phù hợp.</div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="p-6 flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-[#ebeef1] flex items-center justify-center shrink-0">
                      <Car className="w-5 h-5 text-[#434654]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#181c1e]">{task.plate}</span>
                        <span className="text-xs text-[#848a9c]">{task.id}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${task.priorityClass}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-sm text-[#434654] mt-1">{task.service}</p>
                      <p className="text-sm text-[#434654]">Khách: {task.customer}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#848a9c]">
                        <span>{task.bay}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.scheduledTime} ({task.duration})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${task.statusClass}`}>
                      {task.status}
                    </span>
                    {task.status === 'Chờ bắt đầu' && (
                      <button
                        type="button"
                        onClick={() => handleStart(task.id)}
                        className="flex items-center gap-1.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        Bắt đầu
                      </button>
                    )}
                    {task.status === 'Đang xử lý' && (
                      <button
                        type="button"
                        onClick={() => handleComplete(task.id)}
                        className="flex items-center gap-1.5 bg-[#065f46] hover:bg-[#047857] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Hoàn thành
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
