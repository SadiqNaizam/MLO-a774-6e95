import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from 'lucide-react';

interface RestaurantCardProps {
  id: string | number;
  name: string;
  imageUrl: string;
  cuisineTypes: string[]; // e.g., ["Pizza", "Italian"]
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "25-35 min"
  // promotion?: string; // e.g., "20% OFF"
  onClick?: (id: string | number) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTime,
  // promotion,
  onClick,
}) => {
  console.log("Rendering RestaurantCard:", name);

  const handleCardClick = () => {
    if (onClick) {
      console.log("RestaurantCard clicked:", id);
      onClick(id);
    }
  };

  return (
    <Card
      className="w-full overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer group"
      onClick={handleCardClick}
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleCardClick()}
    >
      <CardHeader className="p-0 relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
          />
        </AspectRatio>
        {/* {promotion && (
            <Badge variant="destructive" className="absolute top-3 left-3 text-xs">
                {promotion}
            </Badge>
        )} */}
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <h3 className="text-lg font-semibold truncate group-hover:text-orange-600 transition-colors">{name}</h3>
        <p className="text-sm text-gray-600 truncate">
          {cuisineTypes.join(', ')}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{deliveryTime}</span>
          </div>
        </div>
      </CardContent>
      {/* <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full group-hover:bg-orange-500 group-hover:text-white transition-colors">
          View Menu
        </Button>
      </CardFooter> */}
    </Card>
  );
};

export default RestaurantCard;