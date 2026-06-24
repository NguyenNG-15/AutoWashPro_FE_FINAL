import {
  Bell,
  Settings,
  TrendingUp,
  CalendarCheck,
  Users,
  Star,
  Sparkles,
  Wrench,
  Package,
  Building2,
} from 'lucide-react';

const statCards = [
  {
    label: 'Total Revenue (Today)',
    value: '$4,820.50',
    badge: '+12.5%',
    badgeClass: 'text-[#16a34a] bg-[#f0fdf4]',
    icon: TrendingUp,
    iconBg: 'bg-[#E6F0FF]',
    iconColor: 'text-[#0047AB]',
  },
  {
    label: 'Active Bookings',
    value: '42',
    badge: '86% Capacity',
    badgeClass: 'text-[#0047AB] bg-[#E6F0FF]',
    icon: CalendarCheck,
    iconBg: 'bg-[#E6F0FF]',
    iconColor: 'text-[#0047AB]',
  },
  {
    label: 'Staff Available',
    value: '8 / 12',
    badge: 'Shift Change in 45m',
    badgeClass: 'text-[#848a9c] bg-[#f7fafd]',
    icon: Users,
    iconBg: 'bg-[#E6F0FF]',
    iconColor: 'text-[#0047AB]',
  },
  {
    label: 'Avg. Satisfaction',
    value: '4.82',
    badge: 'Target: 4.5',
    badgeClass: 'text-[#16a34a] bg-[#f0fdf4]',
    icon: Star,
    iconBg: 'bg-[#E6F0FF]',
    iconColor: 'text-[#0047AB]',
  },
];

const technicianAllocation = [
  { label: 'Busy', value: 55, color: 'bg-[#0047AB]' },
  { label: 'Available', value: 22, color: 'bg-[#16a34a]' },
  { label: 'Break', value: 15, color: 'bg-[#f59e0b]' },
];

const bayOccupancy = [
  { name: 'Bay 01 - Ceramic Coat', percent: 75 },
  { name: 'Bay 02 - Express Polish', percent: 32 },
  { name: 'Bay 03 - Interior Detail', percent: 92 },
];

const churnCustomers = [
  {
    id: '#4021',
    name: 'Robert Jenkins',
    initials: 'RJ',
    avatarBg: 'bg-[#0047AB]',
    membership: 'Diamond',
    membershipClass: 'bg-[#181c1e] text-white',
    lastWash: '94 Days',
    risk: 89,
  },
  {
    id: '#1205',
    name: 'Sarah Koenig',
    initials: 'SK',
    avatarBg: 'bg-[#6366f1]',
    membership: 'Platinum',
    membershipClass: 'bg-[#E6F0FF] text-[#0047AB]',
    lastWash: '62 Days',
    risk: 78,
  },
  {
    id: '#3391',
    name: 'David Park',
    initials: 'DP',
    avatarBg: 'bg-[#0ea5e9]',
    membership: 'Diamond',
    membershipClass: 'bg-[#181c1e] text-white',
    lastWash: '102 Days',
    risk: 92,
  },
];

const recentActivities = [
  {
    icon: Users,
    iconBg: 'bg-[#E6F0FF]',
    iconColor: 'text-[#0047AB]',
    text: 'M. Chen updated shift schedule',
    time: '12 minutes ago',
  },
  {
    icon: Wrench,
    iconBg: 'bg-[#f0fdf4]',
    iconColor: 'text-[#16a34a]',
    text: 'Bay 02 Maintenance check completed',
    time: '42 minutes ago',
  },
  {
    icon: Package,
    iconBg: 'bg-[#fff7ed]',
    iconColor: 'text-[#f59e0b]',
    text: 'Inventory Alert: 5% Ceramic Sealant stock',
    time: '1 hour ago',
  },
];

