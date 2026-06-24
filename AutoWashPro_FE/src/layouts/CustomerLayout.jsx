import { Outlet } from 'react-router-dom';
import CustomerSidebar from '../features/customer/components/CustomerSidebar';
import CustomerHeader from '../features/customer/components/CustomerHeader';

export default function CustomerLayout() {
  return (
    <div className="flex h-screen bg-[#f7fafd] overflow-hidden">
      <CustomerSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <CustomerHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
