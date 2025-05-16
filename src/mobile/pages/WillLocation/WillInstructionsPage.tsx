import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import Footer from '@/mobile/components/layout/Footer';
// import willInstructionsData from '@/data/willInstructions.json'; // Uncomment and use real data

interface SubCategory {
  id: string;
  title: string;
  questionsCount: number;
}

// Example subcategories, replace with your real data
const subcategories: SubCategory[] = [
  {
    id: '105-location',
    title: 'Location',
    questionsCount: 2, // replace with real count
  },
  {
    id: '105-legal',
    title: 'Legal',
    questionsCount: 1, // replace with real count
  }
];

const SubCategoryCard = ({
  subcategory,
  isActive,
  onClick,
  completedQuestions
}: {
  subcategory: SubCategory;
  isActive: boolean;
  onClick: () => void;
  completedQuestions: number;
}) => (
  <div
    className="cursor-pointer"
    onClick={onClick}
  >
    <Card className={
      "rounded-xl shadow-sm border transition-all " +
      (isActive
        ? "border-[#2BCFD5] bg-white"
        : "border-gray-200 bg-gray-50")
    }>
      <CardContent className="p-4 flex justify-between items-center">
        <span className="text-base font-medium text-gray-900">{subcategory.title}</span>
        <span className="text-xs text-gray-500">
          {completedQuestions}/{subcategory.questionsCount} questions
        </span>
      </CardContent>
    </Card>
  </div>
);

const WillInstructionsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <GradiantHeader showAvatar={true} title="Will & Testament" />
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Understanding Topics Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="text-base font-bold text-[#8B5CF6] mb-2">Understanding Topics</h2>
          <p className="text-sm text-gray-600">
            Each topic below is a part of your home documents, with questions to help you provide important information for you and your loved ones. Click any topic to answer the questions at your own pace—we'll save everything for you.
          </p>
        </div>
        <div className="space-y-3">
          {subcategories.map((subcategory) => {
            const completedQuestions = 0; // Replace with real completion logic
            const isActive = activeTab === subcategory.id;
            return (
              <SubCategoryCard
                key={subcategory.id}
                subcategory={subcategory}
                isActive={isActive}
                completedQuestions={completedQuestions}
                onClick={() => {
                  setActiveTab(subcategory.id);
                  navigate(`/category/willinstructions/${subcategory.title.toLowerCase()}`);
                }}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WillInstructionsPage;
