import { Heart, ArrowUpRight, Gauge, Fuel, Settings2, MapPin, CarFront, Palette, Compass, Trash2 } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { formatAmount } from '../lib/formatters';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { toast } from 'sonner';

export interface VehicleCardProps {
  id?: string;
  name: string;
  description: string;
  price: string;
  image: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  driveType?: string;
  location?: string;
  condition?: string;
  color?: string;
  badge?: string;
  isFavorited?: boolean;
  onFavorite?: (isSaved: boolean) => void;
  onDelete?: () => void;
  showDelete?: boolean;
  onViewDetails?: () => void;
}

export function VehicleCard({
  id,
  name,
  description,
  price,
  image,
  mileage,
  fuelType,
  transmission,
  location = 'Location unavailable',
  condition = 'New',
  color = 'Black',
  badge,
  isFavorited: initialIsFavorited = false,
  onFavorite,
  onDelete,
  showDelete,
  onViewDetails,
}: VehicleCardProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    setIsFavorited(initialIsFavorited);
  }, [initialIsFavorited]);

  const formatMileage = (input: string) => {
    const match = input?.toString().match(/[0-9][0-9,\.]*/);
    if (!match) return input;
    const num = parseFloat(match[0].replace(/,/g, ''));
    if (Number.isNaN(num)) return input;
    if (num >= 1000) {
      const k = num / 1000;
      const display = Number.isInteger(k) ? `${k}k` : `${parseFloat(k.toFixed(1))}k`;
      return `${display} Miles`;
    }
    return `${num} Miles`;
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to save cars');
      window.location.hash = '#sign-in';
      return;
    }

    if (isToggling || !id) return;

    try {
      setIsToggling(true);
      const response = await api.post('/saved-cars/toggle', { carId: id });
      const newSavedStatus = response.data.saved;
      setIsFavorited(newSavedStatus);
      onFavorite?.(newSavedStatus);
      toast.success(response.data.message);
    } catch (error: any) {
      console.error('Error toggling saved car:', error);
      toast.error(error.response?.data?.error || 'Failed to update saved list');
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      window.location.hash = `#car-detail/${id}`;
    }
    onViewDetails?.();
  };
  
  return (
    <article
      className="bg-white rounded-[16px] overflow-hidden w-full max-w-[450px] xl:max-w-[294.35px] min-w-0 mx-auto group hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-100"
      style={{
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
      }}
      onClick={handleViewDetails}
    >
      {/* Image Container */}
      <div className="relative h-[196px] flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Great Price Badge */}
        {badge && (
          <div
            className="absolute top-3 left-3 flex items-center justify-center px-3 h-[24px] rounded-full bg-brand-green text-white font-light text-[12px] leading-[23px] capitalize z-10"
          >
            {badge}
          </div>
        )}

        {/* Favorite Button */}
        {!showDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleFavorite}
                disabled={isToggling}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full transition-all hover:bg-gray-50 z-20 shadow-sm active:scale-[0.98]"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFavorited ? 'fill-brand-green text-brand-green' : 'text-gray-400'
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isFavorited ? 'Saved' : 'Save'}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Delete Button */}
        {showDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleDelete}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full transition-all hover:bg-red-50 z-20 shadow-sm active:scale-[0.98]"
              >
                <Trash2
                  className="w-4 h-4 text-[#FF3B30]"
                  strokeWidth={1.5}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Remove</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Card Content */}
        <div className="flex flex-col flex-1 px-4 py-3"
      >
        {/* Title & Description */}
        <div className="flex flex-col gap-1 mb-3">
          <h3
            className="font-sans font-extrabold text-[14px] md:text-[16px] leading-tight text-gray-900 truncate"
            title={name}
          >
            {name}
          </h3>
          <p
            className="font-sans font-normal text-[10px] leading-snug text-gray-500 line-clamp-2"
            title={description}
          >
            {description.length > 160 ? `${description.substring(0, 160)}...` : description}
          </p>
        </div>

        {/* Specs Section */}
        <div className="flex flex-col gap-2.5 mb-3">
          {/* Row 1: Mileage, Fuel, Transmission */}
          <div className="flex items-center text-gray-500">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <Gauge className="w-[6px] h-[6px] flex-shrink-0" strokeWidth={1} />
              <span className="font-sans font-normal text-[10px] truncate" title={mileage}>
                {formatMileage(mileage)}
              </span>
            </div>
            <div className="w-px h-3 bg-gray-200 mx-2 flex-shrink-0" />
            <div className="flex items-center gap-1 min-w-0 flex-1 justify-center">
              <Fuel className="w-[6px] h-[6px] flex-shrink-0" strokeWidth={1} />
              <span className="font-sans font-normal text-[10px] truncate" title={fuelType}>
                {fuelType}
              </span>
            </div>
            <div className="w-px h-3 bg-gray-200 mx-2 flex-shrink-0" />
            <div className="flex items-center gap-1 min-w-0 flex-1 justify-end">
              <Settings2 className="w-[6px] h-[6px] flex-shrink-0" strokeWidth={1} />
              <span className="font-sans font-normal text-[10px] truncate" title={transmission}>
                {transmission}
              </span>
            </div>
          </div>

          {/* Row 1.5: Drive Type (optional) */}
          {typeof (driveType) !== 'undefined' && driveType && (
            <div className="flex items-center text-gray-500">
              <div className="flex items-center gap-1 min-w-0 flex-1">
                <Compass className="w-[6px] h-[6px] flex-shrink-0" strokeWidth={1} />
                <span className="font-sans font-normal text-[10px] truncate" title={driveType}>
                  {driveType}
                </span>
              </div>
            </div>
          )}

          {/* Row 2: Location, Condition, Color */}
          <div className="flex items-center text-gray-500">
          <div className="flex items-center gap-1 min-w-0 flex-1">
             <MapPin className="w-[6px] h-[6px] flex-shrink-0" strokeWidth={1} />
             <span className="font-sans font-normal text-[10px] truncate" title={location}>
               {location}
             </span>
           </div>
           <div className="w-px h-3 bg-gray-200 mx-2 flex-shrink-0" />
           <div className="flex items-center gap-1 min-w-0 flex-1 justify-center">
             <CarFront className="w-[6px] h-[6px] flex-shrink-0" strokeWidth={1} />
             <span className="font-sans font-normal text-[10px] truncate" title={condition}>
               {condition}
             </span>
           </div>
           <div className="w-px h-3 bg-gray-200 mx-2 flex-shrink-0" />
           <div className="flex items-center gap-1 min-w-0 flex-1 justify-end">
             <Palette className="w-[6px] h-[6px] flex-shrink-0" strokeWidth={1} />
             <span className="font-sans font-normal text-[10px] truncate" title={color}>
               {color}
             </span>
           </div>
          </div>
        </div>

        {/* Price and View Details */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
          <span className="font-sans font-bold text-[18px] text-gray-900">
            {price.startsWith('₦') ? price : `₦${formatAmount(price)}`}
          </span>
          <button
            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-all active:scale-[0.98] bg-transparent border-none p-0"
            onClick={handleViewDetails}
          >
            <span className="font-sans font-medium text-[10px] text-brand-green">
              View Details
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-brand-green" />
          </button>
        </div>
      </div>
    </article>
  );
}
