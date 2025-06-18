import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import MenuItemCard from '@/components/MenuItemCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, ArrowLeft, Utensils, Clock } from 'lucide-react';

interface CartItemType {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  options?: any; // For customized options
}

const CartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    console.log('CartPage loaded');
    // Attempt to load cart from location state (passed from RestaurantMenuPage)
    // In a real app, this would come from a global state (Context, Redux, Zustand) or localStorage
    if (location.state?.cart) {
      setCartItems(location.state.cart);
    } else {
      // Placeholder cart items if nothing is passed
      setCartItems([
        { id: 'p1', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFyZ2hlcml0YSUyMHBpenphfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60' },
        { id: 'd1', name: 'Coke', price: 2.50, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29rZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=100&q=60' },
      ]);
    }
  }, [location.state]);

  const handleQuantityChange = (id: string | number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(id);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const handleRemoveFromCart = (id: string | number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxes = subtotal * 0.08; // Example tax rate
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0; // Example delivery fee
  const total = subtotal + taxes + deliveryFee;

  const navItems = [
    { href: '/', label: 'Discover', icon: <Utensils className="h-5 w-5" /> },
    { href: '/orders', label: 'My Orders', icon: <Clock className="h-5 w-5" /> },
  ];

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavigationMenu appName="FoodieApp" navItems={navItems} onCartClick={() => navigate('/cart')} showSearch={false}/>
        <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
          <ShoppingCart className="h-24 w-24 text-gray-300 mb-6" />
          <h1 className="text-2xl font-semibold text-gray-700 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Start Shopping
          </Button>
        </main>
         <footer className="py-6 text-center text-sm text-gray-500 border-t">
            © {new Date().getFullYear()} FoodieApp. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu appName="FoodieApp" navItems={navItems} onCartClick={() => navigate('/cart')} showSearch={false}/>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] pr-6"> {/* Added pr-6 to prevent scrollbar overlap with content */}
                  <div className="divide-y">
                    {cartItems.map(item => (
                      <MenuItemCard
                        key={item.id}
                        {...item}
                        variant="cart"
                        quantity={item.quantity}
                        onQuantityChange={handleQuantityChange}
                        onRemoveFromCart={handleRemoveFromCart}
                        // onCustomize could navigate back to menu item with pre-filled state or open a modal
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <Label htmlFor="promo-code">Promo Code</Label>
                </div>
                 <div className="flex space-x-2">
                  <Input 
                    id="promo-code" 
                    placeholder="Enter code" 
                    value={promoCode} 
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline" onClick={() => console.log("Applied promo: ", promoCode)}>Apply</Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Subtotal</Label>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <Label>Taxes (8%)</Label>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <Label>Delivery Fee</Label>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <Label>Total</Label>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600" onClick={() => navigate('/checkout', { state: { cartItems, total } })}>
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
       <footer className="py-6 text-center text-sm text-gray-500 border-t bg-white">
            © {new Date().getFullYear()} FoodieApp. All rights reserved.
        </footer>
    </div>
  );
};

export default CartPage;