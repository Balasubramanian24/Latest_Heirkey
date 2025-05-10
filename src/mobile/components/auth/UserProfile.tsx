import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import AuthHeader from './AuthHeader';

export default function UserProfile() {
  return (
    <>
      <AuthHeader title="Welcome, User" />

      <div className="min-h-scree py-4 sm:py-8 px-4 sm:px-6 lg:px-8">     
        <div className="max-w-md mx-auto p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Profile Settings
            </h2>
          </div>

          <form className="space-y-4 sm:space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                <AvatarImage 
                  src="https://via.placeholder.com/100" 
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center">
                <Label htmlFor="profileImage" className="cursor-pointer text-sm text-[#22BBCC] hover:text-[#22BBCA]">
                  Change Profile Picture
                </Label>
                <Input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                className="mt-1 w-full"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                className="mt-1 w-full"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                className="mt-1 w-full bg-gray-50"
                disabled
              />
              <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-[#22BBCC] text-white hover:bg-[#22BBCA]"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
