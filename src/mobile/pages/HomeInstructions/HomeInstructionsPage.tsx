import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import homeInstructionsData from '@/data/homeIntsructions.json';
import Footer from '@/mobile/components/layout/Footer';

interface SubCategory {
  id: string;
  title: string;
  questionsCount: number;
}

const subcategories: SubCategory[] = [
  {
    id: '101',
    title: 'Pets',
    questionsCount: homeInstructionsData['101']?.length || 0
  },
  {
    id: '102',
    title: 'Trash',
    questionsCount: homeInstructionsData['102']?.length || 0
  },
  {
    id: '103',
    title: 'Other',
    questionsCount: homeInstructionsData['103']?.length || 0
  },
  {
    id: '104',
    title: 'Security',
    questionsCount: homeInstructionsData['104']?.length || 0
  }
];

const SubCategoryCard = ({ subcategory }: { subcategory: SubCategory }) => {
  const navigate = useNavigate();
  const completedQuestions = 0;
  const completionPercentage = subcategory.questionsCount > 0 
    ? Math.round((completedQuestions / subcategory.questionsCount) * 100) 
    : 0;

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate(`/home-instructions/${subcategory.title.toLowerCase()}`)}
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

const HomeInstructionsPage = () => {
 
 return (
    <div className="min-h-screen bg-gray-50">
      <GradiantHeader title="Home Instructions" />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-900">
              Select a Category
            </h1>
            <p className="text-sm text-gray-600">
              Choose a category to add or update your home instructions
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

export default HomeInstructionsPage; 