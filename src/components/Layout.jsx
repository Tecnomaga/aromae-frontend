import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';

export default function Layout() {
  const location = useLocation();
  const isAuthPage = ['/login', '/cadastro', '/onboarding'].includes(location.pathname);
  if (isAuthPage) return <Outlet />;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 bg-fundo">
        <Outlet />
      </main>
      <MobileBottomNav />
    </div>
  );
}
