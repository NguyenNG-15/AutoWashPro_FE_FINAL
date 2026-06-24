import { useState } from 'react';
import {
  Building2,
  Clock,
  CalendarCheck,
  Bell,
  Shield,
  Plug,
  Save,
  RotateCcw,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

const settingTabs = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'operations', label: 'Operations', icon: Clock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'integrations', label: 'Integrations', icon: Plug },
];

const businessHours = [
  { day: 'Monday', open: '07:00', close: '20:00', closed: false },
  { day: 'Tuesday', open: '07:00', close: '20:00', closed: false },
  { day: 'Wednesday', open: '07:00', close: '20:00', closed: false },
  { day: 'Thursday', open: '07:00', close: '20:00', closed: false },
  { day: 'Friday', open: '07:00', close: '21:00', closed: false },
  { day: 'Saturday', open: '08:00', close: '21:00', closed: false },
  { day: 'Sunday', open: '08:00', close: '18:00', closed: false },
];

const integrations = [
  {
    id: 'stripe',
    name: 'Stripe Payments',
    description: 'Online payments & daily payouts',
    connected: true,
    status: 'Live',
  },
  {
    id: 'pos',
    name: 'POS Terminal',
    description: 'In-store checkout & drawer sync',
    connected: true,
    status: 'Synced',
  },
  {
    id: 'sms',
    name: 'SMS Gateway',
    description: 'Booking reminders & promotions',
    connected: false,
    status: 'Not connected',
  },
];

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer py-2">
      <span className="text-sm text-[#434654]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
          checked ? 'bg-[#0047AB]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}

const inputClass =
  'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-[#181c1e] bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]';
