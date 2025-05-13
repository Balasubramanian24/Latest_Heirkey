import { useLocation, useNavigate } from 'react-router-dom';
import CategoryConfirmCard from "@/mobile/components/category/categoryApproval";
import GradiantHeader from '@/mobile/components/header/gradiantHeader';

const CategoryConfirmPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId, categoryName } = location.state || {};

  const handleStart = () => {
    // Navigate to the actual category page
    navigate(`/category/${categoryId}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <GradiantHeader title= "Current Category" />
        <CategoryConfirmCard
          onStart={handleStart}
          onBack={handleBack}
          categoryLabel={categoryName || "Selected Category"}
        />
      </div>
  );
};

export default CategoryConfirmPage;
