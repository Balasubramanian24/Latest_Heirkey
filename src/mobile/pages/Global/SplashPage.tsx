import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import AuthHeader from "@/mobile/components/header/gradiantHeader";

export default function SplashPage() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left panel */}
                    <AuthHeader title="Join Us" />

                {/* Desktop description */}
                <div className="hidden md:flex flex-col justify-center px-10 py-16 h-full mt-10">
                    <h2 className="text-4xl font-semibold mb-8 leading-snug">
                        Protect your legacy,<br />get started in just 5 minutes.
                    </h2>
                    <ul className="space-y-5 text-lg">
                        {["30-day free trial", "Personalized onboarding", "Access to all features"].map((item, idx) => (
                            <li key={idx} className="flex items-center">
                                <CheckCircle className="text-white w-6 h-6 mr-3" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

            {/* Mobile description */}
            <div className="md:hidden bg-white px-6 py-8">
                <h2 className="text-2xl font-semibold text-left mb-6 leading-snug">
                    Protect your legacy,<br />get started in just 5 minutes.
                </h2>
                <ul className="space-y-4 text-left text-gray-700 text-base">
                    {["30-day free trial", "Personalized onboarding", "Access to all features"].map((item, idx) => (
                        <li key={idx} className="flex items-center">
                            <CheckCircle className="text-[#2BCFD5] w-5 h-5 mr-3" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right panel: common for all screens */}
            <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center px-6 py-10 md:py-20">
                <div className="w-full max-w-sm space-y-6">
                    <Link to="/auth/register">
                        <button className="w-full bg-[#2BCFD5] hover:bg-[#25b6bb] text-white text-lg font-semibold rounded-lg transition px-6 py-4">
                            Get started
                        </button>
                    </Link>
                    <Link to="/learn-more">
                        <button className="w-full border border-gray-300 text-gray-800 text-lg font-semibold rounded-lg hover:bg-gray-100 transition px-6 py-4 mt-4">
                            Learn more
                        </button>
                    </Link>
                </div>

                <p className="text-base text-gray-600 mt-6">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="text-[#2BCFD5] hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
