import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Users,
  Timer,
  Star,
  CalendarX,
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Loader2,
  RefreshCw,
  X,
  CheckCircle2,
  Settings,
} from 'lucide-react';
import {
  fetchStaff,
  fetchStaffStats,
  getApiErrorMessage,
} from '../services/staffService';
import CreateStaffModal from '../components/CreateStaffModal';
import StaffManageModal from '../components/StaffManageModal';

const PAGE_SIZE = 10;

const emptyStats = {
  totalStaff: 0,
  avgEfficiency: 0,
  avgRating: 0,
  onBreakCount: 0,
  offDutyCount: 0,
  newThisMonth: 0,
  topPerformers: [],
};

function StatCard({ label, value, badge, badgeClass, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-3">
          <span className="text-[#848a9c] text-sm font-medium">{label}</span>
          <span className="text-[#181c1e] text-3xl font-bold tracking-tight">{value}</span>
          {badge && (
            <span className={`inline-flex w-fit text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}>
              {badge}
            </span>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

export default function AdminStaffPage() {
  const [staffMembers, setStaffMembers] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [manageStaffId, setManageStaffId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
      const result = await fetchStaffStats();
      setStats(result);
    } catch {
      setStats(emptyStats);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const loadStaff = useCallback(async (overrides = {}) => {
    const page = overrides.page ?? currentPage;
    const search = overrides.search ?? searchQuery;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchStaff({
        page,
        size: PAGE_SIZE,
        search,
      });

      setStaffMembers(result.staff);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load staff list.'));
      setStaffMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadStaff(), loadStats()]);
  }, [loadStaff, loadStats]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timer = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleCreateSuccess = (staff) => {
    setSuccessMessage(`Successfully created staff member ${staff.name}.`);
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(0);
    loadStaff({ page: 0, search: '' });
    loadStats();
  };

  const handleManageSuccess = () => {
    loadStaff();
    loadStats();
  };

  const topPerformers = useMemo(() => {
    if (stats.topPerformers.length > 0) return stats.topPerformers.slice(0, 3);
    return [...staffMembers].sort((a, b) => b.efficiency - a.efficiency).slice(0, 3);
  }, [stats.topPerformers, staffMembers]);

  const showingFrom = totalElements === 0 ? 0 : currentPage * PAGE_SIZE + 1;
  const showingTo = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {successMessage && (
          <div className="fixed top-6 right-6 z-[60] flex items-center gap-3 bg-white border border-[#16a34a]/30 shadow-lg rounded-xl px-4 py-3">
            <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#181c1e]">Success</p>
              <p className="text-xs text-[#848a9c] mt-0.5">{successMessage}</p>
            </div>
            <button type="button" onClick={() => setSuccessMessage(null)} className="text-[#848a9c] hover:text-[#181c1e]">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[#181c1e] text-3xl font-bold tracking-tight">Staff &amp; Performance</h1>
            <p className="text-[#434654] text-base mt-1">
              Manage your team&apos;s shifts, status, and service quality metrics.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={refreshAll}
              disabled={isLoading || isStatsLoading}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-medium text-[#434654] hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading || isStatsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-medium text-[#434654] hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Onboard Staff
            </button>
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
          <StatCard
            label="Total Active Staff"
            value={isStatsLoading ? '—' : stats.totalStaff.toLocaleString('en-US')}
            badge={stats.newThisMonth > 0 ? `+${stats.newThisMonth} this month` : 'All staff'}
            badgeClass={stats.newThisMonth > 0 ? 'text-[#16a34a] bg-[#f0fdf4]' : 'text-[#848a9c] bg-[#f7fafd]'}
            icon={Users}
            iconBg="bg-[#E6F0FF]"
            iconColor="text-[#0047AB]"
          />
          <StatCard
            label="Avg. Efficiency"
            value={isStatsLoading ? '—' : `${stats.avgEfficiency}%`}
            badge="Team average"
            badgeClass="text-[#16a34a] bg-[#f0fdf4]"
            icon={Timer}
            iconBg="bg-[#E6F0FF]"
            iconColor="text-[#0047AB]"
          />
          <StatCard
            label="Team Score"
            value={isStatsLoading ? '—' : stats.avgRating > 0 ? `${stats.avgRating} / 5` : '—'}
            badge="Avg. Rating"
            badgeClass="text-[#848a9c] bg-[#f7fafd]"
            icon={Star}
            iconBg="bg-[#E6F0FF]"
            iconColor="text-[#0047AB]"
          />
          <StatCard
            label="On Break Now"
            value={isStatsLoading ? '—' : stats.onBreakCount}
            badge={`${stats.offDutyCount} off-duty`}
            badgeClass="text-[#dc2626] bg-[#fef2f2]"
            icon={CalendarX}
            iconBg="bg-[#E6F0FF]"
            iconColor="text-[#0047AB]"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-[#181c1e] text-lg font-bold">Staff Directory</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
                  <input
                    type="text"
                    placeholder="Search staff..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full sm:w-56 bg-[#f7fafd] border border-gray-200 rounded-lg text-sm text-[#181c1e] placeholder:text-[#848a9c] focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                  />
                </div>
                <button
                  type="button"
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#434654]" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center gap-3 py-20 text-[#848a9c]">
                <Loader2 className="w-5 h-5 animate-spin text-[#0047AB]" />
                <span className="text-sm">Loading staff list...</span>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-[#f7fafd]">
                        <th className="text-left px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Staff Member
                        </th>
                        <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Account
                        </th>
                        <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Work Status
                        </th>
                        <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Jobs
                        </th>
                        <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Efficiency
                        </th>
                        <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Rating
                        </th>
                        <th className="text-right px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffMembers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-[#848a9c]">
                            No matching staff found.
                          </td>
                        </tr>
                      ) : (
                        staffMembers.map((member) => (
                          <tr
                            key={member.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 cursor-pointer"
                            onClick={() => setManageStaffId(member.id)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full ${member.avatarBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                                >
                                  {member.initials}
                                </div>
                                <div>
                                  <div className="text-[#181c1e] font-semibold">{member.name}</div>
                                  <div className="text-[#848a9c] text-xs truncate max-w-[180px]">
                                    {member.role}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${member.accountStatusClass}`}
                              >
                                {member.accountStatusLabel}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${member.workStatusClass}`}
                              >
                                {member.workStatusLabel}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-[#181c1e] font-semibold">{member.jobs}</td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1.5 min-w-[100px]">
                                <span className="text-[#181c1e] font-semibold">{member.efficiency}%</span>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#0047AB] rounded-full"
                                    style={{ width: `${member.efficiency}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1">
                                <span className="text-[#181c1e] font-semibold">
                                  {member.rating > 0 ? member.rating : '—'}
                                </span>
                                {member.rating > 0 && (
                                  <Star className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b]" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setManageStaffId(member.id);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0047AB] border border-[#0047AB]/20 rounded-lg hover:bg-[#E6F0FF] transition-colors"
                              >
                                <Settings className="w-3.5 h-3.5" />
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-sm text-[#848a9c]">
                    Showing {showingFrom}-{showingTo} of {totalElements.toLocaleString('en-US')} staff
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
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
                      onClick={() => setCurrentPage((page) => page + 1)}
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

          <div className="flex flex-col gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#181c1e] text-lg font-bold">Top Performers</h2>
                <span className="text-xs text-[#848a9c]">From stats API</span>
              </div>
              {topPerformers.length === 0 ? (
                <p className="text-sm text-[#848a9c]">No data yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {topPerformers.map((member, index) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50/50 cursor-pointer"
                      onClick={() => setManageStaffId(member.id)}
                    >
                      <span className="text-xs font-bold text-[#848a9c] w-4">#{index + 1}</span>
                      <div
                        className={`w-9 h-9 rounded-full ${member.avatarBg} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {member.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#181c1e] truncate">{member.name}</p>
                        <p className="text-xs text-[#848a9c]">{member.role}</p>
                      </div>
                      <span className="text-sm font-bold text-[#0047AB]">{member.efficiency}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#E6F0FF] border border-[#0047AB]/10 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4 text-[#0047AB]" />
                </div>
                <div>
                  <p className="text-[#0047AB] text-sm font-bold mb-1">Shift Tip</p>
                  <p className="text-[#434654] text-sm leading-relaxed">
                    {stats.onBreakCount > 0
                      ? `${stats.onBreakCount} staff members are on break. Consider adjusting shifts to ensure enough coverage.`
                      : 'The team is running smoothly. Keep monitoring efficiency and ratings.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateStaffModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <StaffManageModal
        isOpen={Boolean(manageStaffId)}
        staffId={manageStaffId}
        onClose={() => setManageStaffId(null)}
        onSuccess={handleManageSuccess}
      />
    </div>
  );
}
