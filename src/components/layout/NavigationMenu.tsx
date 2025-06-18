import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ShoppingCart, User, Search, Utensils } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface NavigationMenuProps {
  navItems?: NavItem[];
  showSearch?: boolean;
  appName?: string;
  onCartClick?: () => void;
  onProfileClick?: () => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  navItems = [
    { href: '/', label: 'Home' },
    { href: '/orders', label: 'My Orders' },
  ],
  showSearch = true,
  appName = 'FoodieApp',
  onCartClick,
  onProfileClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  console.log("Rendering NavigationMenu. Mobile menu open:", isMobileMenuOpen);

  const defaultCartClick = () => console.log('Cart icon clicked, navigate to /cart');
  const defaultProfileClick = () => console.log('Profile icon clicked, navigate to /profile');

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-orange-500">
            <Utensils className="h-7 w-7" />
            <span>{appName}</span>
          </Link>

          {/* Desktop Search (optional) */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Input type="search" placeholder="Search restaurants or dishes..." className="pl-10 w-full" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} className="text-gray-600 hover:text-orange-500 transition-colors">
                {item.label}
              </Link>
            ))}
            <Button variant="ghost" size="icon" onClick={onCartClick || defaultCartClick} aria-label="Cart">
              <ShoppingCart className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onProfileClick || defaultProfileClick} aria-label="Profile">
              <User className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>
                    <Link to="/" className="flex items-center space-x-2 text-lg font-bold text-orange-500" onClick={() => setIsMobileMenuOpen(false)}>
                      <Utensils className="h-6 w-6" />
                      <span>{appName}</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-3">
                  {showSearch && (
                    <div className="relative w-full mb-3">
                      <Input type="search" placeholder="Search..." className="pl-10 w-full" />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center space-x-3 p-2 rounded-md text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <Button variant="ghost" className="w-full justify-start p-2 space-x-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600" onClick={() => { onCartClick ? onCartClick() : defaultCartClick(); setIsMobileMenuOpen(false); }}>
                    <ShoppingCart className="h-5 w-5" />
                    <span>View Cart</span>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-2 space-x-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600" onClick={() => { onProfileClick ? onProfileClick() : defaultProfileClick(); setIsMobileMenuOpen(false); }}>
                    <User className="h-5 w-5" />
                    <span>My Profile</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {/* Mobile Search (optional, can be outside the menu or within) */}
        {showSearch && (
            <div className="md:hidden pb-3 px-1">
              <div className="relative w-full">
                <Input type="search" placeholder="Search restaurants or dishes..." className="pl-10 w-full" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}
      </div>
    </nav>
  );
};

export default NavigationMenu;