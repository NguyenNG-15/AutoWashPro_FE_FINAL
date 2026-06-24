import { Outlet } from 'react-router-dom';
import AdminSidebar from '../features/admin/components/AdminSidebar';
import AdminHeader from '../features/admin/components/AdminHeader';
import AdminStatusBar from '../features/admin/components/AdminStatusBar';
import QuickNewBookingModal from '../features/admin/components/QuickNewBookingModal';
import BookingSuccessToast from '../features/admin/components/BookingSuccessToast';
import BookingActionToast from '../features/admin/components/BookingActionToast';
import BookingDetailModal from '../features/admin/components/BookingDetailModal';
import useBookingStore from '../features/admin/store/bookingStore';

export default function AdminLayout() {
  const workflowBookingId = useBookingStore((state) => state.workflowBookingId);
  const closeWorkflowBooking = useBookingStore((state) => state.closeWorkflowBooking);
  const triggerRefresh = useBookingStore((state) => state.triggerRefresh);

  return (
    <div className="flex h-screen bg-[#f7fafd] overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <AdminStatusBar />
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
