import { create } from 'zustand';

const useBookingStore = create((set) => ({
  isQuickBookingOpen: false,
  lastCreatedBooking: null,
  workflowBookingId: null,
  actionSuccessMessage: null,
  refreshKey: 0,

  openQuickBooking: () => set({ isQuickBookingOpen: true }),
  closeQuickBooking: () => set({ isQuickBookingOpen: false }),

  setLastCreatedBooking: (booking) =>
    set({
      lastCreatedBooking: booking,
      isQuickBookingOpen: false,
    }),

  openWorkflowBooking: (bookingId) =>
    set({
      workflowBookingId: bookingId,
      isQuickBookingOpen: false,
    }),

  closeWorkflowBooking: () => set({ workflowBookingId: null }),

  clearSuccessNotification: () => set({ lastCreatedBooking: null }),

  showActionSuccess: (message) => set({ actionSuccessMessage: message }),
  clearActionSuccess: () => set({ actionSuccessMessage: null }),

  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));

export default useBookingStore;
