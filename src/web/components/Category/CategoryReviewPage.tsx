import { Link } from 'react-router-dom';
import { Avatar } from '@radix-ui/react-avatar';
import SearchPanel from '@/web/pages/Global/SearchPanel';
import Footer from '@/web/components/Layout/Footer';
import AppHeader from '@/web/components/Layout/AppHeader';

interface Topic {
  id: string;
  title: string;
  subtitle?: string;
  data: string;
  onEdit: () => void;
}

interface CategoryReviewPageProps {
  categoryTitle: string;
  infoTitle: string;
  infoDescription: string;
  topics: Topic[];
  user: { name: string; email: string; avatar: string };
  onPrint?: () => void;
}

const CategoryReviewPage = ({
  categoryTitle,
  infoTitle,
  infoDescription,
  topics,
  user,
  onPrint,
}: CategoryReviewPageProps) => (
  <div className="flex flex-col ">
    <AppHeader />
    <div className="w-full bg-gradient-to-r from-[#4b4e7a] to-[#3ed6c5] py-7 px-0 mb-0 pt-24">
      <div className="container mx-auto flex items-center justify-between px-6">
        <div>
          <div className="text-3xl font-bold text-white mb-1">Category: {categoryTitle}</div>
          <div>
            <Link to="/dashboard" className="text-white text-base opacity-90 hover:underline flex items-center">
              <span className="mr-1">←</span> Back Home
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-semibold text-white">{user.name}</div>
            <div className="text-sm text-white opacity-80">{user.email}</div>
          </div>
          <Avatar className="rounded-full w-16 h-16 bg-white overflow-hidden border-4 border-white shadow-md">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </Avatar>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 container mx-auto px-6 py-8 flex gap-8">
      {/* Left */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">My Category Details</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 border border-[#d6e0ef] rounded-md bg-white text-[#222] hover:bg-[#f7f7f7]"
            onClick={onPrint}
          >
           Print
          </button>
        </div>
        {/* Info Box */}
        <div className="bg-[#f5f8ff] border border-[#d6e0ef] rounded-md p-4 mb-6 flex items-start gap-3">
          <div>
            <div className="font-semibold text-[#4b4e7a]">{infoTitle}</div>
            <div className="text-[#555] text-sm">{infoDescription}</div>
          </div>
          <button className="ml-auto text-[#888] hover:text-[#222]">×</button>
        </div>
        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map(topic => (
            <div key={topic.id} className="bg-white border border-[#e5e7ef] rounded-lg p-4 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#223] flex items-center justify-center text-white font-bold text-lg">
                  {topic.title[0]}
                </div>
                <div>
                  <div className="font-semibold">{topic.title}</div>
                  {topic.subtitle && <div className="text-xs text-[#888]">{topic.subtitle}</div>}
                </div>
              </div>
              <div className="text-[#555] text-sm mb-4">{topic.data}</div>
              <button
                className="self-end px-4 py-1 border border-[#d6e0ef] rounded-md bg-white text-[#222] hover:bg-[#f7f7f7]"
                onClick={topic.onEdit}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Right */}
      <div className="w-full max-w-sm">
        <SearchPanel />
      </div>
    </div>
    <Footer />
  </div>
);

export default CategoryReviewPage; 