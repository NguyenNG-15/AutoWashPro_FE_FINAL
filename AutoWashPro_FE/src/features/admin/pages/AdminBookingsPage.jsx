import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  TrendingUp,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  Car,
  Loader2,
  RefreshCw,
  X,
  Banknote,
} from 'lucide-react';
import useBookingStore from '../store/bookingStore';
import {
  acceptBooking,
  completeBooking,
  fetchBookingStats,
  fetchBookings,
  formatCurrency,
  getApiErrorMessage,
  payBooking,
  startBooking,
} from '../services/bookingService';
import PayConfirmDialog from '../components/PayConfirmDialog';

const PAGE_SIZE = 10;

const tabs = [
  { id: 'today', label: 'Today' },
  { id: 'pending', label: 'Pending' },
  { id: 'history', label: 'History' },
];

const PENDING_STATUSES = ['PENDING', 'PENDING_PAYMENT', 'UNPAID', 'CONFIRMED', 'WAITING'];
const HISTORY_STATUSES = ['COMPLETED', 'CANCELLED', 'CANCELED'];

function isTodayBooking(booking) {
  const today = new Date().toISOString().split('T')[0];
  const dateValue = booking.scheduledDate ?? booking.createdAt;
  if (!dateValue) return true;
  return String(dateValue).startsWith(today);
}

function matchesTab(booking, tabId) {
  const status = (booking.statusRaw ?? booking.status ?? '').toUpperCase();

  if (tabId === 'pending') {
    return PENDING_STATUSES.some((value) => status.includes(value));
  }
  if (tabId === 'history') {
    return HISTORY_STATUSES.some((value) => status.includes(value));
  }

  return isTodayBooking(booking);
}

const typeIconMap = {
  'Walk-in': Car,
  Appt: CalendarClock,
};

const emptyStats = {
  todayTotal: 0,
  walkInCount: 0,
  queueTimeMinutes: 0,
  todayRevenue: 0,
  pendingCount: 0,
  processingCount: 0,
  growthPercent: null,
};

