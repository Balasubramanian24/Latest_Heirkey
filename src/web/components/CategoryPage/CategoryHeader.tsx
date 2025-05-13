import { Link } from 'react-router-dom'
import { Avatar } from '@radix-ui/react-avatar'
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg'

interface CategoryHeaderProps {
  title: string
  userName: string
  userEmail: string
  userAvatar?: string
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  title,
  userName,
  userEmail,
  userAvatar = avatar
}) => {
  return (
    <div className="bg-gradient-to-r from-[#183153] to-[#1ccfc9] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">{title}</h1>
            <Link to="/dashboard" className="flex items-center text-sm hover:underline">
              <span className="mr-1">←</span> Back Home
            </Link>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-4">
              <div className="font-semibold">{userName}</div>
              <div className="text-sm opacity-80">{userEmail}</div>
            </div>
            <Avatar className="rounded-full w-14 h-14 bg-white overflow-hidden">
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryHeader 