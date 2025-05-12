import { Button } from "@/components/ui/button"; 
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function WebRegister() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const hasValidPassword = password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== '';

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          className="w-full mt-1 p-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mt-1 p-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Create a password"
          className="w-full mt-1 p-2 border rounded-md text-sm"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your password"
          className="w-full mt-1 p-2 border rounded-md text-sm"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      </div>

      <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
            hasValidPassword ? 'border-green-500 bg-green-500' : 'border-gray-300'
          }`}>
            {hasValidPassword && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <span className={hasValidPassword ? 'text-green-600 font-medium' : 'text-gray-600'}>
            Must be at least 8 characters and one special character
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
            passwordsMatch ? 'border-green-500 bg-green-500' : 'border-gray-300'
          }`}>
            {passwordsMatch && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <span className={passwordsMatch ? 'text-green-600 font-medium' : 'text-gray-600'}>
            Passwords must match
          </span>
        </div>
      </div>

      <Button 
        className="w-full bg-[#2BCFD5] hover:bg-[#25b6ba] text-white text-sm"
        disabled={!hasValidPassword || !passwordsMatch}
      >
        Get started
      </Button>

      <button
        type="button"
        className="w-full mt-2 border text-sm py-2 rounded-md flex justify-center items-center gap-2"
      >
        <FcGoogle className="inline-block w-4 h-4" /> Sign up with Google
      </button>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link to="/auth/login">
          <span className="text-[#2BCFD5] cursor-pointer">Log in</span>
        </Link>
      </p>
    </form>
  );
}
