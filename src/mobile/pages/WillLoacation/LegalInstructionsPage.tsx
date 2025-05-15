import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import Footer from '@/mobile/components/layout/Footer';
// import legalInstructionsData from '@/data/legalInstructions.json'; // Uncomment and use real data

interface SubCategory {
  id: string;
  title: string;
  questionsCount: number;
}

// Example subcategories, replace with your real data
const subcategories: SubCategory[] = [
  {
    id: 'legal-1',
    title: 'Executor Details',
    questionsCount: 4, // replace with real count
  },
  {
    id: 'legal-2',
    title: 'Witness Information',
    questionsCount: 2, // replace with real count
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
      onClick={() => navigate(`/category/willinstructions/legal/${subcategory.title.toLowerCase().replace(/\s/g, '')}`)}
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

const LegalInstructionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <GradiantHeader 
        showAvatar={true}
        title="Legal Instructions"
      />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-900">
              Select a Legal Category
            </h1>
            <p className="text-sm text-gray-600">
              Choose a legal category to add or update your will's legal instructions
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

export default LegalInstructionsPage;
