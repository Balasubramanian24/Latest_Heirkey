import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/web/components/Layout/AppHeader';
import WebLayout from '../Layout/WebLayout';

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Must be at least 8 characters')
      .regex(/[^A-Za-z0-9]/, 'Must contain one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function WebResetPassword() {
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');
  const hasValidPassword = newPassword.length >= 8 && /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== '';

  useEffect(() => {
    trigger('confirmPassword');
  }, [newPassword, confirmPassword, trigger]);

  const onSubmit = (data: ResetPasswordFormValues) => {
    console.log('Submitted values:', data); 
  };

  return (
    <WebLayout subHeaderTitle="Reset Password">
      <div className="flex flex-col md:flex-row">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-xl shadow-md w-full max-w-md py-10 px-6 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#1F2668]">
                Reset your password
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Enter a new password and confirm it.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    {...register('newPassword')}
                    className={`h-12 text-lg ${errors.newPassword ? 'border-red-500' : ''}`}
                  />
                  {errors.newPassword && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    {...register('confirmPassword')}
                    className={`h-12 text-lg ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                    hasValidPassword 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-gray-300'
                  }`}>
                    {hasValidPassword && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={`text-sm ${hasValidPassword ? "text-green-600 font-medium" : "text-gray-600"}`}>
                    Must be at least 8 characters and one special character
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                    passwordsMatch 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-gray-300'
                  }`}>
                    {passwordsMatch && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={`text-sm ${passwordsMatch ? "text-green-600 font-medium" : "text-gray-600"}`}>
                    Passwords must match
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-[#2BCFD5] hover:bg-[#22BBCC] text-white transition-colors duration-200"
                disabled={!isValid}
              >
                Reset Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </WebLayout>
  );
} 