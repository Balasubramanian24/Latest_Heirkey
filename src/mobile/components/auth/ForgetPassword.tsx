import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '../header/gradiantHeader';

export default function ForgetPassword() {
  const navigate = useNavigate();

  return (
    <>
      <AuthHeader title="Forgot Password" />
      <div className="bg-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto">

        <Card className="w-full mt-6 shadow-md">
          <CardHeader>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#1F2668]">
                Forgot your password?
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your email and we'll send you a reset link.
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 text-base"
                />
                {/* Optional: Uncomment for email validation error */}
                {/* <p className="text-sm text-red-500 mt-1">Please enter a valid email</p> */}
              </div>

              <Button
                type="button"
                onClick={() => navigate('/auth/resetpassword')}
                className="w-full bg-[#2BCFD5] text-white py-3 text-base"
              >
                Fetch Reset Link
              </Button>
            </form>
          </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
