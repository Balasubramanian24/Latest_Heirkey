import { useState } from "react";
import WebLayout from "@/web/components/Layout/WebLayout";
import Footer from "@/web/components/Layout/Footer";
import Register from "@/web/pages/AuthPages/WebRegister";
import Login from "@/web/pages/AuthPages/WebLogin";
import LoginImage from "@/assets/webappimage/AuthImages/LoginImage.jpg";

interface AuthFormProps {
  initialMode?: 'register' | 'login';
}

export default function WebAuthForm({ initialMode = 'register' }: AuthFormProps) {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');

  return (
    <WebLayout subHeaderTitle={isRegister ? "Sign Up" : "Login"}>
      <div className="flex-grow flex flex-col md:flex-row items-stretch justify-center md:px-20 gap-12 bg-white py-8">
        <div className="w-full md:w-1/2 max-w-md flex flex-col justify-center">
          <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 min-h-[500px] flex flex-col justify-center">
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setIsRegister(true)}
                className={`w-1/2 py-2 font-medium text-sm rounded-l-md border transition-colors duration-200 ${
                  isRegister
                    ? "bg-white border-b-2 border-[#2BCFD5]"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                Sign up
              </button>
              <button
                onClick={() => setIsRegister(false)}
                className={`w-1/2 py-2 font-medium text-sm rounded-r-md border transition-colors duration-200 ${
                  !isRegister
                    ? "bg-white border-b-2 border-[#2BCFD5]"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                Log in
              </button>
            </div>

            {isRegister ? <Register /> : <Login />}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative w-full max-w-[500px] aspect-[3/4]">
            <img
              src={LoginImage}
              alt="Smiling elderly couple"
              className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg shadow-gray-400 transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
      <Footer />
    </WebLayout>
  );
} 