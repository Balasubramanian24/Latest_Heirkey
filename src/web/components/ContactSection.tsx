import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactSection() {
    return (
        <div className="max-w-5xl mt-10 mx-auto space-y-12">
            <div className="space-y-10 bg-gray-100 p-10 rounded-lg">
                <h1 className="text-3xl font-bold">Still have questions?</h1>
                <p className="text-gray-700">
                    Can't find the answer you're looking for? Please chat to our friendly
                    team.
                </p>
                <Button className="bg-[#2BCFD5] text-white hover:bg-gray-800">
                    Get in touch
                </Button>
            </div>
            <div className="border-t border-gray-200"></div>
            <div className="flex justify-between items-center max-w-4xl w-full">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Join our newsletter</h2>
                    <p className="text-gray-700">
                    We’ll send you a nice letter once per week. No spam.
                    </p>
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
