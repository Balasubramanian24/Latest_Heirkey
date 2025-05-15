import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryReviewPage from '@/web/components/Category/CategoryReviewPage';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import { useAuth } from '@/contexts/AuthContext';
import funeralArrangementsData from '@/data/funeralArrangements.json';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  fetchUserInputs,
  selectUserInputs,
  selectLoading,
  selectError
} from '@/store/slices/funeralArrangementsSlice';

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

// Map section IDs to their routes (update as needed)
const sectionRoutes: Record<string, string> = {
  '205A': '/category/funeralarrangements/details',
  '205B': '/category/funeralarrangements/ceremonylocation',
  '205C': '/category/funeralarrangements/clergy',
  '205D': '/category/funeralarrangements/notification',
  '205E': '/category/funeralarrangements/proceedings',
};

// Map question IDs to their section IDs
const questionToSectionMap: Record<string, string> = {};

// Initialize the question to section mapping
Object.entries(funeralArrangementsData).forEach(([categoryId, questions]) => {
  questions.forEach((question: any) => {
    if (question.sectionId) {
      questionToSectionMap[question.id] = question.sectionId;
    }
  });
});

export default function FuneralArrangementReview() {
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

  // Get data from Redux store
  const userInputs = useAppSelector(selectUserInputs);
  const isLoading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  // Fallback user info if not authenticated
  const userInfo = {
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest',
    email: user?.email || 'guest@example.com',
    avatar: user?.image || avatar
  };

  // Fetch user inputs when component mounts
  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserInputs(user.id));
    }
  }, [dispatch, user]);

  // Process user inputs to create topics for review page
  useEffect(() => {
    if (!isLoading && userInputs.length > 0) {
      // Transform the data for the review page
      const allTopics: Array<{
        id: string;
        title: string;
        subtitle?: string;
        data: string;
        onEdit: () => void;
      }> = [];

      // Process all user inputs
      userInputs.forEach((userInput) => {
        userInput.answersBySection.forEach((section) => {
          section.answers.forEach((answer) => {
            // Find the original question from our data
            const questionId = answer.originalQuestionId;
            const allQuestions = funeralArrangementsData['205'];
            const questionData = allQuestions?.find((q: any) => q.id === questionId);
            const sectionKey = questionToSectionMap[questionId];
            if (questionData) {
              allTopics.push({
                id: questionId,
                title: questionData.text,
                subtitle: `Section: ${section.originalSectionId}`,
                data: answer.answer,
                onEdit: () => {
                  // Navigate to the appropriate section page with question ID as a parameter
                  const route = sectionRoutes[sectionKey];
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
  }, [userInputs, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading your answers...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!user || !user.id) {
    return <div className="flex justify-center items-center h-screen text-red-500">You must be logged in to view your answers</div>;
  }

  if (userInputs.length === 0 && !isLoading) {
    return <div className="flex justify-center items-center h-screen">No funeral arrangement answers found. Please complete some questions first.</div>;
  }

  return (
    <CategoryReviewPage
      categoryTitle="Funeral Arrangements"
      infoTitle="How to edit your information"
      infoDescription="Now, you are about to enter details about your funeral arrangements, preferences, and essential information to be passed on to your family members. Each section has several questions. Fill out as much as you can/like. You can always come back to fill out more information later."
      topics={topics}
      user={userInfo}
      onPrint={() => window.print()}
    />
  );
}
