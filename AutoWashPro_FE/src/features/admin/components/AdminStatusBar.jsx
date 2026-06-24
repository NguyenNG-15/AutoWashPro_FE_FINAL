import { CheckCircle2 } from 'lucide-react';

export default function AdminStatusBar() {
  return (
    <footer className="h-12 shrink-0 bg-white border-t border-gray-200 px-6 flex items-center justify-between text-sm">
      <div className="flex items-center gap-8">
        <span className="text-[#434654]">
          Active Memberships:{' '}
          <strong className="text-[#181c1e]">12,482</strong>
        </span>
        <span className="text-[#434654]">
          Tier Upgrades (30d):{' '}
          <strong className="text-[#16a34a]">+428</strong>
        </span>
        <span className="text-[#434654]">
          Loyalty Liability:{' '}
          <strong className="text-[#181c1e]">$18.2k</strong>
        </span>
      </div>
      <div className="flex items-center gap-2 text-[#434654]">
        <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
        <span>
          SYSTEM HEALTH:{' '}
          <span className="text-[#16a34a] font-medium">All engines operational</span>
        </span>
      </div>
    </footer>
  );
}
