import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function WebForgetPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    console.log('Submitted values:', data); // Replace with API call
    navigate('/auth/resetpassword');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1F2668]">
              Forgot your password?
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                className={`h-12 text-lg ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg bg-[#2BCFD5] hover:bg-[#22BBCC] text-white transition-colors duration-200"
              disabled={!isValid}
            >
              Send Reset Link
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 