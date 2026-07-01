import { useEffect, useState } from 'react';
import {
  X,
  CheckCircle2,
  CalendarClock,
  Car,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import useBookingStore from '../store/bookingStore';
import { formatCurrency } from '../services/bookingService';

const AUTO_DISMISS_MS = 10000;

export default function BookingSuccessToast() {
  const lastCreatedBooking = useBookingStore((state) => state.lastCreatedBooking);
  const clearSuccessNotification = useBookingStore((state) => state.clearSuccessNotification);
  const openWorkflowBooking = useBookingStore((state) => state.openWorkflowBooking);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!lastCreatedBooking) {
      setIsVisible(false);
      setProgress(100);
      return undefined;
    }

    const enterTimer = requestAnimationFrame(() => setIsVisible(true));

    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / AUTO_DISMISS_MS) * 100);
      setProgress(remaining);
    }, 50);

    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(clearSuccessNotification, 300);
    }, AUTO_DISMISS_MS);

    return () => {
      cancelAnimationFrame(enterTimer);
      clearInterval(progressInterval);
      clearTimeout(dismissTimer);
    };
  }, [lastCreatedBooking, clearSuccessNotification]);

  if (!lastCreatedBooking) return null;

  const isWalkIn = lastCreatedBooking.type === 'Walk-in';
  const TypeIcon = isWalkIn ? Car : CalendarClock;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(clearSuccessNotification, 300);
  };

  const handleOpenWorkflow = () => {
    openWorkflowBooking(lastCreatedBooking.id);
    handleClose();
  };
  return (
    <div
      className={`fixed top-6 right-6 z-[70] w-[min(100vw-2rem,400px)] transition-all duration-300 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0 pointer-events-none'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,71,171,0.18)] border border-[#0047AB]/10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#16a34a] via-[#0047AB] to-[#6366f1]" />

        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-[#16a34a]" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#0047AB] flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </span>
            </div>

            <div className="flex-1 min-w-0 pr-6">
              <p className="text-[#181c1e] font-bold text-base leading-tight">
                Booking created successfully!
              </p>
              <p className="text-[#848a9c] text-xs mt-1">
                Next: payment and assign technician
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#848a9c] hover:text-[#181c1e] hover:bg-gray-100 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 rounded-xl bg-[#f7fafd] border border-gray-100 p-4">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
              <div
                className={`w-10 h-10 rounded-full ${lastCreatedBooking.avatarBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}
              >
                {lastCreatedBooking.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[#181c1e] font-semibold text-sm truncate">
                  {lastCreatedBooking.name}
                </p>
                <p className="text-[#848a9c] text-xs">{lastCreatedBooking.membership}</p>
              </div>
              <span
                className={`inline-flex text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${lastCreatedBooking.statusClass}`}
              >
                {lastCreatedBooking.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
              <div>
                <span className="text-[#848a9c] block">Plate</span>
                <span className="text-[#181c1e] font-mono font-semibold">
                  {lastCreatedBooking.plate}
                </span>
              </div>
              <div>
                <span className="text-[#848a9c] block">Time Slot</span>
                <span className="text-[#181c1e] font-semibold">{lastCreatedBooking.slot}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#848a9c] block">Service</span>
                <span className="text-[#181c1e] font-semibold">{lastCreatedBooking.service}</span>
              </div>
              <div>
                <span className="text-[#848a9c] block">Type</span>
                <span className="inline-flex items-center gap-1 text-[#181c1e] font-semibold">
                  <TypeIcon className="w-3.5 h-3.5 text-[#0047AB]" />
                  {lastCreatedBooking.type}
                </span>
              </div>
              <div>
                <span className="text-[#848a9c] block">Total</span>
                <span className="text-[#0047AB] font-bold">{formatCurrency(lastCreatedBooking.price)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenWorkflow}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Pay &amp; Assign Technician
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-[#16a34a] to-[#0047AB] transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
