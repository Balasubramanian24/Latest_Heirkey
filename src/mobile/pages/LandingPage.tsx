import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import landingImage from '@/assets/mobileimage/global/landingImage.png';
import { useNavigate } from 'react-router-dom';
import HeirkeyVideo from "@/assets/heirkeyvideo/HeirkeyVideo.mp4"
import { useState, useRef, useEffect } from 'react';
import Header from '@/mobile/components/layout/Header';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/auth/get-started');
  };

  const handleWatchDemo = () => {
    if (showVideo) {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    } else {
      setShowVideo(true);
      setIsPlaying(true);
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F4168]">
      <Header
        isLandingPage={true}
        isAuthenticated={false}
        showAuthButtons={true}
        user={null}
        handleLogout={() => {}}
      />
      <div className="w-full flex flex-col items-center px-4 py-32 mx-auto">
        <h1 className="text-5xl font-bold text-white text-left w-full">Heirkey</h1>
        <h2 className="text-3xl font-semibold text-white text-left w-full mt-2">Lock In your Legacy.</h2>
        <p className="text-lg text-white/80 text-left w-full mt-4 mb-8">
          Heirkey is a digital organizational tool for you and your heirs
        </p>

        <Button
          onClick={handleGetStarted}
          className="w-full h-5 bg-[#2BCFD5] hover:bg-[#25b6bb] text-white text-lg font-semibold rounded-lg py-6 mb-4 transition-colors"
        >
          Sign Up / Login
        </Button>

        <Button
          variant="outline"
          onClick={handleWatchDemo}
          className="w-full h-5 bg-white text-[#2BCFD5] border-2 border-white flex items-center justify-center text-lg font-semibold rounded-lg py-6 mb-8 transition-colors"
        >
          {showVideo ? (
            isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />
          ) : (
            <Play className="h-5 w-5 mr-2" />
          )}
          {showVideo ? (isPlaying ? 'Pause Video' : 'Play Video') : 'Watch Demo'}
        </Button>

        {showVideo ? (
          <video
            ref={videoRef}
            src={HeirkeyVideo}
            autoPlay
            onClick={handleVideoClick}
            className="w-full h-[400px] rounded-lg shadow-md object-cover mt-4 cursor-pointer"
          />
        ) : (
          <img
            src={landingImage}
            alt="Heirkey Demo"
            className="w-full h-[400px] rounded-lg shadow-md object-cover mt-4"
          />
        )}
      </div>
    </div>
  );
}
