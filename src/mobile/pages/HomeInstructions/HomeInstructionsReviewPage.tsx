import { useState, useEffect } from 'react';
import CategoryReviewPage from '@/mobile/components/category/CategoryReviewPage';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import questionsData from '@/data/homeIntsructions.json';
import { useAuth } from '@/contexts/AuthContext';
import userInputService from '@/services/userInputService';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const navigate = useNavigate();
  const { categoryName } = useParams<{ categoryName: string }>();
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User info with fallbacks for missing data
  const userInfo = {
    name: user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : 'Guest User',
    email: user?.email || 'guest@example.com',
    avatar: avatar, // Always use the default avatar for simplicity
  };

  // Handle navigation to edit a specific question
  const handleEditQuestion = (questionId: string, subcategoryId: string) => {
    const route = subcategoryRoutes[subcategoryId];
    if (route) {
      const basePath = categoryName ? `/category/${categoryName}/${route}` : `/homeinstructions/${route}`;
      navigate(`${basePath}?questionId=${questionId}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!user || !user.id) {
          setError('You must be logged in to view your answers');
          setLoading(false);
          return;
        }

        // Fetch user inputs for the Home Instructions category (ID: 1)
        const userInputsResponse = await userInputService.getUserInputsByUserAndCategory(user.id, '1');

        if (!Array.isArray(userInputsResponse) || userInputsResponse.length === 0) {
          setTopics([]);
          setLoading(false);
          return;
        }

        // Transform the data for the review page
        const allTopics: Topic[] = [];

        // Process all user inputs
        userInputsResponse.forEach((userInput: any) => {
          const subcategoryId = userInput.originalSubCategoryId;

          // Process each section's answers
          if (userInput.answersBySection && Array.isArray(userInput.answersBySection)) {
            userInput.answersBySection.forEach((section: any) => {
              if (section.answers && Array.isArray(section.answers)) {
                section.answers.forEach((answer: any) => {
                  const questionId = answer.originalQuestionId;

                  // Find the question data from our static data
                  const subcategoryQuestions = questionsData[subcategoryId as keyof typeof questionsData] || [];
                  const questionData = subcategoryQuestions.find((q: any) => q.id === questionId);

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
          const allQuestions = Object.values(questionsData).flat();

          // Create topics for questions without answers
          allQuestions.forEach((q: any) => {
            // Find which subcategory this question belongs to
            let subcategoryId = '';
            for (const [id, questions] of Object.entries(questionsData)) {
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
      } catch (error) {
        console.error('Error fetching user answers:', error);
        setError('Failed to load your answers. Please try again.');
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, categoryName, navigate]);

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
      user={userInfo}
      onPrint={() => window.print()}
    />
  );
};

export default HomeInstructionsReviewPage;