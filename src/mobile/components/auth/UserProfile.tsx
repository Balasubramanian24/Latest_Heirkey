import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AuthHeader from '../header/gradiantHeader';

export default function UserProfile() {
  return (
    <>
      <AuthHeader title="Welcome, User" />

      <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-gray-900">Profile Settings</CardTitle>
          </CardHeader>

          <CardContent>
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
                  <Label
                    htmlFor="profileImage"
                    className="cursor-pointer text-sm text-[#22BBCC] hover:text-[#22BBCA]"
                  >
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
                <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  className="mt-1 w-full"
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  className="mt-1 w-full"
                />
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </Label>
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}
