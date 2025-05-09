import { ReactNode } from 'react';
import Header from '@/mobile/components/layout/Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Static header component */}
      <Header
        isLandingPage={false}          // hardcoded value
        isAuthenticated={false}        // hardcoded value
        showAuthButtons={true}         // hardcoded value
        user={null}                    // no user object
        handleLogout={() => {}}       // empty function
      />

      {/* Main content area */}
      <main className="flex-grow container mx-auto px-0 py-0">
        {children}
      </main>
    </div>
  );
}
