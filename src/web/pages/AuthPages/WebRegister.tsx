import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";

interface WebRegisterProps {
  onToggle: (mode: 'register' | 'login') => void;
}

// Define the registration form schema with zod
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function WebRegister({ onToggle }: WebRegisterProps) {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();

  // Initialize react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", // Validate on change for better UX with password requirements
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const hasValidPassword = password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== "";

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);

    try {
      await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
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
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <Input
          type="text"
          placeholder="Enter your username"
          className={`w-full mt-1 p-2 text-sm ${errors.username ? 'border-red-500' : ''}`}
          {...register("username")}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

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

      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <Input
            type="text"
            placeholder="First name"
            className="w-full mt-1 p-2 text-sm"
            {...register("firstName")}
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <Input
            type="text"
            placeholder="Last name"
            className="w-full mt-1 p-2 text-sm"
            {...register("lastName")}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <Input
          type="password"
          placeholder="Create a password"
          className={`w-full mt-1 p-2 text-sm ${errors.password ? 'border-red-500' : ''}`}
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <Input
          type="password"
          placeholder="Confirm your password"
          className={`w-full mt-1 p-2 text-sm ${errors.confirmPassword ? 'border-red-500' : ''}`}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
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
        disabled={!isValid || isLoading}
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
          type="button"
          onClick={() => onToggle('login')}
          className="text-[#2BCFD5] cursor-pointer hover:text-[#22BBCC]"
        >
          Log in
        </button>
      </p>
    </form>
  );
}
