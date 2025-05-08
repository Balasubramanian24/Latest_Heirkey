import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"
import logoHeader from "@/assets/webappimage/logo/logoHeader.png"
import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header className="bg-[#1F4168] text-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center h-20 justify-between">
        <div className="flex items-center space-x-6">
          <img src={logoHeader} alt="Heirkey Logo" className="h-12 w-auto" />

          <NavigationMenu>
            <NavigationMenuList className="gap-5">

              {/* About */}
              <NavigationMenuItem>
                <Link to="/about" className="hover:underline">About</Link>
              </NavigationMenuItem>

              {/* Plans Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="hover:bg-[#274877] hover:underline flex items-center bg-transparent rounded-none shadow-none focus:bg-[#274877] data-[state=open]:bg-[#274877] data-[state=open]:rounded-md"
                >
                  Plans
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 w-48 text-black">
                    <li><Link to="/plans/basic" className="block px-2 py-1 hover:bg-gray-100 rounded">Basic</Link></li>
                    <li><Link to="/plans/premium" className="block px-2 py-1 hover:bg-gray-100 rounded">Premium</Link></li>
                    <li><Link to="/plans/enterprise" className="block px-2 py-1 hover:bg-gray-100 rounded">Enterprise</Link></li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Blog Dropdown */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="hover:bg-[#274877] hover:underline flex items-center bg-transparent rounded-none shadow-none focus:bg-[#274877] data-[state=open]:bg-[#274877] data-[state=open]:rounded-md">
                  Blog
                </NavigationMenuTrigger>
                <NavigationMenuContent >
                  <ul className="grid gap-2 w-48 text-black">
                    <li><Link to="/blog/latest" className="block px-2 py-1 hover:bg-gray-100 rounded">Latest Posts</Link></li>
                    <li><Link to="/blog/guides" className="block px-2 py-1 hover:bg-gray-100 rounded">Guides</Link></li>
                    <li><Link to="/blog/stories" className="block px-2 py-1 hover:bg-gray-100 rounded">User Stories</Link></li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Contact */}
              <NavigationMenuItem>
                <Link to="/contact" className="hover:underline">Contact</Link>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Call to Action Buttons */}
        <div className="hidden md:flex gap-4">
          <Button variant="secondary" className="bg-white text-[#1F4168] hover:bg-gray-200">
            Directory
          </Button>
          <Button variant="secondary" className="bg-[#2BCFD5] text-white hover:bg-[#2BCFD5]">
            Dashboard
          </Button>
        </div>
      </div>
    </header>
  )
}
