import { useEffect, useState } from 'react';
import {
  X,
  Loader2,
  CalendarClock,
  Car,
  User,
  Phone,
  Wrench,
  Banknote,
  CheckCircle2,
  Trash2,
  Play,
} from 'lucide-react';
import {
  acceptBooking,
  assignBookingStaff,
  completeBooking,
  fetchBookingById,
  formatCurrency,
  getApiErrorMessage,
  payBooking,
  startBooking,
  deleteBooking,
} from '../services/bookingService';
import { fetchStaff } from '../../admin/services/staffService';
import PayConfirmDialog from './PayConfirmDialog';
import useBookingStore from '../store/bookingStore';

const inputClass =
  'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#181c1e] bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]';

const WORKFLOW_STEPS = [
  { key: 'pay', label: 'Payment', icon: Banknote },
  { key: 'assign', label: 'Assign Tech', icon: Wrench },
  { key: 'start', label: 'Start', icon: Play },
  { key: 'complete', label: 'Complete', icon: CheckCircle2 },
];

function getWorkflowStepState(booking) {
  const payment = (booking?.paymentStatusRaw ?? '').toUpperCase();
  const status = (booking?.bookingStatusRaw ?? booking?.statusRaw ?? '').toUpperCase();
  const hasTechnician = Boolean(booking?.staffId ?? booking?.technicianId);

  if (status.includes('COMPLETED') || status.includes('CANCEL')) {
    return { current: 4, pay: 'done', assign: 'done', start: 'done', complete: 'done' };
  }
  if (status.includes('PROCESSING')) {
    return { current: 3, pay: 'done', assign: 'done', start: 'done', complete: 'current' };
  }
  if (hasTechnician && (payment.includes('PAID') || status.includes('PAID'))) {
    return { current: 2, pay: 'done', assign: 'done', start: 'current', complete: 'upcoming' };
  }
  if (payment.includes('PAID') || status.includes('PAID')) {
    return { current: 1, pay: 'done', assign: 'current', start: 'upcoming', complete: 'upcoming' };
  }
  return { current: 0, pay: 'current', assign: 'upcoming', start: 'upcoming', complete: 'upcoming' };
}

