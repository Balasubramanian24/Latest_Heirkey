import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar } from '@radix-ui/react-avatar';
import { ChevronLeft, Printer } from 'lucide-react';
import Layout from '@/mobile/components/layout/Layout';
import { Button } from '@/components/ui/button';

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
}: CategoryReviewPageProps) => {
  const navigate = useNavigate();
  const [infoVisible, setInfoVisible] = useState(true);

  return (
    <>
      {/* Category Header */}
      <div className="w-full bg-gradient-to-r from-[#4b4e7a] to-[#3ed6c5] py-6 px-4">
        <div className="flex flex-col mb-2">
          <div className="text-2xl font-bold text-white mb-1">Category: {categoryTitle}</div>
          <Link to="/dashboard" className="text-white text-sm opacity-90 flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">My Category Details</h2>
          <Button
            variant="outline"
            size="sm"
            className="text-sm"
            onClick={onPrint}
          >
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>

        {/* Info Box */}
        {infoVisible && (
          <div className="bg-[#f5f8ff] border border-[#d6e0ef] rounded-md p-3 mb-5 flex items-start gap-2">
            <div className="flex-1">
              <div className="font-semibold text-[#4b4e7a] text-sm">{infoTitle}</div>
              <div className="text-[#555] text-xs">{infoDescription}</div>
            </div>
            <button 
              className="text-[#888] hover:text-[#222] text-lg" 
              onClick={() => setInfoVisible(false)}
            >
              ×
            </button>
          </div>
        )}

        {/* Topics List - Single Column for Mobile */}
        <div className="flex flex-col gap-4">
          {topics.map(topic => (
            <div key={topic.id} className="bg-white border border-[#e5e7ef] rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#223] flex items-center justify-center text-white font-semibold text-sm">
                  {topic.title[0]}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{topic.title}</div>
                  {topic.subtitle && <div className="text-xs text-[#888]">{topic.subtitle}</div>}
                </div>
              </div>
              <div className="text-[#555] text-xs mb-3">{topic.data}</div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={topic.onEdit}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* User Profile - Mobile Shows at Bottom */}
        <div className="flex items-center gap-3 mt-6 border-t border-[#e5e7ef] pt-4">
          <Avatar className="rounded-full w-12 h-12 bg-white overflow-hidden border-2 border-[#e5e7ef] shadow-sm">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </Avatar>
          <div>
            <div className="font-semibold text-sm">{user.name}</div>
            <div className="text-xs text-[#888]">{user.email}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryReviewPage; 