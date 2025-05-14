import { Link } from 'react-router-dom';
import { Avatar } from '@radix-ui/react-avatar';

interface SubCategoryHeaderProps {
  title: string;
  backTo: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

const SubCategoryHeader = ({ title, backTo, user }: SubCategoryHeaderProps) => (
  <div className="w-full bg-gradient-to-r from-[#183153] to-[#1ccfc9] py-7 px-0 mb-0">
    <div className="container mx-auto flex items-center justify-between px-6">
      <div>
        <div className="text-3xl font-bold text-white mb-1">{title}</div>
        <div>
          <Link to={backTo} className="text-white text-base opacity-90 hover:underline flex items-center">
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
);

export default SubCategoryHeader; 