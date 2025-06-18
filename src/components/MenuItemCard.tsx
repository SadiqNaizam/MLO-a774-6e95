import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PlusCircle, MinusCircle, Edit3, Trash2 } from 'lucide-react'; // Added Edit3 and Trash2 for cart variant

interface MenuItemCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  onAddToCart?: (id: string | number) => void;
  // Props for cart variant
  variant?: 'menu' | 'cart';
  quantity?: number;
  onQuantityChange?: (id: string | number, newQuantity: number) => void;
  onCustomize?: (id: string | number) => void; // For items that can be customized
  onRemoveFromCart?: (id: string | number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
  variant = 'menu',
  quantity,
  onQuantityChange,
  onCustomize,
  onRemoveFromCart,
}) => {
  console.log("Rendering MenuItemCard:", name, "Variant:", variant, "Quantity:", quantity);

  const handleAddToCart = () => {
    if (onAddToCart) {
      console.log("Add to cart clicked for item:", id);
      onAddToCart(id);
    }
  };

  const handleIncreaseQuantity = () => {
    if (onQuantityChange && quantity !== undefined) {
      onQuantityChange(id, quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (onQuantityChange && quantity !== undefined && quantity > 0) {
      onQuantityChange(id, quantity - 1); // If quantity becomes 0, CartPage might handle removal
    }
  };

  const handleRemove = () => {
    if (onRemoveFromCart) {
        onRemoveFromCart(id);
    }
  }

  return (
    <Card className="w-full flex flex-col md:flex-row overflow-hidden transition-shadow duration-300 hover:shadow-lg data-[variant=cart]:shadow-none data-[variant=cart]:border-b data-[variant=cart]:rounded-none" data-variant={variant}>
      {imageUrl && (
        <div className="md:w-1/3 w-full">
          <AspectRatio ratio={variant === 'cart' ? 1 : 4/3} className="bg-gray-100">
            <img
              src={imageUrl || '/placeholder.svg'}
              alt={name}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </AspectRatio>
        </div>
      )}
      <div className={`flex flex-col justify-between p-4 ${imageUrl ? 'md:w-2/3 w-full' : 'w-full'}`}>
        <CardContent className={`p-0 space-y-1 ${variant === 'cart' ? 'pb-2' : 'pb-4'}`}>
          <h4 className="text-md font-semibold leading-tight">{name}</h4>
          {description && <p className="text-xs text-gray-500 line-clamp-2">{description}</p>}
          <p className="text-sm font-medium text-orange-600">${price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-0">
          {variant === 'menu' && (
            <div className="flex w-full items-center justify-between">
              {onCustomize && (
                 <Button variant="outline" size="sm" onClick={() => onCustomize(id)}>
                    Customize
                 </Button>
              )}
              <Button size="sm" onClick={handleAddToCart} className="flex-grow ml-auto max-w-xs">
                <PlusCircle className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
          )}
          {variant === 'cart' && quantity !== undefined && onQuantityChange && (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={handleDecreaseQuantity} disabled={quantity <= 0} aria-label="Decrease quantity">
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={handleIncreaseQuantity} aria-label="Increase quantity">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                {onCustomize && (
                    <Button variant="ghost" size="icon" onClick={() => onCustomize(id)} aria-label="Customize item">
                        <Edit3 className="h-4 w-4 text-blue-600"/>
                    </Button>
                )}
                {onRemoveFromCart && (
                     <Button variant="ghost" size="icon" onClick={handleRemove} aria-label="Remove from cart">
                        <Trash2 className="h-4 w-4 text-red-600"/>
                    </Button>
                )}
              </div>
            </div>
          )}
        </CardFooter>
      </div>
    </Card>
  );
};

export default MenuItemCard;