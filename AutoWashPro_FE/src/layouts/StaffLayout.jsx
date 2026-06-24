import { Outlet } from 'react-router-dom';
import StaffSidebar from '../features/staff/components/StaffSidebar';
import StaffHeader from '../features/staff/components/StaffHeader';

export default function StaffLayout() {
  return (
    <div className="flex h-screen bg-[#f7fafd] overflow-hidden">
      <StaffSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <StaffHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
