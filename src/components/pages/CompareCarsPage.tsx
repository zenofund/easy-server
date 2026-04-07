import { ChevronDown, Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CompareVehicleCard } from '../compare/CompareVehicleCard';
import { CompareSearchPanel } from '../compare/CompareSearchPanel';
import { Car, Gauge, Fuel, Calendar, Settings, Compass, DoorClosed, Palette, FileText } from 'lucide-react';
import api from '../../lib/api';
import { Spinner } from '../ui/Spinner';

export function CompareCarsPage() {
  const [loading, setLoading] = useState(false);
  const [vehiclesA, setVehiclesA] = useState<any[]>([]);
  const [vehiclesB, setVehiclesB] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState({
    makeA: '',
    modelA: '',
    yearA: '',
    priceA: '',
    locationA: '',
    makeB: '',
    modelB: '',
    yearB: '',
    priceB: '',
    locationB: ''
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      const hash = window.location.hash;
      const queryString = hash.includes('?') ? hash.split('?')[1] : '';
      const params = new URLSearchParams(queryString);
      
      const makeA = params.get('makeA') || '';
      const modelA = params.get('modelA') || '';
      const yearA = params.get('yearA') || '';
      const priceA = params.get('priceA') || '';
      const locationA = params.get('locationA') || '';
      
      const makeB = params.get('makeB') || '';
      const modelB = params.get('modelB') || '';
      const yearB = params.get('yearB') || '';
      const priceB = params.get('priceB') || '';
      const locationB = params.get('locationB') || '';

      setSearchParams({
        makeA, modelA, yearA, priceA, locationA,
        makeB, modelB, yearB, priceB, locationB
      });

      if (!makeA && !makeB) return;

      setLoading(true);
      try {
        const fetchPromises = [];
        
        if (makeA) {
          const queryA = new URLSearchParams({ make: makeA });
          if (modelA) queryA.append('model', modelA);
          fetchPromises.push(api.get(`/cars?${queryA.toString()}`).then(res => ({ type: 'A', data: res.data.cars || res.data })));
        }
        
        if (makeB) {
          const queryB = new URLSearchParams({ make: makeB });
          if (modelB) queryB.append('model', modelB);
          fetchPromises.push(api.get(`/cars?${queryB.toString()}`).then(res => ({ type: 'B', data: res.data.cars || res.data })));
        }

        const results = await Promise.all(fetchPromises);
        results.forEach(result => {
          if (result.type === 'A') setVehiclesA(Array.isArray(result.data) ? result.data : []);
          if (result.type === 'B') setVehiclesB(Array.isArray(result.data) ? result.data : []);
        });
      } catch (error) {
        console.error("Error fetching comparison vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
    
    const handleHashChange = () => fetchVehicles();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const getVehicleSpecs = (car: any) => [
    { icon: <Car className="w-[18px] h-[18px]" strokeWidth={1} />, label: 'CarType', value: car.bodyType || 'N/A' },
    { icon: <Gauge className="w-[18px] h-[18px]" strokeWidth={1} />, label: 'Mileage', value: car.mileage ? `${car.mileage.toLocaleString()} km` : 'N/A' },
    { icon: <Fuel className="w-[18px] h-[18px]" strokeWidth={1} />, label: 'Fuel Type', value: car.fuelType || 'N/A' },
    { icon: <Calendar className="w-[18px] h-[18px]" strokeWidth={1} />, label: 'Year', value: car.year?.toString() || 'N/A' },
    { icon: <Settings className="w-[18px] h-[18px]" strokeWidth={1} />, label: 'Transmission', value: car.transmission || 'N/A' },
    { icon: <Compass className="w-[18px] h-[18px]" strokeWidth={1} />, label: 'Drive Type', value: car.driveType || 'N/A' },
    { icon: <Car className="w-[18px] h-[18px]" strokeWidth={1} />, label: 'Condition', value: car.condition || 'N/A' },
    { icon: <DoorClosed className="w-[18px] h-[18px]" strokeWidth={1} />, label: 'Door', value: car.doors ? `${car.doors} Doors` : 'N/A' },
    { icon: <Palette className="w-[18px] h-[18px]" strokeWidth={1} />, label: 'Color', value: car.color || 'N/A' },
    { icon: <FileText className="w-[18px] h-[18px]" strokeWidth={1} />, label: 'VIN', value: car.vin || 'N/A' },
  ];

  return (
      <div className="w-full bg-white py-6 md:py-12 px-4 md:px-8 lg:mx-auto lg:max-w-[1375px] overflow-x-hidden">
        <div className="w-full mx-auto">
        {/* Compare Search Panel - First Item */}
        <div className="mb-8 md:mb-12">
          <CompareSearchPanel />
        </div>

        {/* Title */}
        <h2
          className="mb-6 md:mb-8"
          style={{
            fontFamily: 'Lexend',
            fontWeight: 400,
            fontSize: 'clamp(20px, 3vw, 24px)',
            lineHeight: '160%',
            color: '#060606',
          }}
        >
          Compare Cars
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar - Filters for Option A */}
          <div className="lg:w-[300px] xl:w-[320px] flex-shrink-0">
            {/* Cars Option A */}
            <div className="mb-8 md:mb-12">
              <h3
                className="mb-3 md:mb-4 pt-4 md:pt-6"
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 400,
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  lineHeight: '160%',
                  color: '#666666',
                }}
              >
                Cars Option A
              </h3>
              
              {/* Toggle Buttons */}
              <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ background: '#005C32' }}
                >
                  <ChevronLeft className="w-3 h-3 text-white" strokeWidth={2} />
                </button>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ border: '1px solid #BC9C22', background: 'white' }}
                >
                  <ChevronRight className="w-3 h-3 text-[#BC9C22]" strokeWidth={2} />
                </button>
              </div>

              {/* Filter Form */}
              <div
                className="bg-white border border-[#E2E8F9] rounded-[15px] p-4 md:p-6 flex flex-col gap-6 md:gap-8 w-full"
              >
                <div className="flex flex-col gap-6 md:gap-8">
                  {/* Make */}
                  <FilterField label="Select Makes" value={searchParams.makeA || 'Any'} />
                  
                  {/* Model */}
                  <FilterField label="Select Model" value={searchParams.modelA || 'Any'} />
                  
                  {/* Year */}
                  <FilterField label="Select Year" value={searchParams.yearA || 'Any'} />
                  
                  {/* Price */}
                  <FilterField label="Price Range" value={searchParams.priceA || 'Any'} />
                  
                  {/* Location */}
                  <FilterField label="Location" value={searchParams.locationA || 'Any'} />
                  
                  {/* Search Button */}
                  <button
                    className="bg-[#005C32] hover:bg-[#004a28] transition-colors rounded-[16px] flex items-center justify-center gap-2.5 w-full"
                    style={{
                      height: '54px',
                      padding: '13px 24px',
                    }}
                  >
                    <Search className="w-[15px] h-[15px] text-white" style={{ transform: 'scaleY(-1)' }} />
                    <span
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 500,
                        fontSize: '15px',
                        lineHeight: '28px',
                        color: '#FFFFFF',
                      }}
                    >
                      Search
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cars Option B Filters */}
            <div className="mb-6">
              <h3
                className="mb-3 md:mb-4"
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 400,
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  lineHeight: '160%',
                  color: '#666666',
                }}
              >
                Cars Option B
              </h3>
              
              {/* Toggle Buttons */}
              <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ background: '#005C32' }}
                >
                  <ChevronLeft className="w-3 h-3 text-white" strokeWidth={2} />
                </button>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
                  style={{ border: '1px solid #BC9C22', background: 'white' }}
                >
                  <ChevronRight className="w-3 h-3 text-[#BC9C22]" strokeWidth={2} />
                </button>
              </div>

              {/* Filter Form */}
              <div
                className="bg-white border border-[#E2E8F9] rounded-[15px] p-4 md:p-6 flex flex-col gap-6 md:gap-8 w-full"
              >
                <div className="flex flex-col gap-6 md:gap-8">
                  {/* Make */}
                  <FilterField label="Select Makes" value={searchParams.makeB || 'Any'} />
                  
                  {/* Model */}
                  <FilterField label="Select Model" value={searchParams.modelB || 'Any'} />
                  
                  {/* Year */}
                  <FilterField label="Select Year" value={searchParams.yearB || 'Any'} />
                  
                  {/* Price */}
                  <FilterField label="Price Range" value={searchParams.priceB || 'Any'} />
                  
                  {/* Location */}
                  <FilterField label="Location" value={searchParams.locationB || 'Any'} />
                  
                  {/* Search Button */}
                  <button
                    className="bg-[#005C32] hover:bg-[#004a28] transition-colors rounded-[16px] flex items-center justify-center gap-2.5 w-full"
                    style={{
                      height: '54px',
                      padding: '13px 24px',
                    }}
                  >
                    <Search className="w-[15px] h-[15px] text-white" style={{ transform: 'scaleY(-1)' }} />
                    <span
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 500,
                        fontSize: '15px',
                        lineHeight: '28px',
                        color: '#FFFFFF',
                      }}
                    >
                      Search
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Two Comparison Sections */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Spinner size="lg" />
                <p className="text-[#999999] font-['Lexend']">Fetching comparison data...</p>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12">
                {/* First Comparison Section - Option A */}
                <div
                  className="bg-[#FAF8F9] rounded-[15px] p-4 md:p-6 flex-1"
                >
                  <h4 className="text-center mb-6 text-[#666666] font-['Lexend'] text-lg">Option A</h4>
                  {vehiclesA.length > 0 ? (
                    <div className="flex flex-col gap-2 w-full">
                      {vehiclesA.map((car, index) => (
                        <div key={`A-${car.id || index}`} className="flex justify-center w-full">
                          <CompareVehicleCard
                            image={car.images?.[0] || "https://images.unsplash.com/photo-1764605206511-7a649d9df63b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NjU0MTY3OTh8MA&ixlib=rb-4.1.0&q=80&w=1080"}
                            title={`${car.make} ${car.model}`}
                            subtitle={car.description || "No description available"}
                            price={car.price?.toString() || "0"}
                            specs={getVehicleSpecs(car)}
                            carId={car.id || car._id}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-10">
                      <p className="text-[#999999] font-['Lexend']">No vehicles found for Option A</p>
                    </div>
                  )}
                </div>

                {/* Second Comparison Section - Option B */}
                <div
                  className="bg-[#FAF8F9] rounded-[15px] p-4 md:p-6 flex-1"
                >
                  <h4 className="text-center mb-6 text-[#666666] font-['Lexend'] text-lg">Option B</h4>
                  {vehiclesB.length > 0 ? (
                    <div className="flex flex-col gap-2 w-full">
                      {vehiclesB.map((car, index) => (
                        <div key={`B-${car.id || index}`} className="flex justify-center w-full">
                          <CompareVehicleCard
                            image={car.images?.[0] || "https://images.unsplash.com/photo-1764605206511-7a649d9df63b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzZWRhbiUyMGNhcnxlbnwxfHx8fDE3NjU0MTY3OTh8MA&ixlib=rb-4.1.0&q=80&w=1080"}
                            title={`${car.make} ${car.model}`}
                            subtitle={car.description || "No description available"}
                            price={car.price?.toString() || "0"}
                            specs={getVehicleSpecs(car)}
                            carId={car.id || car._id}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-10">
                      <p className="text-[#999999] font-['Lexend']">No vehicles found for Option B</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Filter Field Component
interface FilterFieldProps {
  label: string;
  value: string;
}

function FilterField({ label, value }: FilterFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        style={{
          fontFamily: 'Lexend',
          fontWeight: 500,
          fontSize: '18px',
          lineHeight: '18px',
          color: '#060606',
          textTransform: 'capitalize',
        }}
      >
        {label}
      </label>
      <div className="flex items-center justify-between">
        <span
          style={{
            fontFamily: 'Lexend',
            fontWeight: 400,
            fontSize: '15px',
            lineHeight: '28px',
            color: '#4B5563',
          }}
        >
          {value}
        </span>
        <ChevronDown className="w-6 h-6 text-[#666666]" strokeWidth={1.5} />
      </div>
    </div>
  );
}