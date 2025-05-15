import { useState, useEffect } from 'react';
import CategoryReviewPage from '@/mobile/components/category/CategoryReviewPage';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  fetchUserInputs,
  selectUserInputs,
  selectQuestions,
  selectLoading,
  selectError
} from '@/store/slices/homeInstructionsSlice';

// Map subcategory IDs to their routes
const subcategoryRoutes: Record<string, string> = {
  '101': 'pets',
  '102': 'trash',
  '103': 'other',
  '104': 'security',
};

interface Topic {
  id: string;
  title: string;
  subtitle?: string;
  data: string;
  onEdit: () => void;
}

const HomeInstructionsReviewPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categoryName } = useParams<{ categoryName: string }>();
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);

  // Get data from Redux store
  const userInputs = useAppSelector(selectUserInputs);
  const allQuestions = useAppSelector(selectQuestions);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  // Handle navigation to edit a specific question
  const handleEditQuestion = (questionId: string, subcategoryId: string) => {
    const route = subcategoryRoutes[subcategoryId];
    if (route) {
      const basePath = categoryName ? `/category/${categoryName}/${route}` : `/homeinstructions/${route}`;
      navigate(`${basePath}?questionId=${questionId}`);
    }
  };

  // Fetch user inputs when component mounts
  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserInputs(user.id));
    }
  }, [dispatch, user]);

  // Process user inputs when they are loaded
  useEffect(() => {
    if (!user || !user.id) {
      return;
    }

    // Transform the data for the review page
    const allTopics: Topic[] = [];

    // Process all user inputs
    userInputs.forEach((userInput) => {
      const subcategoryId = userInput.originalSubCategoryId;

      // Process each section's answers
      if (userInput.answersBySection && Array.isArray(userInput.answersBySection)) {
        userInput.answersBySection.forEach((section) => {
          if (section.answers && Array.isArray(section.answers)) {
            section.answers.forEach((answer) => {
              const questionId = answer.originalQuestionId;

              // Find the question data from our Redux store
              const subcategoryQuestions = allQuestions[subcategoryId] || [];
              const questionData = subcategoryQuestions.find((q) => q.id === questionId);

              if (questionData) {
                allTopics.push({
                  id: questionId,
                  title: questionData.text,
                  subtitle: `Category: ${subcategoryRoutes[subcategoryId]?.charAt(0).toUpperCase() + subcategoryRoutes[subcategoryId]?.slice(1)}`,
                  data: answer.answer,
                  onEdit: () => handleEditQuestion(questionId, subcategoryId)
                });
              }
            });
          }
        });
      }
    });

    // If we didn't find any answers, use the questions as a template
    if (allTopics.length === 0) {
      // Flatten all questions from all categories
      const allQuestionsFlat = Object.values(allQuestions).flat();

      // Create topics for questions without answers
      allQuestionsFlat.forEach((q: any) => {
        // Find which subcategory this question belongs to
        let subcategoryId = '';
        for (const [id, questions] of Object.entries(allQuestions)) {
          if ((questions as any[]).some((question: any) => question.id === q.id)) {
            subcategoryId = id;
            break;
          }
        }

        if (subcategoryId) {
          allTopics.push({
            id: q.id,
            title: q.text,
            subtitle: `Category: ${subcategoryRoutes[subcategoryId]?.charAt(0).toUpperCase() + subcategoryRoutes[subcategoryId]?.slice(1)}`,
            data: "No answer provided",
            onEdit: () => handleEditQuestion(q.id, subcategoryId)
          });
        }
      });
    }

    setTopics(allTopics);
  }, [userInputs, allQuestions, user, categoryName, navigate]);

  if (loading) {
    return <div className="p-4 text-center">Loading your answers...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <CategoryReviewPage
      categoryTitle="Home Instructions"
      infoTitle="How to edit your information"
      infoDescription="Review the details about your home, life, and essential information. Tap Edit on any item to update it."
      topics={topics}
      onPrint={() => window.print()}
    />
  );
};

export default HomeInstructionsReviewPage;