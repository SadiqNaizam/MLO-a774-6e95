import React from 'react';
import { cn } from '@/lib/utils'; // For conditional classes
import { CheckCircle, Package, Truck, Home, XCircle } from 'lucide-react';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'FAILED';

interface OrderStatusTrackerProps {
  currentStatus: OrderStatus;
  statuses?: {
    key: OrderStatus;
    label: string;
    icon: React.ReactNode;
    description?: string; // Optional description for current status
  }[];
  orientation?: 'horizontal' | 'vertical';
}

const defaultStatuses: OrderStatusTrackerProps['statuses'] = [
  { key: 'CONFIRMED', label: 'Confirmed', icon: <CheckCircle />, description: "Your order has been confirmed by the restaurant." },
  { key: 'PREPARING', label: 'Preparing', icon: <Package />, description: "The restaurant is preparing your delicious meal." },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: <Truck />, description: "Your order is on its way to you!" },
  { key: 'DELIVERED', label: 'Delivered', icon: <Home />, description: "Enjoy your meal! Your order has been delivered." },
];

const cancelledStatus = { key: 'CANCELLED', label: 'Cancelled', icon: <XCircle className="text-red-500" />, description: "Your order has been cancelled." };
const failedStatus = { key: 'FAILED', label: 'Failed', icon: <XCircle className="text-red-500" />, description: "There was an issue with your order. Please contact support." };


const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  currentStatus,
  statuses = defaultStatuses,
  orientation = 'horizontal',
}) => {
  console.log("Rendering OrderStatusTracker, current status:", currentStatus);

  let displayStatuses = [...statuses];
  if (currentStatus === 'CANCELLED') displayStatuses = [cancelledStatus];
  else if (currentStatus === 'FAILED') displayStatuses = [failedStatus];
  else if (currentStatus === 'PENDING') displayStatuses = [{ key: 'PENDING', label: 'Pending Confirmation', icon: <CheckCircle className="text-gray-400" />, description: "Waiting for restaurant to confirm your order."}];


  const currentIndex = displayStatuses.findIndex(s => s.key === currentStatus);
  const currentStatusDetails = displayStatuses.find(s => s.key === currentStatus);


  return (
    <div className="p-4 bg-gray-50 rounded-lg">
        {currentStatusDetails && (
            <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-orange-600">{currentStatusDetails.label}</h3>
                {currentStatusDetails.description && <p className="text-sm text-gray-600 mt-1">{currentStatusDetails.description}</p>}
            </div>
        )}
        {currentStatus !== 'CANCELLED' && currentStatus !== 'FAILED' && currentStatus !== 'PENDING' && (
             <div className={cn(
                "flex w-full",
                orientation === 'horizontal' ? "flex-row items-start justify-between" : "flex-col space-y-6"
             )}>
                {displayStatuses.map((status, index) => {
                const isActive = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                    <React.Fragment key={status.key}>
                    <div className={cn(
                        "flex items-center text-center flex-col flex-1",
                        orientation === 'horizontal' ? "md:flex-col" : "flex-row items-center space-x-3",
                    )}>
                        <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2",
                        isActive ? "bg-green-500 border-green-600 text-white" : "bg-gray-200 border-gray-300 text-gray-500",
                        isCurrent && "ring-2 ring-green-500 ring-offset-2"
                        )}>
                        {React.cloneElement(status.icon as React.ReactElement, { className: cn("w-5 h-5", isActive ? "text-white" : "text-gray-400") })}
                        </div>
                        <p className={cn(
                        "text-xs mt-2 md:mt-2 md:text-sm",
                        orientation === 'vertical' ? "mt-0 md:mt-0" : "",
                        isActive ? "font-semibold text-green-700" : "text-gray-500"
                        )}>
                        {status.label}
                        </p>
                    </div>
                    {index < displayStatuses.length - 1 && (
                        <div className={cn(
                            "flex-auto border-t-2",
                            orientation === 'horizontal' ? "mt-5 mx-2" : "hidden", // Connector line for horizontal
                            isActive && currentIndex > index ? "border-green-500" : "border-gray-300 border-dashed"
                        )}></div>
                    )}
                     {index < displayStatuses.length - 1 && orientation === 'vertical' && (
                         <div className={cn(
                            "h-8 w-0.5 ml-5 my-1", // Connector line for vertical
                            isActive && currentIndex > index ? "bg-green-500" : "bg-gray-300"
                        )}></div>
                    )}
                    </React.Fragment>
                );
                })}
            </div>
        )}

    </div>
  );
};

export default OrderStatusTracker;