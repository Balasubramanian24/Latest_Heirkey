import { useNavigate } from "react-router-dom";
import GradiantHeader from "@/mobile/components/header/gradiantHeader";
import Footer from "@/mobile/components/layout/Footer";
import { categoryTabsConfig } from '@/data/categoryTabsConfig';

export default function FuneralArrangementReviewPage() {
  const navigate = useNavigate();

  return (
    <>
      <GradiantHeader title="Funeral Arrangements Review" showAvatar={true} />
      <div className="p-4">
        <div className="space-y-4">
          {categoryTabsConfig.funeralarrangements.map((section) => (
            <div key={section.label} className="bg-gray-50 p-4 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">{section.label}</h3>
                <button
                  onClick={() => navigate(section.path)}
                  className="text-[#2BCFD5] text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="text-gray-500">
                Click edit to view and modify {section.label.toLowerCase()} details
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
} 