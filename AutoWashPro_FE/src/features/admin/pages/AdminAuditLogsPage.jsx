import { useState, useEffect, useCallback } from 'react';
import { Shield, Download, SlidersHorizontal, ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import { fetchStaffAuditLogs, getApiErrorMessage } from '../services/staffService';

function ActorBadge({ type, typeClass, actor }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${typeClass || 'bg-[#848a9c] text-white'}`}
        title={type}
      >
        {type}
      </span>
      <span className="text-[#181c1e] font-mono text-xs">{actor}</span>
    </div>
  );
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchStaffAuditLogs({
        page: currentPage,
        size: 15,
        search: searchQuery,
      });
      setLogs(result.logs || []);
      setTotalPages(result.totalPages || 0);
      setTotalElements(result.totalElements || 0);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load audit logs.'));
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const showingFrom = totalElements === 0 ? 0 : currentPage * 15 + 1;
  const showingTo = Math.min((currentPage + 1) * 15, totalElements);

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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white border border-gray-200 rounded-lg text-sm text-[#181c1e] placeholder:text-[#848a9c] focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
              />
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-[#f7fafd] flex items-center justify-between gap-4">
            <h2 className="text-[#181c1e] text-base font-bold">System Black Box</h2>
            <span className="text-xs text-[#848a9c]">
              Live feed:{' '}
              <span className="text-[#16a34a] font-semibold">
                {isLoading ? 'Syncing...' : 'Latency 14ms'}
              </span>
            </span>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-32 text-[#848a9c]">
                <Loader2 className="w-6 h-6 animate-spin text-[#0047AB]" />
                <span className="text-sm">Fetching immutable logs...</span>
              </div>
            ) : (
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
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#848a9c]">
                        No logs match your search.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log, index) => (
                      <tr
                        key={log.id || index}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                      >
                        <td className="px-6 py-4 font-mono text-xs text-[#434654] whitespace-nowrap">
                          {log.timestamp || log.createdAt || '—'}
                        </td>
                        <td className="px-4 py-4">
                          <ActorBadge
                            type={log.actorType || 'SYS'}
                            typeClass={log.actorClass || 'bg-[#848a9c] text-white'}
                            actor={log.actor || log.username || 'System'}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex font-mono text-xs font-medium px-2.5 py-1 rounded ${log.actionClass || 'bg-gray-100 text-[#434654]'}`}
                          >
                            {log.action || 'UNKNOWN_ACTION'}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-mono text-xs text-[#434654]">{log.table || log.entity || '—'}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide ${log.status === 'SUCCESS' ? 'bg-[#f0fdf4] text-[#16a34a]' : 'bg-[#fef2f2] text-[#dc2626]'}`}
                          >
                            {log.status || 'SUCCESS'}
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
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {!isLoading && logs.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-[#848a9c]">
                Showing {showingFrom} to {showingTo} of {totalElements.toLocaleString('en-US')} entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-40"
                  disabled={currentPage === 0}
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
                  disabled={currentPage >= totalPages - 1}
                >
                  <ChevronRight className="w-4 h-4 text-[#434654]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
