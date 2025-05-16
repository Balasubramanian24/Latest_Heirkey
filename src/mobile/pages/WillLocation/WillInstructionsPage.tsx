import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import Footer from '@/mobile/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
// import { categoryTabsConfig } from '@/data/categoryTabsConfig';
import {
  fetchUserInputs,
  selectSubcategories,
  selectUserInputs,
  selectLoading,
  selectError,
  selectProgressStats
} from '@/store/slices/willInstructionsSlice';

interface SubCategory {
  id: string;
  title: string;
  questionsCount: number;
}

// Subcategories will be loaded from Redux

const SubCategoryCard = ({ subcategory }: { subcategory: SubCategory }) => {
  const navigate = useNavigate();
  const userInputs = useAppSelector(selectUserInputs);

  // Calculate completed questions for this subcategory
  const subcategoryInputs = userInputs.filter(input =>
    input.originalSubCategoryId === subcategory.id
  );

  // Count total answered questions in this subcategory
  const completedQuestions = subcategoryInputs.reduce((total, input) => {
    return total + input.answersBySection.reduce((sectionTotal, section) => {
      return sectionTotal + section.answers.length;
    }, 0);
  }, 0);

  // Calculate completion percentage
  const completionPercentage = subcategory.questionsCount > 0
    ? Math.round((completedQuestions / subcategory.questionsCount) * 100)
    : 0;

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate(`/category/willinstructions/${subcategory.title.toLowerCase()}`)}
    >
      <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
        <CardContent className="p-2">
          <div className="flex justify-between items-center mb-2 mt-1">
            <h3 className="text-lg font-semibold text-[#183153]">
              {subcategory.title}
            </h3>
            <span className="text-sm text-[#2BCFD5] font-medium">
              {completedQuestions}/{subcategory.questionsCount}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const WillInstructionsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { category } = useParams();

  // Get data from Redux store
  const subcategories = useAppSelector(selectSubcategories);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const progressStats = useAppSelector(selectProgressStats);

  // Get tabs for willinstructions
 // const tabs = categoryTabsConfig.willinstructions;

  // Fetch user inputs when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserInputs(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <GradiantHeader
        showAvatar={true}
        title="Will Instructions"
      />
      <div className="container mx-auto px-4 py-6">

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="text-base font-bold text-[#8B5CF6] mb-2">Understanding Topics</h2>
          <p className="text-sm text-gray-600">
            Each topic below is a part of your home documents, with questions to help you provide important information for you and your loved ones. Click any topic to answer the questions at your own pace—we'll save everything for you.
          </p>
        </div>

        {/* Tabs Navigation */}
        {/* <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${category === tab.path.split('/').pop() 
                  ? 'bg-[#2BCFD5] text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              {tab.label}
            </button>
          ))}
        </div> */}

        <div className="max-w-md mx-auto space-y-6">
          {/* Show error message if any */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Show loading indicator */}
          {loading ? (
            <div className="flex justify-center my-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#2BCFD5]" />
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {subcategories.map((subcategory) => (
                  <SubCategoryCard
                    key={subcategory.id}
                    subcategory={subcategory}
                  />
                ))}
              </div>

              {/* Review button */}
              {/* <div className="mt-6">
                <button
                  onClick={() => navigate('/category/willinstructions/review')}
                  className="w-full bg-[#2BCFD5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#25b6bb] transition-colors"
                >
                  Review All Answers
                </button>
              </div> */}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WillInstructionsPage;
