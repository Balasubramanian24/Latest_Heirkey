import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryReviewPage from '@/web/components/Category/CategoryReviewPage';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import { useAuth } from '@/contexts/AuthContext';

// We're using 'any' type for API responses with detailed console logging

// No need for mapping tables as we're using direct navigation based on section IDs

export default function WillInstructionsReview() {
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
        // Fetch user inputs for the Will Instructions category (ID: 2)
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/v1/api'}/user-inputs?userId=${user.id}&categoryId=2`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("DIRECT API RESPONSE FOR WILL INSTRUCTIONS:", data);

        // Ensure we're only working with Will Instructions data (category ID 2)
        const userInputs = Array.isArray(data)
          ? data.filter(item => item.originalCategoryId === '2')
          : [];

        console.log("FILTERED WILL INSTRUCTIONS DATA:", userInputs);

        // Transform the data for the review page
        const allTopics: Array<{
          id: string;
          title: string;
          subtitle?: string;
          data: string;
          onEdit: () => void;
        }> = [];

        // Process all user inputs
        userInputs.forEach((userInput: any) => {
          console.log("Processing userInput:", userInput);

          // Process answers by section
          userInput.answersBySection.forEach((section: any) => {
            console.log("Processing section:", section);

            section.answers.forEach((answer: any) => {
              console.log("Processing answer:", answer);

              // Add this answer to our topics list
              allTopics.push({
                id: answer.originalQuestionId,
                title: answer.question, // Use the question text directly from the answer
                subtitle: `Section: ${section.originalSectionId}`,
                data: answer.answer,
                onEdit: () => {
                  // Determine which subcategory to navigate to
                  let route = '/category/willinstructions';

                  // Location sections
                  if (section.originalSectionId === '105A' || section.originalSectionId === '105B') {
                    route = '/category/willinstructions/location';
                  }
                  // Legal section
                  else if (section.originalSectionId === '105C') {
                    route = '/category/willinstructions/legal';
                  }

                  navigate(`${route}?questionId=${answer.originalQuestionId}`);
                }
              });
            });
          });
        });

        console.log("FINAL TOPICS TO DISPLAY:", allTopics);

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
      categoryTitle="Will & Testament"
      infoTitle="How to edit your information"
      infoDescription="Now, you are about to enter details about your will, legal representation, and essential information to be passed on to your family members. Each section has several questions. Fill out as much as you can/like. You can always come back to fill out more information later."
      topics={topics}
      user={userInfo}
      onPrint={() => window.print()}
    />
  );
}