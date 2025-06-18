import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, CreditCard, MapPin, Utensils, Clock } from 'lucide-react';

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  streetAddress: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid postal code"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
});

const paymentSchema = z.object({
  paymentMethod: z.enum(["creditCard", "paypal", "cash"], { required_error: "Payment method is required" }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
}).refine(data => {
    if (data.paymentMethod === 'creditCard') {
        return !!data.cardNumber && data.cardNumber.length === 16 && !!data.expiryDate && !!data.cvv && data.cvv.length === 3;
    }
    return true;
}, {
    message: "Credit card details are incomplete or invalid.",
    path: ["creditCard"], // General path for credit card errors
});

const checkoutSchema = z.object({}).merge(addressSchema).merge(paymentSchema).extend({
    deliveryInstructions: z.string().optional(),
});


type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      streetAddress: '',
      city: '',
      postalCode: '',
      phoneNumber: '',
      paymentMethod: undefined, // Explicitly undefined for RadioGroup
      deliveryInstructions: '',
    },
  });

  useEffect(() => {
    console.log('CheckoutPage loaded');
    if (location.state?.total) {
      setOrderTotal(location.state.total);
    } else {
      // If no total is passed, redirect or show error, for now, set a default
      setOrderTotal(50.00); // Placeholder
    }
  }, [location.state]);

  const onSubmit = (data: CheckoutFormData) => {
    console.log('Order submitted:', data);
    // Simulate API call for placing order
    setIsOrderConfirmed(true);
  };
  
  const navItems = [
    { href: '/', label: 'Discover', icon: <Utensils className="h-5 w-5" /> },
    { href: '/orders', label: 'My Orders', icon: <Clock className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu appName="FoodieApp" navItems={navItems} onCartClick={() => navigate('/cart')} showSearch={false}/>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate('/cart')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Accordion type="single" collapsible defaultValue="address" className="w-full">
                <AccordionItem value="address">
                  <AccordionTrigger className="text-xl font-semibold">
                    <div className="flex items-center"><MapPin className="mr-2 h-6 w-6 text-orange-500" /> Delivery Address</div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Anytown" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                     <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payment">
                  <AccordionTrigger className="text-xl font-semibold">
                    <div className="flex items-center"><CreditCard className="mr-2 h-6 w-6 text-orange-500" /> Payment Method</div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-4">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Select Payment Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="creditCard" />
                                </FormControl>
                                <FormLabel className="font-normal">Credit Card</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="paypal" />
                                </FormControl>
                                <FormLabel className="font-normal">PayPal</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="cash" />
                                </FormControl>
                                <FormLabel className="font-normal">Cash on Delivery</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.watch("paymentMethod") === "creditCard" && (
                        <div className="space-y-4 p-4 border rounded-md">
                             <FormField
                                control={form.control}
                                name="cardNumber"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                control={form.control}
                                name="expiryDate"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="cvv"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>CVV</FormLabel>
                                    <FormControl><Input placeholder="•••" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                        </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                 <AccordionItem value="instructions">
                  <AccordionTrigger className="text-xl font-semibold">Delivery Instructions (Optional)</AccordionTrigger>
                  <AccordionContent className="pt-4">
                     <FormField
                      control={form.control}
                      name="deliveryInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special notes for delivery</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g. Leave at front door, call upon arrival." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* In a real app, list cart items here */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <Label>Items Total</Label>
                    <span>${(orderTotal / 1.08 / 1.05).toFixed(2)}</span> {/* Rough estimate */}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <Label>Delivery Fee</Label>
                    <span>$5.00</span> {/* Placeholder */}
                  </div>
                   <div className="flex justify-between text-sm text-gray-600">
                    <Label>Taxes</Label>
                    <span>${(orderTotal * 0.08).toFixed(2)}</span> {/* Placeholder */}
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <Label>Total to Pay</Label>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Placing Order..." : "Place Order"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </main>

      <AlertDialog open={isOrderConfirmed} onOpenChange={setIsOrderConfirmed}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Order Confirmed!</AlertDialogTitle>
            <AlertDialogDescription>
              Your order has been placed successfully. You will be redirected to the order tracking page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate('/orders')}>Track Order</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <footer className="py-6 text-center text-sm text-gray-500 border-t bg-white">
            © {new Date().getFullYear()} FoodieApp. All rights reserved.
      </footer>
    </div>
  );
};

export default CheckoutPage;