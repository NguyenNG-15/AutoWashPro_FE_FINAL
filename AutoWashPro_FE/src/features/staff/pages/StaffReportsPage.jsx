import { useState } from 'react';
import { BarChart3, FileBarChart, Send, TrendingUp } from 'lucide-react';

const weeklyStats = [
  { label: 'T2', completed: 4 },
  { label: 'T3', completed: 5 },
  { label: 'T4', completed: 6 },
  { label: 'T5', completed: 5 },
  { label: 'T6', completed: 7 },
  { label: 'T7', completed: 8 },
  { label: 'CN', completed: 3 },
];

const maxCompleted = Math.max(...weeklyStats.map((s) => s.completed));

export default function StaffReportsPage() {
  const [shiftNote, setShiftNote] = useState('');
  const [issueReport, setIssueReport] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setShiftNote('');
    setIssueReport('');
  };

  return (
    <div className="p-8">
      <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-[#181c1e] text-3xl font-bold">Báo cáo</h1>
          <p className="text-[#434654] mt-2">Theo dõi hiệu suất cá nhân và gửi báo cáo ca làm việc.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#434654]">Hoàn thành tuần này</p>
              <TrendingUp className="w-4 h-4 text-[#065f46]" />
            </div>
            <p className="text-3xl font-bold text-[#181c1e] mt-2">38</p>
            <p className="text-xs text-[#065f46] mt-1">+12% so với tuần trước</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#434654]">Đúng giờ</p>
              <BarChart3 className="w-4 h-4 text-[#0047AB]" />
            </div>
            <p className="text-3xl font-bold text-[#0047AB] mt-2">94%</p>
            <p className="text-xs text-[#848a9c] mt-1">Mục tiêu: 90%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#434654]">Đánh giá TB</p>
              <FileBarChart className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <p className="text-3xl font-bold text-[#181c1e] mt-2">4.8</p>
            <p className="text-xs text-[#848a9c] mt-1">Từ 32 lượt đánh giá</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
          <h2 className="text-lg font-semibold text-[#181c1e] mb-6">Nhiệm vụ hoàn thành theo ngày</h2>
          <div className="flex items-end justify-between gap-3 h-40">
            {weeklyStats.map((stat) => (
              <div key={stat.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-28">
                  <div
                    className="w-full max-w-[40px] bg-[#0047AB] rounded-t-md transition-all"
                    style={{ height: `${(stat.completed / maxCompleted) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-[#434654]">{stat.label}</span>
                <span className="text-xs text-[#848a9c]">{stat.completed}</span>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0px_4px_10px_rgba(31,41,55,0.08)] flex flex-col gap-5"
        >
          <h2 className="text-lg font-semibold text-[#181c1e]">Gửi báo cáo ca làm</h2>

          <div>
            <label className="text-sm font-medium text-[#434654] mb-1 block">Tóm tắt ca làm</label>
            <textarea
              required
              rows={3}
              value={shiftNote}
              onChange={(e) => {
                setShiftNote(e.target.value);
                setSubmitted(false);
              }}
              placeholder="Mô tả công việc đã hoàn thành, tình trạng bay, vật tư còn lại..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#434654] mb-1 block">
              Báo cáo sự cố (nếu có)
            </label>
            <textarea
              rows={3}
              value={issueReport}
              onChange={(e) => {
                setIssueReport(e.target.value);
                setSubmitted(false);
              }}
              placeholder="Thiết bị hỏng, thiếu vật tư, vấn đề an toàn..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] resize-none"
            />
          </div>

          {submitted && (
            <p className="text-sm text-[#065f46] font-medium">Báo cáo đã được gửi thành công.</p>
          )}

          <button
            type="submit"
            className="self-start flex items-center gap-2 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
            Gửi báo cáo
          </button>
        </form>
      </div>
    </div>
  );
}
