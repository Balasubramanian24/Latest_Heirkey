import { useState, useEffect } from 'react';
import CategoryReviewPage from '@/mobile/components/category/CategoryReviewPage';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import questionsData from '@/data/homeIntsructions.json';
import { useAuth } from '@/contexts/AuthContext';
import userInputService from '@/services/userInputService';

const HomeInstructionsReview = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams<{ categoryName: string }>();
  const { user } = useAuth();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // User info with fallbacks for missing data
  const userInfo = {
    name: user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : 'Francis Nixon',
    email: user?.email || 'fnixon35@hotmail.com',
    avatar: avatar, // Always use the default avatar for simplicity
  };

  // Handle navigation based on whether we have a dynamic category or not
  const handleNavigation = (section: string) => {
    if (categoryName) {
      navigate(`/category/${categoryName}/${section}`);
    } else {
      navigate(`/homeinstructions/${section}`);
    }
  };

  useEffect(() => {
    const fetchUserAnswers = async () => {
      setLoading(true);
      try {
        // Only attempt to fetch if user is logged in
        if (user?.id) {
          // In a real implementation, you would fetch user's answers from an API
          // const userAnswers = await userInputService.getUserInputs(user.id);
          
          // For now, we'll generate example data based on the questions structure
          generateTopicsFromQuestions();
        } else {
          // If user is not logged in, use sample data based on questions structure
          generateTopicsFromQuestions();
        }
      } catch (error) {
        console.error('Error fetching user answers:', error);
        // Fallback to generating sample data
        generateTopicsFromQuestions();
      } finally {
        setLoading(false);
      }
    };

    fetchUserAnswers();
  }, [user?.id]);

  // Generate topics from the questions data
  const generateTopicsFromQuestions = () => {
    const allTopics: any[] = [];
    
    // Categories mapping for better readability
    const categoryNames: Record<string, string> = {
      '101': 'Pets',
      '102': 'Trash',
      '103': 'Other',
      '104': 'Security'
    };

    // Process each category of questions
    Object.entries(questionsData).forEach(([categoryId, questions]) => {
      const categoryName = categoryNames[categoryId] || 'Unknown';
      
      // Process each question in the category
      questions.forEach((question: any) => {
        // Skip dependent questions for simplicity in the example data
        if (!question.dependsOn) {
          // Generate a sample answer based on question type
          let sampleAnswer = '';
          switch (question.type) {
            case 'boolean':
              sampleAnswer = 'Yes';
              break;
            case 'choice':
              sampleAnswer = question.options ? question.options[0] : 'Option 1';
              break;
            case 'text':
              sampleAnswer = question.id.startsWith('s2') ? 'ADT Home Security System with monitoring' : 
                             question.id.startsWith('o1') ? 'WiFi password is in kitchen drawer' : 
                             'Sample answer for ' + question.text;
              break;
            case 'number':
              sampleAnswer = '555-123-4567';
              break;
            default:
              sampleAnswer = 'No answer provided';
          }

          // Create a topic from this question
          allTopics.push({
            id: question.id,
            title: question.text,
            subtitle: categoryName,
            data: sampleAnswer,
            onEdit: () => handleNavigation(categoryName.toLowerCase())
          });
        }
      });
    });

    setTopics(allTopics);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading your answers...</div>;
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

export default HomeInstructionsReview; 