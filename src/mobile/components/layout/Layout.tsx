import { ReactNode } from 'react';
import Header from '@/mobile/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  // const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header component with auth context */}
      <Header
        isLandingPage={isLandingPage}
        isAuthenticated={isAuthenticated}
        showAuthButtons={!isAuthenticated}
        user={user}
        handleLogout={logout}
      />

      {/* Main content area */}
      <main className="flex-grow container mx-auto px-0 py-0">
        {children}
      </main>
    </div>
  );
}
