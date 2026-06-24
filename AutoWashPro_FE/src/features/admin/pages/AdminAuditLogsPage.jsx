import { useState } from 'react';
import { Shield, Download, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const auditLogs = [
  {
    id: 1,
    timestamp: '2024-10-24 14:22:01.482',
    actorType: 'ST',
    actorTypeLabel: 'Staff',
    actorClass: 'bg-[#0047AB] text-white',
    actor: 'm_garcia_mgr',
    action: 'MANUAL_POINT_ADJUST',
    actionClass: 'bg-gray-100 text-[#434654]',
    table: 'loyalty_ledger',
    status: 'SUCCESS',
    statusClass: 'bg-[#f0fdf4] text-[#16a34a]',
    failed: false,
  },
  {
    id: 2,
    timestamp: '2024-10-24 14:18:44.129',
    actorType: 'CU',
    actorTypeLabel: 'Customer',
    actorClass: 'bg-[#6366f1] text-white',
    actor: 'c_jenkins_vip',
    action: 'BOOKING_CREATED',
    actionClass: 'bg-gray-100 text-[#434654]',
    table: 'bookings',
    status: 'SUCCESS',
    statusClass: 'bg-[#f0fdf4] text-[#16a34a]',
    failed: false,
  },
  {
    id: 3,
    timestamp: '2024-10-24 14:15:33.901',
    actorType: 'SYS',
    actorTypeLabel: 'System',
    actorClass: 'bg-[#848a9c] text-white',
    actor: 'service_worker_01',
    action: 'DB_CONNECT_RETRY',
    actionClass: 'bg-[#fef2f2] text-[#dc2626]',
    table: 'global_config',
    status: 'FAILED',
    statusClass: 'bg-[#fef2f2] text-[#dc2626]',
    failed: true,
  },
  {
    id: 4,
    timestamp: '2024-10-24 14:12:07.556',
    actorType: 'ST',
    actorTypeLabel: 'Staff',
    actorClass: 'bg-[#0047AB] text-white',
    actor: 's_chen_lead',
    action: 'SHIFT_CLOSURE_INIT',
    actionClass: 'bg-gray-100 text-[#434654]',
    table: 'shift_reconciliation',
    status: 'SUCCESS',
    statusClass: 'bg-[#f0fdf4] text-[#16a34a]',
    failed: false,
  },
  {
    id: 5,
    timestamp: '2024-10-24 14:08:22.314',
    actorType: 'CU',
    actorTypeLabel: 'Customer',
    actorClass: 'bg-[#6366f1] text-white',
    actor: 'c_miller_reg',
    action: 'PROFILE_UPDATE',
    actionClass: 'bg-gray-100 text-[#434654]',
    table: 'customer_meta',
    status: 'SUCCESS',
    statusClass: 'bg-[#f0fdf4] text-[#16a34a]',
    failed: false,
  },
];

function ActorBadge({ type, typeClass, actor }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${typeClass}`}
        title={type}
      >
        {type}
      </span>
      <span className="text-[#181c1e] font-mono text-xs">{actor}</span>
    </div>
  );
}

export default function AdminAuditLogsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="text-[#181c1e] text-3xl font-bold tracking-tight">Audit Registry</h1>
            <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#0047AB] bg-[#E6F0FF] px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5" />
              Stateless JWT &amp; AOP Security Layer Active
            </div>
            <p className="text-[#434654] text-sm leading-relaxed mt-4">
              Comprehensive immutable log of every system interaction. All events are
              cryptographically hashed and verified against the Aspect-Oriented Programming
              (AOP) security intercepted layer for SOC2 compliance.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-medium text-[#434654] hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter Logs
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-[#f7fafd] flex items-center justify-between gap-4">
            <h2 className="text-[#181c1e] text-base font-bold">System Black Box</h2>
            <span className="text-xs text-[#848a9c]">
              Live feed:{' '}
              <span className="text-[#16a34a] font-semibold">Latency 14ms</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="text-left px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide whitespace-nowrap">
                    Timestamp
                  </th>
                  <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                    Actor
                  </th>
                  <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                    Action
                  </th>
                  <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                    Impacted Table
                  </th>
                  <th className="text-left px-4 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-[#848a9c] font-semibold uppercase text-xs tracking-wide">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-[#434654] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-4">
                      <ActorBadge
                        type={log.actorType}
                        typeClass={log.actorClass}
                        actor={log.actor}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex font-mono text-xs font-medium px-2.5 py-1 rounded ${log.actionClass}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-[#434654]">{log.table}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide ${log.statusClass}`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        className="text-[#0047AB] text-xs font-semibold hover:underline whitespace-nowrap"
                      >
                        View Snapshot
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-[#848a9c]">Showing 5 of 12,492 entries</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40"
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 text-[#434654]" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => page + 1)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#434654]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
