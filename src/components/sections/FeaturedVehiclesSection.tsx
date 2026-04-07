import { useState, useEffect } from 'react';
import { VehicleCard } from '../VehicleCard';
import { VehicleCardSkeleton } from '../ui/SkeletonLoader';
import api from '../../lib/api';

export function FeaturedVehiclesSection() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/cars', {
          params: {
            limit: 10,
            featured: true // Assuming backend can filter by featured
          }
        });
        
        const cars = response.data.cars || [];
        const mappedVehicles = cars.map((car: any) => ({
          id: car.id,
          name: `${car.year} ${car.make} ${car.model}`,
          description: car.description || car.title,
          price: `₦${Number(car.price).toLocaleString()}`,
          image: car.images?.[0] || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=250&fit=crop',
          mileage: `${car.mileage.toLocaleString()} Miles`,
          fuelType: car.fuelType,
          transmission: car.transmission,
          location: car.location || 'Location unavailable',
          condition: car.condition,
          color: car.color,
          isFavorited: car.isFavorited || false
        }));

        setVehicles(mappedVehicles);
      } catch (error) {
        console.error('Error fetching featured vehicles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedVehicles();
  }, []);

  return (
    <section className="px-4 md:px-8 py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-brand-dark text-2xl md:text-3xl mb-2">Explore All Vehicles</h2>
            <p className="text-gray-300">Discover our wide selection of quality vehicles</p>
          </div>
          <a href="#buy-a-car" className="text-brand-green hover:underline hidden md:block">
            View All →
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <VehicleCardSkeleton key={index} />
            ))
          ) : (
            vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} {...vehicle} />
            ))
          )}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <a href="#buy-a-car" className="text-brand-green hover:underline">
            View All Vehicles →
          </a>
        </div>
      </div>
    </section>
  );
}
