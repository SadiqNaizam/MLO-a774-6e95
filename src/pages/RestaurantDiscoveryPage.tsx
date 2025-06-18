import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import RestaurantCard from '@/components/RestaurantCard';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Filter, Search, Utensils, Star, ClockIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const placeholderRestaurants = [
  { id: '1', name: 'Pizza Heaven', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Pizza', 'Italian'], rating: 4.5, deliveryTime: '25-35 min' },
  { id: '2', name: 'Burger Joint', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Burgers', 'American'], rating: 4.2, deliveryTime: '20-30 min' },
  { id: '3', name: 'Sushi World', imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Sushi', 'Japanese'], rating: 4.8, deliveryTime: '30-40 min' },
  { id: '4', name: 'Taco Town', imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGFjb3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', cuisineTypes: ['Mexican', 'Tacos'], rating: 4.3, deliveryTime: '20-25 min' },
];

const cuisineOptions = ["Italian", "American", "Japanese", "Mexican", "Indian", "Chinese"];

const RestaurantDiscoveryPage = () => {
  const [restaurants, setRestaurants] = useState<typeof placeholderRestaurants>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('RestaurantDiscoveryPage loaded');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRestaurants(placeholderRestaurants);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleRestaurantClick = (id: string | number) => {
    navigate(`/restaurant/${id}`);
  };

  const handleCuisineChange = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };
  
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCuisines.length === 0 || restaurant.cuisineTypes.some(c => selectedCuisines.includes(c)))
  );

  const navItems = [
    { href: '/', label: 'Discover', icon: <Utensils className="h-5 w-5" /> },
    { href: '/orders', label: 'My Orders', icon: <ClockIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu
        navItems={navItems}
        appName="FoodieApp"
        onCartClick={() => navigate('/cart')}
        onProfileClick={() => console.log("Profile clicked from Discovery Page")} // Or navigate to a profile page
        showSearch={false} // We have a dedicated search bar on this page
      />

      <header className="py-6 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Find Your Next Meal</h1>
          <p className="text-center text-gray-600 mb-6">Discover amazing restaurants near you.</p>
          <div className="flex flex-col sm:flex-row gap-2 items-center max-w-2xl mx-auto">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search restaurants, cuisines..."
                className="pl-10 w-full h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-12 w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Options</SheetTitle>
                  <SheetDescription>
                    Narrow down your search by applying filters.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <h4 className="font-semibold mb-2">Cuisine</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {cuisineOptions.map(cuisine => (
                      <div key={cuisine} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cuisine-${cuisine}`}
                          checked={selectedCuisines.includes(cuisine)}
                          onCheckedChange={() => handleCuisineChange(cuisine)}
                        />
                        <Label htmlFor={`cuisine-${cuisine}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {cuisine}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {/* Add more filters here: Rating, Price Range, etc. */}
                </div>
                <SheetFooter>
                  <Button onClick={() => console.log("Filters applied", selectedCuisines)} className="w-full">Apply Filters</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <ScrollArea className="h-full"> {/* Adjust height as needed */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <Skeleton className="h-[180px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            filteredRestaurants.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRestaurants.map(restaurant => (
                    <RestaurantCard
                        key={restaurant.id}
                        {...restaurant}
                        onClick={handleRestaurantClick}
                    />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <Utensils className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No Restaurants Found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
                </div>
            )
          )}
        </ScrollArea>
      </main>
      <footer className="py-6 text-center text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} FoodieApp. All rights reserved.
      </footer>
    </div>
  );
};

export default RestaurantDiscoveryPage;