import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoHeader from "@/assets/webappimage/logo/logoHeader.png";

export default function ContactSection() {
    return (
        <div className="w-auto mt-10 px-4 sm:px-8 space-y-12">
            <div className="flex justify-between items-center bg-gray-100 p-10 rounded-lg">
            <div className="space-y-4 max-w-md">
                <h1 className="text-2xl font-bold">Still have questions?</h1>
                <p className="text-gray-700">
                Can't find the answer you're looking for? Please chat to our friendly team.
                </p>
                <Button className="bg-[#2BCFD5] text-white hover:bg-gray-800">
                Get in touch
                </Button>
            </div>
            <div className="hidden sm:block">
                <img
                src={logoHeader} 
                alt="HeirKey Logo"
                className="h-20 w-auto object-contain"
                />
            </div>
            </div>
        
            <div className="border-t border-gray-200"></div>
        
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-xl font-bold">Join our newsletter</h2>
                <p className="text-gray-700 text-sm">We'll send you a nice letter once per week. No spam.</p>
            </div>
            <div className="flex gap-2">
                <Input
                type="email"
                placeholder="Enter your email"
                className="border-gray-300 focus-visible:ring-gray-400 w-52"
                />
                <Button className="bg-[#2BCFD5] text-white hover:bg-[#2BCFD5]">
                Subscribe
                </Button>
            </div>
            </div>
        
            <div className="border-t border-gray-200"></div>
        </div>
      
    );
}
