import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GradiantHeader from '../header/gradiantHeader';

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
  onPrint?: () => void;
}

const CategoryReviewPage = ({
  categoryTitle,
  infoTitle,
  infoDescription,
  topics,
  onPrint,
}: CategoryReviewPageProps) => {
  const navigate = useNavigate();
  const [infoVisible, setInfoVisible] = useState(true);

  return (
    <>
      <GradiantHeader
        title={categoryTitle || "Current Category"}
        showAvatar={true}
      />

      {/* Main Content */}
      <div className="px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{categoryTitle ? `${categoryTitle} Details` : "My Category Details"}</h2>
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
      </div>
    </>
  );
};

export default CategoryReviewPage;
