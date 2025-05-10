import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthHeader from './AuthHeader';

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

export default function ResetPassword() {
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
    console.log('Submitted values:', data); // Replace with API call
  };

  return (
    <div className="bg-white flex flex-col justify-center items-center px-0 py-0 sm:px-6 lg:px-8">
      <div className="w-full md:max-w-xl lg:max-w-2xl mx-auto">
        <AuthHeader title="Reset Password" />

        <div className="w-full pt-6 px-6 md:px-10 py-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-[#1F2668]">
              Reset your password
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter a new password and confirm it.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter new password"
                {...register('newPassword')}
                className={errors.newPassword ? 'border-red-500' : ''}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Confirm new password"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  hasValidPassword 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-300'
                }`}>
                  {hasValidPassword && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className={hasValidPassword ? "text-green-500" : ""}>
                  Must be at least 8 characters and one special character
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  passwordsMatch 
                    ? 'border-green-500 bg-green-500' 
                    : 'border-gray-300'
                }`}>
                  {passwordsMatch && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className={passwordsMatch ? "text-green-500" : ""}>
                  Passwords must match
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2BCFD5] hover:bg-[#22BBCC]"
              disabled={!isValid}
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
