import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import google from '@/assets/mobileimage/global/google.svg';
import { useNavigate } from 'react-router-dom';
import AuthHeader from './AuthHeader';

export default function LoginForm() {
  const navigate = useNavigate();
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

      <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto bg-white p-6 md:p-10  ">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6">
          Login
        </h1>

        <form className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 text-base md:p-4 border-gray-200"
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 text-base md:p-4 border-gray-200"
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
            type="button"
            onClick={() => {
              navigate('/auth/UserProfile');
            }}
            className="w-full bg-[#2BCFD5] hover:bg-[#2BCFD5] text-white py-3 md:py-4 rounded-md text-base"
          >
            Log in
          </Button>

          <button
            type="button"
            className="w-full mt-4 py-3 md:py-4 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 text-base"
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
      </div>
    </>
  );
}
