import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryReviewPage from '@/web/components/Category/CategoryReviewPage';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import { useAuth } from '@/contexts/AuthContext';
import homeInstructionsData from '@/data/homeIntsructions.json';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  fetchUserInputs,
  UserInput as ReduxUserInput
} from '../../../../store/slices/homeInstructionsSlice';

// Define interfaces for the data structure
interface Answer {
  index: number;
  questionId?: string;
  originalQuestionId: string;
  question: string;
  type: string;
  answer: string;
}

interface SectionAnswers {
  originalSectionId: string;
  isCompleted: boolean;
  answers: Answer[];
}

interface UserInput {
  userId: string;
  categoryId: string;
  originalCategoryId: string;
  subCategoryId: string;
  originalSubCategoryId: string;
  answersBySection: SectionAnswers[];
}

// Map subcategory IDs to their routes
const subcategoryRoutes: Record<string, string> = {
  '101': '/category/homeinstructions/pets',
  '102': '/category/homeinstructions/trash',
  '103': '/category/homeinstructions/other',
  '104': '/category/homeinstructions/security',
};

// Map question IDs to their subcategory IDs
const questionToSubcategoryMap: Record<string, string> = {};

// Initialize the question to subcategory mapping
Object.entries(homeInstructionsData).forEach(([subcategoryId, questions]) => {
  questions.forEach(question => {
    questionToSubcategoryMap[question.id] = subcategoryId;
  });
});

export default function HomeInstructionsReview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [topics, setTopics] = useState<Array<{
    id: string;
    title: string;
    subtitle?: string;
    data: string;
    onEdit: () => void;
  }>>([]);

  // Get data from Redux store using selectors
  const userInputs = useAppSelector((state: any) => state.homeInstructions.userInputs) as ReduxUserInput[];
  const loading = useAppSelector((state: any) => state.homeInstructions.loading);
  const error = useAppSelector((state: any) => state.homeInstructions.error);

  // Fallback user info if not authenticated
  const userInfo = {
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest',
    email: user?.email || 'guest@example.com',
    avatar: user?.image || avatar
  };

  // Fetch user inputs when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserInputs(user.id));
    }
  }, [dispatch, user]);

  // Process user inputs to create topics for review
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    if (userInputs.length > 0 && !loading) {
      // Transform the data for the review page
      const allTopics: Array<{
        id: string;
        title: string;
        subtitle?: string;
        data: string;
        onEdit: () => void;
      }> = [];

      // Process all user inputs
      userInputs.forEach((userInput: ReduxUserInput) => {
        const subcategoryId = userInput.originalSubCategoryId;

        // Process answers by section
        userInput.answersBySection.forEach((section) => {
          section.answers.forEach((answer) => {
            // Find the original question from our data
            const questionId = answer.originalQuestionId;
            const subcategoryData = homeInstructionsData[subcategoryId as keyof typeof homeInstructionsData];
            const questionData = subcategoryData?.find((q: any) => q.id === questionId);

            if (questionData) {
              allTopics.push({
                id: questionId,
                title: questionData.text,
                subtitle: `Section: ${section.originalSectionId}`,
                data: answer.answer,
                onEdit: () => {
                  // Navigate to the appropriate subcategory page with question ID as a parameter
                  const route = subcategoryRoutes[subcategoryId as keyof typeof subcategoryRoutes];
                  if (route) {
                    navigate(`${route}?questionId=${questionId}`);
                  }
                }
              });
            }
          });
        });
      });

      setTopics(allTopics);
    }
  }, [userInputs, loading, navigate, user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading your answers...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!user?.id) {
    return <div className="flex justify-center items-center h-screen text-red-500">You must be logged in to view your answers</div>;
  }

  return (
    <CategoryReviewPage
      categoryTitle="Home Instructions"
      infoTitle="How to edit your information"
      infoDescription="Now, you are about to enter details about your home, life, and essential information to be passed on to your family members. Each section has several questions. Fill out as much as you can/like. You can always come back to fill out more information later."
      topics={topics}
      user={userInfo}
      onPrint={() => window.print()}
    />
  );
}