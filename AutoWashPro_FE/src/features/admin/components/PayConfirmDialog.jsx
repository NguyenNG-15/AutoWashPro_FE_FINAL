import { Banknote, Loader2, X } from 'lucide-react';
import { formatCurrency } from '../services/bookingService';

export default function PayConfirmDialog({
  isOpen,
  booking,
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        disabled={isLoading}
      />

      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pay-confirm-title"
      >
        <div className="h-1 bg-gradient-to-r from-[#0047AB] to-[#6366f1]" />

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E6F0FF] flex items-center justify-center shrink-0">
              <Banknote className="w-6 h-6 text-[#0047AB]" />
            </div>
            <div className="flex-1 min-w-0 pr-6">
              <h3 id="pay-confirm-title" className="text-[#181c1e] text-lg font-bold">
                Confirm Payment
              </h3>
              <p className="text-[#434654] text-sm mt-1">
                Do you want to process payment for this booking?
              </p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-[#848a9c] hover:text-[#181c1e] hover:bg-gray-100 disabled:opacity-50"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-5 rounded-xl bg-[#f7fafd] border border-gray-100 p-4 text-sm">
            <div className="flex justify-between gap-3 mb-2">
              <span className="text-[#848a9c]">Customer</span>
              <span className="font-semibold text-[#181c1e] text-right">{booking.name}</span>
            </div>
            <div className="flex justify-between gap-3 mb-2">
              <span className="text-[#848a9c]">Plate</span>
              <span className="font-mono font-semibold text-[#181c1e]">{booking.plate}</span>
            </div>
            <div className="flex justify-between gap-3 mb-2">
              <span className="text-[#848a9c]">Service</span>
              <span className="font-semibold text-[#181c1e] text-right">{booking.service}</span>
            </div>
            <div className="flex justify-between gap-3 pt-2 border-t border-gray-200">
              <span className="text-[#848a9c] font-medium">Total due</span>
              <span className="text-lg font-bold text-[#0047AB]">
                {formatCurrency(booking.price)}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#848a9c] mt-3">
            After confirmation, the booking will move to{' '}
            <strong className="text-[#434654]">Assign Technician</strong>.
          </p>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-[#434654] hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
