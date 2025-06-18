import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import OrderStatusTracker from '@/components/OrderStatusTracker';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Utensils, Package, Clock, History, ShoppingBag } from 'lucide-react';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'FAILED';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  restaurantName: string;
  restaurantImageUrl?: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
}

const placeholderOrders: Order[] = [
  {
    id: 'order1',
    orderNumber: 'ORD1001',
    date: '2024-07-28',
    restaurantName: 'Pizza Heaven',
    restaurantImageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGl6emF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60',
    status: 'OUT_FOR_DELIVERY',
    totalAmount: 25.99,
    items: [
      { id: 'p1', name: 'Margherita Pizza', quantity: 1, price: 12.99 },
      { id: 'd1', name: 'Coke', quantity: 2, price: 2.50 },
    ],
  },
  {
    id: 'order2',
    orderNumber: 'ORD1002',
    date: '2024-07-27',
    restaurantName: 'Burger Joint',
    restaurantImageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60',
    status: 'DELIVERED',
    totalAmount: 18.50,
    items: [{ id: 'b1', name: 'Cheeseburger', quantity: 1, price: 9.00 }, { id: 'f1', name: 'Fries', quantity: 1, price: 3.50 }],
  },
    {
    id: 'order3',
    orderNumber: 'ORD1003',
    date: '2024-07-29',
    restaurantName: 'Sushi World',
    restaurantImageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60',
    status: 'PREPARING',
    totalAmount: 32.75,
    items: [
      { id: 's1', name: 'Salmon Nigiri Set', quantity: 1, price: 15.00 },
      { id: 's2', name: 'California Roll', quantity: 1, price: 8.75 },
      { id: 'd2', name: 'Green Tea', quantity: 1, price: 3.00 },
    ],
  },
  {
    id: 'order4',
    orderNumber: 'ORD1004',
    date: '2024-07-26',
    restaurantName: 'Pizza Heaven',
    status: 'CANCELLED',
    totalAmount: 15.49,
    items: [{ id: 'p2', name: 'Pepperoni Pizza', quantity: 1, price: 15.49 }],
  },
];

const OrderManagementPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('OrderManagementPage loaded');
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrders(placeholderOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  const activeOrders = orders.filter(order => order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'FAILED');
  const pastOrders = orders.filter(order => order.status === 'DELIVERED' || order.status === 'CANCELLED' || order.status === 'FAILED');

  const handleReorder = (orderId: string) => {
    console.log('Reorder requested for:', orderId);
    // In a real app, this would likely repopulate the cart and navigate there
    const orderToReorder = orders.find(o => o.id === orderId);
    if (orderToReorder) {
        const cartItemsForReorder = orderToReorder.items.map(item => ({ ...item, restaurantId: orderToReorder.id /* or some other way to identify restaurant */ }));
        navigate('/cart', { state: { cart: cartItemsForReorder } }); // Simple re-cart, needs more logic for real scenario
    }
  };

  const navItems = [
    { href: '/', label: 'Discover', icon: <Utensils className="h-5 w-5" /> },
    { href: '/orders', label: 'My Orders', icon: <Clock className="h-5 w-5" /> },
  ];

  const renderOrderCard = (order: Order) => (
    <Card key={order.id} className="mb-6 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
            <div className="flex items-center mb-1">
                {order.restaurantImageUrl && <img src={order.restaurantImageUrl} alt={order.restaurantName} className="w-8 h-8 rounded-full mr-2 object-cover"/>}
                <CardTitle className="text-xl">{order.restaurantName}</CardTitle>
            </div>
          <CardDescription>Order #{order.orderNumber} - Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-orange-600">${order.totalAmount.toFixed(2)}</p>
          <Badge variant={order.status === 'DELIVERED' ? 'default' : (order.status === 'CANCELLED' || order.status === 'FAILED' ? 'destructive' : 'secondary')} className="mt-1">
             {order.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'FAILED' && (
          <div className="mb-4">
            <OrderStatusTracker currentStatus={order.status} />
          </div>
        )}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="items">
            <AccordionTrigger>View Items ({order.items.length})</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm">
                {order.items.map(item => (
                  <li key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded mr-3 object-cover"/>}
                        <span>{item.name} (x{item.quantity})</span>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm">View Receipt</Button>
        {(order.status === 'DELIVERED' || order.status === 'CANCELLED') && (
            <Button size="sm" onClick={() => handleReorder(order.id)}>Reorder</Button>
        )}
      </CardFooter>
    </Card>
  );
  
  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen">
            <NavigationMenu appName="FoodieApp" navItems={navItems} onCartClick={() => navigate('/cart')} showSearch={false}/>
            <main className="flex-grow container mx-auto px-4 py-8">
                 {Array.from({length: 3}).map((_, i) => (
                    <Card key={i} className="mb-6"><CardHeader><CardTitle><Utensils className="animate-pulse h-8 w-32 bg-gray-200 rounded"/></CardTitle></CardHeader><CardContent><Package className="animate-pulse h-20 w-full bg-gray-200 rounded"/></CardContent></Card>
                 ))}
            </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu appName="FoodieApp" navItems={navItems} onCartClick={() => navigate('/cart')} showSearch={false}/>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            <Button onClick={() => navigate('/')}><ShoppingBag className="mr-2 h-4 w-4"/> New Order</Button>
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <Clock className="mr-2 h-4 w-4" /> Active Orders ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <History className="mr-2 h-4 w-4" /> Past Orders ({pastOrders.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <ScrollArea className="h-auto"> {/* Adjust height or use max-height */}
              {activeOrders.length > 0 ? activeOrders.map(renderOrderCard) : (
                <div className="text-center py-10">
                    <Clock className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No Active Orders</h3>
                    <p className="mt-1 text-sm text-gray-500">Place a new order to see it here.</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="past">
            <ScrollArea className="h-auto">
              {pastOrders.length > 0 ? pastOrders.map(renderOrderCard) : (
                 <div className="text-center py-10">
                    <History className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No Past Orders</h3>
                    <p className="mt-1 text-sm text-gray-500">Your completed or cancelled orders will appear here.</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-6 text-center text-sm text-gray-500 border-t bg-white">
        © {new Date().getFullYear()} FoodieApp. All rights reserved.
      </footer>
    </div>
  );
};

export default OrderManagementPage;