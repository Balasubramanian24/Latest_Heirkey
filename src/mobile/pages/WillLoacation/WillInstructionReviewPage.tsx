import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import Footer from '@/mobile/components/layout/Footer';
// import willInstructionsReviewData from '@/data/willInstructionsReview.json'; // Uncomment and use real data

const reviewItems = [
  {
    label: "Will Location",
    value: "Safe deposit box at ABC Bank",
  },
  {
    label: "Executor Name",
    value: "John Doe",
  },
  {
    label: "Witnesses",
    value: "Jane Smith, Bob Johnson",
  },
  // Add more review items as needed
];

const WillInstructionReviewPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GradiantHeader 
        showAvatar={true}
        title="Will Instructions Review"
      />
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-900">
              Review Your Will Instructions
            </h1>
            <p className="text-sm text-gray-600">
              Please review the information below. If you need to make changes, go back to the relevant section.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
            {reviewItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="font-medium text-[#183153]">{item.label}</span>
                <span className="text-sm text-gray-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WillInstructionReviewPage;
