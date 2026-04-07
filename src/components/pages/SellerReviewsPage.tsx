import { useState, useEffect } from 'react';
import { ChevronLeft, Star, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../../lib/api';
import { Spinner } from '../ui/Spinner';
import { UserAvatar } from '../UserAvatar';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { formatDurationSince } from '../../lib/formatters';

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  text: string;
  avatar: string;
}

interface SellerDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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

export function SellerReviewsPage() {
  const [seller, setSeller] = useState<SellerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reviews: Review[] = [
    {
      id: 1,
      name: "Kristin Watson",
      date: "March 14, 2024",
      rating: 5,
      text: "The seller was professional and transparent. The car was exactly as described, and the transaction was smooth. Highly recommend!",
      avatar: ""
    },
    {
      id: 2,
      name: "Jenny Wilson",
      date: "January 28, 2024",
      rating: 5,
      text: "I appreciated the honesty and prompt responses from the seller. The car was in great condition, and the process was hassle-free.",
      avatar: ""
    },
    {
      id: 3,
      name: "Bessie Cooper",
      date: "January 11, 2024",
      rating: 4,
      text: "You made it so simple. My new site is so much faster and easier to work with than my old site. I just choose the page, make the changes.",
      avatar: ""
    }
  ];

  useEffect(() => {
    const fetchSellerDetails = async () => {
      const getSellerIdFromHash = () => {
        const hash = window.location.hash;
        
        // Handle #seller-reviews/id
        if (hash.startsWith('#seller-reviews/')) {
          const id = hash.replace('#seller-reviews/', '').split('?')[0].split('/')[0];
          return id || null;
        }
        
        // Handle #seller-reviews?id=id
        if (hash.startsWith('#seller-reviews') && hash.includes('?')) {
          const query = hash.split('?')[1];
          const params = new URLSearchParams(query);
          return params.get('id');
        }
        
        return null;
      };

      setLoading(true);
      setError(null);
      try {
        const id = getSellerIdFromHash();
        console.log('Detected Seller ID from hash:', id);

        if (!id) {
          setError('No seller ID provided');
          return;
        }

        const response = await api.get(`/sellers/${id}`);
        setSeller(response.data.seller);
      } catch (err: any) {
        console.error('Error fetching seller details:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load seller details');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDetails();
    
    const handleHashChange = () => {
      if (window.location.hash.startsWith('#seller-reviews')) {
        fetchSellerDetails();
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
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4 px-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-lg text-gray-600 text-center">{error || 'Seller not found'}</p>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-[#005C32] text-white rounded-lg hover:bg-opacity-90"
        >
          Go Back
        </button>
      </div>
    );
  }

  const displayName = seller.sellerProfile?.companyName || `${seller.firstName} ${seller.lastName}`;
  const isVerified = seller.sellerProfile?.verified || seller.verified;

  const registrationDuration = formatDurationSince(seller.createdAt);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        fill={i < rating ? "#F59E0B" : "#D4D4D8"}
        stroke={i < rating ? "#F59E0B" : "#D4D4D8"}
        className="mr-0.5"
      />
    ));
  };

  return (
    <div className="bg-white min-h-screen pt-[65px] pb-12" style={{ fontFamily: 'Lexend' }}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[63px]">
        {/* Header and Back Button */}
        <div className="mb-8 lg:mb-12">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mb-4"
          >
            <ChevronLeft size={20} />
            <span className="text-lg">Back</span>
          </button>
          
          <h1 className="text-2xl font-medium text-gray-900 mb-1">{displayName}</h1>
          <p className="text-xl font-light text-gray-400">Reviews ({reviews.length})</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 lg:gap-12">
          {/* Left Column - Seller Info Card */}
          <div className="h-fit">
            <div className="bg-white rounded-3xl border border-gray-100 p-5 lg:p-6 space-y-5 shadow-sm w-full">
              <h3 className="text-gray-900 font-medium text-lg border-b border-gray-50 pb-3">Seller</h3>
              
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
                  
                  <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start mt-2">
                    <div className="flex items-center gap-1 px-3 py-1 bg-brand-green/10 rounded-full">
                      <Clock size={12} className="text-brand-green" />
                      <span className="text-brand-green text-[10px] lg:text-[10.5px] font-medium whitespace-nowrap">Quick Reply in 2 mins</span>
                    </div>
                    {isVerified && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-brand-green/10 rounded-full">
                        <CheckCircle size={12} className="text-brand-green" />
                        <span className="text-brand-green text-[10px] lg:text-[10.5px] font-medium whitespace-nowrap">Verified ID</span>
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

          {/* Right Column - Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar 
                      firstName={review.name.split(' ')[0]} 
                      lastName={review.name.split(' ')[1] || ''} 
                      avatar={review.avatar}
                      className="w-10 h-10"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{review.name}</h4>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
