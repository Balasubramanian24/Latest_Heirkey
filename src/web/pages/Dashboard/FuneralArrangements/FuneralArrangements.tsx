import { Link, useParams } from 'react-router-dom';
import { Avatar } from '@radix-ui/react-avatar';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';
import AppHeader from '@/web/components/Layout/AppHeader';
import Footer from '@/web/components/Layout/Footer';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';
import funeralArrangementsData from '@/data/funeralArrangements.json';
import SearchPanel from '@/web/pages/Global/SearchPanel';
import { useAuth } from '@/contexts/AuthContext';

const sectionTitles = {
  '205A': 'Details',
  '205B': 'Ceremony Location',
  '205C': 'Clergy',
  '205D': 'Notifications',
  '205E': 'Proceedings'
};

// Define SubCategory type
interface SubCategory {
  id: string;
  title: string;
  questionsCount: number;
}

const subcategories: SubCategory[] = Object.entries(sectionTitles).map(([sectionId, title]) => ({
  id: sectionId,
  title,
  questionsCount: funeralArrangementsData['205'].filter(q => q.sectionId === sectionId).length
}));

const SubCategoryCard = ({ subcategory }: { subcategory: SubCategory }) => {
  const completedQuestions = 0; // Replace with real logic
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
        <Progress value={completionPercentage} className="h-1.5 mb-2" />
      </div>
    </div>
  );
};

const FuneralArrangements = () => {
  const { user } = useAuth();
  // ...userInfo logic as in HomeInstructions

  // ...progressStats logic as in HomeInstructions

  return (
    <div className="flex flex-col pt-20 min-h-screen">
      <AppHeader />
      <div className="bg-gradient-to-r from-[#183153] to-[#1ccfc9] text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Funeral Arrangements</h1>
              <Link to="/dashboard" className="flex items-center text-sm hover:underline">
                <span className="mr-1">←</span> Back Home
              </Link>
            </div>
            {/* ...user profile card as in HomeInstructions */}
          </div>
        </div>
      </div>
      {/* ...progress bar, info box, etc. */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {/* ...progress bar, info box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {subcategories.map(subcategory => (
                  <Link key={subcategory.id} to={`/category/funeralarrangements/${subcategory.title.toLowerCase()}`} className="block">
                    <SubCategoryCard subcategory={subcategory} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div>
            <SearchPanel />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FuneralArrangements;