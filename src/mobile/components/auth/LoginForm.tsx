import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent} from '@/components/ui/card';
import google from '@/assets/mobileimage/global/google.svg';
import AuthHeader from '../header/gradiantHeader';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth login endpoint
    window.location.href = `${import.meta.env.VITE_API_URL?.replace('/v1/api', '') || 'http://localhost:3000'}/v1/auth/google/login`;
  };

  return (
    <>
      <AuthHeader title="Sign up or Login" />

      <div className="flex mb-6 border-b w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto mt-10">
        <Link
          to="/auth/register"
          className="flex-1 py-2 text-center text-gray-500 hover:text-[#2BCFD5] transition"
        >
          Sign up
        </Link>
        <Link
          to="/auth/login"
          className="flex-1 py-2 text-center font-medium text-[#2BCFD5] border-b-2 border-[#2BCFD5]"
        >
          Log in
        </Link>
      </div>

      <Card className="w-full max-w-sm md:max-w-xl lg:max-w-2xl mx-auto p-4 md:p-6 shadow-md">
        <CardContent className='mt-7'>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 text-base md:p-4 border-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 text-base md:p-4 border-gray-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="mt-2 text-right">
                <Link
                  to="/auth/forgetpassword"
                  className="text-sm text-[#2BCFD5] hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2BCFD5] hover:bg-[#2BCFD5] text-white py-3 md:py-4 rounded-md text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>

            <button
              type="button"
              className="w-full mt-4 py-3 md:py-4 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 text-base"
              onClick={handleGoogleLogin}
            >
              <img src={google} alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-[#2BCFD5] hover:text-[#2BCFD5]">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
