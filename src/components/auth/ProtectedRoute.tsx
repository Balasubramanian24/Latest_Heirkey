import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/auth/login'
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('ProtectedRoute: Still loading authentication state');
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('ProtectedRoute: User is not authenticated, redirecting to', redirectTo);

    // Check if we have a token in localStorage but isAuthenticated is false
    // This could indicate an issue with the auth context not being properly updated
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      console.log('ProtectedRoute: Token found in localStorage but user not authenticated in context');
      // Force a page reload to try to fix the auth state
      window.location.reload();
      return <div>Refreshing authentication state...</div>;
    }

    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
