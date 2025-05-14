import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryReviewPage from '@/web/components/Category/CategoryReviewPage';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import { useAuth } from '@/contexts/AuthContext';
import userInputService from '@/services/userInputService';
import homeInstructionsData from '@/data/homeIntsructions.json';

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
  const [topics, setTopics] = useState<Array<{
    id: string;
    title: string;
    subtitle?: string;
    data: string;
    onEdit: () => void;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback user info if not authenticated
  const userInfo = {
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest',
    email: user?.email || 'guest@example.com',
    avatar: user?.image || avatar
  };

  useEffect(() => {
    const fetchUserAnswers = async () => {
      if (!user || !user.id) {
        setError('You must be logged in to view your answers');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch user inputs for the Home Instructions category (ID: 1)
        const userInputsResponse = await userInputService.getUserInputsByUserAndCategory(user.id, '1');
        const userInputs = userInputsResponse as Array<{
          originalSubCategoryId: string;
          answersBySection: Array<{
            originalSectionId: string;
            answers: Array<{
              originalQuestionId: string;
              answer: string;
            }>;
          }>;
        }>;

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
          const subcategoryId = userInput.originalSubCategoryId;

          // Process answers by section
          userInput.answersBySection.forEach((section) => {
            section.answers.forEach((answer) => {
              // Find the original question from our data
              const questionId = answer.originalQuestionId;
              const subcategoryData = homeInstructionsData[subcategoryId as keyof typeof homeInstructionsData];
              const questionData = subcategoryData?.find(q => q.id === questionId);

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
      } catch (err) {
        console.error('Error fetching user answers:', err);
        setError('Failed to load your answers. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAnswers();
  }, [user, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading your answers...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
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