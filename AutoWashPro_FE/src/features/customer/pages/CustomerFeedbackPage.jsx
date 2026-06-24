import { useState } from 'react';
import { MessageSquare, Send, Star } from 'lucide-react';

const recentFeedback = [
  {
    id: 1,
    bookingId: 'BK-240610',
    rating: 5,
    comment: 'Dịch vụ rất tốt, xe sạch và thơm. Nhân viên nhiệt tình!',
    date: '10/06/2024',
    status: 'Đã gửi',
  },
  {
    id: 2,
    bookingId: 'BK-240602',
    rating: 4,
    comment: 'Rửa kỹ, chỉ hơi chờ lâu một chút vào cuối tuần.',
    date: '02/06/2024',
    status: 'Đã gửi',
  },
];

export default function CustomerFeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [bookingId, setBookingId] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setRating(0);
    setBookingId('');
    setComment('');
  };

  return (
    <div className="p-8">
      <div className="max-w-[900px] mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-[#181c1e] text-3xl font-bold">Feedback</h1>
          <p className="text-[#434654] mt-2">Chia sẻ đánh giá để chúng tôi cải thiện chất lượng dịch vụ.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0px_4px_10px_rgba(31,41,55,0.08)] flex flex-col gap-5"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#0047AB]" />
            <h2 className="text-lg font-semibold text-[#181c1e]">Gửi đánh giá mới</h2>
          </div>

          <div>
            <label className="text-sm font-medium text-[#434654] mb-2 block">Mức độ hài lòng</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(value)}
                  className="p-1"
                  aria-label={`${value} sao`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      value <= (hoverRating || rating)
                        ? 'fill-[#f59e0b] text-[#f59e0b]'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#434654] mb-1 block">Mã booking (tuỳ chọn)</label>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="VD: BK-240610"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#434654] mb-1 block">Nội dung phản hồi</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] resize-none"
            />
          </div>

          {submitted && (
            <p className="text-sm text-[#065f46] font-medium">Cảm ơn bạn! Phản hồi đã được gửi thành công.</p>
          )}

          <button
            type="submit"
            disabled={rating === 0}
            className="self-start flex items-center gap-2 bg-[#0047AB] hover:bg-[#003a8c] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
            Gửi feedback
          </button>
        </form>

        <section className="bg-white border border-gray-200 rounded-xl shadow-[0px_4px_10px_rgba(31,41,55,0.08)] overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-[#181c1e]">Feedback đã gửi</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentFeedback.map((item) => (
              <div key={item.id} className="p-6 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={`w-4 h-4 ${
                          value <= item.rating ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#848a9c]">{item.date}</span>
                </div>
                <p className="text-sm text-[#434654]">{item.comment}</p>
                <div className="flex items-center gap-3 text-xs text-[#848a9c]">
                  <span>{item.bookingId}</span>
                  <span>·</span>
                  <span className="text-[#065f46] font-medium">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
