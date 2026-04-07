import React, { useState, useEffect, useRef } from 'react';
import { VehicleCard } from '../VehicleCard';
import { VehicleCardSkeleton } from '../ui/SkeletonLoader';
import { Spinner } from '../ui/Spinner';
import img3Huce1 from 'figma:asset/7c207ade046d0da27fce32efb7319d641dddfec9.png';
import imgMedracknewlogo3 from 'figma:asset/33fdad934e5e2e869921ffdcb711b343ad08d8b9.png';
import api from '../../lib/api';

interface VehicleCardData {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  location: string;
  condition: string;
  color: string;
  badge?: string;
  isFavorited?: boolean;
}

export function ExploreVehiclesSection() {
  const [activeTab, setActiveTab] = useState('recent');
  const [vehicles, setVehicles] = useState<VehicleCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const isFirstLoad = useRef(true);

  const tabs = [
    { id: 'recent', label: 'Recent Cars' },
    { id: 'featured', label: 'Featured Cars' },
    { id: 'popular', label: 'Popular Cars' },
  ];

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        if (isFirstLoad.current) {
          setIsLoading(true);
        } else {
          setIsTabSwitching(true);
        }

        // We can pass the activeTab as a filter if the backend supports it, 
        // for now just fetching all cars
        const response = await api.get('/cars', {
          params: {
            limit: 10 // Show 10 for consistency
          }
        });
        
        // Map API response to component data
        const cars = response.data.cars || response.data;
        if (!Array.isArray(cars)) {
          throw new Error('API response cars is not an array');
        }

        const mappedVehicles = cars.map((car: any) => ({
          id: car.id,
          name: `${car.year} ${car.make} ${car.model}`,
          description: car.description || car.title,
          price: car.price.toString(),
          image: car.images?.[0] || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop',
          mileage: car.mileage ? car.mileage.toString() : '0',
          fuelType: car.fuelType,
          transmission: car.transmission,
          location: car.location || 'Location unavailable',
          condition: car.condition,
          color: car.color,
          badge: undefined,
          isFavorited: car.isFavorited || false
        }));

        setVehicles(mappedVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setIsLoading(false);
        setIsTabSwitching(false);
        isFirstLoad.current = false;
      }
    };

    fetchVehicles();
  }, [activeTab]);

  return (
    <section className="py-8 md:py-10 px-4 md:px-8 lg:px-0 lg:mx-auto lg:max-w-[1375px] w-full">
      <div className="w-full mx-auto">
        <div className="flex flex-col gap-10 md:gap-[56px]">
          {/* Heading */}
          <h2
            style={{
              fontFamily: 'Lexend',
              fontWeight: 600,
              fontSize: 'clamp(24px, 4vw, 35px)',
              lineHeight: 'clamp(32px, 5vw, 40px)',
              color: '#060606',
            }}
          >
            Explore All Vehicles
          </h2>

          {/* Container with Tabs and Grid */}
          <div className="relative">
            {/* Tabs */}
            <div
              className="border-b border-gray-100 mb-8 md:mb-[90px] pb-0"
            >
              <div className="flex gap-6 md:gap-[27px] overflow-x-auto pb-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex flex-col gap-[10px] items-start pb-0 font-sans text-[16px] leading-[30px] transition-colors ${
                      activeTab === tab.id 
                        ? 'font-medium text-gray-900' 
                        : 'font-normal text-[#999999]'
                    }`}
                  >
                    <div>{tab.label}</div>
                    {activeTab === tab.id && (
                      <div
                        className="h-[2px] bg-brand-green w-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 relative">
              {/* Tab Switching Overlay */}
              {isTabSwitching && (
                <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                  <div className="flex flex-col items-center gap-3">
                    <Spinner size="lg" variant="primary" />
                    <span className="text-brand-green font-medium">Updating list...</span>
                  </div>
                </div>
              )}

              {/* First Row */}
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <VehicleCardSkeleton key={index} />
                  ))
                : vehicles.slice(0, 3).map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      {...vehicle}
                    />
                  ))}

              {/* CTA Card */}
              <CTACard />

              {/* Second Row - More Vehicles */}
              {!isLoading && vehicles.slice(3).map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  {...vehicle}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTACard() {
  return (
    <div
      className="bg-brand-gold overflow-hidden relative mx-auto w-full max-w-[294px] h-[389px] rounded-[14px]"
    >
      {/* Content */}
      <div
        className="absolute flex flex-col justify-center left-[19.31px] top-[87px] right-[19.31px] gap-[19px]"
      >
        <p
          className="font-sans font-semibold text-[24px] md:text-[32px] leading-[0.91] text-white m-0"
        >
          Find Your Perfect Car, Hassle-Free.
        </p>
        <button
          className="bg-[#b3cec2] flex items-center justify-center rounded-[10px] px-[8.26px] py-[6.04px]"
          onClick={() => { window.location.hash = '#sign-up'; }}
        >
          <p
            className="font-sans font-medium text-[14.98px] leading-normal text-brand-green m-0"
          >
            Get Started
          </p>
        </button>
      </div>

      {/* Circle Decoration */}
      <div
        className="absolute pointer-events-none left-[73.31px] top-[218px] w-[585.67px] h-[585.67px]"
      >
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 586 586">
          <circle cx="292.833" cy="292.833" r="210.012" stroke="#E2E8F9" strokeOpacity="0.2" strokeWidth="165.643" />
        </svg>
      </div>

      {/* Logo */}
      <div
        className="absolute h-[39px] left-[19.31px] top-[23px] w-[143.75px]"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            alt=""
            className="absolute max-w-none h-[368.59%] left-[-11.45%] top-[-115.04%] w-full"
            src={imgMedracknewlogo3}
          />
        </div>
      </div>

      {/* Car Image */}
      <div
        className="absolute flex items-center justify-center pointer-events-none left-[calc(50%-122.84px)] top-[calc(50%+111.89px)] -translate-x-1/2 -translate-y-1/2 w-[548.43px] h-[185.22px]"
      >
        <div className="rotate-[180deg] scale-y-[-100%]">
          <div
            className="relative h-[185.22px] w-[548.43px]"
          >
            <img
              alt=""
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
              src={img3Huce1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
