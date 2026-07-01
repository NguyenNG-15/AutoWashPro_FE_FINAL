import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import useBookingStore from '../store/bookingStore';

const AUTO_DISMISS_MS = 4000;

export default function BookingActionToast() {
  const actionSuccessMessage = useBookingStore((state) => state.actionSuccessMessage);
  const clearActionSuccess = useBookingStore((state) => state.clearActionSuccess);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!actionSuccessMessage) {
      setIsVisible(false);
      return undefined;
    }

    const enterTimer = requestAnimationFrame(() => setIsVisible(true));
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(clearActionSuccess, 300);
    }, AUTO_DISMISS_MS);

    return () => {
      cancelAnimationFrame(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [actionSuccessMessage, clearActionSuccess]);

  if (!actionSuccessMessage) return null;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(clearActionSuccess, 300);
  };

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[80] w-[min(100vw-2rem,420px)] transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-xl border border-[#16a34a]/30 bg-white px-4 py-3.5 shadow-[0_12px_40px_rgba(22,163,74,0.18)]">
        <div className="w-9 h-9 rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-[#16a34a]" />
        </div>
        <p className="flex-1 text-sm font-semibold text-[#181c1e]">{actionSuccessMessage}</p>
        <button
          type="button"
          onClick={handleClose}
          className="p-1 rounded-lg text-[#848a9c] hover:text-[#181c1e] hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
