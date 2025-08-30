import Sidebar from '../../components/layout/Sidebar';

export default function GrantedTendersLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar role="company" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
