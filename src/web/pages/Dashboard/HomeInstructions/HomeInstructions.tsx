import { Link, useParams } from 'react-router-dom';
import { Avatar } from '@radix-ui/react-avatar';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import AppHeader from '@/web/components/Layout/AppHeader';
import Footer from '@/web/components/Layout/Footer';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import SearchPanel from '@/web/pages/Global/SearchPanel';
import { useAuth } from '@/contexts/AuthContext';
import { categoryTabsConfig } from '@/data/categoryTabsConfig';
import SubCategoryTabs from '@/web/components/Global/SubCategoryTabs';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  fetchUserInputs,
  SubCategory,
  UserInput,
  selectSubcategories,
  selectProgressStats
} from '../../../../store/slices/homeInstructionsSlice';
import { useEffect } from 'react';

const SubCategoryCard = ({ subcategory }: { subcategory: SubCategory }) => {
  // Get the completed questions count from Redux state
  const userInputs = useAppSelector((state: any) => state.homeInstructions.userInputs) as UserInput[];

  // Calculate completed questions for this subcategory
  const completedQuestions = userInputs.reduce((count: number, input: UserInput) => {
    if (input.originalSubCategoryId === subcategory.id) {
      return count + input.answersBySection.reduce(
        (sectionCount: number, section) => sectionCount + section.answers.length, 0
      );
    }
    return count;
  }, 0);

  const completionPercentage = subcategory.questionsCount > 0
    ? Math.round((completedQuestions / subcategory.questionsCount) * 100)
    : 0;

  return (
    <div className="border rounded-lg overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-[#183153]">{subcategory.title}</h3>
          <span className="text-sm text-blue-500">
            {completedQuestions}/{subcategory.questionsCount} questions
          </span>
        </div>
        <Progress
          value={completionPercentage}
          className="h-1.5 mb-2"
        />
      </div>
    </div>
  );
};

const HomeInstructions = ({ category }: { category?: string }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const params = useParams();
  const categoryName = category || params.categoryName;

  // Get data from Redux store
  const subcategories = useAppSelector(selectSubcategories);
  const progressStats = useAppSelector(selectProgressStats);

  // Fetch user inputs when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserInputs(user.id));
    }
  }, [dispatch, user]);

  // Fallback user info if not authenticated
  const userInfo = {
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest',
    email: user?.email || 'guest@example.com',
    avatar: user?.image || avatar
  };

  const tabs = categoryTabsConfig[categoryName as keyof typeof categoryTabsConfig] || categoryTabsConfig['homeinstructions'];

  return (
    <div className="flex flex-col pt-20 min-h-screen">
      <AppHeader />

      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-[#183153] to-[#1ccfc9] text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Home Instructions</h1>
              <Link to="/dashboard" className="flex items-center text-sm hover:underline">
                <span className="mr-1">←</span> Back Home
              </Link>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-4">
                <div className="font-semibold">{userInfo.name}</div>
                <div className="text-sm opacity-80">{userInfo.email}</div>
              </div>
              <Avatar className="rounded-full w-14 h-14 bg-white overflow-hidden">
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = avatar; // Fallback to default avatar
                  }}
                />
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <SubCategoryTabs tabs={tabs} />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Categories */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {/* Overall progress bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Overall progress</h3>
                  <span className="text-sm text-gray-500">
                    {progressStats.answeredQuestions}/{progressStats.totalQuestions} questions completed
                  </span>
                </div>
                <Progress
                  value={progressStats.completionPercentage}
                  className="h-2"
                />
                {progressStats.completionPercentage === 100 && (
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center text-sm text-green-600 font-medium">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> All questions completed!
                    </span>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-semibold text-[#183153] mb-2">Good to Know: <span className="text-purple-600">How to Understand Topics</span></h2>
              <p className="text-gray-600 mb-6">
                Each topic below is a part of your home documents, with questions to help you provide important
                information for you and your loved ones. Click on a category to answer questions at your own pace—
                we'll save everything for you.
              </p>

              {/* Subcategory cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {subcategories.map((subcategory: SubCategory) => (
                  <Link key={subcategory.id} to={`/category/${categoryName}/${subcategory.title.toLowerCase()}`} className="block">
                    <SubCategoryCard subcategory={subcategory} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Search panel */}
          <div>
            <SearchPanel />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomeInstructions;