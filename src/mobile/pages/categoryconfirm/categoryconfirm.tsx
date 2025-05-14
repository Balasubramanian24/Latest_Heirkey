import { useLocation, useNavigate } from 'react-router-dom';
import CategoryConfirmCard from "@/mobile/components/category/categoryApproval";
import GradiantHeader from '@/mobile/components/header/gradiantHeader';
import Footer from '@/mobile/components/layout/Footer';

const CategoryConfirmPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId, categoryName } = location.state || {};

  const handleStart = () => {
    // Navigate to the actual category page
    navigate(`/${categoryId}`);
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
          category={categoryName || "Selected Category"}
        />
      <Footer />
    </div>
  );
};

export default CategoryConfirmPage;
