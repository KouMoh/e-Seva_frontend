import AdminLayout from '../../components/admin/AdminLayout';
import AdminPinProtection from '../../components/auth/AdminPinProtection';

export default function Layout({ children }) {
  return (
    <AdminPinProtection>
      <AdminLayout>{children}</AdminLayout>
    </AdminPinProtection>
  );
}
