import { ReactNode } from 'react';
import Header from '@/mobile/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Static header component */}
      <Header
        isLandingPage={false}          // hardcoded value
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
