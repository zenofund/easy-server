import { Heart, Share2, MapPin, Check, ChevronRight, Car, Gauge, Fuel, Calendar, Settings, Compass, Wrench, DoorOpen, Palette, FileText, ArrowLeft, Bell, Star, ShieldCheck, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useState, useEffect, useRef } from 'react';
import bannerImage from 'figma:asset/ea85032fabf72efbb1f57a4df874777e918f2102.png';
import { MakeOfferModal } from '../modals/MakeOfferModal';
import { RequestInspectionModal } from '../modals/RequestInspectionModal';
import { VehicleCard } from '../VehicleCard';
import api from '../../lib/api';
import { toast } from 'sonner';
import { ChatDetailView } from './ChatDetailView';
import { Modal } from "../ui/Modal";
import { Dialog, DialogContent } from "../ui/dialog";
import { VehicleDetailSkeleton } from '../ui/SkeletonLoader';
import { formatAmount, formatDurationSince } from '../../lib/formatters';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { UserAvatar } from '../UserAvatar';

interface CarDetails {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice?: number;
  year: number;
  make: string;
  model: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  driveType?: string;
  bodyType: string;
  color: string;
  condition: string;
  vin: string;
  images: string[];
  features: string[];
  seller: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    createdAt?: string;
    sellerProfile?: {
      companyName: string;
      address: string;
      isVerified: boolean;
    };
  };
  createdAt: string;
  isFavorited?: boolean;
}

