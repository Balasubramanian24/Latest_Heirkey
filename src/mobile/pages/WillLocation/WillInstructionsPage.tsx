import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import Footer from '@/mobile/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
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

const WillInstructionsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get data from Redux store
  const subcategories = useAppSelector(selectSubcategories);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const progressStats = useAppSelector(selectProgressStats);

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
              <div className="mt-6">
                <button
                  onClick={() => navigate('/category/willinstructions/review')}
                  className="w-full bg-[#2BCFD5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#25b6bb] transition-colors"
                >
                  Review All Answers
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WillInstructionsPage;