function StatCard({ label, value, badge, badgeClass, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-3">
          <span className="text-[#848a9c] text-sm font-medium">{label}</span>
          <span className="text-[#181c1e] text-3xl font-bold tracking-tight">{value}</span>
          <span className={`inline-flex w-fit text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClass}`}>
            {badge}
          </span>
        </div>
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

function RiskBar({ percent }) {
  const color =
    percent >= 85 ? 'bg-red-500' : percent >= 75 ? 'bg-orange-500' : 'bg-amber-400';

  return (
    <div className="flex items-center gap-3 min-w-[140px]">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-sm font-semibold text-[#181c1e] w-10 text-right">{percent}%</span>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[#181c1e] text-3xl font-bold tracking-tight">Operations Overview</h1>
            <p className="text-[#434654] text-base mt-1">
              Real-time performance metrics for Facility #082
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-[#181c1e] text-lg font-bold">Real-time Operations</h2>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16a34a] bg-[#f0fdf4] px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-[#16a34a] rounded-full animate-pulse" />
                LIVE ENGINE
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-[#434654] text-sm font-semibold mb-4">Technician Allocation</h3>
                <div className="flex items-end justify-center gap-6 h-44 px-4">
                  {technicianAllocation.map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-2 flex-1 max-w-[72px]">
                      <div className="w-full flex items-end justify-center h-32">
                        <div
                          className={`w-full max-w-[56px] rounded-t-lg ${item.color}`}
                          style={{ height: `${item.value * 1.8}px` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-[#434654]">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[#434654] text-sm font-semibold mb-4">Bay Occupancy</h3>
                <div className="flex flex-col gap-5">
                  {bayOccupancy.map((bay) => (
                    <div key={bay.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#434654]">{bay.name}</span>
                        <span className="text-sm font-semibold text-[#181c1e]">{bay.percent}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0047AB] rounded-full transition-all"
                          style={{ width: `${bay.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0047AB] rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-white" />
              <h2 className="text-white text-lg font-bold">AI Strategy Agent</h2>
            </div>
            <p className="text-white/90 text-sm leading-relaxed flex-1">
              Based on current bay occupancy and technician availability, I recommend a{' '}
              <strong className="text-white">&quot;Quick Polish Happy Hour&quot;</strong> from 2:00 PM
              to 4:00 PM today. This could increase turnover by 15% and optimize underutilized
              technicians in Bay 02.
            </p>
            <button
              type="button"
              className="mt-6 w-full bg-white hover:bg-gray-50 text-[#0047AB] text-sm font-semibold py-3 rounded-lg transition-colors"
            >
              Implement Promotion
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-[#181c1e] text-lg font-bold">Customer Churn Risk</h2>
              <p className="text-[#848a9c] text-sm mt-0.5">High Risk VIPs</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#f7fafd]">
                    <th className="text-left px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                      Membership
                    </th>
                    <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                      Last Wash
                    </th>
                    <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                      Risk Level
                    </th>
                    <th className="text-left px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {churnCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${customer.avatarBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                          >
                            {customer.initials}
                          </div>
                          <div>
                            <div className="text-[#181c1e] font-semibold">{customer.name}</div>
                            <div className="text-[#848a9c] text-xs">{customer.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${customer.membershipClass}`}
                        >
                          {customer.membership}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#434654]">{customer.lastWash}</td>
                      <td className="px-4 py-4">
                        <RiskBar percent={customer.risk} />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          className="text-[#0047AB] text-sm font-semibold hover:underline"
                        >
                          Send Offer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1">
              <h2 className="text-[#181c1e] text-lg font-bold mb-5">Recent Activity</h2>
              <div className="flex flex-col gap-5">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.text} className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg ${activity.iconBg} flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`w-4 h-4 ${activity.iconColor}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-[#181c1e] font-medium leading-snug">{activity.text}</p>
                        <p className="text-xs text-[#848a9c] mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="h-36 bg-gradient-to-br from-[#E6F0FF] via-[#f7fafd] to-[#dbeafe] flex items-center justify-center">
                <Building2 className="w-16 h-16 text-[#0047AB]/30" />
              </div>
              <div className="px-5 py-4 border-t border-gray-100">
                <p className="text-[#181c1e] font-bold text-sm">Facility #082 - Downtown</p>
                <p className="text-[#848a9c] text-xs mt-0.5">Primary operations hub</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
