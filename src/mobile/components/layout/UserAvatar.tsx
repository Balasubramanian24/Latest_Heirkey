import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import defaultAvatar from '@/assets/global/defaultAvatar/defaultImage.jpg';

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
        <AvatarImage src={defaultAvatar} alt="Default avatar" />
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
    if (!imagePath || imagePath.includes('defaultImage.jpg')) return undefined;
    return `${import.meta.env.VITE_API_URL}/uploads/${imagePath}`;
  };

  const imageSrc = getImagePath() || defaultAvatar;

  return (
    <Avatar className={className}>
      <AvatarImage
        src={imageSrc}
        alt={`${user.firstName || 'User'}'s avatar`}
      />
      <AvatarFallback>{getInitials()}</AvatarFallback>
    </Avatar>
  );
} 