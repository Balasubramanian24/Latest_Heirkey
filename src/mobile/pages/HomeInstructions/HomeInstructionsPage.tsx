import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import Footer from '@/mobile/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  fetchUserInputs,
  SubCategory,
  selectSubcategories,
  selectUserInputs,
  selectLoading,
  selectError
} from '@/store/slices/homeInstructionsSlice';

const SubCategoryCard = ({ subcategory }: { subcategory: SubCategory }) => {
  const navigate = useNavigate();
  const userInputs = useAppSelector(selectUserInputs);

  // Calculate completed questions for this subcategory
  const completedQuestions = userInputs.reduce((count, input) => {
    if (input.originalSubCategoryId === subcategory.id) {
      return count + input.answersBySection.reduce(
        (sectionCount, section) => sectionCount + section.answers.length, 0
      );
    }
    return count;
  }, 0);

  const completionPercentage = subcategory.questionsCount > 0
    ? Math.round((completedQuestions / subcategory.questionsCount) * 100)
    : 0;

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate(`/category/homeinstructions/${subcategory.title.toLowerCase()}`)}
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
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const subcategories = useAppSelector(selectSubcategories);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  // Fetch user inputs when component mounts
  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserInputs(user.id));
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GradiantHeader title="Home Instructions" />
        <div className="container mx-auto px-4 py-6 text-center">
          Loading your home instructions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GradiantHeader title="Home Instructions" />
        <div className="container mx-auto px-4 py-6 text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

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