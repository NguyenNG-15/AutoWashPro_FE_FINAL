import { Outlet } from 'react-router-dom';
import StaffSidebar from '../features/staff/components/StaffSidebar';
import StaffHeader from '../features/staff/components/StaffHeader';
import QuickNewBookingModal from '../features/staff/components/QuickNewBookingModal';
import BookingSuccessToast from '../features/staff/components/BookingSuccessToast';
import BookingActionToast from '../features/staff/components/BookingActionToast';
import BookingDetailModal from '../features/staff/components/BookingDetailModal';
import useBookingStore from '../features/staff/store/bookingStore';

export default function StaffLayout() {
  const workflowBookingId = useBookingStore((state) => state.workflowBookingId);
  const closeWorkflowBooking = useBookingStore((state) => state.closeWorkflowBooking);
  const triggerRefresh = useBookingStore((state) => state.triggerRefresh);
  return (
    <div className="flex h-screen bg-[#f7fafd] overflow-hidden">
      <StaffSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <StaffHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <QuickNewBookingModal />
      <BookingSuccessToast />
      <BookingActionToast />
      <BookingDetailModal
        isOpen={Boolean(workflowBookingId)}
        bookingId={workflowBookingId}
        onClose={closeWorkflowBooking}
        onUpdated={() => triggerRefresh()}
      />
    </div>
  );
}
