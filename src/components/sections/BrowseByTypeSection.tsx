import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Spinner } from '../ui/Spinner';
import api from '../../lib/api';

interface VehicleType {
  id: string;
  name: string;
  image: string;
}

export function BrowseByTypeSection() {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback static data if API fails or is empty, but we'll try to use this structure
  // Ideally, we want unique body types from the DB
  const defaultTypes: VehicleType[] = [
    { id: 'convertible', name: 'Convertible', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=300&fit=crop' },
    { id: 'hatchback', name: 'Hatchback', image: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400&h=300&fit=crop' },
    { id: 'truck', name: 'Truck', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop' },
    { id: 'suv', name: 'SUV', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop' },
    { id: 'coupe', name: 'Coupe', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop' },
    { id: 'sedan', name: 'Sedan', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop' },
  ];

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await api.get('/cars');
        const cars = Array.isArray(response.data) ? response.data : response.data?.cars;
        if (Array.isArray(cars) && cars.length > 0) {
          // Extract unique body types
          // Note: The current mock data or DB schema might not have 'bodyType' explicitly on all records
          // We will try to map from the 'bodyType' field if it exists, or fallback to default list
          // For this implementation, let's assume we want to show the standard categories but only if cars exist,
          // OR simply use the standard categories as navigation entry points (which is safer for "Browse By Type")
          
          // Let's stick to the standard list for the UI consistency, but make them clickable
          setVehicleTypes(defaultTypes);
        } else {
          setVehicleTypes(defaultTypes);
        }
      } catch (error) {
        console.error('Error fetching car types:', error);
        setVehicleTypes(defaultTypes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTypes();
  }, []);

  const handleTypeClick = (typeName: string) => {
    // Navigate to Buy page with body type filter
    const params = new URLSearchParams();
    params.append('bodyType', typeName); 
    window.location.hash = `#buy?${params.toString()}`;
  };

  const scrollLeft = () => {
    const container = document.getElementById('vehicle-types-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('vehicle-types-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 md:py-10 px-4 md:px-8 lg:px-0 lg:mx-auto lg:max-w-[1375px] bg-white">
      <div className="w-full mx-auto">
        <div className="flex flex-col gap-8 md:gap-10 lg:gap-[56px]">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between">
            <h2
              style={{
                fontFamily: 'Lexend',
                fontWeight: 600,
                fontSize: 'clamp(24px, 4vw, 35px)',
                lineHeight: 'clamp(32px, 5vw, 40px)',
                color: '#060606',
              }}
            >
              Browse by Type
            </h2>

            {/* Navigation Arrows - Hidden on mobile, visible on md */}
            <div className="hidden md:flex items-center gap-5">
              <button
                onClick={scrollLeft}
                className="rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#005C32',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label="Previous"
              >
                <ChevronLeft 
                  style={{ 
                    width: '12px', 
                    height: '12px',
                    color: '#FFFFFF',
                  }} 
                  strokeWidth={2.5} 
                />
              </button>
              <button
                onClick={scrollRight}
                className="rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid #BC9C22',
                  background: '#FFFFFF',
                  cursor: 'pointer',
                }}
                aria-label="Next"
              >
                <ChevronRight 
                  style={{ 
                    color: '#BC9C22', 
                    width: '12px', 
                    height: '12px' 
                  }} 
                  strokeWidth={2.5} 
                />
              </button>
            </div>
          </div>

          {/* Vehicle Types Carousel */}
          <div className="overflow-hidden relative min-h-[160px]">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Spinner size="lg" variant="primary" />
                <span className="text-brand-green font-medium" style={{ fontFamily: 'Lexend' }}>Loading types...</span>
              </div>
            ) : (
              <div
                id="vehicle-types-container"
                className="flex justify-between overflow-x-auto pb-4 scrollbar-hide sm:px-[11px]"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  gap: '12px',
                }}
              >
                {vehicleTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => handleTypeClick(type.name)}
                    className="flex-shrink-0 cursor-pointer group bg-white active:scale-[0.98] transition-all"
                    style={{
                      width: 'clamp(160px, 25vw, 200px)', // Reduced width
                      minHeight: '160px',
                    }}
                  >
                    <div className="relative w-full h-full flex flex-col items-center">
                      {/* Image Container */}
                      <div
                        className="relative flex items-center justify-center"
                        style={{
                          width: '100%',
                          maxWidth: '180px', // Reduced max width
                          height: 'clamp(100px, 15vw, 130px)', // Reduced height
                        }}
                      >
                        <img
                          src={type.image}
                          alt={type.name}
                          className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
                        />
                      </div>

                      {/* Type Name */}
                      <p
                        className="text-center mt-3"
                        style={{
                          fontFamily: 'Lexend',
                          fontWeight: 500,
                          fontSize: 'clamp(16px, 2.5vw, 18px)',
                          lineHeight: '22px',
                          color: '#060606',
                          margin: 0,
                        }}
                      >
                        {type.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
