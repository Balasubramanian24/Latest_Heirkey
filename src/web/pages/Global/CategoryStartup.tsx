import SearchPanel from './SearchPanel';
import Footer from '@/web/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AppHeader from '@/web/components/Layout/AppHeader';
import { Avatar } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import avatar from '@/assets/global/defaultAvatar/defaultImage.jpg'
import { useAuth } from '@/contexts/AuthContext';

export default function CategoryStartup({ category = 'Topic' }: { category?: string }) {
  const [showInfo, setShowInfo] = useState(true);
  const { user } = useAuth();

  // Fallback user info if not authenticated
  const userInfo = {
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Guest',
    email: user?.email || 'guest@example.com',
    avatar: user?.image || avatar
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <AppHeader />
      <div className="bg-gradient-to-r from-[#183153] to-[#1ccfc9] text-white py-4 pt-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Topic</h1>
              <Link to="/" className="flex items-center text-sm hover:underline">
                <span className="mr-1">←</span> Back Home
              </Link>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-4">
                <div className="font-semibold">{userInfo.name}</div>
                <div className="text-sm opacity-80">{userInfo.email}</div>
              </div>
              <Avatar className="rounded-full w-14 h-14 bg-white overflow-hidden">
                <img 
                  src={userInfo.avatar} 
                  alt={userInfo.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = avatar; // Fallback to default avatar
                  }}
                />
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="flex gap-2 mb-6">
            {[...Array(8)].map((_, i) => (
              <Button key={i} variant={i === 0 ? 'default' : 'outline'} className="rounded-none px-6 py-2 text-sm font-medium">
                Topic
              </Button>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-2">
            Category: <span className="text-[#1ccfc9]">{category.toUpperCase().replace(' ', ' ')}</span>
          </h2>

          {showInfo && (
            <div className="bg-[#f3f4fa] border border-[#cfd8dc] rounded-lg p-4 mb-4 relative">
              <div className="flex justify-between items-center">
                <span className="text-[#5b3fd2] font-semibold">How to edit your information</span>
                <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-gray-700 text-lg font-bold">×</button>
              </div>
              <p className="text-gray-700 text-sm mt-2">
                Now, you are about to enter details about your home, life, and essential information to be passed on to your family members. Each section has several questions. Fill out as much as you can/like. You can always come back to fill out more information later.
              </p>
            </div>
          )}

          <div className="flex gap-4 mb-8">
            <Link to={"/dashboard"}>
              <Button variant="outline" className="flex-1">Back to All Categories</Button>
            </Link>
            <Link to={`/category/${category.toLowerCase()}/info`}>
              <Button className="flex-1 bg-[#1ccfc9] hover:bg-[#19bbb5]">Get Started with {category}</Button>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-[400px]">
          <SearchPanel />
        </div>
      </div>
      <Footer />
    </div>
  );
} 