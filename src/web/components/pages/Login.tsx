import { Button } from "@/components/ui/button"; 
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  return (
    <form className="space-y-4">
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
          placeholder="Enter your password"
          className="w-full mt-1 p-2 border rounded-md text-sm"
        />
      </div>

      <Button className="w-full bg-[#2BCFD5] hover:bg-[#25b6ba] text-white text-sm">
        Log in
      </Button>

      <button
        type="button"
        className="w-full mt-2 border text-sm py-2 rounded-md flex justify-center items-center gap-2"
      >
       <FcGoogle className="inline-block w-4 h-4" /> Log in with Google
      </button>

      <p className="text-center text-sm mt-4">
        Don't have an account?{" "}
        <span className="text-[#2BCFD5] cursor-pointer">Sign up</span>
      </p>
    </form>
  );
}
