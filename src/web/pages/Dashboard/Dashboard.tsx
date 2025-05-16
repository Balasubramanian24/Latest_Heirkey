import { Link } from 'react-router-dom'
import { Avatar } from '@radix-ui/react-avatar'
import { useEffect, useState } from 'react'
import AppHeader from '@/web/components/Layout/AppHeader'
import Footer from '@/web/components/Layout/Footer'
import SearchPanel from '@/web/pages/Global/SearchPanel'
import home from '@/assets/global/category/home.jpg'
import documents from '@/assets/global/category/document.jpg'
import will from '@/assets/global/category/will.jpg'
import funeral from '@/assets/global/category/funeral.jpg'
import contact from '@/assets/global/category/contact.jpg'
import socialMedia from '@/assets/global/category/socialMedia.jpg'
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg'
import { useAuth } from '@/contexts/AuthContext'
import { useAppDispatch } from '@/store/hooks'
import { fetchUserInputs as fetchHomeInstructionsInputs } from '@/store/slices/homeInstructionsSlice'
import { fetchUserInputs as fetchWillInstructionsInputs } from '@/store/slices/willInstructionsSlice'
import { fetchUserInputs as fetchFuneralArrangementsInputs } from '@/store/slices/funeralArrangementsSlice'
import userInputService from '@/services/userInputService'

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
  categoryId?: string;
  originalCategoryId: string;
  subCategoryId?: string;
  originalSubCategoryId: string;
  answersBySection: SectionAnswers[];
  _id?: string;
}

const CategoryCard = ({
  title,
  imageSrc,
  questionCount,
  path,
  isCompleted = false
}: {
  title: string;
  imageSrc: string;
  questionCount: string;
  path: string;
  isCompleted?: boolean;
}) => {
  return (
    <div className="relative flex flex-col rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
      {isCompleted && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          Completed
        </div>
      )}
      <Link to={path} className="block">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h3 className="font-medium">{title}</h3>
          <span className={`text-sm ${isCompleted ? 'text-green-500' : 'text-blue-400'}`}>{questionCount}</span>
        </div>
      </Link>
    </div>
  )
}

const Dashboard = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [categoryProgress, setCategoryProgress] = useState<Record<string, { answered: number, total: number }>>({
    homeinstructions: { answered: 0, total: 5 },
    homedocuments: { answered: 0, total: 26 },
    willinstructions: { answered: 0, total: 3 },
    funeralarrangements: { answered: 0, total: 12 },
    importantcontacts: { answered: 0, total: 12 },
    socialmedia: { answered: 0, total: 12 }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch progress data when component mounts
  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user || !user.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch data for each category
        const homeInstructionsPromise = userInputService.getUserInputsByUserAndCategory(user.id, '1');
        const willInstructionsPromise = userInputService.getUserInputsByUserAndCategory(user.id, '2');
        const funeralArrangementsPromise = userInputService.getUserInputsByUserAndCategory(user.id, '3');
        // Add more categories as needed

        const [homeInstructionsData, willInstructionsData, funeralArrangementsData] = await Promise.all([
          homeInstructionsPromise,
          willInstructionsPromise,
          funeralArrangementsPromise
        ]) as [UserInput[], UserInput[], UserInput[]];

        // Calculate progress for each category
        const progress = { ...categoryProgress };

        // Home Instructions
        const homeInstructionsAnswered = homeInstructionsData.reduce((total: number, input: UserInput) => {
          return total + input.answersBySection.reduce((sectionTotal: number, section: SectionAnswers) => {
            return sectionTotal + section.answers.length;
          }, 0);
        }, 0);
        progress.homeinstructions.answered = homeInstructionsAnswered;

        // Will Instructions
        const willInstructionsAnswered = willInstructionsData.reduce((total: number, input: UserInput) => {
          return total + input.answersBySection.reduce((sectionTotal: number, section: SectionAnswers) => {
            return sectionTotal + section.answers.length;
          }, 0);
        }, 0);
        progress.willinstructions.answered = willInstructionsAnswered;

        // Funeral Arrangements
        const funeralArrangementsAnswered = funeralArrangementsData.reduce((total: number, input: UserInput) => {
          return total + input.answersBySection.reduce((sectionTotal: number, section: SectionAnswers) => {
            return sectionTotal + section.answers.length;
          }, 0);
        }, 0);
        progress.funeralarrangements.answered = funeralArrangementsAnswered;

        setCategoryProgress(progress);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();

    // Also dispatch Redux actions to update the store
    if (user?.id) {
      dispatch(fetchHomeInstructionsInputs(user.id));
      dispatch(fetchWillInstructionsInputs(user.id));
      dispatch(fetchFuneralArrangementsInputs(user.id));
    }
  }, [user, dispatch, categoryProgress]);

  // Fallback user info if not authenticated
  const userInfo = {
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest',
    email: user?.email || 'guest@example.com',
    avatar: user?.image || avatar
  }

  const categories = [
    {
      title: 'Home Instructions',
      imageSrc: home,
      questionCount: `${categoryProgress.homeinstructions.answered}/${categoryProgress.homeinstructions.total} questions`,
      path: '/category/homeinstructions',
      isCompleted: categoryProgress.homeinstructions.answered >= categoryProgress.homeinstructions.total
    },
    {
      title: 'Home Documents',
      imageSrc: documents,
      questionCount: `${categoryProgress.homedocuments.answered}/${categoryProgress.homedocuments.total} questions`,
      path: '/category/homedocuments',
      isCompleted: categoryProgress.homedocuments.answered >= categoryProgress.homedocuments.total
    },
    {
      title: 'Will Location',
      imageSrc: will,
      questionCount: `${categoryProgress.willinstructions.answered}/${categoryProgress.willinstructions.total} questions`,
      path: '/category/willinstructions',
      isCompleted: categoryProgress.willinstructions.answered >= categoryProgress.willinstructions.total
    },
    {
      title: 'Funeral Arrangements',
      imageSrc: funeral,
      questionCount: `${categoryProgress.funeralarrangements.answered}/${categoryProgress.funeralarrangements.total} questions`,
      path: '/category/funeralarrangements',
      isCompleted: categoryProgress.funeralarrangements.answered >= categoryProgress.funeralarrangements.total
    },
    {
      title: 'Important Contacts',
      imageSrc: contact,
      questionCount: `${categoryProgress.importantcontacts.answered}/${categoryProgress.importantcontacts.total} questions`,
      path: '/category/importantcontacts',
      isCompleted: categoryProgress.importantcontacts.answered >= categoryProgress.importantcontacts.total
    },
    {
      title: 'Social Media',
      imageSrc: socialMedia,
      questionCount: `${categoryProgress.socialmedia.answered}/${categoryProgress.socialmedia.total} questions`,
      path: '/category/socialmedia',
      isCompleted: categoryProgress.socialmedia.answered >= categoryProgress.socialmedia.total
    }
  ]

  return (
    <div className="flex flex-col">
      <AppHeader />
      <div className="bg-gradient-to-r from-[#183153] to-[#1ccfc9] text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
              <Link to="/" className="flex items-center text-sm hover:underline">
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
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {isLoading ? (
                <div className="col-span-2 flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2BCFD5]"></div>
                </div>
              ) : (
                categories.map((category, index) => (
                  <CategoryCard
                    key={index}
                    title={category.title}
                    imageSrc={category.imageSrc}
                    questionCount={category.questionCount}
                    path={category.path}
                    isCompleted={category.isCompleted}
                  />
                ))
              )}
            </div>
          </div>

          <div>
            <SearchPanel />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
