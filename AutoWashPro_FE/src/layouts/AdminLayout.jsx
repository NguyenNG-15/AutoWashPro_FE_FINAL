import { Outlet } from 'react-router-dom';
import AdminSidebar from '../features/admin/components/AdminSidebar';
import AdminHeader from '../features/admin/components/AdminHeader';
import AdminStatusBar from '../features/admin/components/AdminStatusBar';

export default function AdminLayout() {

  return (
    <div className="flex h-screen bg-[#f7fafd] overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <AdminStatusBar />
      </div>
    </div>
  );
}