export function CarDetailPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [car, setCar] = useState<CarDetails | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  const [similarCars, setSimilarCars] = useState<CarDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const carCacheRef = useRef(new Map<string, CarDetails>());
  const similarCacheRef = useRef(new Map<string, CarDetails[]>());
  const lastIdRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  const handleFavorite = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (!car?.id) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to save cars');
      window.location.hash = '#sign-in';
      return;
    }

    if (isToggling) return;

    try {
      setIsToggling(true);
      const response = await api.post('/saved-cars/toggle', { carId: car.id });
      const newSavedStatus = response.data.saved;
      setCar(prev => prev ? { ...prev, isFavorited: newSavedStatus } : null);
      toast.success(response.data.message);
    } catch (error: any) {
      console.error('Error toggling saved car:', error);
      toast.error(error.response?.data?.error || 'Failed to update saved list');
    } finally {
      setIsToggling(false);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const recordView = async () => {
      const token = localStorage.getItem('token');
      if (token && car?.id) {
        try {
          await api.post('/view-history/record', { carId: car.id });
        } catch (error) {
          console.error('Error recording view history:', error);
        }
      }
    };
    recordView();
  }, [car?.id]);

  useEffect(() => {
    const fetchSimilarCars = async (bodyType: string | undefined, currentCarId: string, controller: AbortController) => {
      if (!bodyType) return;
      const cachedSimilar = similarCacheRef.current.get(bodyType);
      if (cachedSimilar) {
        setSimilarCars(cachedSimilar.filter(c => c.id !== currentCarId).slice(0, 10));
        return;
      }
      try {
        const similarResponse = await api.get('/cars', {
          params: { bodyType, limit: 10 },
          signal: controller.signal
        });
        const filteredSimilar = (similarResponse.data.cars || similarResponse.data || [])
          .filter((c: any) => c.id !== currentCarId)
          .map((c: any) => ({
            ...c,
            isFavorited: c.isFavorited || false
          }))
          .slice(0, 10);
        similarCacheRef.current.set(bodyType, filteredSimilar);
        setSimilarCars(filteredSimilar);
      } catch (simErr: any) {
        if (simErr?.code === 'ERR_CANCELED') return;
        console.error('Error fetching similar cars:', simErr);
      }
    };

    const fetchCarDetails = async () => {
      try {
        setError('');
        const hash = window.location.hash;

        if (!hash.startsWith('#car-detail')) {
          return;
        }
        
        // Remove the prefix to get the ID
        let id = '';
        if (hash.includes('/')) {
          id = hash.split('/')[1];
        } else {
          id = hash.replace('#car-detail', '');
        }
        
        id = id.split('?')[0].split('/')[0];

        if (!id || id.trim() === '') {
          console.error('Failed to extract ID from hash:', hash);
          setError(`No car ID provided. Hash detected: "${hash}"`);
          setLoading(false);
          return;
        }

        if (lastIdRef.current === id) {
          setLoading(false);
          return;
        }
        lastIdRef.current = id;

        const cachedCar = carCacheRef.current.get(id);
        if (cachedCar) {
          setCar(cachedCar);
          setSelectedImageIndex(0);
          setLoading(false);
          await fetchSimilarCars(cachedCar.bodyType, id, new AbortController());
          return;
        }

        setLoading(true);
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const response = await api.get(`/cars/${id}`, { signal: controller.signal });
        const carData = response.data;
        setCar(carData);
        setSelectedImageIndex(0);
        carCacheRef.current.set(id, carData);

        await fetchSimilarCars(carData.bodyType, carData.id, controller);
      } catch (err: any) {
        if (err?.code === 'ERR_CANCELED') return;
        console.error('Error fetching car details:', err);
        setError(err.response?.data?.error || 'Failed to load car details');
        toast.error('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener('hashchange', fetchCarDetails);
    fetchCarDetails();

    return () => {
      abortRef.current?.abort();
      window.removeEventListener('hashchange', fetchCarDetails);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen pt-20">
        <VehicleDetailSkeleton />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="w-full bg-white min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h2>
        <p className="text-gray-600 mb-8">{error || 'The car you are looking for does not exist or has been removed.'}</p>
        <button 
          onClick={() => window.location.hash = '#buy'}
          className="bg-[#005C32] text-white px-6 py-3 rounded-lg hover:bg-[#004a28] transition-colors"
        >
          Browse All Cars
        </button>
      </div>
    );
  }

  // Ensure images array exists and has at least one image
  const displayImages = car.images && car.images.length > 0 
    ? car.images 
    : ['https://images.unsplash.com/photo-1621839673705-6617f4b29e36?w=600'];

  const mapDriveType = (dt?: string) => {
    switch (dt) {
      case 'REAR_WHEEL': return 'Rear-Wheel Drive';
      case 'FRONT_WHEEL': return 'Front-Wheel Drive';
      case 'ALL_WHEEL': return 'All-Wheel Drive';
      case 'FOUR_WHEEL': return '4WD / 4x4';
      default: return 'N/A';
    }
  };

  const handleStartChat = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      toast.error('Please sign in to start a chat');
      window.location.hash = '#signin';
      return;
    }

    const currentUser = JSON.parse(userData);
    
    // Check if seller
    if (currentUser.role === 'SELLER') {
      toast.error('Sellers cannot start chats with other sellers.');
      return;
    }

    // Check if self
    if (currentUser.id === car?.seller?.id) {
      toast.error('You cannot start a chat with yourself.');
      return;
    }

    if (!car?.seller?.id) return;

    setIsChatModalOpen(true);
  };

  const handleActionCheck = (action: () => void) => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      toast.error('Please sign in to proceed');
      window.location.hash = '#signin';
      return;
    }

    const currentUser = JSON.parse(userData);
    
    // Check if seller
    if (currentUser.role === 'SELLER') {
      toast.error('Sellers cannot purchase cars or make offers.');
      return;
    }

    // Check if self
    if (currentUser.id === car?.seller?.id) {
      toast.error('You cannot purchase your own car.');
      return;
    }

    action();
  };

  const overviewSpecs = [
    { icon: "car", label: "Car Type", value: car.bodyType || "N/A" },
    { icon: "gauge", label: "Mileage", value: `${formatAmount(car.mileage || 0)} Miles` },
    { icon: "fuel", label: "Fuel Type", value: car.fuelType || "N/A" },
    { icon: "calendar", label: "Year", value: car.year?.toString() || "N/A" },
    { icon: "settings", label: "Transmission", value: car.transmission || "N/A" },
    { icon: "compass", label: "Drive Type", value: mapDriveType(car.driveType) },
    { icon: "wrench", label: "Condition", value: car.condition || "Used" },
    { icon: "door", label: "Door", value: "4 Doors" },
    { icon: "palette", label: "Color", value: car.color || "N/A" },
    { icon: "file-text", label: "VIN", value: car.vin || "N/A" },
  ];

  // Group features (simplified categorization since we just have a flat list)
  // In a real app, we might want to categorize these in the backend or have a mapping
  const featuresList = car.features || [];
  const interiorFeatures = featuresList.slice(0, Math.ceil(featuresList.length / 4));
  const safetyFeatures = featuresList.slice(Math.ceil(featuresList.length / 4), Math.ceil(featuresList.length / 2));
  const exteriorFeatures = featuresList.slice(Math.ceil(featuresList.length / 2), Math.ceil(featuresList.length * 3 / 4));
  const comfortFeatures = featuresList.slice(Math.ceil(featuresList.length * 3 / 4));

  const sellerName = car.seller?.sellerProfile?.companyName || `${car.seller?.firstName} ${car.seller?.lastName}` || 'Private Seller';
  const sellerLocation = car.seller?.sellerProfile?.address || 'Location Hidden';
  const isVerified = car.seller?.sellerProfile?.isVerified || false;

  return (
    <div className="w-full bg-white">
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button className="p-2 -ml-2" onClick={() => window.history.back()}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-sans font-semibold text-base text-gray-900 truncate max-w-[200px]">
          {car.title}
        </h1>
        <button className="p-2 -mr-2">
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Breadcrumb - Only visible on desktop */}
      <div className="hidden lg:block max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[73px] pt-[32px] pb-[21px]">
        <p className="font-sans text-sm text-gray-500" style={{ fontFamily: 'Lexend', fontWeight: 300 }}>
          <span className="cursor-pointer hover:text-brand-green" onClick={() => window.location.hash = '#home'}>Home </span> / 
          <span className="cursor-pointer hover:text-brand-green" onClick={() => window.location.hash = '#buy'}> Cars </span> / 
          <span className="cursor-pointer hover:text-brand-green" onClick={() => window.location.hash = '#buy'}> {car.bodyType} </span> / 
          <span className="text-gray-900"> {car.title}</span>
        </p>
      </div>

      {/* Main Image - Full width on mobile, part of layout on desktop */}
      <div className="lg:hidden px-4 py-4">
        <div className="relative w-full h-64 bg-gray-200 rounded-[15px] overflow-hidden">
          <img src={displayImages[selectedImageIndex]} alt="Car" className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4 flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleFavorite}
                  disabled={isToggling}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform"
                >
                  <Heart 
                    className={`w-5 h-5 ${car.isFavorited ? 'fill-brand-green text-brand-green' : 'text-gray-600'}`} 
                    strokeWidth={1.5}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{car.isFavorited ? 'Saved' : 'Save'}</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Thumbnail Strip - Mobile only, horizontal scroll */}
      <div className="lg:hidden px-2 py-2 flex gap-1.5 overflow-x-auto no-scrollbar">
        {displayImages.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 ${
              selectedImageIndex === index ? 'border-[#005C32]' : 'border-gray-200'
            }`}
          >
            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-[73px] pb-8 lg:pb-[64px]">
        {/* Desktop Image Gallery + Car Info Card */}
        <div className="hidden lg:flex gap-6 xl:gap-12 mb-[100px]">
          {/* Image Gallery */}
          <div className="flex gap-4 xl:gap-[25px] flex-shrink-0">
            <div className="flex flex-col gap-[19px] max-h-[494px] overflow-y-auto no-scrollbar">
              {displayImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-[100px] xl:w-[127px] h-[66px] xl:h-[84px] rounded-[5px] overflow-hidden transition-all border-2 flex-shrink-0 ${
                    selectedImageIndex === index ? 'border-[#005C32]' : 'border-transparent'
                  }`}
                  style={{ background: '#F1F2F4' }}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="relative w-[400px] xl:w-[547px] h-[362px] xl:h-[494px] rounded-[15px] overflow-hidden bg-gray-100">
              <img src={displayImages[selectedImageIndex]} alt="Main car" className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={handleFavorite}
                      disabled={isToggling}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md active:scale-95"
                    >
                      <Heart 
                        className={`w-5 h-5 ${car.isFavorited ? 'fill-brand-green text-brand-green' : 'text-[#6B7280]'}`} 
                        strokeWidth={1.5} 
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{car.isFavorited ? 'Saved' : 'Save'}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                      <Share2 className="w-5 h-5 text-[#6B7280]" strokeWidth={1.5} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Desktop Car Info Card */}
          <div className="bg-white rounded-[22px] border border-[#E2E8F9] flex-1 min-w-0"
            style={{ 
              padding: window.innerWidth >= 1280 ? '48px 35px' : '32px',
              filter: 'drop-shadow(10px 10px 50px rgba(0, 98, 255, 0.03))',
              display: 'flex',
              flexDirection: 'column'
            }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ marginBottom: '26px' }}>
                <h1 className="mb-2 font-sans text-[#060606]" 
                  style={{ 
                    fontFamily: 'Lexend', 
                    fontWeight: 700, 
                    fontSize: 'clamp(24px, 4vw, 36px)', 
                    lineHeight: '1.2' 
                  }}>
                  {car.title}
                </h1>
                {car.salePrice && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ 
                      fontFamily: 'Lexend',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#FF3B30',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>Sale</span>
                    <span style={{ 
                      fontFamily: 'Lexend',
                      fontSize: '16px',
                      color: '#FF3B30',
                      textDecoration: 'line-through'
                    }}>
                      ₦{formatAmount(car.salePrice)}
                    </span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin className="w-4 h-4 text-[#999999]" />
                  <span style={{ 
                    fontFamily: 'Lexend',
                    fontWeight: 300,
                    fontSize: '15px',
                    color: '#999999'
                  }}>
                    Save 10% right now
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <p style={{ 
                  fontFamily: 'Lexend',
                  marginBottom: '4px',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#060606'
                }}>Price</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ 
                    fontFamily: 'Lexend',
                    fontWeight: 900,
                    fontSize: '56px',
                    lineHeight: '64px',
                    color: '#060606'
                  }}>
                    ₦{formatAmount(car.price)}
                  </span>
                  <span style={{ 
                    fontFamily: 'Lexend',
                    fontWeight: 500,
                    fontSize: '24px',
                    color: '#999999'
                  }}>
                    .00
                  </span>
                </div>
                <p style={{ 
                  fontFamily: 'Lexend',
                  fontWeight: 300,
                  fontSize: '14px',
                  color: '#999999'
                }}>
                  Instant Savings N3,000
                </p>
              </div>

              <div style={{ marginBottom: '40px' }}>
                <p style={{ 
                  fontFamily: 'Lexend',
                  marginBottom: '12px',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#060606'
                }}>Seller</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0 }}>
                    <UserAvatar 
                      firstName={car.seller?.firstName} 
                      lastName={car.seller?.lastName} 
                      avatar={car.seller?.avatar}
                      className="w-full h-full border-2 border-[#005C32]"
                      fallbackClassName="text-lg"
                    />
                    <div style={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      right: 0, 
                      borderRadius: '9999px', 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: '#34C759', 
                      border: '2px solid white', 
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '2px', flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ 
                          fontFamily: 'Lexend',
                          fontWeight: 700,
                          fontSize: '16px',
                          color: '#060606',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>{sellerName}</span>
                        <span style={{ 
                          fontFamily: 'Lexend',
                          fontWeight: 300,
                          fontSize: '11px',
                          color: '#999999',
                          whiteSpace: 'nowrap'
                        }}>{formatDurationSince(car.seller?.createdAt)}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center', marginTop: '4px' }}>
                        <span style={{ 
                          fontFamily: 'Lexend',
                          padding: '2px 10px',
                          borderRadius: '9999px',
                          backgroundColor: '#E6F2EB',
                          color: '#005C32',
                          fontSize: '9px',
                          fontWeight: 700,
                          border: '1px solid rgba(0, 92, 50, 0.1)',
                          whiteSpace: 'nowrap'
                        }}>Verified ID</span>
                        <span style={{ 
                          fontFamily: 'Lexend',
                          padding: '2px 10px',
                          borderRadius: '9999px',
                          backgroundColor: '#E6F2EB',
                          color: '#005C32',
                          fontSize: '9px',
                          fontWeight: 700,
                          border: '1px solid rgba(0, 92, 50, 0.1)',
                          whiteSpace: 'nowrap'
                        }}>Quick Reply</span>
                        <button 
                          onClick={() => window.location.hash = `#seller-reviews/${car.seller?.id}`}
                          style={{ 
                            fontFamily: 'Lexend',
                            padding: '2px 10px',
                            borderRadius: '9999px',
                            border: '1px solid #E2E8F9',
                            color: '#005C32',
                            backgroundColor: 'transparent',
                            fontSize: '9px',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            cursor: 'pointer'
                          }}
                        >
                          View Reviews
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                <button 
                  style={{ 
                    height: '44px', 
                    padding: '0 16px', 
                    borderRadius: '10px', 
                    color: 'white', 
                    backgroundColor: '#005C32', 
                    fontFamily: 'Lexend', 
                    fontWeight: 600, 
                    fontSize: '13px', 
                    whiteSpace: 'nowrap', 
                    flex: '1',
                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  className="transition-all active:scale-[0.98]"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#004a28')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#005C32')}
                  onClick={() => handleActionCheck(() => setIsOfferModalOpen(true))}>
                  Make an Offer
                </button>
                <button 
                  style={{ 
                    height: '44px', 
                    padding: '0 16px', 
                    borderRadius: '10px', 
                    color: '#005C32', 
                    backgroundColor: '#E6F2EB', 
                    fontFamily: 'Lexend', 
                    fontWeight: 600, 
                    fontSize: '13px', 
                    whiteSpace: 'nowrap', 
                    flex: '1',
                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  className="transition-all active:scale-[0.98]"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d1e7da')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E6F2EB')}
                  onClick={() => handleActionCheck(() => setIsInspectionModalOpen(true))}>
                  Request Inspection
                </button>
                <button 
                  style={{ 
                    height: '44px', 
                    padding: '0 16px', 
                    borderRadius: '10px', 
                    color: '#005C32', 
                    backgroundColor: '#E6F2EB', 
                    fontFamily: 'Lexend', 
                    fontWeight: 600, 
                    fontSize: '13px', 
                    whiteSpace: 'nowrap', 
                    flex: '1',
                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  className="transition-all active:scale-[0.98]"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d1e7da')}
                   onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#E6F2EB')}
                   onClick={handleStartChat}>
                   Start Chat
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Title & Price */}
        <div className="lg:hidden mb-6">
          <div className="flex items-start justify-between mb-3">
            <h2 className="font-sans font-semibold text-[28px] leading-[38px] text-[#18181B]" style={{ fontFamily: 'Lexend' }}>
              {car.title}
            </h2>
            <div className="px-3 py-1.5 bg-gray-100 rounded-full">
              <span className="font-sans font-semibold text-[16px] leading-[24px] text-[#005C32]" style={{ fontFamily: 'Lexend' }}>
                ₦{formatAmount(car.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Seller Info */}
        <div className="lg:hidden mb-6">
          <h3 className="mb-3 font-sans font-semibold text-[16px] leading-[24px] text-[#18181B]" style={{ fontFamily: 'Lexend' }}>Seller</h3>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative" style={{ width: '60px', height: '60px', flexShrink: 0 }}>
              <UserAvatar 
                firstName={car.seller?.firstName} 
                lastName={car.seller?.lastName} 
                avatar={car.seller?.avatar}
                className="w-full h-full border-2 border-[#005C32]"
                fallbackClassName="text-xl"
              />
              <div className="absolute bottom-0 right-0 w-[15px] h-[15px] bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-sans font-semibold text-[16px] leading-[24px] text-[#18181B]" style={{ fontFamily: 'Lexend' }}>{sellerName}</span>
                <span className="font-sans text-[11px] text-[#999999]" style={{ fontFamily: 'Lexend' }}>{formatDurationSince(car.seller?.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-sans text-[11px] text-[#999999]" style={{ fontFamily: 'Lexend' }}>{sellerLocation}</span>
                <button 
                  onClick={() => window.location.hash = `#seller-reviews/${car.seller?.id}`}
                  className="font-sans text-[11px] text-[#005C32] underline"
                  style={{ fontFamily: 'Lexend' }}
                >
                  View Reviews
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button 
              onClick={() => handleActionCheck(() => setIsOfferModalOpen(true))}
              className="flex-1 h-9 bg-[#005C32] hover:bg-[#E6F2EB] text-white hover:text-[#005C32] rounded-lg px-1 sm:px-2 font-sans font-semibold text-[10px] sm:text-[11px] whitespace-nowrap transition-all active:scale-[0.98] border border-[#005C32]"
              style={{ fontFamily: 'Lexend' }}
            >
              Make an Offer
            </button>
            <button 
              onClick={() => handleActionCheck(() => setIsInspectionModalOpen(true))} 
              className="flex-1 h-9 bg-[#005C32] hover:bg-[#E6F2EB] text-white hover:text-[#005C32] rounded-lg px-1 sm:px-2 font-sans font-semibold text-[10px] sm:text-[11px] whitespace-nowrap transition-all active:scale-[0.98] border border-[#005C32]"
              style={{ fontFamily: 'Lexend' }}
            >
              Request Inspection
            </button>
            <button 
               onClick={handleStartChat}
                className="flex-1 h-9 bg-[#005C32] hover:bg-[#E6F2EB] text-white hover:text-[#005C32] rounded-lg px-1 sm:px-2 font-sans font-semibold text-[10px] sm:text-[11px] whitespace-nowrap transition-all active:scale-[0.98] border border-[#005C32]"
                style={{ fontFamily: 'Lexend' }}
              >
                Start Chat
              </button>
          </div>
        </div>

        {/* Car Overview, Description and Advert Banner Section */}
        <div 
          className="mb-8 lg:mb-[80px]"
          style={{ 
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : (window.innerWidth >= 1280 ? '1fr 380px' : '1fr 350px'),
            gap: isMobile ? '32px' : (window.innerWidth >= 1280 ? '80px' : '32px'),
            alignItems: 'start'
          }}
        >
          {/* Left Column: Overview & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '32px' : '64px' }}>
            {/* Car Overview */}
            <div>
              <h2 className="mb-6 lg:mb-[48px] font-sans font-bold text-[24px] lg:text-[32px] text-[#060606]" style={{ fontFamily: 'Lexend', fontWeight: 700 }}>
                Car Overview
              </h2>
              {/* Mobile: 1-column stack, Desktop: 2-column with tighter gap */}
              <div 
                style={{ 
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                  columnGap: '40px',
                  rowGap: isMobile ? '16px' : '24px',
                  maxWidth: '800px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>
                  {overviewSpecs.slice(0, 5).map((spec, index) => (
                    <SpecRow key={index} {...spec} />
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>
                  {overviewSpecs.slice(5, 10).map((spec, index) => (
                    <SpecRow key={index} {...spec} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ width: '100%', height: '1px', backgroundColor: '#E2E8F9' }} />

            {/* Description */}
            <div>
              <h2 className="mb-6 lg:mb-[32px] font-sans font-bold text-[24px] lg:text-[32px] text-[#060606]" style={{ fontFamily: 'Lexend', fontWeight: 700 }}>
                Description
              </h2>
              <p className="font-sans font-light text-[16px] lg:text-[18px]" style={{ fontFamily: 'Lexend', lineHeight: isMobile ? '26px' : '32px', color: '#6B7280' }}>
                {car.description}
              </p>
            </div>
          </div>

          {/* Advert Banner (Desktop: Right Column, Mobile: Full Width below) */}
          <div style={{ width: '100%' }}>
            <div style={{ position: isMobile ? 'relative' : 'sticky', top: isMobile ? '0' : '32px' }}>
              <img 
                src={bannerImage} 
                alt="Need a car?" 
                style={{ 
                  width: '100%', 
                  borderRadius: '22px', 
                  objectFit: 'cover', 
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  height: isMobile ? '200px' : '600px'
                }} 
              />
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#E2E8F9] mb-8 lg:mb-[80px]" />

        {/* Features Section */}
        {featuresList.length > 0 && (
          <div className="mb-8 lg:mb-[80px]">
            <h2 className="mb-8 lg:mb-[48px] font-sans font-bold text-[24px] lg:text-[32px] text-[#060606]" style={{ fontFamily: 'Lexend', fontWeight: 700 }}>
              Features
            </h2>
            <div 
              style={{ 
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
                rowGap: isMobile ? '32px' : '40px',
                columnGap: '48px'
              }}
            >
              {interiorFeatures.length > 0 && <FeatureColumn title="Interior" features={interiorFeatures} />}
              {safetyFeatures.length > 0 && <FeatureColumn title="Safety" features={safetyFeatures} />}
              {exteriorFeatures.length > 0 && <FeatureColumn title="Exterior" features={exteriorFeatures} />}
              {comfortFeatures.length > 0 && <FeatureColumn title="Comfort & Convenience" features={comfortFeatures} />}
            </div>
          </div>
        )}

        <div style={{ width: '100%', height: '1px', backgroundColor: '#E2E8F9', marginBottom: isMobile ? '32px' : '80px' }} />

        {/* Location Section */}
        <div className="mb-8 lg:mb-[80px]">
          <h2 className="mb-6 lg:mb-[48px] font-sans font-bold text-[24px] lg:text-[32px] text-[#060606]" style={{ fontFamily: 'Lexend', fontWeight: 700 }}>
            Location
          </h2>
          <div style={{ 
            width: '100%', 
            height: isMobile ? '300px' : '400px', 
            backgroundColor: '#F3F4F6', 
            borderRadius: '22px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            border: '1px solid #E2E8F9', 
            overflow: 'hidden', 
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' 
          }}>
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <MapPin className="w-12 h-12 text-[#005C32] mx-auto mb-4 opacity-50" />
              <p style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '18px', color: '#060606', marginBottom: '8px' }}>Map View (Coming Soon)</p>
              <p style={{ fontFamily: 'Lexend', color: '#6B7280' }}>{car.seller?.sellerProfile?.address || 'Location information'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Cars Section */}
      <SimilarCarsSection cars={similarCars} isMobile={isMobile} />

      {/* Modals */}
      <MakeOfferModal 
        isOpen={isOfferModalOpen} 
        onClose={() => setIsOfferModalOpen(false)} 
        carId={car?.id}
        carName={car?.title}
        currentPrice={car ? `₦${formatAmount(car.salePrice || car.price)}` : undefined}
      />
      <RequestInspectionModal 
        isOpen={isInspectionModalOpen} 
        onClose={() => setIsInspectionModalOpen(false)} 
        carId={car?.id}
      />

      <Modal 
          isOpen={isChatModalOpen} 
          onClose={() => setIsChatModalOpen(false)}
          maxWidth="max-w-[742px]"
          padding="p-0"
          className="h-[550px] flex flex-col"
        >
        {car && car.seller && (
          <ChatDetailView 
            contactId={car.seller.id}
            contactName={sellerName}
            contactRole="Seller"
            onBack={() => setIsChatModalOpen(false)}
            userType="buyer"
          />
        )}
      </Modal>
    </div>
  );
}

// Spec Row Component
interface SpecRowProps {
  icon: string;
  label: string;
  value: string;
}

function SpecRow({ icon, label, value }: SpecRowProps) {
  const getIcon = () => {
    const iconProps = { className: "w-[18px] h-[18px]", style: { color: '#999999' } };
    switch (icon) {
      case 'car': return <Car {...iconProps} />;
      case 'gauge': return <Gauge {...iconProps} />;
      case 'fuel': return <Fuel {...iconProps} />;
      case 'calendar': return <Calendar {...iconProps} />;
      case 'settings': return <Settings {...iconProps} />;
      case 'compass': return <Compass {...iconProps} />;
      case 'wrench': return <Wrench {...iconProps} />;
      case 'door': return <DoorOpen {...iconProps} />;
      case 'palette': return <Palette {...iconProps} />;
      case 'file-text': return <FileText {...iconProps} />;
      default: return <div style={{ width: '18px', height: '18px', borderRadius: '2px', backgroundColor: '#999999' }} />;
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {/* Mobile: Horizontal layout with label and value side-by-side or stack */}
      <div className="flex lg:hidden" style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%', borderBottom: '1px solid #F1F2F4', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getIcon()}
          <span style={{ fontFamily: 'Lexend', fontSize: '13px', color: '#999999' }}>{label}</span>
        </div>
        <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '14px', color: '#060606' }}>{value}</span>
      </div>

      {/* Desktop: Horizontal layout */}
      <div className="hidden lg:flex" style={{ 
        alignItems: 'center', 
        width: '100%', 
        borderBottom: '1px solid #F1F2F4', 
        paddingBottom: '12px',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {getIcon()}
          <span style={{ fontFamily: 'Lexend', fontWeight: 300, fontSize: '15px', lineHeight: '28px', color: '#999999' }}>{label}</span>
        </div>
        <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '15px', lineHeight: '28px', color: '#060606' }}>{value}</span>
      </div>
    </div>
  );
}

// Feature Column Component
interface FeatureColumnProps {
  title: string;
  features: string[];
}

function FeatureColumn({ title, features }: FeatureColumnProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3 style={{ fontFamily: 'Lexend', fontWeight: 700, fontSize: '18px', color: '#060606' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {features.map((feature, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '16px', 
              height: '16px', 
              borderRadius: '9999px', 
              backgroundColor: '#E6F2EB', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Check style={{ width: '10px', height: '10px', color: '#005C32' }} strokeWidth={3} />
            </div>
            <span style={{ fontFamily: 'Lexend', fontWeight: 300, fontSize: '15px', color: '#6B7280' }}>
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Similar Cars Section
function SimilarCarsSection({ cars, isMobile }: { cars: CarDetails[], isMobile: boolean }) {
  if (cars.length === 0) return null;

  return (
    <div style={{ 
      width: '100%', 
      backgroundColor: 'white', 
      padding: isMobile ? '48px 0' : '80px 0', 
      borderTop: '1px solid #E2E8F9' 
    }}>
      <div style={{ 
        maxWidth: '1440px', 
        margin: '0 auto', 
        padding: isMobile ? '0 16px' : '0 73px' 
      }}>
        <h2 style={{ 
          fontFamily: 'Lexend', 
          fontWeight: 700, 
          fontSize: isMobile ? '24px' : '35px', 
          lineHeight: isMobile ? '32px' : '40px', 
          color: '#060606',
          marginBottom: isMobile ? '32px' : '56px'
        }}>
          Similar Suggested Cars
        </h2>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : (window.innerWidth >= 1024 ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)'),
          gap: isMobile ? '24px' : '30px'
        }}>
          {cars.map((car) => (
            <VehicleCard 
              key={car.id}
              id={car.id}
              name={car.title}
              description={`${car.year} ${car.make} ${car.model}`}
              price={car.price.toString()}
              image={car.images?.[0] || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop'}
              mileage={car.mileage?.toString() || '0'}
              fuelType={car.fuelType}
              transmission={car.transmission}
              location={car.location || 'Location unavailable'}
              isFavorited={car.isFavorited}
              badge="Great Price"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
