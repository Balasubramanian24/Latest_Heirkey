import CategoryReviewPage from '@/web/components/Category/CategoryReviewPage';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg';

// Example user info (replace with real user data as needed)
const user = {
  name: 'Francis Nixon',
  email: 'fnixon35@hotmail.com',
  avatar,
};

// Example topics (replace with real answers from state/context)
const topics = [
  { id: 'q1', title: 'Do you have pets?', data: 'Yes', onEdit: () => {/* navigate to edit */} },
  { id: 'q2', title: 'How Many?', data: '3', onEdit: () => {/* navigate to edit */} },
  // ...add all other questions/answers from all subcategories
];

export default function HomeInstructionsReview() {
  return (
    <CategoryReviewPage
      categoryTitle="Home Instructions"
      infoTitle="How to edit your information"
      infoDescription="Now, you are about to enter details about your home, life, and essential information to be passed on to your family members. Each section has several questions. Fill out as much as you can/like. You can always come back to fill out more information later."
      topics={topics}
      user={user}
      onPrint={() => window.print()}
    />
  );
} 