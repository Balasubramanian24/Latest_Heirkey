import { motion } from 'framer-motion';
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
    id: 'home-instructions',
    name: 'Home Instructions',
    description: 'Instructions for your home and pets.',
    imageUrl: homeImg,
  },
  {
    id: 'home-documents',
    name: 'Home Documents',
    description: 'Important documents for your home.',
    imageUrl: documentsImg,
  },
  {
    id: 'will-location',
    name: 'Will Location',
    description: 'Where your will is stored.',
    imageUrl: willImg,
  },
  {
    id: 'funeral-arrangements',
    name: 'Funeral Arrangements',
    description: 'Your funeral preferences.',
    imageUrl: funeralImg,
  },
  {
    id: 'important-contacts',
    name: 'Important Contacts',
    description: 'People to contact in case of emergency.',
    imageUrl: contactImg,
  },
  {
    id: 'social-media-phone',
    name: 'Social Media and Phone',
    description: 'Your social media and phone details.',
    imageUrl: socialMediaImg,
  },
];

const questionCounts = {
  'home-instructions': 15,
  'home-documents': 20,
  'will-location': 3,
  'funeral-arrangements': 0,
  'important-contacts': 0,
  'social-media-phone': 0,
};

export default function DashboardPage() {
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
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
