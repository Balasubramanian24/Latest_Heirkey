import { Button } from "@/components/ui/button"
import logoHeader from "@/assets/webappimage/logo/logoHeader.png"
import { Link, useNavigate } from "react-router-dom"
import { Bell, Settings, LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AppHeader() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white text-[#1F4168] shadow-sm fixed top-0 left-0 right-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center h-20 justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img src={logoHeader} alt="Heirkey Logo" className="h-12 w-auto" />
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="hover:underline font-medium">Home</Link>
            <Link to="/dashboard" className="hover:underline font-medium">Dashboard</Link>
            <Link to="/directory" className="hover:underline font-medium">Directory</Link>
            <Link to="/support" className="hover:underline font-medium">Support</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="font-medium">Subscribe</Button>

          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/auth/user-profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!isAuthenticated && (
            <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
              <Settings className="w-5 h-5" />
            </Button>
          )}

          <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
        </div>
      </div>
    </header>
  )
}
