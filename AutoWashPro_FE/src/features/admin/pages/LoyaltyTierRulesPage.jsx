import { useState } from 'react';
import {
  User,
  Medal,
  Crown,
  Gem,
  History,
  Clock,
  AlertTriangle,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react';

const loyaltyTiers = [
  {
    id: 'member',
    name: 'Member',
    subtitle: 'Default Tier',
    icon: User,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    minSpend: '$0.00',
    multiplier: '1.0x',
    bookingWindow: '7 Days',
    highlighted: false,
  },
  {
    id: 'silver',
    name: 'Silver',
    subtitle: null,
    icon: Medal,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-500',
    minSpend: '$250.00',
    multiplier: '1.2x',
    bookingWindow: '14 Days',
    highlighted: false,
  },
  {
    id: 'gold',
    name: 'Gold',
    subtitle: null,
    icon: Crown,
    iconBg: 'bg-[#E6F0FF]',
    iconColor: 'text-[#0047AB]',
    minSpend: '$750.00',
    multiplier: '1.5x',
    bookingWindow: '30 Days',
    highlighted: true,
    badge: 'MOST POPULAR',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    subtitle: null,
    icon: Gem,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    minSpend: '$2,000.00',
    multiplier: '2.0x',
    bookingWindow: '60 Days',
    highlighted: false,
  },
];

const promotionRules = [
  {
    id: 'RL-981',
    trigger: 'Booking Confirmation',
    condition: 'Is Birthday week?',
    action: '+500 Points',
    actionStyle: 'green',
  },
  {
    id: 'RL-442',
    trigger: 'Referral Success',
    condition: 'New user 1st wash',
    action: '1 Free Basic Wash',
    actionStyle: 'blue',
  },
];

export default function LoyaltyTierRulesPage() {
  const [ruleActive, setRuleActive] = useState(true);
  const [upgradeFrequency, setUpgradeFrequency] = useState('realtime');
  const [evaluationPeriod, setEvaluationPeriod] = useState('12');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [welcomeBonus, setWelcomeBonus] = useState(true);
  const [manualPlatinum, setManualPlatinum] = useState(false);

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[#181c1e] text-3xl font-bold tracking-tight">
              Loyalty Tier &amp; Rules
            </h1>
            <p className="text-[#434654] text-base mt-1">
              Manage membership tiers, spend requirements, and automation logic.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-medium text-[#434654] hover:bg-gray-50 transition-colors">
              <History className="w-4 h-4" />
              Change History
            </button>
            <button className="px-5 py-2.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg transition-colors">
              Save All Changes
            </button>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {loyaltyTiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.id}
                className={`relative bg-white rounded-xl p-5 flex flex-col gap-4 ${
                  tier.highlighted
                    ? 'border-2 border-[#0047AB] shadow-[0px_4px_20px_rgba(0,71,171,0.12)]'
                    : 'border border-gray-200 shadow-sm'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0047AB] text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                    {tier.badge}
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${tier.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${tier.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-[#181c1e] font-bold text-base">{tier.name}</h3>
                    {tier.subtitle && (
                      <span className="text-[#848a9c] text-xs">{tier.subtitle}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#848a9c]">Min. Spend</span>
                    <span className="text-[#181c1e] font-semibold">{tier.minSpend}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#848a9c]">Multiplier</span>
                    <span className="text-[#181c1e] font-semibold">{tier.multiplier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#848a9c]">Booking Window</span>
                    <span className="text-[#181c1e] font-semibold">{tier.bookingWindow}</span>
                  </div>
                </div>

                <button
                  className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${
                    tier.highlighted
                      ? 'bg-[#0047AB] hover:bg-[#003a8c] text-white'
                      : 'border border-gray-200 text-[#434654] hover:bg-gray-50'
                  }`}
                >
                  Edit Parameters
                </button>
              </div>
            );
          })}
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Auto-Upgrade Logic */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#181c1e] text-lg font-semibold">Auto-Upgrade Logic</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-[#434654]">Rule Active</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={ruleActive}
                  onClick={() => setRuleActive(!ruleActive)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    ruleActive ? 'bg-[#0047AB]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      ruleActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#434654]">Upgrade Frequency</label>
                <select
                  value={upgradeFrequency}
                  onChange={(e) => setUpgradeFrequency(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-[#181c1e] bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                >
                  <option value="realtime">Real-time (Immediate)</option>
                  <option value="daily">Daily Batch</option>
                  <option value="weekly">Weekly Batch</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#434654]">Evaluation Period</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={evaluationPeriod}
                    onChange={(e) => setEvaluationPeriod(e.target.value)}
                    className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-[#181c1e] focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                  />
                  <span className="text-sm text-[#848a9c] whitespace-nowrap">Months of history</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#181c1e] mb-3">Tier Transition Behavior</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#0047AB] focus:ring-[#0047AB]"
                  />
                  <span className="text-sm text-[#434654]">Send email notification on tier upgrade</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={welcomeBonus}
                    onChange={(e) => setWelcomeBonus(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#0047AB] focus:ring-[#0047AB]"
                  />
                  <span className="text-sm text-[#434654]">
                    Issue one-time &apos;Welcome&apos; bonus (100 pts)
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={manualPlatinum}
                    onChange={(e) => setManualPlatinum(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#0047AB] focus:ring-[#0047AB]"
                  />
                  <span className="text-sm text-[#434654]">
                    Require manual approval for &apos;Platinum&apos; tier
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Inactivity Review */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#434654]" />
              <h2 className="text-[#181c1e] text-lg font-semibold">Inactivity Review</h2>
            </div>

            <div className="bg-[#FFF4F2] border border-orange-100 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-800">Critical Logic</p>
                <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                  Members inactive for 6+ months will be automatically downgraded one tier
                  during the next review cycle.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[#848a9c]">Inactivity Threshold</span>
                  <span className="text-[#181c1e] font-semibold">180 Days</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-400 h-full w-[60%] rounded-full" />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#848a9c]">Next Review Run</span>
                <span className="text-[#181c1e] font-medium">Oct 01, 00:00 AM</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-[#848a9c]">Last Run Status</span>
                <span className="flex items-center gap-1.5 text-[#16a34a] font-medium">
                  <span className="w-2 h-2 bg-[#16a34a] rounded-full" />
                  Successful
                </span>
              </div>
            </div>

            <button className="w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-[#434654] hover:bg-gray-50 transition-colors mt-auto">
              Run Review Now (Dry Run)
            </button>
          </div>
        </div>

        {/* Promotion Stackability Rules */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[#181c1e] text-lg font-semibold">Promotion Stackability Rules</h2>
            <button className="flex items-center gap-1.5 text-sm font-medium text-[#0047AB] hover:underline">
              <Plus className="w-4 h-4" />
              Add Rule
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f7fafd] text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-[#848a9c] uppercase tracking-wider">
                    Rule ID
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#848a9c] uppercase tracking-wider">
                    Trigger Event
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#848a9c] uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#848a9c] uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#848a9c] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {promotionRules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-[#181c1e] font-medium">{rule.id}</td>
                    <td className="px-6 py-4 text-[#434654]">{rule.trigger}</td>
                    <td className="px-6 py-4 text-[#434654]">{rule.condition}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          rule.actionStyle === 'green'
                            ? 'bg-[#E6F4EA] text-[#16a34a]'
                            : 'bg-[#E6F0FF] text-[#0047AB]'
                        }`}
                      >
                        {rule.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-[#434654]">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
