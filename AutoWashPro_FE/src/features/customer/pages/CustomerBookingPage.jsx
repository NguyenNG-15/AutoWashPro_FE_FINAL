import { useState } from 'react';
import { Calendar, Car, Clock, MapPin, Sparkles } from 'lucide-react';

const serviceOptions = [
  { id: 'standard', name: 'Rửa xe tiêu chuẩn', duration: '30 phút', price: '150.000đ' },
  { id: 'premium', name: 'Rửa xe cao cấp', duration: '60 phút', price: '350.000đ' },
  { id: 'detail', name: 'Rửa xe chi tiết', duration: '90 phút', price: '550.000đ' },
  { id: 'nano', name: 'Rửa xe + Phủ Nano', duration: '120 phút', price: '890.000đ' },
];

const timeSlots = ['08:00', '09:30', '11:00', '13:30', '15:00', '16:30', '18:00'];

export default function CustomerBookingPage() {
  const [selectedService, setSelectedService] = useState('premium');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [licensePlate, setLicensePlate] = useState('51A-123.45');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8">
        <div className="max-w-[720px] mx-auto bg-white border border-gray-200 rounded-xl p-8 text-center shadow-[0px_4px_20px_0px_rgba(31,41,55,0.08)]">
          <div className="w-16 h-16 rounded-full bg-[#d1fae5] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[#065f46]" />
          </div>
          <h1 className="text-2xl font-bold text-[#181c1e] mb-2">Đặt lịch thành công!</h1>
          <p className="text-[#434654] mb-6">
            Yêu cầu đặt lịch của bạn đã được ghi nhận. Chúng tôi sẽ xác nhận qua SMS trong vài phút.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Đặt lịch khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-[#181c1e] text-3xl font-bold">Đặt lịch dịch vụ</h1>
          <p className="text-[#434654] mt-2">Chọn dịch vụ, thời gian và xe của bạn để đặt lịch rửa xe.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
              <h2 className="text-lg font-semibold text-[#181c1e] mb-4">Chọn dịch vụ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviceOptions.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service.id)}
                    className={`text-left border rounded-xl p-4 transition-colors ${
                      selectedService === service.id
                        ? 'border-[#0047AB] bg-[#E6F0FF]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-[#181c1e]">{service.name}</p>
                    <p className="text-sm text-[#434654] mt-1">{service.duration}</p>
                    <p className="text-sm font-bold text-[#0047AB] mt-2">{service.price}</p>
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
              <h2 className="text-lg font-semibold text-[#181c1e] mb-4">Thời gian</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#434654] mb-1 block">Ngày hẹn</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#434654] mb-1 block">Khung giờ</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
                    <select
                      required
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] bg-white"
                    >
                      <option value="">Chọn giờ</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedTime === slot
                        ? 'bg-[#0047AB] text-white border-[#0047AB]'
                        : 'bg-white text-[#434654] border-gray-200 hover:border-[#0047AB]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0px_4px_10px_rgba(31,41,55,0.08)]">
              <h2 className="text-lg font-semibold text-[#181c1e] mb-4">Thông tin xe</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#434654] mb-1 block">Biển số xe</label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
                    <input
                      type="text"
                      required
                      value={licensePlate}
                      onChange={(e) => setLicensePlate(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#434654] mb-1 block">Ghi chú</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Yêu cầu đặc biệt (nếu có)"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                  />
                </div>
              </div>
            </section>
          </div>

          <aside className="bg-white border border-gray-200 rounded-xl p-6 h-fit shadow-[0px_4px_10px_rgba(31,41,55,0.08)] sticky top-6">
            <h2 className="text-lg font-semibold text-[#181c1e] mb-4">Tóm tắt đặt lịch</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#434654]">Dịch vụ</span>
                <span className="font-medium text-[#181c1e] text-right">
                  {serviceOptions.find((s) => s.id === selectedService)?.name}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#434654]">Ngày</span>
                <span className="font-medium text-[#181c1e]">{selectedDate || '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#434654]">Giờ</span>
                <span className="font-medium text-[#181c1e]">{selectedTime || '—'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#434654]">Xe</span>
                <span className="font-medium text-[#181c1e]">{licensePlate}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-semibold text-[#181c1e]">Tổng cộng</span>
                <span className="font-bold text-[#0047AB]">
                  {serviceOptions.find((s) => s.id === selectedService)?.price}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-[#f7fafd] border border-gray-100 flex gap-2 text-xs text-[#434654]">
              <MapPin className="w-4 h-4 shrink-0 text-[#0047AB]" />
              <span>AutoWash Pro — 123 Nguyễn Văn Linh, Quận 7, TP.HCM</span>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold py-3 rounded-lg transition-colors"
            >
              Xác nhận đặt lịch
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}
