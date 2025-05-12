import { Link } from 'react-router-dom'
import { Avatar } from '@radix-ui/react-avatar'
import AppHeader from '@/web/components/Layout/AppHeader'
import Footer from '@/web/components/Layout/Footer'
import SearchPanel from '@/web/pages/Global/SearchPanel'

// Import images
import homeImg from '@/assets/category/home.jpg'
import documentsImg from '@/assets/category/documents.jpg'
import willImg from '@/assets/category/will.jpg'
import funeralImg from '@/assets/category/funeral.jpg'
import contactImg from '@/assets/category/contact.jpg'
import socialMediaImg from '@/assets/category/socialMedia.jpg'

const CategoryCard = ({ 
  title, 
  imageSrc, 
  questionCount, 
  path 
}: { 
  title: string; 
  imageSrc: string; 
  questionCount: string; 
  path: string;
}) => {
  return (
    <div className="relative flex flex-col rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
      <Link to={path} className="block">
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h3 className="font-medium">{title}</h3>
          <span className="text-sm text-blue-400">{questionCount}</span>
        </div>
      </Link>
    </div>
  )
}


const Dashboard = () => {
  const user = {
    name: 'Francis Nixon',
    email: 'fnixon35@hotmail.com',
    avatar: '/heirkey.svg'
  }
  
  const categories = [
    {
      title: 'Home Instructions',
      imageSrc: homeImg,
      questionCount: '0/5 questions',
      path: '/home-instructions'
    },
    {
      title: 'Home Documents',
      imageSrc: documentsImg,
      questionCount: '0/26 questions',
      path: '/home-documents'
    },
    {
      title: 'Will Location',
      imageSrc: willImg,
      questionCount: '0/3 questions',
      path: '/will-location'
    },
    {
      title: 'Funeral Arrangements',
      imageSrc: funeralImg,
      questionCount: '0/12',
      path: '/funeral-arrangements'
    },
    {
      title: 'Important Contacts',
      imageSrc: contactImg,
      questionCount: '0/12',
      path: '/important-contacts'
    },
    {
      title: 'Social Media',
      imageSrc: socialMediaImg,
      questionCount: '0/12',
      path: '/social-media'
    }
  ]

  return (
    <div className="flex flex-col">
      <AppHeader />
      <div className="bg-gradient-to-r from-[#183153] to-[#1ccfc9] text-white py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
              <Link to="/" className="flex items-center text-sm hover:underline">
                <span className="mr-1">←</span> Back Home
              </Link>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-4">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm opacity-80">{user.email}</div>
              </div>
              <Avatar className="rounded-full w-14 h-14 bg-white overflow-hidden">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {categories.map((category, index) => (
                <CategoryCard 
                  key={index}
                  title={category.title}
                  imageSrc={category.imageSrc}
                  questionCount={category.questionCount}
                  path={category.path}
                />
              ))}
            </div>
          </div>

          <div>
            <SearchPanel />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
