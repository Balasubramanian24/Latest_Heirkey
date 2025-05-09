import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface UserAvatarProps {
  user: {
    image?: string;
    profileImage?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  if (!user) {
    return (
      <Avatar className={className}>
        <AvatarFallback>
          <User className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
    );
  }

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return '?';
  };

  const getImagePath = () => {
    const imagePath = user.image || user.profileImage;
    if (!imagePath) return undefined;
    return `${import.meta.env.VITE_API_URL}/uploads/${imagePath}`;
  };

  return (
    <Avatar className={className}>
      {(user.image || user.profileImage) ? (
        <AvatarImage
          src={getImagePath()}
          alt={`${user.firstName || 'User'}'s avatar`}
        />
      ) : null}
      <AvatarFallback>{getInitials()}</AvatarFallback>
    </Avatar>
  );
} 