import { useState } from "react";
import Header from "@/web/components/Layout/Header";
import Footer from "@/web/components/Layout/Footer";
import Register from "@/web/pages/AuthPages/WebRegister";
import Login from "@/web/pages/AuthPages/WebLogin";
import LoginImage from "@/assets/webappimage/AuthImages/LoginImage.jpg";

export default function WebRegisterForm() {
  const [isRegister, setIsRegister] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="flex-grow flex flex-col md:flex-row items-center justify-center md:px-20 py-24 gap-12 bg-white">
        <div className="w-full md:w-1/2 max-w-md">
          <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setIsRegister(true)}
                className={`w-1/2 py-2 font-medium text-sm rounded-l-md border ${
                  isRegister
                    ? "bg-white border-b-2 border-[#2BCFD5]"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                Sign up
              </button>
              <button
                onClick={() => setIsRegister(false)}
                className={`w-1/2 py-2 font-medium text-sm rounded-r-md border ${
                  !isRegister
                    ? "bg-white border-b-2 border-[#2BCFD5]"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                Log in
              </button>
            </div>

            {isRegister ? <Register /> : <Login />}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={LoginImage}
            alt="Smiling elderly couple"
            className="object-cover max-w-[400px] shadow-lg"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
} 