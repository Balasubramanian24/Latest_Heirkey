import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";

// Define the login form schema with zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function WebLogin() {
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const handleToggle = (mode: 'register' | 'login') => {
    navigate(mode === 'register' ? '/auth/register' : '/auth/login');
  };

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);

    try {
      await login({ email: data.email, password: data.password });
      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
        variant: "default",
      });
      navigate("/auth/user-profile");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
      toast({
        title: "Login failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Login successful",
      description: "You have been logged in successfully",
      variant: "default",
    });
    window.location.href = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/v1/auth/google/login`;
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          placeholder="Enter your email"
          className={`w-full mt-1 p-2 text-sm ${errors.email ? 'border-red-500' : ''}`}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <Input
          type="password"
          placeholder="Enter your password"
          className={`w-full mt-1 p-2 text-sm ${errors.password ? 'border-red-500' : ''}`}
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
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
        <button
          type="button"
          onClick={() => handleToggle('register')}
          className="text-[#2BCFD5] cursor-pointer hover:text-[#22BBCC]"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}
