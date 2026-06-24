import { useState } from 'react';
import {
  Bell,
  Settings,
  Calendar,
  CreditCard,
  Briefcase,
  TrendingUp,
  Download,
  FileText,
  Clock,
  Eye,
  ClipboardCheck,
} from 'lucide-react';

const revenueComposition = [
  { label: 'Online', percent: 55, amount: '$6,865.37', color: 'bg-[#0047AB]' },
  { label: 'Cash', percent: 30, amount: '$3,744.75', color: 'bg-[#16a34a]' },
  { label: 'Loyalty', percent: 15, amount: '$1,872.38', color: 'bg-[#f59e0b]' },
];

const ledgerTransactions = [
  { id: 1, label: 'Stripe Daily Payout', amount: '+$6,420.00', positive: true },
  { id: 2, label: 'Cash Register Vault Dep.', amount: '+$3,500.00', positive: true },
  { id: 3, label: 'Refund Transaction #8921', amount: '-$45.00', positive: false },
  { id: 4, label: 'Loyalty Redemption Burn', amount: '+$210.50', positive: true },
];

const auditTabs = [
  { id: 'all', label: 'All Shifts' },
  { id: 'flagged', label: 'Flagged Only' },
  { id: 'manual', label: 'Manual Adjustments' },
];

const shiftAudits = [
  {
    id: 1,
    name: 'Sarah K.',
    initials: 'SK',
    avatarBg: 'bg-[#6366f1]',
    time: '06:00 AM - 02:00 PM',
    expected: '$2,840.00',
    counted: '$2,840.00',
    discrepancy: '$0.00',
    discrepancyClass: 'text-[#16a34a]',
    status: 'RECONCILED',
    statusClass: 'bg-[#f0fdf4] text-[#16a34a]',
    flagged: false,
  },
  {
    id: 2,
    name: 'James D.',
    initials: 'JD',
    avatarBg: 'bg-[#0047AB]',
    time: '06:00 AM - 02:00 PM',
    expected: '$3,120.50',
    counted: '$3,105.00',
    discrepancy: '-$15.50',
    discrepancyClass: 'text-[#dc2626]',
    status: 'FLAGGED',
    statusClass: 'bg-[#fef2f2] text-[#dc2626]',
    flagged: true,
  },
  {
    id: 3,
    name: 'Linda M.',
    initials: 'LM',
    avatarBg: 'bg-[#0ea5e9]',
    time: '02:00 PM - 10:00 PM',
    expected: '$2,410.00',
    counted: '$2,410.00',
    discrepancy: '$0.00',
    discrepancyClass: 'text-[#16a34a]',
    status: 'RECONCILED',
    statusClass: 'bg-[#f0fdf4] text-[#16a34a]',
    flagged: false,
  },
];

