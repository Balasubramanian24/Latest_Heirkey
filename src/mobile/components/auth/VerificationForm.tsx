import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '../header/gradiantHeader';

export default function VerificationForm() {
  const navigate = useNavigate();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    e.target.value = value;

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('Text').slice(0, 4);
    pasted.split('').forEach((char, idx) => {
      if (inputsRef.current[idx]) {
        inputsRef.current[idx]!.value = char;
      }
    });
    if (pasted.length === 4) {
      inputsRef.current[3]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = inputsRef.current.map((input) => input?.value).join('');
    console.log('Entered code:', code);
    navigate('/auth/login'); // Replace with your actual verification logic
  };

  return (
    <>
    <AuthHeader title="Join Us" />
    <div className="flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md mt-8 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <MailCheck className="h-10 w-10 text-gray-600" />
            </div>
          </div>
          <CardTitle className="text-xl">Check your email</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            We sent a verification link to <br />
            <strong>francis@gmail.com</strong>
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <Input
                    key={index}
                    maxLength={1}
                    inputMode="numeric"
                    className="w-14 h-14 text-center text-2xl font-medium border-2 border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg"
                    ref={(el) => void (inputsRef.current[index] = el)}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                  />
                ))}
            </div>
            <div className="flex justify-center items-center">
            <Button
              type="submit"
              className="bg-[#22BBCC] text-white hover:bg-[#22BBCA] w-64" >
              Verify email
            </Button>
            </div>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Didn't receive the email?{' '}
            <button
              type="button"
              className="text-cyan-600 hover:underline"
              onClick={() => {
                // Trigger resend logic here
              }}
            >
              Click to resend
            </button>
          </p>
        </CardContent>
      </Card>
      
      <div className="mt-10 flex justify-center items-center w-full">
            <ArrowLeft className="h-4 w-4 mr-1 text-gray-500" />
            <button
              type="button"
              onClick={() => navigate('/auth/login')}
              className="text-sm text-gray-600 hover:underline"
            >
              Back to log in
            </button>
          </div>
    </div>
    </>
  );
}
