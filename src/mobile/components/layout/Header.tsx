import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { 
  KeySquare, 
  Menu, 
  LogOut, 
  User, 
  HelpCircle, 
  Bell, 
  Mail, 
  Home,
  Settings,
  FileText,
  Phone,
  Info,
  BookOpen,
  Newspaper,
  Mail as MailIcon,
  LogIn,
  UserPlus
} from 'lucide-react';
import { UserAvatar } from '@/mobile/components/layout/UserAvatar';
import logoOne from '@/assets/mobileimage/logo/logoOne.png';
import logoTwo from '@/assets/mobileimage/logo/logoTwo.png';
import { useAuth } from '@/contexts/AuthContext';

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
  const { logout } = useAuth();

  const currentLogo = location.pathname.startsWith('/dashboard') ? logoTwo : logoOne;

  const renderLandingLinks = () => (
    <nav className="hidden md:flex items-center space-x-6">
      <Link to="/about" className="text-white hover:text-[#2BCFD5] font-medium">About</Link>
      <Link to="/plans" className="text-white hover:text-[#2BCFD5] font-medium">Plans</Link>
      <Link to="/blog" className="text-white hover:text-[#2BCFD5] font-medium">Blog</Link>
      <Link to="/contact" className="text-white hover:text-[#2BCFD5] font-medium">Contact</Link>
    </nav>
  );

  const renderAppLinks = () => (
    <nav className="hidden md:flex items-center space-x-6">
      <Link to="/" className="text-secondary-900 hover:text-[#2BCFD5] font-medium">Home</Link>
      <Link to="/dashboard" className="text-secondary-900 hover:text-[#2BCFD5] font-medium">Dashboard</Link>
      <Link to="/directory" className="text-secondary-900 hover:text-[#2BCFD5] font-medium">Directory</Link>
      <Link to="/support" className="text-secondary-900 hover:text-[#2BCFD5] font-medium">Support</Link>
    </nav>
  );

  const renderDesktopButtons = () => {
    if (isLandingPage) {
      return (
        <div className="hidden md:flex gap-2">
          <Button variant="secondary" className="bg-white text-[#1F4168] hover:bg-gray-200 font-medium">Directory</Button>
          <Button variant="secondary" className="bg-[#2BCFD5] text-white hover:bg-[#2BCFD5]/90 font-medium">Dashboard</Button>
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" className="font-medium">Subscribe</Button>
          <Button variant="ghost" size="icon"><Settings className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
          <UserAvatar user={user} />
        </div>
      );
    }

    return null;
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        isLandingPage
          ? 'bg-[#1F4168] text-white'
          : 'bg-white text-secondary-900 border-b border-border shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link to="/" className="flex items-center">
            <img
              src={currentLogo}
              alt="HeirKey Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>
          {isLandingPage ? renderLandingLinks() : renderAppLinks()}
        </div>

        {renderDesktopButtons()}

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden transition-colors ${
                isLandingPage ? 'text-white' : 'text-secondary-900'
              }`}
            >
              <Menu className="w-7 h-7" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">Main navigation and user options</SheetDescription>
            <div className="flex flex-col h-full bg-gray-50">
              {/* Header: Only logo, no close/hamburger icon */}
              <div className="p-6 bg-white border-b flex items-center justify-between">
                <img
                  src={currentLogo}
                  alt="HeirKey Logo"
                  className="h-8 w-18 object-contain"
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                {isAuthenticated ? (
                  <>
                    {/* User Profile Card */}
                    <div className="p-6 mb-4 bg-gradient-to-br from-[#1F2668] to-[#22BBCC] text-white">
                      <div className="flex items-start gap-4">
                        <UserAvatar user={user} className="h-12 w-12" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {user?.firstName} {user?.lastName}
                          </h3>
                          <div className="flex items-center gap-2 opacity-80 mt-1">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">{user?.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subscribe Button */}
                    <div className="px-3 mb-2">
                      <Button 
                        variant="outline" 
                        className="w-full font-bold mb-2 bg-white border-2 border-[#2BCFD5] text-[#2BCFD5] shadow-sm hover:bg-[#2BCFD5]/10 flex items-center justify-center gap-2"
                      >
                        <Bell className="w-5 h-5 mr-2" />
                        <span className="text-lg">Subscribe</span>
                      </Button>
                    </div>

                    {/* Navigation Links with icons */}
                    <div className="px-3">
                      <div className="space-y-1">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start h-12" 
                          onClick={() => {
                            navigate('/');
                            setIsOpen(false);
                          }}
                        >
                          <Home className="mr-3 h-5 w-5" />
                          Home
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start h-12" 
                          onClick={() => {
                            navigate('/dashboard');
                            setIsOpen(false);
                          }}
                        >
                          <KeySquare className="mr-3 h-5 w-5" />
                          Dashboard
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start h-12" 
                          onClick={() => {
                            navigate('/auth/user-profile');
                            setIsOpen(false);
                          }}
                        >
                          <User className="mr-3 h-5 w-5" />
                          Profile
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start h-12" 
                          onClick={() => {
                            navigate('/settings');
                            setIsOpen(false);
                          }}
                        >
                          <Settings className="mr-3 h-5 w-5" />
                          Settings
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start h-12" 
                          onClick={() => {
                            navigate('/directory');
                            setIsOpen(false);
                          }}
                        >
                          <FileText className="mr-3 h-5 w-5" />
                          Directory
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start h-12" 
                          onClick={() => {
                            navigate('/support');
                            setIsOpen(false);
                          }}
                        >
                          <Phone className="mr-3 h-5 w-5" />
                          Support
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {showAuthButtons && (
                      <div className="p-6 space-y-3">
                        <Button 
                          variant="outline" 
                          className="w-full justify-center h-11 flex items-center gap-2"
                          onClick={() => {
                            navigate('/auth/login');
                            setIsOpen(false);
                          }}
                        >
                          <LogIn className="w-5 h-5" />
                          Log in
                        </Button>
                        <Button 
                          className="w-full justify-center h-11 bg-[#2BCFD5] hover:bg-[#2BCFD5]/90 flex items-center gap-2"
                          onClick={() => {
                            navigate('/auth/register');
                            setIsOpen(false);
                          }}
                        >
                          <UserPlus className="w-5 h-5" />
                          Sign up
                        </Button>
                      </div>
                    )}

                    <div className="px-6 py-4 border-t">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Quick Links</h4>
                      <div className="space-y-2">
                        <Link to="/about" className="py-2 hover:text-[#2BCFD5] transition-colors flex items-center gap-2">
                          <Info className="w-5 h-5" /> About
                        </Link>
                        <Link to="/plans" className="py-2 hover:text-[#2BCFD5] transition-colors flex items-center gap-2">
                          <BookOpen className="w-5 h-5" /> Plans
                        </Link>
                        <Link to="/blog" className="py-2 hover:text-[#2BCFD5] transition-colors flex items-center gap-2">
                          <Newspaper className="w-5 h-5" /> Blog
                        </Link>
                        <Link to="/contact" className="py-2 hover:text-[#2BCFD5] transition-colors flex items-center gap-2">
                          <MailIcon className="w-5 h-5" /> Contact
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Actions */}
              {isAuthenticated && (
                <div className="p-4 border-t bg-white mt-auto">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-12 text-red-500 hover:text-red-600 hover:bg-red-50" 
                    onClick={logout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Log out
                  </Button>
                </div>
              )}

              <div className="p-4 border-t bg-white">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-12" 
                  onClick={() => {
                    navigate('/help');
                    setIsOpen(false);
                  }}
                >
                  <HelpCircle className="mr-3 h-5 w-5" />
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
