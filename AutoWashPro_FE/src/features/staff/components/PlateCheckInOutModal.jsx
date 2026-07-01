import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, Car, CalendarClock } from 'lucide-react';
import useBookingStore from '../store/bookingStore';
import {
  fetchBookings,
  startBooking,
  completeBooking,
  acceptBooking,
  getApiErrorMessage,
} from '../services/bookingService';

export default function PlateCheckInOutModal({ isOpen, onClose }) {
  const [plate, setPlate] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [booking, setBooking] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const inputRef = useRef(null);

  const openQuickBooking = useBookingStore((state) => state.openQuickBooking);
  const openWorkflowBooking = useBookingStore((state) => state.openWorkflowBooking);
  const showActionSuccess = useBookingStore((state) => state.showActionSuccess);
  const triggerRefresh = useBookingStore((state) => state.triggerRefresh);

  useEffect(() => {
    if (isOpen) {
      setPlate('');
      setBooking(null);
      setHasSearched(false);
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const query = plate.trim();
    if (!query) return;

    setIsSearching(true);
    setError('');
    setHasSearched(true);
    setBooking(null);

    try {
      // Fetch 10 items to find active bookings today
      const result = await fetchBookings({ search: query, page: 0, size: 10 });
      const today = new Date().toISOString().split('T')[0];
      
      // Find the first active booking today (ignore COMPLETED or CANCELLED)
      const activeBooking = result.bookings.find((b) => {
        const isToday = !b.scheduledDate || String(b.scheduledDate).startsWith(today);
        const status = (b.statusRaw || b.status || '').toUpperCase();
        const isCompletedOrCancelled = status.includes('COMPLETED') || status.includes('CANCEL');
        return isToday && !isCompletedOrCancelled;
      });

      if (activeBooking) {
        setBooking(activeBooking);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Lỗi khi tìm kiếm booking.'));
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateWalkIn = () => {
    onClose();
    openQuickBooking();
  };

  const handleAction = async () => {
    if (!booking?.nextAction) return;
    const { action } = booking.nextAction;

    if (action === 'pay' || action === 'assign') {
      onClose();
      openWorkflowBooking(booking.id);
      return;
    }

    setIsActing(true);
    setError('');
    try {
      let updated;
      if (action === 'accept') updated = await acceptBooking(booking.id);
      else if (action === 'start') updated = await startBooking(booking.id);
      else if (action === 'complete') updated = await completeBooking(booking.id);

      if (updated) {
        triggerRefresh();
        const successMessages = {
          accept: 'Check-in (Xác nhận) thành công!',
          start: 'Check-in (Bắt đầu) thành công!',
          complete: 'Check-out (Hoàn thành) thành công!',
        };
        showActionSuccess(successMessages[action]);
        onClose();
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Lỗi khi thao tác.'));
    } finally {
      setIsActing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#0047AB] to-[#0ea5e9]" />
        
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-[#181c1e] text-lg font-bold">Nhập biển số xe</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-[#434654]" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#848a9c]" />
            <input
              ref={inputRef}
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="Ví dụ: 51A-123.45"
              className="w-full pl-11 pr-24 py-3 bg-[#f7fafd] border border-gray-200 rounded-xl text-base text-[#181c1e] font-mono font-bold placeholder:font-sans placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
            />
            <button
              type="submit"
              disabled={isSearching || !plate.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg disabled:opacity-60 transition-colors"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tìm kiếm'}
            </button>
          </form>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {hasSearched && !isSearching && !booking && !error && (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Car className="w-6 h-6 text-[#848a9c]" />
              </div>
              <p className="text-[#181c1e] font-medium mb-1">Không tìm thấy Booking khả dụng</p>
              <p className="text-[#848a9c] text-sm mb-4">
                Không có lịch hẹn nào đang chờ xử lý hoặc chưa hoàn thành cho biển số {plate}.
              </p>
              <button
                type="button"
                onClick={handleCreateWalkIn}
                className="px-5 py-2.5 bg-white border border-[#0047AB] text-[#0047AB] hover:bg-[#E6F0FF] text-sm font-semibold rounded-lg transition-colors"
              >
                Tạo Booking Nhanh (Walk-in)
              </button>
            </div>
          )}

          {hasSearched && !isSearching && booking && (
            <div className="rounded-xl border border-gray-200 p-4 bg-[#f7fafd]">
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${booking.statusClass}`}>
                  {booking.status}
                </span>
                <span className="text-sm font-semibold text-[#0047AB]">{booking.slot}</span>
              </div>
              
              <h3 className="font-bold text-[#181c1e] text-lg mb-1">{booking.service}</h3>
              <p className="text-[#434654] text-sm mb-4">Khách hàng: {booking.name}</p>

              {booking.nextAction ? (
                <button
                  type="button"
                  onClick={handleAction}
                  disabled={isActing}
                  className={`w-full py-3 rounded-lg text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 ${
                    booking.nextAction.action === 'complete' 
                      ? 'bg-[#16a34a] hover:bg-[#15803d]' 
                      : 'bg-[#0047AB] hover:bg-[#003a8c]'
                  }`}
                >
                  {isActing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : booking.nextAction.action === 'complete' ? (
                    'Check-out (Hoàn thành)'
                  ) : booking.nextAction.action === 'pay' || booking.nextAction.action === 'assign' ? (
                    `Xử lý tiếp (${booking.nextAction.label})`
                  ) : (
                    'Check-in (Bắt đầu)'
                  )}
                </button>
              ) : (
                <div className="text-center text-sm font-medium text-[#16a34a] py-2 bg-[#f0fdf4] rounded-lg">
                  Booking này đã hoàn tất thao tác.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
