import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
// import your location instructions data here
// import locationInstructionsData from '@/data/locationInstructions.json';
import Footer from '@/mobile/components/layout/Footer';

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
    questionsCount: 5, // replace with real count
  },
  {
    id: '105-legal',
    title: 'Legal',
    questionsCount: 3, // replace with real count
  }
];

const SubCategoryCard = ({ subcategory }: { subcategory: SubCategory }) => {
  const navigate = useNavigate();
  const completedQuestions = 0; // Replace with real completion logic
  const completionPercentage = subcategory.questionsCount > 0 
    ? Math.round((completedQuestions / subcategory.questionsCount) * 100) 
    : 0;

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate(`/category/willinstructions/${subcategory.title.toLowerCase()}`)}
    >
      <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-[#183153]">
              {subcategory.title}
            </h3>
            <span className="text-sm text-[#2BCFD5] font-medium">
              {completedQuestions}/{subcategory.questionsCount}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              {completionPercentage}% Complete
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LocationInstrucationsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <GradiantHeader 
        showAvatar={true}
        title="Will Location"
      />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-900">
              Select a Category
            </h1>
            <p className="text-sm text-gray-600">
              Choose a category to add or update your will location instructions
            </p>
          </div>
          <div className="space-y-4">
            {subcategories.map((subcategory) => (
              <SubCategoryCard 
                key={subcategory.id} 
                subcategory={subcategory} 
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LocationInstrucationsPage;
