import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import MenuItemCard from '@/components/MenuItemCard';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Utensils, ArrowLeft, ShoppingCart, PlusCircle, MinusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Placeholder data - in a real app, this would come from an API
const placeholderRestaurantsData: { [key: string]: any } = {
  '1': {
    name: 'Pizza Heaven',
    logoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60',
    bannerUrl: 'https://images.unsplash.com/photo-1593504049358-7433075513ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBpenphJTIwcmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    rating: 4.5,
    deliveryTime: '25-35 min',
    cuisine: 'Italian, Pizza',
    menu: {
      'Appetizers': [
        { id: 'a1', name: 'Garlic Knots', description: 'Served with marinara sauce.', price: 6.99, imageUrl: 'https://images.unsplash.com/photo-1627042634067-673ac7ea0a4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2FybGljJTIwa25vdHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60' },
      ],
      'Pizzas': [
        { id: 'p1', name: 'Margherita Pizza', description: 'Classic cheese and tomato.', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', customizable: true },
        { id: 'p2', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni.', price: 14.99, imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVwcGVyb25pJTIwcGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', customizable: true },
      ],
      'Drinks': [
        { id: 'd1', name: 'Coke', description: 'Refreshing Coca-Cola.', price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29rZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=300&q=60' },
      ],
    }
  },
  // Add more restaurants if needed
};

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  customizable?: boolean;
  options?: { type: 'radio' | 'checkbox'; label: string; choices: { name: string; priceChange?: number }[] }[];
}

interface CartItem extends MenuItem {
  quantity: number;
}

const RestaurantMenuPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCustomizationDialogOpen, setIsCustomizationDialogOpen] = useState(false);
  const [currentItemForCustomization, setCurrentItemForCustomization] = useState<MenuItem | null>(null);
  const [customizationOptions, setCustomizationOptions] = useState<any>({});


  useEffect(() => {
    console.log(`RestaurantMenuPage loaded for restaurant ID: ${restaurantId}`);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = placeholderRestaurantsData[restaurantId || ''] || placeholderRestaurantsData['1']; // Fallback to first restaurant
      setRestaurant(data);
      setIsLoading(false);
    }, 1000);
  }, [restaurantId]);

  const handleAddToCart = (itemId: string | number) => {
    const itemToAdd = Object.values(restaurant.menu).flat().find((item: any) => item.id === itemId) as MenuItem | undefined;
    if (!itemToAdd) return;

    if (itemToAdd.customizable) {
        setCurrentItemForCustomization(itemToAdd);
        setCustomizationOptions({}); // Reset options
        setIsCustomizationDialogOpen(true);
    } else {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === itemId);
            if (existingItem) {
            return prevCart.map(item => item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prevCart, { ...itemToAdd, quantity: 1 }];
        });
        console.log('Added to cart:', itemToAdd.name);
    }
  };
  
  const handleCustomizationSubmit = () => {
    if (!currentItemForCustomization) return;
    // Here you would typically save the item with its selected customizations
    // For this placeholder, we'll just add it to cart like a non-customized item
    setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === currentItemForCustomization.id && JSON.stringify(item.options) === JSON.stringify(customizationOptions)); // Basic check for "same" customized item
        if (existingItem) {
        return prevCart.map(item => item.id === currentItemForCustomization.id && JSON.stringify(item.options) === JSON.stringify(customizationOptions) ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prevCart, { ...currentItemForCustomization, quantity: 1, options: customizationOptions }];
    });
    console.log('Added customized item to cart:', currentItemForCustomization.name, 'with options:', customizationOptions);
    setIsCustomizationDialogOpen(false);
    setCurrentItemForCustomization(null);
  };

  const getTotalCartItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavigationMenu appName="FoodieApp" showSearch={false} onCartClick={() => navigate('/cart')} />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-48 w-full mb-6" />
          <div className="flex items-center space-x-4 mb-6">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <NavigationMenu appName="FoodieApp" showSearch={false} onCartClick={() => navigate('/cart')} />
        <Utensils className="h-16 w-16 text-gray-400 mb-4" />
        <p className="text-xl text-gray-600">Restaurant not found.</p>
        <Button onClick={() => navigate('/')} className="mt-4">Go Back</Button>
      </div>
    );
  }
  
  const navItems = [
    { href: '/', label: 'Discover', icon: <Utensils className="h-5 w-5" /> },
    { href: '/orders', label: 'My Orders', icon: <Clock className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20"> {/* Padding bottom for sticky button */}
      <NavigationMenu
        navItems={navItems}
        appName="FoodieApp"
        showSearch={false}
        onCartClick={() => navigate('/cart')}
        onProfileClick={() => console.log("Profile clicked")}
      />

      {/* Restaurant Banner & Info */}
      <header className="relative">
        <img src={restaurant.bannerUrl || 'https://via.placeholder.com/1200x300?text=Restaurant+Banner'} alt={`${restaurant.name} banner`} className="w-full h-48 md:h-64 object-cover"/>
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="absolute top-4 left-4 text-white bg-black bg-opacity-50 hover:bg-opacity-75">
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </header>

      <div className="container mx-auto px-4 -mt-16 ">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src={restaurant.logoUrl} alt={restaurant.name} />
                <AvatarFallback>{restaurant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
                <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
                <p className="text-gray-600 text-sm">{restaurant.cuisine}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" /> {restaurant.rating}
                </div>
                <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-1" /> {restaurant.deliveryTime}
                </div>
                </div>
            </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue={Object.keys(restaurant.menu)[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap gap-2 mb-6 justify-start bg-transparent p-0">
            {Object.keys(restaurant.menu).map(category => (
              <TabsTrigger key={category} value={category} className="data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=inactive]:bg-white">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollArea className="h-auto"> {/* Adjust height as needed, or let content define it */}
            {Object.entries(restaurant.menu).map(([category, items]) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(items as MenuItem[]).map(item => (
                    <MenuItemCard
                      key={item.id}
                      {...item}
                      onAddToCart={() => handleAddToCart(item.id)}
                      onCustomize={item.customizable ? () => { setCurrentItemForCustomization(item); setIsCustomizationDialogOpen(true); } : undefined}
                      variant="menu"
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>
      </main>

      {/* Customization Dialog */}
      <Dialog open={isCustomizationDialogOpen} onOpenChange={setIsCustomizationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Customize {currentItemForCustomization?.name}</DialogTitle>
            <DialogDescription>
              Make changes to your item here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Placeholder for customization options */}
            <p className="text-sm text-gray-600">Customization options for {currentItemForCustomization?.name} would go here.</p>
            <Label htmlFor="special-instructions">Special Instructions</Label>
            <textarea id="special-instructions" className="w-full p-2 border rounded-md" placeholder="e.g., extra spicy, no onions"></textarea>
            {/* Example: Size options using RadioGroup could be added if 'currentItemForCustomization.options' was populated */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomizationDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleCustomizationSubmit}>Add to Cart</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sticky View Cart Button */}
      {getTotalCartItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-top z-40">
          <Button className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600" onClick={() => navigate('/cart', { state: { cart }})}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            View Cart ({getTotalCartItems()} items)
          </Button>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenuPage;