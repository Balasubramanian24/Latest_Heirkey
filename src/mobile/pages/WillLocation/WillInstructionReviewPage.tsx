import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import Footer from '@/mobile/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
// import userInputService from '@/services/userInputService';
import willInstructionsData from '@/data/willInstructions.json';

interface ReviewItem {
  id: string;
  title: string;
  subtitle?: string;
  data: string;
  onEdit: () => void;
}

// Map subcategory IDs to their routes
// const subcategoryRoutes: Record<string, string> = {
//   '105-location': '/category/willinstructions/location',
//   '105-legal': '/category/willinstructions/legal',
// };

// Map question IDs to their subcategory IDs
const questionToSubcategoryMap: Record<string, string> = {};

// Initialize the question to subcategory mapping
Object.entries(willInstructionsData).forEach(([categoryId, questions]) => {
  questions.forEach(question => {
    // Map to our custom subcategory keys
    let subKey = '';
    if (question.sectionId === '105A' || question.sectionId === '105B') subKey = '105-location';
    if (question.sectionId === '105C') subKey = '105-legal';
    if (subKey) questionToSubcategoryMap[question.id] = subKey;
  });
});

const WillInstructionReviewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categoryName } = useParams<{ categoryName: string }>();
  const [topics, setTopics] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAnswers = async () => {
      if (!user || !user.id) {
        setError('You must be logged in to view your answers');
        setIsLoading(false);
        return;
      }

      try {
        // DIRECT API CALL: Explicitly fetch only Will Instructions data
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/v1/api'}/user-inputs?userId=${user.id}&categoryId=2`);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("DIRECT API RESPONSE FOR WILL INSTRUCTIONS:", data);

        // Ensure we're only working with Will Instructions data (category ID 2)
        const willInstructionsData = Array.isArray(data)
          ? data.filter(item => item.originalCategoryId === '2')
          : [];

        console.log("FILTERED WILL INSTRUCTIONS DATA:", willInstructionsData);

        // Transform the data for the review page
        const allTopics: ReviewItem[] = [];

        // Process all user inputs
        willInstructionsData.forEach((userInput: any) => {
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
  }, [user, navigate, categoryName]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GradiantHeader
        showAvatar={true}
        title="Will Instructions Review"
      />
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-900">
              Review Your Will Instructions
            </h1>
            <p className="text-sm text-gray-600">
              Please review the information below. If you need to make changes, go back to the relevant section.
            </p>
          </div>

          {/* Show error message if any */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Show loading indicator */}
          {isLoading ? (
            <div className="flex justify-center my-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#2BCFD5]" />
            </div>
          ) : topics.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
              {topics.map((item, idx) => (
                <div key={idx} className="flex flex-col space-y-1 py-2 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[#183153]">{item.title}</span>
                    <button
                      onClick={item.onEdit}
                      className="text-xs text-[#2BCFD5] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  {item.subtitle && (
                    <span className="text-xs text-gray-500">{item.subtitle}</span>
                  )}
                  <span className="text-sm text-gray-700">{item.data}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-center text-gray-500">
                No answers found. Please complete the Will Instructions sections.
              </p>
              <button
                onClick={() => navigate(`/category/${categoryName || 'willinstructions'}`)}
                className="mt-4 w-full bg-[#2BCFD5] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#25b6bb]"
              >
                Go to Will Instructions
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WillInstructionReviewPage;
