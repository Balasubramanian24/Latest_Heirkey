import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AuthHeader from '../header/gradiantHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogOut } from 'lucide-react';

export default function UserProfile() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setUsername(user.username || '');
      if (user.image) {
        setImagePreview(user.image);
      }
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // TODO: Implement profile update using authService
      // For now, just show a success message
      setSuccess('Profile updated successfully!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    return 'UN';
  };

  return (
    <>
      <AuthHeader title={`Welcome, ${firstName || username || 'User'}`} />

      <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl sm:text-2xl text-gray-900">Profile Settings</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOut size={16} />
              Logout
            </Button>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              {/* Profile Image Section */}
              <div className="flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                  {imagePreview ? (
                    <AvatarImage
                      src={imagePreview}
                      alt="Profile"
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback>{getInitials()}</AvatarFallback>
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
                    onChange={handleImageChange}
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                  value={email}
                  className="mt-1 w-full bg-gray-50"
                  disabled
                />
                <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-[#22BBCC] text-white hover:bg-[#22BBCA]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
