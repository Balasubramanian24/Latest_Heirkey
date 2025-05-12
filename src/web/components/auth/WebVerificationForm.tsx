import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MailCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/web/components/Layout/AppHeader';
import Footer from '../Layout/Footer';
import WebLayout from '../Layout/WebLayout';

export default function VerificationForm() {
  const navigate = useNavigate();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;
    e.target.value = value;
    if (value && index < 3) inputsRef.current[index + 1]?.focus();
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
    if (pasted.length === 4) inputsRef.current[3]?.focus();
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = inputsRef.current.map((input) => input?.value).join('');
    console.log('Entered code:', code);
    navigate('/auth/login');
  };

  return (
    <WebLayout subHeaderTitle="Verify Email">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-xl shadow-md py-4 mb-8 max-w-md w-full space-y-8">
            <div className="flex justify-center">
              <div className="bg-gray-100 p-4 rounded-full">
                <MailCheck className="h-12 w-12 text-gray-600" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Check your email</h2>
              <p className="text-lg text-gray-600 mb-8">
                We sent a verification link to <br />
                <strong>francis@gmail.com</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-4 mb-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Input
                    key={index}
                    maxLength={1}
                    inputMode="numeric"
                    className="w-16 h-16 font-bold text-[#22BBCC] text-center text-3xl rounded-lg border-2 border-[#22BBCC] focus:ring-2 focus:ring-purple-500"
                    ref={(el) => {
                      if (el) {
                        inputsRef.current[index] = el;
                      }
                    }}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-48 h-12 text-lg bg-[#22BBCC] text-white hover:bg-[#22BBCA] transition-colors duration-200"
                >
                  Verify email
                </Button>
              </div>
            </form>

            <div className="text-center text-sm text-gray-600">
              Didn’t receive the email?{' '}
              <button
                type="button"
                className="text-cyan-600 hover:text-cyan-700 hover:underline font-medium"
                onClick={() => {
                }}
              >
                Click to resend
              </button>
            </div>

            <div className="flex justify-center items-center">
              <ArrowLeft className="h-5 w-5 mr-2 text-gray-500" />
              <button
                type="button"
                onClick={() => navigate('/auth/login')}
                className="text-sm text-gray-600 hover:text-gray-800 hover:underline font-medium"
              >
                Back to log in
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </WebLayout>
  );
}
