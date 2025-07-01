import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex bg-[#0D0D0D] min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet /> {/* Your page content will appear here */}
      </div>
    </div>
  );
}