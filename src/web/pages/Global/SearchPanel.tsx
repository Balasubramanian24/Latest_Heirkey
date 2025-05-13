import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SearchPanel() {
    return (
      <div className="bg-[#183153] rounded-xl p-8 w-full">
        <h2 className="text-white text-lg font-semibold mb-2">Search it Here</h2>
        <p className="text-gray-200 text-sm mb-4">
          Can't find a specific information you loaded, search for it below.
        </p>
        <div className="flex mb-6">
          <Input
            type="text"
            className="flex-1 rounded-l-md border-0"
            placeholder="Search..."
          />
          <Button className="bg-[#1ccfc9] hover:bg-[#19bbb5] text-white rounded-l-none">
            Search
          </Button>
        </div>
        <div className="bg-[#223c5a] rounded-lg p-4 mt-4 border border-[#2bcfd5]">
          <h3 className="text-white font-semibold mb-2">Still have questions?</h3>
          <p className="text-gray-200 text-sm mb-4">
            Can't find the answer you're looking for? Please chat to our friendly team.
          </p>
          <Button className="bg-[#1ccfc9] hover:bg-[#19bbb5] text-white w-full">
            Get in touch
          </Button>
        </div>
      </div>
    );
  }