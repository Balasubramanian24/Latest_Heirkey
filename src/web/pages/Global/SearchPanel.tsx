export default function SearchPanel() {
    return (
      <div className="bg-[#183153] rounded-xl p-8 w-full max-w-sm mx-auto">
        <h2 className="text-white text-lg font-semibold mb-2">Search it Here</h2>
        <p className="text-gray-200 text-sm mb-4">
          Can't find a specific information you loaded, search for it below.
        </p>
        <div className="flex mb-6">
          <input
            type="text"
            className="flex-1 rounded-l-md px-3 py-2 text-sm"
            placeholder="Search..."
          />
          <button className="bg-[#1ccfc9] text-white px-4 py-2 rounded-r-md text-sm font-medium">
            Search
          </button>
        </div>
        <div className="bg-[#223c5a] rounded-lg p-4 mt-4 border border-[#2bcfd5]">
          <h3 className="text-white font-semibold mb-2">Still have questions?</h3>
          <p className="text-gray-200 text-sm mb-4">
            Can't find the answer you're looking for? Please chat to our friendly team.
          </p>
          <button className="bg-[#1ccfc9] text-white px-4 py-2 rounded-md text-sm font-medium">
            Get in touch
          </button>
        </div>
      </div>
    );
  }