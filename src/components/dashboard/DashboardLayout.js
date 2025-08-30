import Sidebar from '../layout/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar role="company" />
      <div className="flex-1 p-6 bg-gray-50">{children}</div>
    </div>
  );
}
