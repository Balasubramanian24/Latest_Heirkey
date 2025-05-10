import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AuthHeader from './AuthHeader';

export default function ForgetPassword() {
  const navigate = useNavigate();

  return (
    <div className="bg-white flex flex-col justify-center items-center px-0 py-0 sm:px-6 lg:px-8">
      <div className="w-full md:max-w-xl lg:max-w-2xl mx-auto">
        <AuthHeader title="Forgot Password" />

        <div className="w-full px-6 md:px-10 py-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-[#1F2668]">
              Forgot your password?
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
              />
              {/* Optional: Uncomment for email validation error */}
              {/* <p className="text-sm text-red-500 mt-1">Please enter a valid email</p> */}
            </div>

            <Button
              type="button"
              onClick={() => {
                navigate('/auth/resetpassword');
              }}
              className="w-full bg-[#2BCFD5] text-white"
            >
              Fetch Reset Link
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
