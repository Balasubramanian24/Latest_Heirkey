import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from '../layout/UserAvatar';

interface AuthHeaderProps {
  title: string;
  showAvatar?: boolean;
}

export default function AuthHeader({ title, showAvatar = false }: AuthHeaderProps) {
  const { user } = useAuth();

  return (
    <div className="w-full md:w-1/2 bg-gradient-to-br from-[#1F2668] to-[#22BBCC] text-white">
      <div className="py-6 md:py-8 px-6 md:px-10 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {title}
            </h1>
            {showAvatar && (
              <div className="text-base md:text-lg opacity-80 mt-1">
                {user?.email}
              </div>
            )}
          </div>
          {showAvatar && (
            <div className="w-16 h-16 border-4 border-white rounded-full shadow-lg overflow-hidden">
              <UserAvatar user={user} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 