import { Button } from "@/components/ui/button";
import logoHeader from "@/assets/webappimage/logo/logoHeader.png";
import { Link } from "react-router-dom";

export default function LandingHeader() {
  return (
    <header className="bg-[#1F4168] text-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center h-20 justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/">
            <img src={logoHeader} alt="Heirkey Logo" className="h-12 w-auto" />
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/about" className="hover:underline font-medium">About</Link>
            <div className="relative group">
              <span className="hover:underline font-medium cursor-pointer">Plans</span>
            </div>
            <div className="relative group">
              <span className="hover:underline font-medium cursor-pointer">Blog</span>
            </div>
            <Link to="/contact" className="hover:underline font-medium">Contact</Link>
          </nav>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="bg-white text-[#1F4168] hover:bg-gray-200 font-medium">Directory</Button>
          <Button variant="secondary" className="bg-[#2BCFD5] text-white hover:bg-[#2BCFD5] font-medium">Dashboard</Button>
        </div>
      </div>
    </header>
  );
} 