const labelClass = 'text-sm font-medium text-[#434654] mb-1.5 block';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const [facilityName, setFacilityName] = useState('AutoWash Pro — Facility #082');
  const [facilityAddress, setFacilityAddress] = useState('123 Downtown Blvd, District 1, HCMC');
  const [facilityPhone, setFacilityPhone] = useState('1900 1234');
  const [facilityEmail, setFacilityEmail] = useState('facility082@autowashpro.com');
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh');

  const [bayCount, setBayCount] = useState('3');
  const [slotDuration, setSlotDuration] = useState('30');
  const [maxWalkIns, setMaxWalkIns] = useState('12');
  const [autoAssignBay, setAutoAssignBay] = useState(true);
  const [allowOnlineBooking, setAllowOnlineBooking] = useState(true);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsReminders, setSmsReminders] = useState(false);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [shiftClosureAlerts, setShiftClosureAlerts] = useState(true);
  const [promoBroadcasts, setPromoBroadcasts] = useState(true);

  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [auditLogRetention, setAuditLogRetention] = useState('365');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  const handleReset = () => {
    setFacilityName('AutoWash Pro — Facility #082');
    setFacilityAddress('123 Downtown Blvd, District 1, HCMC');
    setFacilityPhone('1900 1234');
    setFacilityEmail('facility082@autowashpro.com');
    setTimezone('Asia/Ho_Chi_Minh');
    setBayCount('3');
    setSlotDuration('30');
    setMaxWalkIns('12');
    setAutoAssignBay(true);
    setAllowOnlineBooking(true);
    setEmailAlerts(true);
    setSmsReminders(false);
    setLowStockAlerts(true);
    setShiftClosureAlerts(true);
    setPromoBroadcasts(true);
    setSessionTimeout('30');
    setForcePasswordChange(true);
    setTwoFactorRequired(false);
    setAuditLogRetention('365');
  };

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        {saved && (
          <div className="fixed top-6 right-6 z-[60] flex items-center gap-3 bg-white border border-[#16a34a]/30 shadow-lg rounded-xl px-4 py-3 animate-[slideIn_0.3s_ease-out]">
            <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#181c1e]">Đã lưu cài đặt</p>
              <p className="text-xs text-[#848a9c]">Thay đổi đã được áp dụng (mock)</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-[#181c1e] text-3xl font-bold tracking-tight">System Settings</h1>
            <p className="text-[#434654] text-base mt-1">
              Configure facility operations, notifications, and security preferences.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-medium text-[#434654] hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save All Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <nav className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm flex lg:flex-col gap-1 overflow-x-auto">
              {settingTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === id
                      ? 'bg-[#E6F0FF] text-[#0047AB]'
                      : 'text-[#434654] hover:bg-gray-50 hover:text-[#181c1e]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-6">
            {activeTab === 'general' && (
              <>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Building2 className="w-5 h-5 text-[#0047AB]" />
                    <h2 className="text-[#181c1e] text-lg font-bold">Facility Profile</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label htmlFor="facilityName" className={labelClass}>
                        Facility Name
                      </label>
                      <input
                        id="facilityName"
                        type="text"
                        value={facilityName}
                        onChange={(e) => setFacilityName(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="facilityAddress" className={labelClass}>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          Address
                        </span>
                      </label>
                      <input
                        id="facilityAddress"
                        type="text"
                        value={facilityAddress}
                        onChange={(e) => setFacilityAddress(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="facilityPhone" className={labelClass}>
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" />
                          Phone
                        </span>
                      </label>
                      <input
                        id="facilityPhone"
                        type="tel"
                        value={facilityPhone}
                        onChange={(e) => setFacilityPhone(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="facilityEmail" className={labelClass}>
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          Email
                        </span>
                      </label>
                      <input
                        id="facilityEmail"
                        type="email"
                        value={facilityEmail}
                        onChange={(e) => setFacilityEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="timezone" className={labelClass}>
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className={inputClass}
                      >
                        <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh (GMT+7)</option>
                        <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                        <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Facility ID</label>
                      <input
                        type="text"
                        value="#082 — Downtown"
                        disabled
                        className={`${inputClass} bg-gray-50 text-[#848a9c] cursor-not-allowed`}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5 text-[#0047AB]" />
                    <h2 className="text-[#181c1e] text-lg font-bold">Business Hours</h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {businessHours.map((row) => (
                      <div
                        key={row.day}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3 border-b border-gray-50 last:border-0"
                      >
                        <span className="text-sm font-medium text-[#181c1e] w-28 shrink-0">
                          {row.day}
                        </span>
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            defaultValue={row.open}
                            className={`${inputClass} max-w-[140px]`}
                          />
                          <span className="text-[#848a9c] text-sm">to</span>
                          <input
                            type="time"
                            defaultValue={row.close}
                            className={`${inputClass} max-w-[140px]`}
                          />
                        </div>
                        <span className="text-xs font-semibold text-[#16a34a] bg-[#f0fdf4] px-2.5 py-1 rounded-full w-fit">
                          Open
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'operations' && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <CalendarCheck className="w-5 h-5 text-[#0047AB]" />
                  <h2 className="text-[#181c1e] text-lg font-bold">Booking &amp; Queue</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label htmlFor="bayCount" className={labelClass}>
                      Active Bays
                    </label>
                    <input
                      id="bayCount"
                      type="number"
                      min="1"
                      max="10"
                      value={bayCount}
                      onChange={(e) => setBayCount(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="slotDuration" className={labelClass}>
                      Slot Duration (minutes)
                    </label>
                    <select
                      id="slotDuration"
                      value={slotDuration}
                      onChange={(e) => setSlotDuration(e.target.value)}
                      className={inputClass}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="maxWalkIns" className={labelClass}>
                      Max Walk-ins (concurrent)
                    </label>
                    <input
                      id="maxWalkIns"
                      type="number"
                      min="1"
                      value={maxWalkIns}
                      onChange={(e) => setMaxWalkIns(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 flex flex-col divide-y divide-gray-50">
                  <Toggle
                    label="Auto-assign bay when booking is confirmed"
                    checked={autoAssignBay}
                    onChange={setAutoAssignBay}
                  />
                  <Toggle
                    label="Allow online customer self-booking"
                    checked={allowOnlineBooking}
                    onChange={setAllowOnlineBooking}
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Bell className="w-5 h-5 text-[#0047AB]" />
                  <h2 className="text-[#181c1e] text-lg font-bold">Alert Preferences</h2>
                </div>
                <div className="flex flex-col divide-y divide-gray-50">
                  <Toggle
                    label="Email alerts for flagged shift reconciliations"
                    checked={emailAlerts}
                    onChange={setEmailAlerts}
                  />
                  <Toggle
                    label="SMS booking reminders to customers"
                    checked={smsReminders}
                    onChange={setSmsReminders}
                  />
                  <Toggle
                    label="Low inventory stock alerts"
                    checked={lowStockAlerts}
                    onChange={setLowStockAlerts}
                  />
                  <Toggle
                    label="Shift closure deadline warnings"
                    checked={shiftClosureAlerts}
                    onChange={setShiftClosureAlerts}
                  />
                  <Toggle
                    label="Flash promo broadcast to POS terminals"
                    checked={promoBroadcasts}
                    onChange={setPromoBroadcasts}
                  />
                </div>
                {!smsReminders && (
                  <div className="mt-5 rounded-lg bg-[#E6F0FF] border border-[#0047AB]/10 px-4 py-3 text-sm text-[#434654]">
                    SMS Gateway chưa kết nối. Bật tích hợp SMS trong tab Integrations để sử dụng
                    tính năng này.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5 text-[#0047AB]" />
                  <h2 className="text-[#181c1e] text-lg font-bold">Security &amp; Access</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label htmlFor="sessionTimeout" className={labelClass}>
                      Session Timeout (minutes)
                    </label>
                    <select
                      id="sessionTimeout"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className={inputClass}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="auditLogRetention" className={labelClass}>
                      Audit Log Retention (days)
                    </label>
                    <input
                      id="auditLogRetention"
                      type="number"
                      value={auditLogRetention}
                      onChange={(e) => setAuditLogRetention(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 flex flex-col divide-y divide-gray-50">
                  <Toggle
                    label="Force password change on first login"
                    checked={forcePasswordChange}
                    onChange={setForcePasswordChange}
                  />
                  <Toggle
                    label="Require two-factor authentication for admins"
                    checked={twoFactorRequired}
                    onChange={setTwoFactorRequired}
                  />
                </div>
                <div className="mt-5 rounded-lg bg-[#f7fafd] border border-gray-200 px-4 py-3 flex items-start gap-3">
                  <Shield className="w-4 h-4 text-[#0047AB] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#434654] leading-relaxed">
                    Stateless JWT &amp; AOP security layer is active. All setting changes are
                    logged in the Audit Registry for SOC2 compliance.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Plug className="w-5 h-5 text-[#0047AB]" />
                  <h2 className="text-[#181c1e] text-lg font-bold">Connected Services</h2>
                </div>
                <div className="flex flex-col gap-4">
                  {integrations.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
                    >
                      <div>
                        <p className="text-[#181c1e] font-semibold text-sm">{item.name}</p>
                        <p className="text-[#848a9c] text-xs mt-0.5">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            item.connected
                              ? 'bg-[#f0fdf4] text-[#16a34a]'
                              : 'bg-gray-100 text-[#848a9c]'
                          }`}
                        >
                          {item.status}
                        </span>
                        <button
                          type="button"
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                            item.connected
                              ? 'border border-gray-200 text-[#434654] hover:bg-gray-50'
                              : 'bg-[#0047AB] hover:bg-[#003a8c] text-white'
                          }`}
                        >
                          {item.connected ? 'Configure' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
