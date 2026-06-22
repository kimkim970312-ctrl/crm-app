import Sidebar from '@/components/sidebar/Sidebar';
import AuthGuard from '@/components/AuthGuard';

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        {children}
      </div>
    </AuthGuard>
  );
}
