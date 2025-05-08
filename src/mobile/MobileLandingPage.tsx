import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';


export default function MobileLandingPage() {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/splash');
  };
  
  return (
    <div className="bg-[#1F4168] text-white min-h-screen flex flex-col justify-between px-4 md:px-12 py-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between flex-1 min-h-screen">
        <div className="text-center md:text-left md:max-w-lg space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold text-left">Heirkey</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-left">Lock In your Legacy.</h2>
          <p className="text-md md:text-base text-gray-200 text-left">
            Heirkey is a digital organizational tool for you and your heirs
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center md:justify-start">
            <Button
              onClick={handleGetStarted}
              className="bg-[#2BCFD5] text-white text-lg px-6 py-6 rounded-xl"
            >
              Sign Up / Login
            </Button>
            <Button className="bg-white text-[#2BCFD5] border-white text-lg px-6 py-6 rounded-xl flex items-center gap-2">
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="mt-8 md:mt-0 md:max-w-md">
          <img
            alt="HeirKey Video Image"
            className="w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}