import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { KeySquare, Menu, LogOut, User, Settings, HelpCircle } from 'lucide-react';
import { UserAvatar } from '@/mobile/components/layout/UserAvatar';
import logoOne from '@/assets/mobileimage/logo/logoOne.png';
import logoTwo from '@/assets/mobileimage/logo/logoTwo.png';

export default function Header({
  isLandingPage,
  isAuthenticated,
  showAuthButtons,
  user,
  handleLogout,
}: {
  isLandingPage: boolean;
  isAuthenticated: boolean;
  user: any;
  showAuthButtons: boolean;
  handleLogout: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentLogo = location.pathname.startsWith('/dashboard') ? logoTwo : logoOne;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        isLandingPage
          ? 'bg-[#1F4168] text-white'
          : 'bg-white text-secondary-900 border-b border-border shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src={currentLogo}
            alt="HeirKey Logo"
            className="h-12 md:h-14 w-auto object-contain"
          />
        </Link>

        {/* Mobile Navigation Only */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden transition-colors ${
                isLandingPage ? 'text-white' : 'text-secondary-900'
              }`}
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-6 py-6">
              <div className="flex items-center">
                <img
                  src={currentLogo}
                  alt="HeirKey Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>

              <div className="flex flex-col gap-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <UserAvatar user={user} />
                      <div>
                        <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>

                    <Button variant="ghost" className="justify-start" onClick={() => {
                      navigate('/profile');
                      setIsOpen(false);
                    }}>
                      <User className="mr-2 h-5 w-5" />
                      Profile
                    </Button>

                    <Button variant="ghost" className="justify-start" onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}>
                      <KeySquare className="mr-2 h-5 w-5" />
                      Dashboard
                    </Button>

                    <Button variant="ghost" className="justify-start" onClick={() => {
                      navigate('/settings');
                      setIsOpen(false);
                    }}>
                      <Settings className="mr-2 h-5 w-5" />
                      Settings
                    </Button>

                    <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                      <LogOut className="mr-2 h-5 w-5" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    {showAuthButtons && (
                      <div className="flex flex-col gap-4">
                        <Button variant="ghost" className="justify-start" onClick={() => {
                          navigate('/auth/login');
                          setIsOpen(false);
                        }}>
                          Log in
                        </Button>
                        <Button className="justify-start" onClick={() => {
                          navigate('/auth/register');
                          setIsOpen(false);
                        }}>
                          Sign up
                        </Button>
                      </div>
                    )}
                  </>
                )}

                <Button variant="ghost" className="justify-start mt-4" onClick={() => {
                  navigate('/help');
                  setIsOpen(false);
                }}>
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Help & Support
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
