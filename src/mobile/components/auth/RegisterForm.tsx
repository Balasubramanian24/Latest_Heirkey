import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import google from '@/assets/mobileimage/global/google.svg';
import AuthHeader from '../header/gradiantHeader';
import { useState } from 'react';

export default function RegisterForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const hasValidPassword =
    password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== '';

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <>
      <AuthHeader title="Sign up or Login" />

      {/* Tab Navigation */}
      <div className="flex mb-6 border-b w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto mt-10">
        <button className="flex-1 py-2 text-center font-medium text-[#2BCFD5] border-b-2 border-[#2BCFD5]">
          Sign up
        </button>
        <Link
          to="/auth/login"
          className="flex-1 py-2 text-center text-gray-500 hover:text-[#2BCFD5] transition"
        >
          Log in
        </Link>
      </div>

      {/* Card Container */}
      <Card className="w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto p-4 md:p-6 shadow-md">
        <CardHeader>
          <h1 className="text-2xl md:text-3xl font-semibold text-center">
            Sign up
          </h1>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            <Input
              placeholder="Enter your username"
              className="w-full p-3 text-base"
            />
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 text-base"
            />
            <Input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 text-base"
              value={password}
              onChange={handlePasswordChange}
            />
            <Input
              type="password"
              placeholder="Confirm your password"
              className="w-full p-3 text-base"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />

            {/* Password hints */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    hasValidPassword
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}
                >
                  {hasValidPassword && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className={hasValidPassword ? 'text-green-500' : ''}>
                  Must be at least 8 characters and one special character
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    passwordsMatch
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}
                >
                  {passwordsMatch && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className={passwordsMatch ? 'text-green-500' : ''}>
                  Passwords must match
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#2BCFD5] text-white py-3 text-base"
              disabled={!hasValidPassword || !passwordsMatch}
            >
              <Link to="/auth/verify">Sign up</Link>
            </Button>

            {/* Google Signup */}
            <button
              type="button"
              className="w-full mt-4 py-3 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 text-base"
            >
              <img src={google} alt="Google" className="w-5 h-5" />
              Sign up with Google
            </button>

            {/* Footer Link */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-[#2BCFD5] hover:text-[#2BCFD5]"
              >
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
