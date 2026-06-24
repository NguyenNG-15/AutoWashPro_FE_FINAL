import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Users,
  Crown,
  UserPlus,
  AlertTriangle,
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Phone,
  Mail,
  Car,
  Loader2,
  RefreshCw,
  X,
  CheckCircle2,
  Pencil,
} from 'lucide-react';
import {
  fetchCustomers,
  formatCurrency,
  getApiErrorMessage,
} from '../services/customerService';
import CreateCustomerModal from '../components/CreateCustomerModal';
import EditCustomerModal from '../components/EditCustomerModal';

const PAGE_SIZE = 10;

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

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [successTitle, setSuccessTitle] = useState('Success');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadCustomers = useCallback(async (overrides = {}) => {
    const page = overrides.page ?? currentPage;
    const search = overrides.search ?? searchQuery;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchCustomers({
        page,
        size: PAGE_SIZE,
        search,
      });

      setCustomers(result.customers);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load customers.'));
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timer = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleCreateSuccess = (customer) => {
    setSuccessTitle('Customer Created');
    setSuccessMessage(`Successfully created customer ${customer.name}.`);
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(0);
    loadCustomers({ page: 0, search: '' });
  };

  const handleUpdateSuccess = (customer) => {
    setSuccessTitle('Customer Updated');
    setSuccessMessage(`Successfully updated ${customer.name}.`);
    loadCustomers();
  };

  const filteredCustomers = useMemo(() => {
    if (membershipFilter === 'all') return customers;

    return customers.filter((customer) => {
      const tier = customer.membership.toLowerCase();
      const status = customer.status.toLowerCase();

      if (membershipFilter === 'vip') {
        return ['gold', 'platinum', 'diamond', 'vip'].some((key) => tier.includes(key));
      }

      if (membershipFilter === 'at-risk') {
        return status.includes('risk') || status.includes('inactive') || status.includes('rủi ro');
      }

      return true;
    });
  }, [customers, membershipFilter]);

  const premiumCount = customers.filter((customer) => {
    const tier = customer.membership.toLowerCase();
    return ['gold', 'platinum', 'diamond', 'vip'].some((key) => tier.includes(key));
  }).length;

  const atRiskCount = customers.filter((customer) => {
    const status = customer.status.toLowerCase();
    return status.includes('risk') || status.includes('inactive') || status.includes('rủi ro');
  }).length;

  const topCustomers = [...customers]
    .sort((a, b) => b.totalSpending - a.totalSpending)
    .slice(0, 3);

  const recentCustomers = [...customers]
    .filter((customer) => customer.lastVisitAt)
    .sort((a, b) => new Date(b.lastVisitAt) - new Date(a.lastVisitAt))
    .slice(0, 3);

  const showingFrom = totalElements === 0 ? 0 : currentPage * PAGE_SIZE + 1;
  const showingTo = Math.min((currentPage + 1) * PAGE_SIZE, totalElements);

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {successMessage && (
          <div className="fixed top-6 right-6 z-[60] flex items-center gap-3 bg-white border border-[#16a34a]/30 shadow-lg rounded-xl px-4 py-3 animate-[slideIn_0.3s_ease-out]">
            <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#181c1e]">{successTitle}</p>
              <p className="text-xs text-[#848a9c] mt-0.5">{successMessage}</p>
            </div>
            <button type="button" onClick={() => setSuccessMessage(null)} className="text-[#848a9c] hover:text-[#181c1e]">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[#181c1e] text-3xl font-bold tracking-tight">Customer Management</h1>
            <p className="text-[#434654] text-base mt-1">
              Manage customer profiles, membership tiers, and visit history.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={loadCustomers}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-medium text-[#434654] hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-medium text-[#434654] hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export List
            </button>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Customer
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
            label="Total Customers"
            value={isLoading ? '—' : totalElements.toLocaleString('en-US')}
            badge={`Page ${currentPage + 1}/${Math.max(totalPages, 1)}`}
            badgeClass="text-[#848a9c] bg-[#f7fafd]"
            icon={Users}
            iconBg="bg-[#E6F0FF]"
            iconColor="text-[#0047AB]"
          />
          <StatCard
            label="Premium (this page)"
            value={isLoading ? '—' : premiumCount}
            badge="Gold / Platinum / VIP"
            badgeClass="text-[#0047AB] bg-[#E6F0FF]"
            icon={Crown}
            iconBg="bg-[#E6F0FF]"
            iconColor="text-[#0047AB]"
          />
          <StatCard
            label="On This Page"
            value={isLoading ? '—' : customers.length}
            badge={`${PAGE_SIZE} per page`}
            badgeClass="text-[#848a9c] bg-[#f7fafd]"
            icon={UserPlus}
            iconBg="bg-[#f0fdf4]"
            iconColor="text-[#16a34a]"
          />
          <StatCard
            label="At Risk (this page)"
            value={isLoading ? '—' : atRiskCount}
            badge="Needs outreach"
            badgeClass="text-[#dc2626] bg-[#fef2f2]"
            icon={AlertTriangle}
            iconBg="bg-[#fff7ed]"
            iconColor="text-[#ea580c]"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-[#181c1e] text-lg font-bold">Customer Directory</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
                  <input
                    type="text"
                    placeholder="Search name, phone, plate..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full sm:w-56 bg-[#f7fafd] border border-gray-200 rounded-lg text-sm text-[#181c1e] placeholder:text-[#848a9c] focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                  />
                </div>
                <select
                  value={membershipFilter}
                  onChange={(e) => setMembershipFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#434654] bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20"
                >
                  <option value="all">All Customers</option>
                  <option value="vip">VIP &amp; Premium</option>
                  <option value="at-risk">At Risk / Inactive</option>
                </select>
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
                <span className="text-sm">Loading customers...</span>
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
                          Contact
                        </th>
                        <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Vehicle
                        </th>
                        <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Visits
                        </th>
                        <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Points
                        </th>
                        <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Spending
                        </th>
                        <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Last Visit
                        </th>
                        <th className="text-left px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Status
                        </th>
                        <th className="text-right px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-12 text-center text-[#848a9c]">
                            No matching customers found.
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((customer) => (
                          <tr
                            key={customer.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 cursor-pointer"
                            onClick={() => setEditCustomer(customer)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full ${customer.avatarBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                                >
                                  {customer.initials}
                                </div>
                                <div>
                                  <div className="text-[#181c1e] font-semibold">{customer.name}</div>
                                  <span
                                    className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${customer.membershipClass}`}
                                  >
                                    {customer.membership}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="inline-flex items-center gap-1.5 text-xs text-[#434654]">
                                  <Phone className="w-3 h-3 text-[#848a9c]" />
                                  {customer.phone}
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-xs text-[#848a9c] truncate max-w-[180px]">
                                  <Mail className="w-3 h-3 shrink-0" />
                                  {customer.email}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 text-[#434654] text-xs font-mono font-semibold rounded w-fit">
                                  <Car className="w-3 h-3 text-[#848a9c]" />
                                  {customer.plate}
                                </span>
                                <span className="text-[10px] text-[#848a9c]">{customer.carType}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-[#181c1e] font-semibold">{customer.visits}</td>
                            <td className="px-4 py-4">
                              <span className="text-[#0047AB] font-semibold">
                                {customer.points.toLocaleString('en-US')}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-[#181c1e] font-semibold whitespace-nowrap">
                              {formatCurrency(customer.totalSpending)}
                            </td>
                            <td className="px-4 py-4 text-[#434654] whitespace-nowrap">{customer.lastVisit}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex w-fit text-xs font-semibold px-2.5 py-1 rounded-full ${customer.statusClass}`}
                              >
                                {customer.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditCustomer(customer);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0047AB] border border-[#0047AB]/20 rounded-lg hover:bg-[#E6F0FF] transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                Edit
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
                    Showing {showingFrom}-{showingTo} of {totalElements.toLocaleString('en-US')} customers
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
                <h2 className="text-[#181c1e] text-lg font-bold">Top Customers</h2>
                <span className="text-xs text-[#848a9c]">Current page</span>
              </div>
              {topCustomers.length === 0 ? (
                <p className="text-sm text-[#848a9c]">No data yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {topCustomers.map((customer, index) => (
                    <div
                      key={customer.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50/50"
                    >
                      <span className="text-xs font-bold text-[#848a9c] w-4">#{index + 1}</span>
                      <div
                        className={`w-9 h-9 rounded-full ${customer.avatarBg} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {customer.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#181c1e] truncate">{customer.name}</p>
                        <p className="text-xs text-[#848a9c]">{customer.membership}</p>
                      </div>
                      <span className="text-sm font-bold text-[#0047AB]">
                        {formatCurrency(customer.totalSpending)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-[#181c1e] text-lg font-bold mb-5">Recent Visits</h2>
              {recentCustomers.length === 0 ? (
                <p className="text-sm text-[#848a9c]">No visit history yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {recentCustomers.map((customer) => (
                    <div key={customer.id} className="flex flex-col gap-1">
                      <p className="text-sm text-[#434654] leading-snug">
                        <strong className="text-[#181c1e]">{customer.name}</strong> — {customer.plate}
                      </p>
                      <p className="text-xs text-[#848a9c]">{customer.lastVisit}</p>
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
                  <p className="text-[#0047AB] text-sm font-bold mb-1">Retention Tip</p>
                  <p className="text-[#434654] text-sm leading-relaxed">
                    {atRiskCount > 0
                      ? `${atRiskCount} customers on this page are at risk. Consider sending a loyalty offer.`
                      : 'All customers on this page are active. Keep monitoring visit count and loyalty points.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateCustomerModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditCustomerModal
        isOpen={Boolean(editCustomer)}
        customer={editCustomer}
        onClose={() => setEditCustomer(null)}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
