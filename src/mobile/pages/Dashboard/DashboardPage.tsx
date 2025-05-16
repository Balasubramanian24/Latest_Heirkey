import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import CategoryCard from '@/mobile/components/dashboard/CategoryCard';
import { useAuth } from '@/contexts/AuthContext';
import homeImg from '@/assets/global/category/home.jpg'
import documentsImg from '@/assets/global/category/document.jpg'
import willImg from '@/assets/global/category/will.jpg'
import funeralImg from '@/assets/global/category/funeral.jpg'
import contactImg from '@/assets/global/category/contact.jpg'
import socialMediaImg from '@/assets/global/category/socialMedia.jpg'
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import userInputService from '@/services/userInputService';

const categories = [
  {
    id: 'homeinstructions',
    name: 'Home Instructions',
    description: 'Instructions for your home and pets.',
    imageUrl: homeImg,
  },
  {
    id: 'homedocuments',
    name: 'Home Documents',
    description: 'Important documents for your home.',
    imageUrl: documentsImg,
  },
  {
    id: 'willlocation',
    name: 'Will Location',
    description: 'Where your will is stored.',
    imageUrl: willImg,
  },
  {
    id: 'funeralarrangements',
    name: 'Funeral Arrangements',
    description: 'Your funeral preferences.',
    imageUrl: funeralImg,
  },
  {
    id: 'importantcontacts',
    name: 'Important Contacts',
    description: 'People to contact in case of emergency.',
    imageUrl: contactImg,
  },
  {
    id: 'socialmediaphone',
    name: 'Social Media and Phone',
    description: 'Your social media and phone details.',
    imageUrl: socialMediaImg,
  },
];

// Define interface for category stats
interface CategoryStat {
  categoryId: string;
  answeredQuestions: number;
}

// Define total questions for each category
const totalQuestions = {
  'homeinstructions':11,
  'homedocuments': 26,
  'willlocation': 6,
  'funeralarrangements': 15,
  'importantcontacts': 12,
  'socialmediaphone': 12,
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const dataFetchedRef = useRef(false);

  // Initialize question counts with zeros
  const [questionCounts, setQuestionCounts] = useState({
    'homeinstructions': 0,
    'homedocuments': 0,
    'willlocation': 0,
    'funeralarrangements': 0,
    'importantcontacts': 0,
    'socialmediaphone': 0,
  });

  // Function to fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    if (!user || !user.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Fetch dashboard stats from the API
      const dashboardStats = await userInputService.getDashboardStats(user.id);

      // Create a new question counts object with default values
      const newQuestionCounts = {
        'homeinstructions': 0,
        'homedocuments': 0,
        'willlocation': 0,
        'funeralarrangements': 0,
        'importantcontacts': 0,
        'socialmediaphone': 0,
      };

      // Update counts based on the stats from the API
      dashboardStats.forEach((stat: CategoryStat) => {
        switch (stat.categoryId) {
          case '1':
            newQuestionCounts.homeinstructions = stat.answeredQuestions;
            break;
          case '2':
            newQuestionCounts.willlocation = stat.answeredQuestions;
            break;
          case '3':
            newQuestionCounts.funeralarrangements = stat.answeredQuestions;
            break;
          // Add more categories as needed
        }
      });

      // Update state with the new counts
      setQuestionCounts(newQuestionCounts);

      // Mark data as fetched
      dataFetchedRef.current = true;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch data when component mounts
  useEffect(() => {
    // Prevent multiple fetches on re-renders
    if (dataFetchedRef.current) return;

    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const handleCategoryClick = (_categoryId: string, categoryName: string) => {
    // Using underscore prefix to indicate intentionally unused parameter
    navigate(`/category/${categoryName.toLowerCase().replace(/\s+/g, '')}`);
  };

  const headerTitle = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || user?.email || 'Welcome';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen overflow-y-auto bg-background"
    >
      <GradiantHeader
        title={headerTitle}
        showAvatar={true}
      />
      <div className="container mx-auto px-4 py-8 max-w-md" style={{ minHeight: '100vh' }}>
        <div className="overflow-y-auto">
          <div className="w-full max-w-md mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-1">
              <h1 className="text-xl font-bold text-secondary-900">Your Folders</h1>
              <button
                onClick={() => {
                  dataFetchedRef.current = false;
                  fetchDashboardStats();
                }}
                className="text-primary flex items-center text-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-1"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                Refresh
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Your information is organized in folders. Tap any section to explore the details.
            </p>

            <div className="flex flex-col gap-4 pb-10">
              {isLoading ? (
                // Loading indicator
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                // Render category cards
                categories.map((category, idx) => (
                  <CategoryCard
                    key={category.id}
                    name={category.name}
                    description={category.description}
                    imageUrl={category.imageUrl}
                    questionCount={questionCounts[category.id as keyof typeof questionCounts] || 0}
                    totalQuestions={totalQuestions[category.id as keyof typeof totalQuestions] || 0}
                    isCompleted={
                      questionCounts[category.id as keyof typeof questionCounts] > 0 &&
                      questionCounts[category.id as keyof typeof questionCounts] >= totalQuestions[category.id as keyof typeof totalQuestions]
                    }
                    index={idx}
                    onClick={() => handleCategoryClick(category.id, category.name)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
