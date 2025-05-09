import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import landingImage from '@/assets/mobileimage/global/landingImage.png';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth/get-started');
  };

  return (
    <div className="min-h-screen bg-[#1F4168]">
      <div className="w-full max-w-sm flex flex-col items-center px-4 py-32 mx-auto">
        <h1 className="text-5xl font-bold text-white text-left w-full">Heirkey</h1>
        <h2 className="text-3xl font-semibold text-white text-left w-full mt-2">Lock In your Legacy.</h2>
        <p className="text-base text-white/80 text-left w-full mt-4 mb-8">
          Heirkey is a digital organizational tool for you and your heirs
        </p>

        <Button
          onClick={handleGetStarted}
          className="w-full bg-[#2BCFD5] hover:bg-[#25b6bb] text-white text-lg font-semibold rounded-xl py-4 mb-4 transition-colors"
        >
          Sign Up / Login
        </Button>

        <Button
          variant="outline"
          className="w-full bg-white text-[#2BCFD5] border-2 border-white flex items-center justify-center text-lg font-semibold rounded-xl py-4 mb-8 transition-colors"
        >
          <Play className="h-5 w-5 mr-2" />
          Watch Demo
        </Button>

        <img
          src={landingImage}
          alt="HeirKey Video"
          className="w-full rounded-xl shadow-md object-cover mt-4"
        />
      </div>
    </div>
  );
}
