import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import Footer from "@/mobile/components/layout/Footer";
import { categoryTabsConfig } from '@/data/categoryTabsConfig';
import { CheckCircle } from "lucide-react";

interface SubCategoryCardProps {
  label: string;
  path: string;
  questionsCount: number;
  completedCount: number;
}

const SubCategoryCard = ({ label, path, questionsCount, completedCount }: SubCategoryCardProps) => {
  const navigate = useNavigate();
  const completionPercentage = Math.round((completedCount / questionsCount) * 100);

  return (
    <div
      className="cursor-pointer"
      onClick={() => navigate(path)}
    >
      <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-[#183153]">
              {label}
            </h3>
            <span className="text-sm text-[#2BCFD5] font-medium">
              {completedCount}/{questionsCount}
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#2BCFD5] h-2 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {completionPercentage}% Complete
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Add this type definition
type SubcategoryQuestionsType = {
  [key: string]: { total: number; completed: number };
};

// Update the const declaration with the type
const subcategoryQuestions: SubcategoryQuestionsType = {
  "Details": { total: 5, completed: 0 },
  "Ceremony Location": { total: 2, completed: 0 },
  "Clergy": { total: 3, completed: 0 },
  "Notifications": { total: 1, completed: 0 },
  "Proceedings": { total: 4, completed: 0 }
};

export default function FuneralArrangementsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <GradiantHeader 
        title="Funeral Arrangements" 
        showAvatar={true}
      />
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="text-lg font-bold text-[#8B5CF6] mb-2">Understanding Topics</h2>
          <p className="text-sm text-gray-600">
            Each topic below is a part of your home documents, with questions to help you provide important information for you and your loved ones. Click any topic to answer the questions at your own pace—we'll save everything for you.
          </p>
        </div>

        <div className="space-y-3">
          {categoryTabsConfig.funeralarrangements.map((item) => {
            const { total, completed } = subcategoryQuestions[item.label] || { total: 0, completed: 0 };
            const isActive = activeTab === item.label;
            const isCompleted = completed === total && total > 0;

            return (
              <div
                key={item.label}
                className={
                  "flex items-center justify-between px-4 py-3 rounded-xl border transition-all " +
                  (isActive
                    ? "border-[#2BCFD5] bg-white shadow"
                    : "border-gray-200 bg-gray-50 hover:bg-white")
                }
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setActiveTab(item.label);
                  navigate(item.path);
                }}
              >
                <span className="font-medium text-gray-900">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {completed}/{total} questions
                  </span>
                  {isCompleted && (
                    <>
                      <CheckCircle className="w-5 h-5 text-[#2BCFD5]" />
                      <button
                        className="text-xs text-[#2BCFD5] font-semibold px-2 py-1 rounded hover:underline"
                        onClick={e => { e.stopPropagation(); navigate(item.path); }}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
} 