import Sidebar from '@/components/sidebar/Sidebar';
import AuthGuard from '@/components/AuthGuard';

export default function AccountsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        {children}
      </div>
    </AuthGuard>
  );
}
