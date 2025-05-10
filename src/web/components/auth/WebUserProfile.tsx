import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import Header from '../Layout/Header';

export default function WebUserProfile() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Profile Settings
              </h2>
            </div>

            <form className="space-y-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center space-y-6">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage 
                      src="https://via.placeholder.com/200" 
                      alt="Profile"
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl">UN</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Label htmlFor="profileImage" className="cursor-pointer text-white text-sm font-medium">
                      Change Photo
                    </Label>
                  </div>
                </div>
                <Input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    className="h-12 text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  className="h-12 text-lg bg-gray-50"
                  disabled
                />
                <p className="text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="h-12 px-8 text-lg bg-[#22BBCC] text-white hover:bg-[#22BBCA] transition-colors duration-200"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 