export default function AdminBookingsPage() {
  const openQuickBooking = useBookingStore((state) => state.openQuickBooking);
  const openWorkflowBooking = useBookingStore((state) => state.openWorkflowBooking);
  const showActionSuccess = useBookingStore((state) => state.showActionSuccess);
  const refreshKey = useBookingStore((state) => state.refreshKey);
  const triggerRefresh = useBookingStore((state) => state.triggerRefresh);

  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [activeTab, setActiveTab] = useState('today');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actingId, setActingId] = useState(null);
  const [payConfirmBooking, setPayConfirmBooking] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const result = await fetchBookingStats();
      setStats(result);
    } catch {
      setStats(emptyStats);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const loadBookings = useCallback(async (overrides = {}) => {
    const page = overrides.page ?? currentPage;
    const search = overrides.search ?? searchQuery;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchBookings({
        page,
        size: PAGE_SIZE,
        search,
      });

      setBookings(result.bookings);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load bookings.'));
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadBookings(), loadStats()]);
    triggerRefresh();
  }, [loadBookings, loadStats, triggerRefresh]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings, refreshKey]);

  useEffect(() => {
    loadStats();
  }, [loadStats, refreshKey]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(0);
  };

  const handleQuickAction = async (e, booking) => {
    e.stopPropagation();
    if (!booking.nextAction) return;

    setActingId(booking.id);
    setError(null);

    try {
      let updated;
      const { action } = booking.nextAction;

      if (action === 'accept') updated = await acceptBooking(booking.id);
      else if (action === 'pay') {
        setPayConfirmBooking(booking);
        return;
      } else if (action === 'assign') {
        openWorkflowBooking(booking.id);
        return;
      } else if (action === 'start') updated = await startBooking(booking.id);
      else if (action === 'complete') updated = await completeBooking(booking.id);

      if (updated) {
        setBookings((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        loadStats();
        const successMessages = {
          accept: 'Booking confirmed successfully!',
          pay: 'Payment successful!',
          start: 'Service started successfully!',
          complete: 'Booking completed successfully!',
        };
        if (successMessages[action]) {
          showActionSuccess(successMessages[action]);
        }
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to complete this action.'));
    } finally {
      setActingId(null);
    }
  };

  const handleConfirmPay = async () => {
    if (!payConfirmBooking) return;
    setActingId(payConfirmBooking.id);
    setError(null);
    try {
      const updated = await payBooking(payConfirmBooking.id);
      setBookings((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      loadStats();
      setPayConfirmBooking(null);
      showActionSuccess('Payment successful!');
      openWorkflowBooking(updated.id);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to process payment.'));
    } finally {
      setActingId(null);
    }
  };

  const filteredBookings = useMemo(
    () => bookings.filter((booking) => matchesTab(booking, activeTab)),
    [bookings, activeTab],
  );

  const showingFrom = filteredBookings.length === 0 ? 0 : 1;
  const showingTo = filteredBookings.length;

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[#181c1e] text-3xl font-bold tracking-tight">
                Staff Booking Management
              </h1>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0047AB] bg-[#E6F0FF] px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-[#0047AB] rounded-full animate-pulse" />
                Live View
              </span>
            </div>
            <p className="text-[#434654] text-base mt-1">
              Manage today&apos;s queue, payments, and service progress.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={refreshAll}
              disabled={isLoading || isStatsLoading}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-medium text-[#434654] hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading || isStatsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg">
              <Banknote className="w-4 h-4 text-[#16a34a]" />
              <span className="text-[#181c1e] font-bold text-sm">
                {isStatsLoading ? '—' : formatCurrency(stats.todayRevenue)}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start justify-between gap-4">
            <p className="text-sm text-red-700">{error}</p>
            <button type="button" onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <span className="text-[#848a9c] text-sm font-medium">Today&apos;s Total</span>
            <p className="text-[#181c1e] text-4xl font-bold tracking-tight mt-2">
              {isStatsLoading ? '—' : stats.todayTotal}
            </p>
            {stats.growthPercent != null && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-[#16a34a]" />
                <span className="text-xs font-semibold text-[#16a34a]">
                  {stats.growthPercent > 0 ? '+' : ''}
                  {stats.growthPercent}% from yesterday
                </span>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <span className="text-[#848a9c] text-sm font-medium">Walk-ins</span>
            <p className="text-[#181c1e] text-4xl font-bold tracking-tight mt-2">
              {isStatsLoading ? '—' : stats.walkInCount}
            </p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-4">
              <div
                className="h-full bg-[#0047AB] rounded-full"
                style={{
                  width: `${stats.todayTotal > 0 ? Math.min(100, (stats.walkInCount / stats.todayTotal) * 100) : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <span className="text-[#848a9c] text-sm font-medium">Queue Time</span>
            <p className="text-[#181c1e] text-4xl font-bold tracking-tight mt-2">
              {isStatsLoading ? '—' : `${stats.queueTimeMinutes}m`}
            </p>
            <span className="text-xs text-[#848a9c] mt-2 block">Avg. wait today</span>
          </div>

          <div className="bg-[#0047AB] rounded-xl p-5 shadow-sm flex flex-col">
            <span className="text-white/80 text-sm font-medium">Pending / Processing</span>
            <p className="text-white text-4xl font-bold tracking-tight mt-2">
              {isStatsLoading ? '—' : `${stats.pendingCount} / ${stats.processingCount}`}
            </p>
            <span className="text-white/80 text-xs mt-2">Needs attention today</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h2 className="text-[#181c1e] text-lg font-bold">Active Queue</h2>
              <div className="flex items-center gap-1 bg-[#f7fafd] p-1 rounded-lg border border-gray-100">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#0047AB] text-white shadow-sm'
                        : 'text-[#434654] hover:text-[#181c1e]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openQuickBooking}
                className="flex items-center gap-2 px-3 py-2 border border-[#0047AB] text-[#0047AB] rounded-lg text-sm font-medium hover:bg-[#E6F0FF] transition-colors"
              >
                + New Booking
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
                <input
                  type="text"
                  placeholder="Search customer or plate..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 bg-[#f7fafd] border border-gray-200 rounded-lg text-sm text-[#181c1e] placeholder:text-[#848a9c] focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                />
              </div>
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-[#434654] hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-[#848a9c]">
              <Loader2 className="w-5 h-5 animate-spin text-[#0047AB]" />
              <span className="text-sm">Loading bookings...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#f7fafd]">
                      <th className="text-left px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                        Customer
                      </th>
                      <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                        Plate
                      </th>
                      <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                        Slot
                      </th>
                      <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                        Type
                      </th>
                      <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                        Service
                      </th>
                      <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                        Technician
                      </th>
                      <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-[#848a9c] text-sm">
                          No matching bookings found.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking) => {
                        const TypeIcon = typeIconMap[booking.type] ?? CalendarClock;
                        return (
                          <tr
                            key={booking.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 cursor-pointer"
                            onClick={() => openWorkflowBooking(booking.id)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full ${booking.avatarBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                                >
                                  {booking.initials}
                                </div>
                                <div>
                                  <div className="text-[#181c1e] font-semibold">{booking.name}</div>
                                  <div className="text-[#848a9c] text-xs">{booking.membership}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex px-2.5 py-1 bg-gray-100 text-[#434654] text-xs font-mono font-semibold rounded">
                                {booking.plate}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-[#434654] font-medium whitespace-nowrap">
                              {booking.slot}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1.5 text-[#434654]">
                                <TypeIcon className="w-4 h-4 text-[#848a9c]" />
                                <span>{booking.type}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-[#434654] max-w-[180px] truncate">
                              {booking.service}
                            </td>
                            <td className="px-4 py-4 text-[#434654] text-xs">
                              {booking.staffName}
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${booking.statusClass}`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {booking.nextAction ? (
                                <button
                                  type="button"
                                  onClick={(e) => handleQuickAction(e, booking)}
                                  disabled={actingId === booking.id}
                                  className="px-4 py-1.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
                                >
                                  {actingId === booking.id ? '...' : booking.nextAction.label}
                                </button>
                              ) : (
                                <span className="text-[#848a9c]">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-[#848a9c]">
                  Showing {showingFrom}-{showingTo} on this page (total {totalElements} from API)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40"
                    disabled={currentPage === 0 || isLoading}
                  >
                    <ChevronLeft className="w-4 h-4 text-[#434654]" />
                  </button>
                  <span className="px-3 text-sm text-[#434654]">
                    {currentPage + 1} / {Math.max(totalPages, 1)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40"
                    disabled={currentPage >= totalPages - 1 || isLoading}
                  >
                    <ChevronRight className="w-4 h-4 text-[#434654]" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <PayConfirmDialog
        isOpen={Boolean(payConfirmBooking)}
        booking={payConfirmBooking}
        onConfirm={handleConfirmPay}
        onCancel={() => setPayConfirmBooking(null)}
        isLoading={actingId === payConfirmBooking?.id}
      />
    </div>
  );
}
