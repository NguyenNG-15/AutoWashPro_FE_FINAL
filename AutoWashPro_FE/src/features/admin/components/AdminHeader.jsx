import { Search, Download, Bell, LayoutGrid } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="h-16 shrink-0 bg-white border-b border-gray-200 px-6 flex items-center justify-between gap-4">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
          <input
            type="text"
            placeholder="Search configurations..."
            className="w-full pl-10 pr-4 py-2 bg-[#f7fafd] border border-gray-200 rounded-lg text-sm text-[#181c1e] placeholder:text-[#848a9c] focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#434654] hover:text-[#181c1e] transition-colors">
          <Download className="w-4 h-4" />
          Export Data
        </button>
        <button className="bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          New Report
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors relative">
          <Bell className="w-5 h-5 text-[#434654]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <LayoutGrid className="w-5 h-5 text-[#434654]" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0047AB] to-[#0066cc] flex items-center justify-center text-white text-sm font-bold">
          AD
        </div>
      </div>
    </header>
  );
}
