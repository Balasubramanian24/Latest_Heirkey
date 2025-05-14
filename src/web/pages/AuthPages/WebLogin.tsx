import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function WebLogin() {
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
      navigate("/auth/user-profile");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth login endpoint
    window.location.href = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/v1/auth/google/login`;
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full mt-1 p-2 border rounded-md text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="mt-2 text-right">
          <Link
            to="/auth/forgetpassword"
            className="text-sm text-[#2BCFD5] hover:text-[#22BBCC] hover:underline transition-colors duration-200"
          >
            Forgot your password?
          </Link>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#2BCFD5] hover:bg-[#25b6ba] text-white text-sm"
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
        className="w-full mt-2 border text-sm py-2 rounded-md flex justify-center items-center gap-2"
        onClick={handleGoogleLogin}
      >
       <FcGoogle className="inline-block w-4 h-4" /> Log in with Google
      </button>

      <p className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <Link to="/auth/register">
          <span className="text-[#2BCFD5] cursor-pointer">Sign up</span>
        </Link>
      </p>
    </form>
  );
}
