import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
interface WebRegisterProps {
  onToggle: (mode: 'register' | 'login') => void;
}

export default function WebRegister({ onToggle }: WebRegisterProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const hasValidPassword = password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasValidPassword || !passwordsMatch) {
      setError("Please ensure your password meets all requirements.");
      toast({
        title: "Registration failed",
        description: "Please ensure your password meets all requirements.",
        variant: "destructive",
      });
      return;
    }

    try {
      await register({
        username,
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined
      });
      toast({
        title: "Registration successful",
        description: "You have been registered successfully",
        variant: "default",
      });
      navigate("/auth/user-profile");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
      toast({
        title: "Registration failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignup = () => {
    toast({
      title: "Signup successful",
      description: "You have been signed up successfully",
      variant: "default",
    });
    window.location.href = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/v1/auth/google/signup`;
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          className="w-full mt-1 p-2 border rounded-md text-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mt-1 p-2 border rounded-md text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            placeholder="First name"
            className="w-full mt-1 p-2 border rounded-md text-sm"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            placeholder="Last name"
            className="w-full mt-1 p-2 border rounded-md text-sm"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Create a password"
          className="w-full mt-1 p-2 border rounded-md text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your password"
          className="w-full mt-1 p-2 border rounded-md text-sm"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
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
        type="submit"
        className="w-full bg-[#2BCFD5] hover:bg-[#25b6ba] text-white text-sm"
        disabled={!hasValidPassword || !passwordsMatch || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing up...
          </>
        ) : (
          "Get started"
        )}
      </Button>

      <button
        type="button"
        className="w-full mt-2 border text-sm py-2 rounded-md flex justify-center items-center gap-2"
        onClick={handleGoogleSignup}
      >
        <FcGoogle className="inline-block w-4 h-4" /> Sign up with Google
      </button>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <button 
          onClick={() => onToggle('login')} 
          className="text-[#2BCFD5] cursor-pointer hover:text-[#22BBCC]"
        >
          Log in
        </button>
      </p>
    </form>
  );
}