function WorkflowSteps({ booking }) {
  const state = getWorkflowStepState(booking);
  const currentIndex = WORKFLOW_STEPS.findIndex((step) => state[step.key] === 'current');
  const doneCount = WORKFLOW_STEPS.filter((step) => state[step.key] === 'done').length;
  const progressPercent =
    currentIndex >= 0
      ? ((doneCount + 0.5) / (WORKFLOW_STEPS.length - 1)) * 100
      : doneCount >= WORKFLOW_STEPS.length
        ? 100
        : (doneCount / (WORKFLOW_STEPS.length - 1)) * 100;

  return (
    <div className="rounded-xl border border-gray-100 bg-gradient-to-b from-[#f7fafd] to-white px-4 py-5">
      <div className="relative">
        {/* Background track */}
        <div
          className="absolute top-4 left-[10%] right-[10%] h-[3px] rounded-full bg-gray-200"
          aria-hidden
        />
        {/* Progress fill */}
        <div
          className="absolute top-4 left-[10%] h-[3px] rounded-full bg-gradient-to-r from-[#16a34a] to-[#0047AB] transition-all duration-500 ease-out"
          style={{ width: `calc(80% * ${Math.min(progressPercent, 100) / 100})` }}
          aria-hidden
        />

        <div className="relative flex justify-between">
          {WORKFLOW_STEPS.map((step) => {
            const stepState = state[step.key];
            const Icon = step.icon;
            const isDone = stepState === 'done';
            const isCurrent = stepState === 'current';

            return (
              <div key={step.key} className="flex flex-col items-center w-[4.5rem] z-[1]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${
                    isDone
                      ? 'bg-[#16a34a] border-[#16a34a] text-white shadow-sm shadow-[#16a34a]/30'
                      : isCurrent
                        ? 'bg-[#0047AB] border-[#0047AB] text-white ring-4 ring-[#0047AB]/20 shadow-md shadow-[#0047AB]/25'
                        : 'bg-white border-gray-200 text-[#848a9c]'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>
                <span
                  className={`text-[10px] mt-2 text-center leading-tight max-w-[4.5rem] ${
                    isDone
                      ? 'text-[#16a34a] font-medium'
                      : isCurrent
                        ? 'text-[#0047AB] font-semibold'
                        : 'text-[#848a9c]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function BookingDetailModal({ isOpen, bookingId, onClose, onUpdated }) {
  const [booking, setBooking] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActing, setIsActing] = useState(false);
  const [showPayConfirm, setShowPayConfirm] = useState(false);
  const showActionSuccess = useBookingStore((state) => state.showActionSuccess);

  useEffect(() => {
    if (!isOpen || !bookingId) return undefined;

    setError('');
    setShowPayConfirm(false);

    const load = async () => {
      setIsLoading(true);
      try {
        const [detail, staffResult] = await Promise.all([
          fetchBookingById(bookingId),
          fetchStaff({ page: 0, size: 50 }),
        ]);
        setBooking(detail);
        setSelectedStaffId(detail.staffId ? String(detail.staffId) : '');
        setStaffList(
          (staffResult.staff ?? []).filter(
            (staff) => staff.accountStatus === 'ACTIVE',
          ),
        );
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load booking details.'));
        setBooking(null);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [isOpen, bookingId]);

  if (!isOpen) return null;

  const runAction = async (actionFn, successMessage) => {
    setIsActing(true);
    setError('');
    try {
      const updated = await actionFn();
      setBooking(updated);
      setSelectedStaffId(updated.staffId ? String(updated.staffId) : '');
      showActionSuccess(successMessage);
      onUpdated?.(updated);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to complete this action.'));
    } finally {
      setIsActing(false);
    }
  };

  const handleAction = async (action) => {
    if (!booking) return;

    if (action === 'accept') {
      await runAction(() => acceptBooking(booking.id), 'Booking confirmed successfully!');
      return;
    }
    if (action === 'pay') {
      setShowPayConfirm(true);
      return;
    }
    if (action === 'assign') {
      if (!selectedStaffId) {
        setError('Please select a technician.');
        return;
      }
      await runAction(
        () => assignBookingStaff(booking.id, Number(selectedStaffId)),
        'Technician assigned successfully!',
      );
      return;
    }
    if (action === 'start') {
      await runAction(() => startBooking(booking.id), 'Service started successfully!');
      return;
    }
    if (action === 'complete') {
      await runAction(() => completeBooking(booking.id), 'Booking completed successfully!');
    }
  };

  const handleConfirmPay = async () => {
    if (!booking) return;
    setIsActing(true);
    setError('');
    try {
      const updated = await payBooking(booking.id);
      setBooking(updated);
      setSelectedStaffId(updated.staffId ? String(updated.staffId) : '');
      showActionSuccess('Payment successful!');
      onUpdated?.(updated);
      setShowPayConfirm(false);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to process payment.'));
    } finally {
      setIsActing(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!booking) return;
    if (!window.confirm(`Are you sure you want to delete booking for ${booking.name}?`)) return;

    setIsActing(true);
    setError('');
    try {
      await deleteBooking(booking.id);
      showActionSuccess('Booking deleted successfully!');
      onClose();
      // Use triggerRefresh from store to update list if onUpdated is not enough
      useBookingStore.getState().triggerRefresh();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to delete booking.'));
    } finally {
      setIsActing(false);
    }
  };

  const TypeIcon = booking?.type === 'Walk-in' ? Car : CalendarClock;
  const showStaffPicker = booking?.nextAction?.action === 'assign';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="h-1.5 bg-gradient-to-r from-[#0047AB] via-[#6366f1] to-[#0ea5e9]" />

        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[#181c1e] text-xl font-bold">Booking for Customer</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDeleteBooking}
              disabled={isActing}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-60 transition-colors"
              title="Delete Booking"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-[#434654]" />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-[#848a9c]">
              <Loader2 className="w-5 h-5 animate-spin text-[#0047AB]" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : booking ? (
            <>
              <WorkflowSteps booking={booking} />

              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full ${booking.avatarBg} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {booking.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#181c1e]">{booking.name}</p>
                  <p className="text-xs text-[#848a9c]">{booking.membership}</p>
                </div>
                <span
                  className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${booking.statusClass}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-[#f7fafd] p-3">
                  <p className="text-[#848a9c] text-xs mb-1">Plate</p>
                  <p className="font-mono font-semibold">{booking.plate}</p>
                </div>
                <div className="rounded-lg bg-[#f7fafd] p-3">
                  <p className="text-[#848a9c] text-xs mb-1">Time Slot</p>
                  <p className="font-semibold">{booking.slot}</p>
                </div>
                <div className="rounded-lg bg-[#f7fafd] p-3 col-span-2">
                  <p className="text-[#848a9c] text-xs mb-1">Service</p>
                  <p className="font-semibold">{booking.service}</p>
                </div>
                <div className="rounded-lg bg-[#f7fafd] p-3">
                  <p className="text-[#848a9c] text-xs mb-1 flex items-center gap-1">
                    <TypeIcon className="w-3.5 h-3.5" />
                    Type
                  </p>
                  <p className="font-semibold">{booking.type}</p>
                </div>
                <div className="rounded-lg bg-[#f7fafd] p-3">
                  <p className="text-[#848a9c] text-xs mb-1">Total</p>
                  <p className="font-bold text-[#0047AB]">{formatCurrency(booking.price)}</p>
                </div>
                {booking.phone !== '—' && (
                  <div className="rounded-lg bg-[#f7fafd] p-3 col-span-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#848a9c]" />
                    <span>{booking.phone}</span>
                  </div>
                )}
                {booking.staffName !== '—' && (
                  <div className="rounded-lg bg-[#E6F0FF] p-3 col-span-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0047AB]" />
                    <span className="text-[#0047AB] font-medium">Technician: {booking.staffName}</span>
                  </div>
                )}
              </div>

              {showStaffPicker && (
                <div className="rounded-xl border border-[#0047AB]/20 bg-[#f7fafd] p-4">
                  <label htmlFor="assignStaff" className="text-sm font-medium text-[#434654] mb-1.5 block">
                    <span className="inline-flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-[#0047AB]" />
                      Select technician *
                    </span>
                  </label>
                  <p className="text-xs text-[#848a9c] mb-2">
                    Booking must be paid before assigning a technician.
                  </p>
                  <select
                    id="assignStaff"
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">-- Select technician --</option>
                    {staffList.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} — {staff.role} ({staff.workStatusLabel})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {booking.nextAction ? (
                <button
                  type="button"
                  onClick={() => handleAction(booking.nextAction.action)}
                  disabled={isActing}
                  className="w-full px-4 py-3 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isActing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {booking.nextAction.label}
                </button>
              ) : (
                <div className="rounded-lg bg-[#f0fdf4] border border-[#16a34a]/30 px-4 py-3 text-sm text-[#16a34a] text-center font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Complete
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      <PayConfirmDialog
        isOpen={showPayConfirm}
        booking={booking}
        onConfirm={handleConfirmPay}
        onCancel={() => setShowPayConfirm(false)}
        isLoading={isActing}
      />
    </div>
  );
}
