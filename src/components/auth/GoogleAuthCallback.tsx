import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function GoogleAuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useAuth() as any; // Add setUser and setToken to AuthContext

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Parse query parameters
        const params = new URLSearchParams(location.search);
        const success = params.get('success') === 'true';
        const errorMsg = params.get('error');
        const token = params.get('token');
        const userJson = params.get('user');
        const redirectTo = params.get('redirectTo');

        if (!success || errorMsg) {
          setError(errorMsg || 'Authentication failed');

          // If redirectTo is specified, navigate there after a delay
          if (redirectTo) {
            setTimeout(() => {
              navigate(`/auth/${redirectTo}`);
            }, 3000);
          }
          return;
        }

        if (!token || !userJson) {
          setError('Invalid response from server');
          return;
        }

        // Parse user data
        const userData = JSON.parse(userJson);

        // Store token and user in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', userJson);

        // Update auth context
        console.log('Setting token and user in auth context');
        setToken(token);
        setUser(userData);

        // Redirect to dashboard or profile completion if needed
        console.log('Navigating to user profile page');
        // Force a page reload to ensure the auth state is properly updated
        window.location.href = '/auth/user-profile';
      } catch (err) {
        console.error('Error processing Google auth callback:', err);
        setError('Failed to process authentication response');
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();

    // Add a safety timeout to force navigation if something goes wrong
    const safetyTimeout = setTimeout(() => {
      // Check if we're still on the callback page after 5 seconds
      if (location.pathname === '/auth/google/callback') {
        console.log('Forcing navigation to dashboard due to timeout');
        // Try to get token from localStorage as a fallback
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          console.log('Token found in localStorage, forcing hard redirect to dashboard');
          window.location.href = '/dashboard';
        } else {
          console.log('No token found, redirecting to login');
          window.location.href = '/auth/login';
        }
      }
    }, 5000);

    return () => clearTimeout(safetyTimeout);
  }, [location, navigate, setToken, setUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {isProcessing ? (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#2BCFD5]" />
          <p className="text-lg font-medium">Processing authentication...</p>
        </div>
      ) : error ? (
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertDescription className="text-center py-2">{error}</AlertDescription>
          </Alert>
          <p className="text-center mt-4">
            Redirecting you back to the login page...
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-[#2BCFD5] text-4xl">✓</div>
          <p className="text-lg font-medium">Authentication successful!</p>
          <p>Redirecting you to the dashboard...</p>
        </div>
      )}
    </div>
  );
}
