import { X, ChevronLeft, ChevronDown, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Spinner } from '../ui/Spinner';
import api from '../../lib/api';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchFormData {
  make: string;
  model: string;
  year: string;
  price: string;
  location: string;
  carType: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  driveType: string;
  condition: string;
  door: string;
  color: string;
}

export function AdvancedSearchModal({ isOpen, onClose }: AdvancedSearchModalProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState<SearchFormData>({
    make: '',
    model: '',
    year: '',
    price: '',
    location: '',
    carType: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    driveType: '',
    condition: '',
    door: '',
    color: '',
  });

  const [allCars, setAllCars] = useState<any[]>([]);
  const [options, setOptions] = useState({
    makes: [] as string[],
    models: [] as string[],
    years: [] as string[],
    locations: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan'],
    carTypes: ['Sedan', 'SUV', 'Hatchback', 'Truck', 'Coupe', 'Convertible'],
    fuelTypes: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
    transmissions: ['Automatic', 'Manual'],
    driveTypes: ['Front-Wheel Drive', 'Rear-Wheel Drive', 'All-Wheel Drive', '4WD / 4x4'],
    conditions: ['New', 'Used', 'Foreign Used'],
    doors: ['2', '3', '4', '5'],
    colors: ['Black', 'White', 'Silver', 'Grey', 'Blue', 'Red', 'Other']
  });

  // Fetch unique makes, models, and years from API
  useEffect(() => {
    if (isOpen) {
      const fetchOptions = async () => {
        try {
          const response = await api.get('/cars');
          const cars = response.data.cars || response.data;
          
          if (Array.isArray(cars)) {
            setAllCars(cars);
            const uniqueMakes = Array.from(new Set(cars.map((car: any) => car.make))).filter(Boolean) as string[];
            const uniqueModels = Array.from(new Set(cars.map((car: any) => car.model))).filter(Boolean) as string[];
            const uniqueYears = Array.from(new Set(cars.map((car: any) => String(car.year)))).filter(Boolean) as string[];
            
            setOptions(prev => ({
              ...prev,
              makes: uniqueMakes.sort(),
              models: uniqueModels.sort(),
              years: uniqueYears.sort((a, b) => Number(b) - Number(a))
            }));
          }
        } catch (error) {
          console.error("Error fetching search options:", error);
        }
      };

      fetchOptions();
    }
  }, [isOpen]);

  // Filter models based on selected make
  useEffect(() => {
    if (formData.make) {
      const filteredModels = Array.from(
        new Set(
          allCars
            .filter((car) => car.make === formData.make)
            .map((car) => car.model)
        )
      ).filter(Boolean) as string[];
      
      setOptions(prev => ({
        ...prev,
        models: filteredModels.sort()
      }));

      // Reset selected model if it's not in the new models list
      if (formData.model && !filteredModels.includes(formData.model)) {
        setFormData(prev => ({ ...prev, model: '' }));
      }
    } else {
      // If no make is selected, show all unique models from allCars
      const allModels = Array.from(new Set(allCars.map((car: any) => car.model))).filter(Boolean) as string[];
      setOptions(prev => ({
        ...prev,
        models: allModels.sort()
      }));
    }
  }, [formData.make, allCars]);

  console.log("AdvancedSearchModal is rendering. isOpen:", isOpen);

  useEffect(() => {
    if (isOpen) {
      console.log("AdvancedSearchModal: Modal is OPEN, applying overflow hidden");
      document.body.style.overflow = 'hidden';
      // Force a re-render or layout check
      window.dispatchEvent(new Event('resize'));
    } else {
      console.log("AdvancedSearchModal: Modal is CLOSED, resetting overflow");
      document.body.style.overflow = 'unset';
    }
    return () => {
      console.log("AdvancedSearchModal: Cleanup - resetting overflow");
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    console.log("AdvancedSearchModal: isOpen is false, returning null");
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSearching) {
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Construct query parameters
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        // Map UI field names to API query parameters if needed
        let paramKey = key;
        if (key === 'carType') paramKey = 'bodyType';
        
        let paramValue = value;
        
        // Map UI values to API constants if needed
        if (key === 'transmission') {
          paramValue = value.toUpperCase();
        }
        if (key === 'fuelType') {
          paramValue = value.toUpperCase();
        }
        if (key === 'driveType') {
          const driveMap: Record<string, string> = {
            'Front-Wheel Drive': 'FRONT_WHEEL',
            'Rear-Wheel Drive': 'REAR_WHEEL',
            'All-Wheel Drive': 'ALL_WHEEL',
            '4WD / 4x4': 'FOUR_WHEEL'
          };
          paramValue = driveMap[value] || value;
        }
        if (key === 'condition') {
          const conditionMap: Record<string, string> = {
            'New': 'NEW',
            'Used': 'USED',
            'Foreign Used': 'FOREIGN_USED'
          };
          paramValue = conditionMap[value] || value;
        }

        params.append(paramKey, paramValue);
      }
    });

    // Simulate small delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Redirect to Buy Page with filters
    window.location.hash = `#buy?${params.toString()}`;
    
    setIsSearching(false);
    onClose();
  };

  return createPortal(
    <div
      id="advanced-search-modal-backdrop"
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ 
        backdropFilter: 'blur(12px)', 
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'fixed',
        visibility: 'visible',
        display: 'flex',
        zIndex: 9999999
      }}
      onClick={handleBackdropClick}
    >
      <div
        id="advanced-search-modal-content"
        className="bg-white rounded-[22px] overflow-hidden"
        style={{
          width: '742px',
          maxWidth: '100%',
          maxHeight: '90vh',
          border: '1px solid #E2E8F9',
          filter: 'drop-shadow(10px 10px 50px rgba(0, 98, 255, 0.03))',
          position: 'relative',
          zIndex: 10000000,
          backgroundColor: 'white'
        }}
      >
        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          <div className="p-10 flex flex-col gap-[53px]">
            {/* Back Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-2 hover:opacity-70 transition-opacity w-fit"
              style={{
                fontFamily: 'Lexend',
                fontWeight: 400,
                fontSize: '18px',
                lineHeight: '150%',
                letterSpacing: '-0.02em',
                color: '#999999',
              }}
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2} />
              Back
            </button>

            {/* Header */}
            <div className="flex flex-col gap-2">
              <h2
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 600,
                  fontSize: '24px',
                  lineHeight: '30px',
                  color: '#060606',
                }}
              >
                Advanced Search
              </h2>
              <p
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 300,
                  fontSize: '15px',
                  lineHeight: '19px',
                  color: '#999999',
                }}
              >
                Refine Your Search to Match Your Needs
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Row 1: Make & Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                  label="Make" 
                  name="make"
                  value={formData.make}
                  options={options.makes}
                  onChange={handleInputChange}
                  placeholder="Select Car Make" 
                />
                <SelectField 
                  label="Model" 
                  name="model"
                  value={formData.model}
                  options={options.models}
                  onChange={handleInputChange}
                  placeholder="Select Car Model" 
                />
              </div>

              {/* Row 2: Year & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                  label="Year" 
                  name="year"
                  value={formData.year}
                  options={options.years}
                  onChange={handleInputChange}
                  placeholder="Select Car Year" 
                />
                <SelectField 
                  label="Price" 
                  name="price"
                  value={formData.price}
                  options={['Under N5m', 'N5m - N10m', 'N10m - N20m', 'Above N20m']}
                  onChange={handleInputChange}
                  placeholder="Select Car Price" 
                />
              </div>

              {/* Row 3: Location & Car Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                  label="Location" 
                  name="location"
                  value={formData.location}
                  options={options.locations}
                  onChange={handleInputChange}
                  placeholder="Select Location" 
                />
                <SelectField 
                  label="Car Type" 
                  name="carType"
                  value={formData.carType}
                  options={options.carTypes}
                  onChange={handleInputChange}
                  placeholder="Select Type" 
                />
              </div>

              {/* Row 4: Mileage & Fuel Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                  label="Mileage" 
                  name="mileage"
                  value={formData.mileage}
                  options={['0 - 10,000', '10,000 - 50,000', '50,000 - 100,000', 'Above 100,000']}
                  onChange={handleInputChange}
                  placeholder="Select Mileage" 
                />
                <SelectField 
                  label="Fuel Type" 
                  name="fuelType"
                  value={formData.fuelType}
                  options={options.fuelTypes}
                  onChange={handleInputChange}
                  placeholder="Select Fuel Type" 
                />
              </div>

              {/* Row 5: Transmission & Drive Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                  label="Transmission" 
                  name="transmission"
                  value={formData.transmission}
                  options={options.transmissions}
                  onChange={handleInputChange}
                  placeholder="Select Transmission" 
                />
                <SelectField 
                  label="Drive Type" 
                  name="driveType"
                  value={formData.driveType}
                  options={options.driveTypes}
                  onChange={handleInputChange}
                  placeholder="Select Drive Type" 
                />
              </div>

              {/* Row 6: Condition & Door */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                  label="Condition" 
                  name="condition"
                  value={formData.condition}
                  options={options.conditions}
                  onChange={handleInputChange}
                  placeholder="Select Car Condition" 
                />
                <SelectField 
                  label="Door" 
                  name="door"
                  value={formData.door}
                  options={options.doors}
                  onChange={handleInputChange}
                  placeholder="Select Doors" 
                />
              </div>

              {/* Row 7: Color */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                  label="Color" 
                  name="color"
                  value={formData.color}
                  options={options.colors}
                  onChange={handleInputChange}
                  placeholder="Select Car Color" 
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSearching}
                className="flex items-center justify-center gap-2 bg-[#005C32] hover:bg-[#004a28] transition-all rounded-[10px] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                style={{
                  padding: '12px 28px',
                  height: '52px',
                  fontFamily: 'Lexend',
                  fontWeight: 500,
                  fontSize: '15px',
                  lineHeight: '28px',
                  color: '#FFFFFF',
                }}
              >
                {isSearching ? (
                  <>
                    <Spinner size="sm" variant="white" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Select Field Component
interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
}

function SelectField({ label, name, value, options, onChange, placeholder }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        style={{
          fontFamily: 'Lexend',
          fontWeight: 400,
          fontSize: '12.58px',
          lineHeight: '24px',
          color: '#060606',
        }}
      >
        {label}
      </label>
      <div className="relative group">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full appearance-none bg-white border border-[#E2E8F9] rounded-md px-5 py-4 cursor-pointer focus:outline-none focus:border-[#005C32] transition-colors"
          style={{
            height: '64px',
            fontFamily: 'Lexend',
            fontWeight: value ? 400 : 200,
            fontSize: '12.68px',
            lineHeight: '20px',
            color: value ? '#060606' : '#999999',
          }}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#999999] group-hover:text-[#005C32] transition-colors">
          <ChevronDown className="w-6 h-6" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
