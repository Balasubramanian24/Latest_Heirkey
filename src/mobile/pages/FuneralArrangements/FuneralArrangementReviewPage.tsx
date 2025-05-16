import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import { categoryTabsConfig } from '@/data/categoryTabsConfig';
import CategoryReviewPage from '@/mobile/components/category/CategoryReviewPage';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  fetchUserInputs,
  selectUserInputs,
  selectQuestions,
  selectLoading,
  selectError
} from '@/store/slices/funeralArrangementsSlice';

// Map subcategory IDs to their routes
const subcategoryRoutes: Record<string, string> = {
  '205A': 'details',
  '205B': 'ceremonylocation',
  '205C': 'clergy',
  '205D': 'notification',
  '205E': 'proceedings',
};

interface Topic {
  id: string;
  title: string;
  subtitle?: string;
  data: string;
  onEdit: () => void;
}

export default function FuneralArrangementReviewPage() {
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
      // Always use the /category prefix for consistent routing
      const basePath = `/category/${categoryName || 'funeralarrangements'}/${route}`;
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

    // Debug logging
    console.log('User inputs:', userInputs);
    console.log('All questions:', allQuestions);

    // Transform the data for the review page
    const allTopics: Topic[] = [];

    // Process all user inputs
    userInputs.forEach((userInput) => {
      const subcategoryId = userInput.originalSubCategoryId;
      console.log('Processing userInput with subcategoryId:', subcategoryId, userInput);

      // Process each section's answers
      if (userInput.answersBySection && Array.isArray(userInput.answersBySection)) {
        userInput.answersBySection.forEach((section) => {
          if (section.answers && Array.isArray(section.answers)) {
            console.log('Processing section answers:', section.answers);
            section.answers.forEach((answer) => {
              const questionId = answer.originalQuestionId;
              console.log('Processing answer:', answer);

              // Find the question data from our Redux store
              // For funeral arrangements, all questions are stored under '205' key
              const subcategoryQuestions = allQuestions['205'] || [];
              const questionData = subcategoryQuestions.find((q) => q.id === questionId);

              if (questionData) {
                allTopics.push({
                  id: questionId,
                  title: questionData.text,
                  subtitle: `Category: ${getSubcategoryName(subcategoryId)}`,
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
      // For funeral arrangements, all questions are stored under '205' key
      const allQuestionsFlat = allQuestions['205'] || [];

      // Create topics for questions without answers
      allQuestionsFlat.forEach((q: any) => {
        // Get the subcategory ID from the question's sectionId
        const subcategoryId = q.sectionId;

        if (subcategoryId) {
          allTopics.push({
            id: q.id,
            title: q.text,
            subtitle: `Category: ${getSubcategoryName(subcategoryId)}`,
            data: "No answer provided",
            onEdit: () => handleEditQuestion(q.id, subcategoryId)
          });
        }
      });

      // If still no topics (e.g., no questions defined), fall back to section-based display
      if (allTopics.length === 0) {
        categoryTabsConfig.funeralarrangements.forEach((section) => {
          const subcategoryId = getSubcategoryIdFromLabel(section.label);
          if (subcategoryId) {
            allTopics.push({
              id: subcategoryId,
              title: section.label,
              subtitle: 'No answers provided yet',
              data: 'Click edit to add your information',
              onEdit: () => navigate(section.path)
            });
          }
        });
      }
    }

    setTopics(allTopics);
  }, [userInputs, allQuestions, user, categoryName, navigate]);

  // Helper function to get subcategory name from ID
  const getSubcategoryName = (subcategoryId: string): string => {
    switch (subcategoryId) {
      case '205A': return 'Details';
      case '205B': return 'Ceremony Location';
      case '205C': return 'Clergy';
      case '205D': return 'Notifications';
      case '205E': return 'Proceedings';
      default: return 'Unknown';
    }
  };

  // Helper function to get subcategory ID from label
  const getSubcategoryIdFromLabel = (label: string): string | null => {
    switch (label) {
      case 'Details': return '205A';
      case 'Ceremony Location': return '205B';
      case 'Clergy': return '205C';
      case 'Notifications': return '205D';
      case 'Proceedings': return '205E';
      default: return null;
    }
  };

  if (loading) {
    return (
      <>
        <GradiantHeader title="Funeral Arrangements Review" showAvatar={true} />
        <div className="p-4 text-center">Loading your answers...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <GradiantHeader title="Funeral Arrangements Review" showAvatar={true} />
        <div className="p-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  return (
    <CategoryReviewPage
      categoryTitle="Funeral Arrangements"
      infoTitle="How to edit your information"
      infoDescription="Review the details about your funeral arrangements. Tap Edit on any item to update it."
      topics={topics}
      onPrint={() => window.print()}
    />
  );
}