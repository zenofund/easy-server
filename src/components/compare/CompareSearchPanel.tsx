import { ChevronDown, Search, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Spinner } from '../ui/Spinner';
import { AdvancedSearchModal } from '../modals/AdvancedSearchModal';
import api from '../../lib/api';

export function CompareSearchPanel() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState('all');
  const [totalCars, setTotalCars] = useState(0);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  
  const [makes, setMakes] = useState<string[]>([]);
  const [allCars, setAllCars] = useState<any[]>([]);
  
  // Selection state for both car slots
  const [carA, setCarA] = useState({ make: '', model: '', year: '', price: '', location: '' });
  const [carB, setCarB] = useState({ make: '', model: '', year: '', price: '', location: '' });

  // Fetch car count based on active tab
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const params = new URLSearchParams();
        if (searchType === 'new') {
          params.append('condition', 'New');
        } else if (searchType === 'used') {
          params.append('condition', 'Used');
          params.append('condition', 'Foreign Used');
          params.append('condition', 'Nigerian Used');
        }
        
        const response = await api.get(`/cars?${params.toString()}`);
        const pagination = response.data.pagination;
        const cars = response.data.cars || response.data;
        
        if (pagination) {
          setTotalCars(pagination.total);
        } else if (Array.isArray(cars)) {
          setTotalCars(cars.length);
        }
      } catch (error) {
        console.error("Error fetching car count:", error);
      }
    };

    fetchCount();
  }, [searchType]);

  // Fetch initial data for makes
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await api.get('/cars');
        const cars = response.data.cars || response.data;
        if (Array.isArray(cars)) {
          setAllCars(cars);
          const uniqueMakes = Array.from(new Set(cars.map((car: any) => car.make))).filter(Boolean) as string[];
          setMakes(uniqueMakes.sort());
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    setIsSearching(true);
    // Construct query for comparison
    const params = new URLSearchParams();
    if (carA.make) params.append('makeA', carA.make);
    if (carA.model) params.append('modelA', carA.model);
    if (carA.year) params.append('yearA', carA.year);
    if (carA.price) params.append('priceA', carA.price);
    if (carA.location) params.append('locationA', carA.location);
    
    if (carB.make) params.append('makeB', carB.make);
    if (carB.model) params.append('modelB', carB.model);
    if (carB.year) params.append('yearB', carB.year);
    if (carB.price) params.append('priceB', carB.price);
    if (carB.location) params.append('locationB', carB.location);
    
    // Simulate search logic
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSearching(false);
    
    window.location.hash = `#compare?${params.toString()}`;
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'used', label: 'Used' },
  ];

  console.log("CompareSearchPanel isAdvancedSearchOpen:", isAdvancedSearchOpen);

  return (
    <div
      className="bg-white rounded-[16px] w-full max-w-[1300px] mx-auto"
      style={{
        padding: 'clamp(20px, 3vw, 39px) clamp(12px, 2.5vw, 35px)',
        boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06), 0px 0px 0px 1px #D1CFCF',
      }}
    >
      {/* Search Type Tabs */}
      <div className="flex items-start gap-4 md:gap-6 mb-6 md:mb-[35px] overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSearchType(tab.id)}
            className="flex items-center whitespace-nowrap transition-colors"
            style={{
              fontFamily: 'Lexend',
              fontWeight: 500,
              fontSize: 'clamp(14px, 2vw, 16px)',
              lineHeight: '30px',
              color: searchType === tab.id ? '#005C32' : '#999999',
              height: '30px',
              borderBottom: searchType === tab.id ? '2px solid #005C32' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
        
        <div className="flex flex-col gap-1">
          <button
            className="flex items-center whitespace-nowrap"
            style={{
              fontFamily: 'Lexend',
              fontWeight: 500,
              fontSize: 'clamp(14px, 2vw, 16px)',
              lineHeight: '30px',
              color: '#005C32',
              height: '30px',
            }}
          >
            Compare Cars
          </button>
          <div
            style={{
              width: '100%',
              maxWidth: '113px',
              height: '2px',
              background: '#005C32',
            }}
          />
        </div>
      </div>

      {/* First Row of Search Fields */}
      <div className="flex flex-col gap-6 md:gap-[30px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          <SearchField 
            label="Select Make" 
            value={carA.make} 
            options={makes}
            onChange={(val) => setCarA({...carA, make: val, model: ''})}
          />
          <SearchField 
            label="Select Model" 
            value={carA.model} 
            options={Array.from(new Set(allCars.filter(c => c.make === carA.make).map(c => c.model)))}
            onChange={(val) => setCarA({...carA, model: val})}
            disabled={!carA.make}
          />
          <SearchField label="Select Year" value={carA.year} options={['2024', '2023', '2022', '2021', '2020']} onChange={(val) => setCarA({...carA, year: val})} />
          <SearchField label="Select Price" value={carA.price} options={['Under N5m', 'N5m - N10m', 'Above N10m']} onChange={(val) => setCarA({...carA, price: val})} />
          <SearchField label="Select Location" value={carA.location} options={['Lagos', 'Abuja', 'Port Harcourt']} onChange={(val) => setCarA({...carA, location: val})} />
        </div>

        {/* Add Button */}
        <div className="flex justify-center">
          <button
            className="bg-[#005C32] hover:bg-[#004a28] transition-colors rounded-[16px] flex items-center justify-center"
            style={{
              width: '50px',
              height: '50px',
            }}
          >
            <Plus className="w-6 h-6 text-white" strokeWidth={1.5} />
          </button>
        </div>

        {/* Second Row of Search Fields */}
        <div className="flex flex-col gap-4 md:gap-[30px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            <SearchField 
              label="Select Make" 
              value={carB.make} 
              options={makes}
              onChange={(val) => setCarB({...carB, make: val, model: ''})}
            />
            <SearchField 
              label="Select Model" 
              value={carB.model} 
              options={Array.from(new Set(allCars.filter(c => c.make === carB.make).map(c => c.model)))}
              onChange={(val) => setCarB({...carB, model: val})}
              disabled={!carB.make}
            />
            <SearchField label="Select Year" value={carB.year} options={['2024', '2023', '2022', '2021', '2020']} onChange={(val) => setCarB({...carB, year: val})} />
            <SearchField label="Select Price" value={carB.price} options={['Under N5m', 'N5m - N10m', 'Above N10m']} onChange={(val) => setCarB({...carB, price: val})} />
            <SearchField label="Select Location" value={carB.location} options={['Lagos', 'Abuja', 'Port Harcourt']} onChange={(val) => setCarB({...carB, location: val})} />
          </div>

          {/* Advanced Search Link */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                console.log("CompareSearchPanel: Clicking Advance Search button");
                setIsAdvancedSearchOpen(true);
              }}
              className="underline text-left hover:opacity-80 transition-opacity"
              style={{
                fontFamily: 'Lexend',
                fontWeight: 500,
                fontSize: 'clamp(14px, 2vw, 16px)',
                lineHeight: '30px',
                color: '#005C32',
                textDecorationLine: 'underline',
              }}
            >
              Advance Search
            </button>
            {isAdvancedSearchOpen && <span className="text-[10px] text-gray-400">(Modal state: OPEN)</span>}
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-[#005C32] hover:bg-[#004a28] transition-all rounded-[16px] flex items-center justify-center gap-2.5 w-full max-w-full md:max-w-[648px] mx-auto active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            height: '54px',
            padding: '13px 24px',
          }}
        >
          {isSearching ? (
            <>
              <Spinner size="sm" variant="white" />
              <span
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 500,
                  fontSize: '15px',
                  lineHeight: '28px',
                  color: '#FFFFFF',
                }}
              >
                Searching...
              </span>
            </>
          ) : (
            <>
              <Search
                className="w-[15px] h-[15px] text-white"
                style={{ transform: 'scaleY(-1)' }}
              />
              <span
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 500,
                  fontSize: '15px',
                  lineHeight: '28px',
                  color: '#FFFFFF',
                }}
              >
                Search ({totalCars})
              </span>
            </>
          )}
        </button>
      </div>

      <AdvancedSearchModal 
        isOpen={isAdvancedSearchOpen} 
        onClose={() => setIsAdvancedSearchOpen(false)} 
      />
    </div>
  );
}

// Search Field Component
interface SearchFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  disabled?: boolean;
}

function SearchField({ label, value, options, onChange, disabled }: SearchFieldProps) {
  return (
    <div
      className={`flex flex-col gap-1.5 ${disabled ? 'opacity-50' : ''}`}
      style={{
        minWidth: 0,
      }}
    >
      <label
        style={{
          fontFamily: 'Lexend',
          fontWeight: 500,
          fontSize: '16px',
          lineHeight: '1.2',
          color: '#060606',
          textTransform: 'capitalize',
        }}
      >
        {label}
      </label>
      <div
        className="relative flex items-center justify-between"
        style={{
          height: '28px',
        }}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        >
          <option value="">Any</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span
          className="truncate pr-6"
          style={{
            fontFamily: 'Lexend',
            fontWeight: 400,
            fontSize: '15px',
            lineHeight: '28px',
            color: value ? '#060606' : '#999999',
          }}
        >
          {value || 'Any'}
        </span>
        <ChevronDown className="w-6 h-6 text-[#999999]" strokeWidth={1.5} />
      </div>
    </div>
  );
}