function StatCard({ label, value, badge, badgeClass, icon: Icon, iconBg, iconColor, dark }) {
  if (dark) {
    return (
      <div className="bg-[#0047AB] rounded-xl p-5 shadow-sm flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-4">
          <span className="text-white/80 text-sm font-medium">{label}</span>
          <Icon className="w-5 h-5 text-white/70" />
        </div>
        <span className="text-white text-3xl font-bold tracking-tight">{value}</span>
        <span className="text-white/70 text-xs mt-2">{badge}</span>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-white rounded-full" style={{ width: '94.7%' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-3">
          <span className="text-[#848a9c] text-sm font-medium">{label}</span>
          <span className="text-[#181c1e] text-3xl font-bold tracking-tight">{value}</span>
          {badge && (
            <span className={`inline-flex w-fit items-center gap-1 text-xs font-semibold ${badgeClass}`}>
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

export default function AdminFinancePage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredAudits = shiftAudits.filter((audit) => {
    if (activeTab === 'flagged') return audit.flagged;
    if (activeTab === 'manual') return audit.status === 'MANUAL';
    return true;
  });

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-[#181c1e] text-3xl font-bold tracking-tight">
              Finance &amp; Shift Closure
            </h1>
            <p className="text-[#434654] text-base mt-1">
              Real-time revenue monitoring and reconciliation auditing.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-[#434654]">
              <Calendar className="w-4 h-4 text-[#848a9c]" />
              October 24, 2024
            </div>
            <button
              type="button"
              className="p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-[#434654]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <button
              type="button"
              className="p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-5 h-5 text-[#434654]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <StatCard
            label="Total Daily Revenue"
            value="$12,482.50"
            badge={
              <>
                <TrendingUp className="w-3.5 h-3.5 text-[#16a34a]" />
                +12.4% vs yest.
              </>
            }
            badgeClass="text-[#16a34a]"
            icon={CreditCard}
            iconBg="bg-[#E6F0FF]"
            iconColor="text-[#0047AB]"
          />
          <StatCard
            label="Total Pending Reconciliations"
            value="3"
            badge="Current Batch"
            badgeClass="text-[#848a9c]"
            icon={Briefcase}
            iconBg="bg-[#E6F0FF]"
            iconColor="text-[#0047AB]"
          />
          <StatCard
            label="Projected End of Day"
            value="$14,200.00"
            badge="Target: $15k"
            icon={TrendingUp}
            dark
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-[#181c1e] text-lg font-bold">Daily Financial Ledger</h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-[#434654] hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Full Report
                </button>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-[#434654] text-sm font-semibold mb-4">Revenue Composition</h3>
                <div className="flex h-4 rounded-full overflow-hidden mb-4">
                  {revenueComposition.map((item) => (
                    <div
                      key={item.label}
                      className={`${item.color} h-full`}
                      style={{ width: `${item.percent}%` }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {revenueComposition.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                      <div>
                        <p className="text-sm font-semibold text-[#181c1e]">
                          {item.label}: {item.percent}%
                        </p>
                        <p className="text-xs text-[#848a9c]">{item.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[#434654] text-sm font-semibold mb-3">Recent Transactions</h3>
                <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {ledgerTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-gray-50/50"
                    >
                      <span className="text-sm text-[#434654]">{tx.label}</span>
                      <span
                        className={`text-sm font-semibold ${
                          tx.positive ? 'text-[#181c1e]' : 'text-[#dc2626]'
                        }`}
                      >
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#E6F0FF] border border-[#0047AB]/10 rounded-xl p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-[#0047AB]" />
              <h2 className="text-[#181c1e] text-lg font-bold">Next Shift Closure Due</h2>
            </div>
            <p className="text-[#434654] text-sm leading-relaxed">
              Shift #04 (Morning) reconciliation window closes in{' '}
              <strong className="text-[#181c1e]">42 minutes</strong>.
            </p>

            <div className="mt-5 p-4 bg-white rounded-xl border border-[#0047AB]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0047AB] flex items-center justify-center text-white text-xs font-bold">
                  MC
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#181c1e]">Marcus Chen</p>
                  <p className="text-xs text-[#848a9c]">Lead Cashier — Gate 02</p>
                </div>
                <span className="text-[10px] font-bold text-[#16a34a] bg-[#f0fdf4] px-2 py-1 rounded-full">
                  ON-DUTY
                </span>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 w-full flex items-center justify-center gap-2 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold py-3 rounded-lg transition-colors"
            >
              <ClipboardCheck className="w-4 h-4" />
              Initiate Shift Closure
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-[#181c1e] text-lg font-bold">Shift Closure Audit</h2>
            <div className="flex items-center gap-1 bg-[#f7fafd] p-1 rounded-lg border border-gray-100">
              {auditTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
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

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#f7fafd]">
                  <th className="text-left px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                    Cashier Name
                  </th>
                  <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                    Start/End Time
                  </th>
                  <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                    System Expected
                  </th>
                  <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                    Actual Counted
                  </th>
                  <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                    Discrepancy
                  </th>
                  <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAudits.map((audit) => (
                  <tr
                    key={audit.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${audit.avatarBg} flex items-center justify-center text-white text-xs font-bold`}
                        >
                          {audit.initials}
                        </div>
                        <span className="text-[#181c1e] font-semibold">{audit.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#434654]">{audit.time}</td>
                    <td className="px-4 py-4 text-[#181c1e] font-medium">{audit.expected}</td>
                    <td className="px-4 py-4 text-[#181c1e] font-medium">{audit.counted}</td>
                    <td className={`px-4 py-4 font-semibold ${audit.discrepancyClass}`}>
                      {audit.discrepancy}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide ${audit.statusClass}`}
                      >
                        {audit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {audit.flagged ? (
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          REVIEW
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-4 h-4 text-[#434654]" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
