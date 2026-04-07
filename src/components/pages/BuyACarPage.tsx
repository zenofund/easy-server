import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { VehicleCardSkeleton } from '../ui/SkeletonLoader';
import { VehicleCard } from '../VehicleCard';
import api from '../../lib/api';
import { toast } from 'sonner';

interface VehicleCardData {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  driveType?: string;
  location: string;
  condition: string;
  color: string;
  badge?: string;
  isFavorited?: boolean;
}

export function BuyACarPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleCardData[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const cacheRef = useRef(new Map<string, { vehicles: VehicleCardData[]; totalPages: number; totalResults: number }>());
  const lastKeyRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Parse filters from URL hash
  const getFiltersFromHash = () => {
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const queryString = hash.split('?')[1];
      const params = new URLSearchParams(queryString);
      
      const bodyType = params.get('bodyType');
      const make = params.get('make');
      const model = params.get('model');
      
      // Update active filter label for the heading
      if (bodyType) setActiveFilter(bodyType);
      else if (make && model) setActiveFilter(`${make} ${model}`);
      else if (make) setActiveFilter(make);
      else setActiveFilter(null);

      return {
        make,
        model,
        year: params.get('year'),
        condition: params.getAll('condition'),
        bodyType,
        location: params.get('location'),
        transmission: params.get('transmission'),
        fuelType: params.get('fuelType'),
        driveType: params.get('driveType'),
        color: params.get('color'),
        mileage: params.get('mileage'),
        price: params.get('price'),
      };
    }
    setActiveFilter(null);
    return {};
  };

  const fetchVehicles = async (page = currentPage) => {
    try {
      const filters = getFiltersFromHash();
      // Construct URLSearchParams for the API call to handle multiple conditions correctly
      const apiParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach(v => apiParams.append(key, v));
          } else {
            apiParams.append(key, value as string);
          }
        }
      });
      apiParams.append('page', page.toString());
      apiParams.append('limit', '10');
      const cacheKey = apiParams.toString();
      
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        lastKeyRef.current = cacheKey;
        setVehicles(cached.vehicles);
        setTotalPages(cached.totalPages);
        setTotalResults(cached.totalResults);
        setIsLoading(false);
        return;
      }

      if (lastKeyRef.current === cacheKey && isLoading) return;
      lastKeyRef.current = cacheKey;
      setIsLoading(true);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await api.get(`/cars?${cacheKey}`, { signal: controller.signal });
      
      const { cars, pagination } = response.data;
      
      if (!Array.isArray(cars)) {
        throw new Error('API response cars is not an array');
      }

      // Map API response to component data
      const driveTypeLabel = (dt: string | undefined) => {
        switch (dt) {
          case 'REAR_WHEEL': return 'Rear-Wheel Drive';
          case 'FRONT_WHEEL': return 'Front-Wheel Drive';
          case 'ALL_WHEEL': return 'All-Wheel Drive';
          case 'FOUR_WHEEL': return '4WD / 4x4';
          default: return undefined;
        }
      };

      const mappedVehicles = cars.map((car: any) => {
        try {
          return {
            id: car.id,
            name: `${car.year} ${car.make} ${car.model}`,
            description: car.description || car.title,
            price: car.price.toString(),
            image: Array.isArray(car.images) && car.images.length > 0 ? car.images[0] : 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop',
            mileage: car.mileage ? car.mileage.toString() : '0',
            fuelType: car.fuelType || 'N/A',
            transmission: car.transmission || 'N/A',
            driveType: driveTypeLabel(car.driveType),
            location: car.location || 'Location unavailable',
            condition: car.condition || 'Used',
            color: car.color || 'N/A',
            badge: undefined,
            isFavorited: car.isFavorited || false
          };
        } catch (err) {
          console.error('Error mapping car:', car, err);
          return null;
        }
      }).filter(Boolean) as VehicleCardData[]; // Remove nulls

      setVehicles(mappedVehicles);
      if (pagination) {
        setTotalPages(pagination.totalPages);
        setTotalResults(pagination.total);
      }
      cacheRef.current.set(cacheKey, {
        vehicles: mappedVehicles,
        totalPages: pagination?.totalPages ?? 1,
        totalResults: pagination?.total ?? mappedVehicles.length
      });
    } catch (error: any) {
      if (error?.code === 'ERR_CANCELED') return;
      toast.error(`Failed to load vehicles: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Fetch and hash change fetch
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(1); // Reset to page 1 on filter change
      fetchVehicles(1);
    };

    // Initial fetch
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Page change fetch
  useEffect(() => {
    if (currentPage > 1) { // Skip if it's the first page which is already handled by hash change
      fetchVehicles(currentPage);
    }
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div 
      className="w-full bg-white py-8 md:py-10 px-4 md:px-8"
    >
      <div className="max-w-[1315px] mx-auto">
        <div className="flex flex-col gap-14">
          {/* Header with Results and Filter */}
          <div className="flex items-center justify-between">
            <h1
              className="font-sans font-medium text-[clamp(24px,4vw,36px)] text-gray-900"
            >
              {activeFilter ? `${activeFilter}s` : 'All'} ({totalResults} Results)
            </h1>

            {/* Filter Button */}
            <button
              className="flex items-center gap-2.5 px-8 py-2.5 border border-[#E2E8F9] rounded-2xl hover:bg-gray-50 transition-colors font-normal text-[15px] leading-[28px] text-[#6B7280]"
            >
              <SlidersHorizontal className="w-4 h-4" style={{ color: '#6B7280' }} />
              Filter
            </button>
          </div>

          {/* Vehicles Grid */}
          <div className="flex flex-col gap-7 relative min-h-[400px]">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <VehicleCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : vehicles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    {...vehicle}
                    isFavorited={favorites.includes(vehicle.id)}
                    onToggleFavorite={() => toggleFavorite(vehicle.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <p className="text-xl font-medium">No vehicles found</p>
                <p>Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              className="flex items-center justify-between pt-6 border-t"
              style={{ borderColor: '#EAECF0' }}
            >
              {/* Previous Button */}
              <button
                className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-[#005C32] rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-200"
                disabled={currentPage === 1 || isLoading}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="w-6 h-6" style={{ color: currentPage === 1 ? '#999' : '#6B7280' }} />
                <span
                  className="font-normal text-[16.5577px] leading-[24px] text-[#060606]"
                  style={{ color: currentPage === 1 ? '#999' : '#060606' }}
                >
                  Previous
                </span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...' || isLoading}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${
                      page === '...' ? 'cursor-default' : 'hover:bg-gray-100'
                    }`}
                    style={{
                      background: page === currentPage ? 'rgba(0, 92, 50, 0.1)' : 'transparent',
                      fontWeight: page === currentPage ? 500 : 300,
                      fontSize: '16.5577px',
                      lineHeight: '24px',
                      color: page === currentPage ? '#005C32' : '#6B7280',
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-[#005C32] rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-200"
                disabled={currentPage === totalPages || isLoading}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                <span
                  className="font-normal text-[16.5577px] leading-[24px] text-[#060606]"
                  style={{ color: currentPage === totalPages ? '#999' : '#060606' }}
                >
                  Next
                </span>
                <ChevronRight className="w-6 h-6" style={{ color: currentPage === totalPages ? '#999' : '#6B7280' }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
