import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import Footer from '@/mobile/components/layout/Footer';
import willInstructionsData from "@/data/willInstructions.json";

// Mock answers for demonstration; replace with real data as needed
const mockAnswers: Record<string, string> = {
  w1: "Yes",
  w2: "No",
  w3: "Safe deposit box at ABC Bank",
  w4: "Living room drawer",
  w5: "Yes",
  w6: "Attorney Smith, 555-1234",
};

const getReviewItems = () => {
  // Flatten all location and legal questions
  const questions = (willInstructionsData["105"] || []).filter(
    q => ["105A", "105B", "105C"].includes(q.sectionId)
  );
  return questions.map(q => ({
    label: q.text,
    value: mockAnswers[q.id] || "No answer provided",
  }));
};

const WillInstructionReviewPage = () => {
  const reviewItems = getReviewItems();

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
