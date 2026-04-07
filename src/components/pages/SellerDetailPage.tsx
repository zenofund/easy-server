import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Phone, Mail, Share2, ShieldCheck, Clock, Car, ChevronRight, LayoutGrid, List, CheckCircle, AlertCircle } from 'lucide-react';
import { VehicleCard } from '../VehicleCard';
import api from '../../lib/api';
import { Spinner } from '../ui/Spinner';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { UserAvatar } from '../UserAvatar';

interface SellerDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  verified: boolean;
  createdAt: string;
  sellerProfile: {
    companyName: string | null;
    address: string;
    verified: boolean;
  } | null;
  _count: {
    cars: number;
  };
}

interface Car {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  mileage: number;
  fuelType: string;
  transmission: string;
  condition: string;
  color: string;
  make: string;
  model: string;
  year: number;
}

export function SellerDetailPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [seller, setSeller] = useState<SellerDetails | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getSellerIdFromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#seller-detail/')) {
        const parts = hash.split('/');
        return parts[1] || null;
      }
      if (hash.startsWith('#seller-detail') && hash.includes('?')) {
        const query = hash.split('?')[1];
        const params = new URLSearchParams(query);
        return params.get('id');
      }
      return null;
    };

    const fetchSellerDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const id = getSellerIdFromHash();

        if (!id) {
          setError('No seller ID provided');
          return;
        }

        const response = await api.get(`/sellers/${id}`, {
          params: {
            page: currentPage,
            limit: 10,
          },
        });

        const { seller, cars, pagination } = response.data;
        setSeller(seller);
        setCars(cars);
        setTotalPages(pagination.pages);
      } catch (err: any) {
        console.error('Error fetching seller details:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load seller details');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDetails();
  }, [currentPage]);

  // Handle hash change to re-fetch if ID changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.startsWith('#seller-detail')) {
        setCurrentPage(1);
      }
    };

    const handleUserUpdate = (event: any) => {
      const updatedUser = event.detail;
      if (seller && (updatedUser.id === seller.id || updatedUser._id === seller.id)) {
        setSeller(prev => prev ? { ...prev, avatar: updatedUser.avatar } : null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('user-updated', handleUserUpdate);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('user-updated', handleUserUpdate);
    };
  }, [seller?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg text-gray-600">{error || 'Seller not found'}</p>
        <button 
          onClick={() => window.location.hash = '#sellers'}
          className="px-6 py-2 bg-[#005C32] text-white rounded-lg hover:bg-opacity-90"
        >
          Back to Sellers
        </button>
      </div>
    );
  }

  const displayName = seller.sellerProfile?.companyName || `${seller.firstName} ${seller.lastName}`;
  const displayAddress = seller.sellerProfile?.address || 'Abuja, Nigeria';
  const isVerified = seller.sellerProfile?.verified || seller.verified;

  const registrationDuration = (() => {
    const createdDate = new Date(seller.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} days on Huce Autos`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks on Huce Autos`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months on Huce Autos`;
    return `${Math.floor(diffDays / 365)} years on Huce Autos`;
  })();

  return (
    <section
      className="bg-white w-full"
      style={{
        paddingTop: '65px',
        paddingBottom: '0px',
      }}
    >
      <div className="max-w-[1440px] mx-auto w-full">
        {/* Breadcrumb */}
        <div
          className="px-4 md:px-8 lg:px-[66px] w-full"
          style={{
            marginBottom: '29px',
          }}
        >
          <p
            style={{
              fontFamily: 'Lexend',
              fontWeight: 300,
              fontSize: '14px',
              lineHeight: '21px',
              color: '#52525B',
            }}
          >
            Home / Car Sellers / {displayName}
          </p>
        </div>

        {/* Main Content Container */}
        <div
          className="px-4 md:px-8 lg:px-[63px] w-full"
          style={{
            maxWidth: '1315px',
            margin: '0 auto',
          }}
        >
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 mb-16">
            {/* Left Column - Vehicle Listings */}
            <div className="space-y-8 lg:space-y-14 w-full">
              {/* Tab Header */}
              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2 lg:gap-4">
                    <h2 className="text-gray-900 text-2xl font-medium">{displayName}</h2>
                    <p className="text-gray-400">Available Cars ({seller._count.cars} Cars)</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Grid */}
              {cars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-10 w-full">
                  {cars.map((car) => (
                    <VehicleCard
                      key={car.id}
                      id={car.id}
                      name={car.title}
                      description={`${car.year} ${car.make} ${car.model}`}
                      price={car.price.toString()}
                      image={car.images[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80'}
                      mileage={`${car.mileage} Miles`}
                      fuelType={car.fuelType}
                      transmission={car.transmission}
                      location={car.location || 'Location unavailable'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                  No cars available from this seller at the moment.
                </div>
              )}

              {/* Pagination */}
              {cars.length > 0 && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 w-full">
                  <button
                    className="flex items-center gap-2 px-4 py-2 border border-brand-green rounded-lg text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-40 w-full sm:w-auto justify-center"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M5 12L12 19M5 12L12 5" />
                    </svg>
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg transition-all flex-shrink-0 ${
                          currentPage === page
                            ? 'bg-brand-green/10 text-brand-green'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    className="flex items-center gap-2 px-4 py-2 border border-brand-green rounded-lg text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-40 w-full sm:w-auto justify-center"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <span>Next</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Seller Profile Card */}
            <div className="lg:sticky lg:top-24 h-fit w-full">
              <div className="bg-white rounded-3xl border border-gray-100 p-5 lg:p-6 space-y-5 shadow-sm w-full">
                <h3 className="text-gray-900 font-medium text-lg border-b border-gray-50 pb-3">Seller</h3>
                
                {/* Seller Profile */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative flex-shrink-0 w-[50px] h-[50px]">
                    <UserAvatar 
                      firstName={seller.firstName} 
                      lastName={seller.lastName} 
                      avatar={seller.avatar}
                      className="w-full h-full border-2 border-brand-green"
                      fallbackClassName="text-lg"
                    />
                    <div className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-green-500 rounded-full border-2 border-white shadow-sm" title="Online" />
                  </div>

                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap justify-center sm:justify-start">
                      <h4 className="text-gray-900 font-semibold text-base truncate leading-tight">{displayName}</h4>
                      <span className="text-gray-400 text-[11px] sm:text-xs whitespace-nowrap">({registrationDuration})</span>
                    </div>
                    <p className="text-gray-400 text-[11px] sm:text-xs whitespace-nowrap leading-tight text-center sm:text-left">{seller._count.cars} Cars Available</p>
                    
                    {/* Badges & Buttons - All on same line */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start mt-2">
                      <div className="flex items-center gap-1 px-3 py-1 bg-brand-green/10 rounded-full">
                        <Clock size={12} className="text-brand-green" />
                        <span className="text-brand-green text-[10px] lg:text-[10.5px] font-medium whitespace-nowrap" style={{ fontFamily: 'Lexend' }}>Quick Reply in 2 mins</span>
                      </div>
                      {isVerified && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-brand-green/10 rounded-full">
                          <CheckCircle size={12} className="text-brand-green" />
                          <span className="text-brand-green text-[10px] lg:text-[10.5px] font-medium whitespace-nowrap" style={{ fontFamily: 'Lexend' }}>Verified ID</span>
                        </div>
                      )}
                      <button className="px-3 py-1 bg-brand-green text-white rounded-full text-[10px] lg:text-[10.5px] font-medium whitespace-nowrap hover:bg-brand-green/90 transition-colors">
                        Message Seller
                      </button>
                      <button 
                        onClick={() => window.location.hash = `#seller-reviews/${seller.id}`}
                        className="px-3 py-1 border border-gray-300 text-gray-700 rounded-full text-[10px] lg:text-[10.5px] font-medium whitespace-nowrap hover:bg-gray-50 transition-colors"
                      >
                        View Reviews
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
