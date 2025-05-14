import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '@/mobile/components/dashboard/CategoryCard';
import GradiantHeader from '@/mobile/components/header/gradiantHeader';

import homeImg from '@/assets/global/category/home.jpg'
import documentsImg from '@/assets/global/category/document.jpg'
import willImg from '@/assets/global/category/will.jpg'
import funeralImg from '@/assets/global/category/funeral.jpg'
import contactImg from '@/assets/global/category/contact.jpg'
import socialMediaImg from '@/assets/global/category/socialMedia.jpg'

const categories = [
  {
    id: 'homeinstructions',
    name: 'Home Instructions',
    description: 'Instructions for your home and pets.',
    imageUrl: homeImg,
  },
  {
    id: 'homedocuments',
    name: 'Home Documents',
    description: 'Important documents for your home.',
    imageUrl: documentsImg,
  },
  {
    id: 'willlocation',
    name: 'Will Location',
    description: 'Where your will is stored.',
    imageUrl: willImg,
  },
  {
    id: 'funeralarrangements',
    name: 'Funeral Arrangements',
    description: 'Your funeral preferences.',
    imageUrl: funeralImg,
  },
  {
    id: 'importantcontacts',
    name: 'Important Contacts',
    description: 'People to contact in case of emergency.',
    imageUrl: contactImg,
  },
  {
    id: 'socialmediaphone',
    name: 'Social Media and Phone',
    description: 'Your social media and phone details.',
    imageUrl: socialMediaImg,
  },
];

const questionCounts = {
  'homeinstructions': 15,
  'homedocuments': 20,
  'willlocation': 3,
  'funeralarrangements': 0,
  'importantcontacts': 0,
  'socialmediaphone': 0,
};

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    navigate(`/category/${categoryName.toLowerCase().replace(/\s+/g, '')}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen overflow-y-auto bg-background"
    >
      <GradiantHeader title="Dashboard" />
      <div className="container mx-auto px-4 py-8 max-w-md" style={{ minHeight: '100vh' }}>
        <div className="overflow-y-auto">
          <div className="w-full max-w-md mx-auto px-4 py-6">
            <h1 className="text-xl font-bold mb-1 text-secondary-900">Your Folders</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Your information is organized in folders. Tap any section to explore the details.
            </p>

            <div className="flex flex-col gap-4 pb-10">
              {categories.map((category, idx) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  description={category.description}
                  imageUrl={category.imageUrl}
                  questionCount={questionCounts[category.id as keyof typeof questionCounts] || 0}
                  isCompleted={questionCounts[category.id as keyof typeof questionCounts] > 0}
                  index={idx}
                  onClick={() => handleCategoryClick(category.id, category.name)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
