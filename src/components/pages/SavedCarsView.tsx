import { VehicleCard } from '../VehicleCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { VehicleCardSkeleton } from '../ui/SkeletonLoader';

interface SavedCarsViewProps {
  userType?: 'buyer' | 'seller';
}

export function SavedCarsView({ userType = 'buyer' }: SavedCarsViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [savedCars, setSavedCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);

  const fetchSavedCars = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await api.get('/saved-cars', {
        params: {
          page,
          limit: 10
        }
      });
      
      const mappedCars = response.data.cars.map((car: any) => ({
        id: car.id,
        name: `${car.year} ${car.make} ${car.model}`,
        description: car.description || car.title,
        price: car.price.toString(),
        image: car.images?.[0] || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=400&auto=format&fit=crop',
        mileage: car.mileage ? car.mileage.toString() : '0',
        fuelType: car.fuelType,
        transmission: car.transmission,
        location: car.location || 'Location unavailable',
        condition: car.condition,
        color: car.color,
        isFavorited: true,
      }));

      setSavedCars(mappedCars);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching saved cars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCars(currentPage);
  }, [currentPage]);

  const handleFavoriteToggle = (carId: string) => {
    // If it was unsaved, remove it from the list
    setSavedCars(prev => prev.filter(car => car.id !== carId));
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-16 w-full py-6 border-t border-[#F0F0F0]">
        <div className="flex items-center gap-2 sm:gap-6">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: '#FFFFFF',
              border: `1px solid ${currentPage === 1 ? '#E5E7EB' : '#005C32'}`,
              borderRadius: '8px',
              color: currentPage === 1 ? '#9CA3AF' : '#005C32',
              fontFamily: 'Lexend',
              fontSize: '14px',
              fontWeight: 500,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <ChevronLeft size={18} />
            <span className="hidden md:inline">Previous</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border-none font-['Lexend'] text-sm font-medium cursor-pointer transition-all duration-200 ${
                  currentPage === page ? 'bg-[#F0F9F4] text-[#005C32]' : 'bg-transparent text-[#999999]'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === pagination.totalPages}
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: '#FFFFFF',
              border: `1px solid ${currentPage === pagination.totalPages ? '#E5E7EB' : '#005C32'}`,
              borderRadius: '8px',
              color: currentPage === pagination.totalPages ? '#9CA3AF' : '#005C32',
              fontFamily: 'Lexend',
              fontSize: '14px',
              fontWeight: 500,
              cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <h2 style={{ 
        fontFamily: 'Lexend', 
        fontWeight: 600, 
        fontSize: 'clamp(24px, 5vw, 32px)', 
        lineHeight: '145%', 
        color: '#000000',
        marginBottom: 'clamp(24px, 4vw, 40px)'
      }}>
        Saved Car
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <VehicleCardSkeleton key={index} />
          ))}
        </div>
      ) : savedCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
          {savedCars.map((car) => (
            <VehicleCard
              key={car.id}
              {...car}
              onFavorite={(isSaved) => !isSaved && handleFavoriteToggle(car.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 font-lexend text-lg">No saved cars found.</p>
          <button 
            onClick={() => window.location.hash = '#buy-a-car'}
            className="mt-4 text-brand-green font-lexend font-medium hover:underline"
          >
            Explore available vehicles
          </button>
        </div>
      )}

      {renderPagination()}
    </>
  );
}
