import { Button } from "@/components/ui/button"; 
import { FcGoogle } from "react-icons/fc";


export default function WebRegister() {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          className="w-full mt-1 p-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mt-1 p-2 border rounded-md text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Create a password"
          className="w-full mt-1 p-2 border rounded-md text-sm"
        />
      </div>

      <Button className="w-full bg-[#2BCFD5] hover:bg-[#25b6ba] text-white text-sm">
        Get started
      </Button>

      <button
        type="button"
        className="w-full mt-2 border text-sm py-2 rounded-md flex justify-center items-center gap-2"
      >
        <FcGoogle className="inline-block w-4 h-4" /> Sign up with Google
      </button>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <span className="text-[#2BCFD5] cursor-pointer">Log in</span>
      </p>
    </form>
  );
}
