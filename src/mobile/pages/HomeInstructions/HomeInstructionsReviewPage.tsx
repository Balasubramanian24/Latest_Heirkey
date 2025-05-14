import { useState, useEffect } from 'react';
import CategoryReviewPage from '@/mobile/components/category/CategoryReviewPage';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import questionsData from '@/data/homeIntsructions.json';
import { useAuth } from '@/contexts/AuthContext';
// import userInputService from '@/services/userInputService'; // Uncomment for real data

const HomeInstructionsReviewPage = () => {
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
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch user answers (replace with real fetch)
        let userAnswers: Record<string, any> = {};
        // if (user?.id) {
        //   userAnswers = await userInputService.getUserInputs(user.id);
        // }
        // For now, use mock data:
        userAnswers = {
          q1: "Yes",
          t1: "Monday",
          o1: "WiFi password is in kitchen drawer",
          s1: "No",
          s2: "",
        };

        // 2. Flatten all questions from all categories
        const allQuestions = Object.values(questionsData).flat();

        // 3. Map questions to answers
        const reviewTopics = allQuestions
          .filter(q => !('dependsOn' in q))
          .map(q => ({
            id: q.id,
            title: q.text,
            data: userAnswers[q.id] ?? "No answer provided",
            onEdit: () => handleNavigation(q.text.toLowerCase())
          }));

        setTopics(reviewTopics);
      } catch (error) {
        console.error('Error fetching user answers:', error);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

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

export default HomeInstructionsReviewPage; 