import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { AdvancedSearchModal } from "./modals/AdvancedSearchModal";
import { Spinner } from "./ui/Spinner";
import api from "../lib/api";
import { toast } from "sonner";

export function SearchBar() {
  const [searchType, setSearchType] = useState("all");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [totalCars, setTotalCars] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [makes, setMakes] = useState<string[]>([]);
  const [allCars, setAllCars] = useState<any[]>([]); // Store all cars to filter models locally
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  
  // Selected Filters
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Fetch car count based on selected tab and filters
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const params = new URLSearchParams();
        if (searchType === 'new') {
          params.append('condition', 'New');
        } else if (searchType === 'used') {
          // Pass all used variations to be sure we catch them
          params.append('condition', 'Used');
          params.append('condition', 'Foreign Used');
          params.append('condition', 'Nigerian Used');
        }
        
        if (selectedMake) params.append('make', selectedMake);
        if (selectedModel) params.append('model', selectedModel);
        if (selectedYear) params.append('year', selectedYear);
        if (selectedLocation) params.append('location', selectedLocation);
        
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
  }, [searchType, selectedMake, selectedModel, selectedYear, selectedLocation]);

  // Fetch initial data (Makes, Models, Years)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await api.get('/cars');
        const cars = response.data.cars || response.data;
        
        if (Array.isArray(cars)) {
          setAllCars(cars);
          // Extract unique makes, models, and years from fetched cars for filter options
          const uniqueMakes = Array.from(new Set(cars.map((car: any) => car.make))).filter(Boolean) as string[];
          const uniqueModels = Array.from(new Set(cars.map((car: any) => car.model))).filter(Boolean) as string[];
          const uniqueYears = Array.from(new Set(cars.map((car: any) => String(car.year)))).filter(Boolean) as string[];
          
          setMakes(uniqueMakes.sort());
          setModels(uniqueModels.sort());
          setYears(uniqueYears.sort((a, b) => Number(b) - Number(a))); // Descending order
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };
    fetchInitialData();
  }, []);

  // Filter models based on selected make
  useEffect(() => {
    if (selectedMake) {
      const filteredModels = Array.from(
        new Set(
          allCars
            .filter((car) => car.make === selectedMake)
            .map((car) => car.model)
        )
      ).filter(Boolean) as string[];
      setModels(filteredModels.sort());
      // Reset selected model if it's not in the new models list
      if (selectedModel && !filteredModels.includes(selectedModel)) {
        setSelectedModel("");
      }
    } else {
      // If no make is selected, show all unique models
      const allModels = Array.from(new Set(allCars.map((car: any) => car.model))).filter(Boolean) as string[];
      setModels(allModels.sort());
    }
  }, [selectedMake, allCars]);

  const handleSearch = async () => {
    setIsSearching(true);
    // Construct query parameters
    const params = new URLSearchParams();
    if (searchType === 'new') {
      params.append('condition', 'New');
    } else if (searchType === 'used') {
      // Pass all used variations
      params.append('condition', 'Used');
      params.append('condition', 'Foreign Used');
      params.append('condition', 'Nigerian Used');
    }

    if (selectedMake) params.append('make', selectedMake);
    if (selectedModel) params.append('model', selectedModel);
    if (selectedYear) params.append('year', selectedYear);
    if (selectedLocation) params.append('location', selectedLocation);

    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Redirect to Buy Page with filters
    window.location.hash = `#buy?${params.toString()}`;
    setIsSearching(false);
  };

  const searchTabs = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "used", label: "Used" },
    { id: "compare", label: "Compare Cars" },
  ];

  console.log("SearchBar isAdvancedSearchOpen:", isAdvancedSearchOpen);

  const handleTabClick = (tabId: string) => {
    if (tabId === "compare") {
      window.location.hash = '#compare';
    } else {
      setSearchType(tabId);
    }
  };

  return (
    <div
      className="relative bg-white rounded-[16px] mx-auto px-4 py-4 md:px-8 md:py-6 lg:px-[45px] lg:py-[13px] w-full"
      style={{
        maxWidth: "1188px",
        boxShadow: "0px 6px 30px 5px rgba(16, 25, 40, 0.12)",
      }}
    >
      {/* Search Type Tabs and Fields Container */}
      <div className="flex flex-col gap-6 lg:gap-[45px] w-full">
        <div className="flex flex-col gap-4 lg:gap-[30px] w-full">
          {/* Search Type Tabs */}
          <div className="flex gap-4 md:gap-6 lg:gap-[30px] overflow-x-auto pb-2 lg:pb-0 w-full">
            {searchTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className="relative flex items-center whitespace-nowrap flex-shrink-0"
                style={{
                  fontFamily: "Lexend",
                  fontWeight: 500,
                  fontSize: "clamp(14px, 2vw, 16px)",
                  lineHeight: "30px",
                  color: searchType === tab.id ? "#005C32" : "#999999",
                  height: "30px",
                }}
              >
                {tab.label}
                {searchType === tab.id && (
                  <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{ height: "2px", background: "#005C32" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search Fields Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center gap-4 lg:gap-[52px] w-full">
            {/* Make Filter */}
            <div className="flex flex-col gap-1 w-full sm:w-auto" style={{ minWidth: "140px" }}>
              <label className="flex items-center capitalize" style={{ fontFamily: "Lexend", fontWeight: 500, fontSize: "clamp(14px, 2.5vw, 18px)", lineHeight: "18px", color: "#060606" }}>
                Select Makes
              </label>
              <div className="relative">
                <select 
                  value={selectedMake} 
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="appearance-none w-full bg-transparent outline-none cursor-pointer truncate pr-6"
                  style={{ fontFamily: "Lexend", fontWeight: 400, fontSize: "clamp(13px, 2vw, 15px)", lineHeight: "28px", color: "#999999" }}
                >
                  <option value="">Any Make</option>
                  {makes.map(make => <option key={make} value={make}>{make}</option>)}
                </select>
                
              </div>
            </div>

            {/* Model Filter */}
            <div className="flex flex-col gap-1 w-full sm:w-auto" style={{ minWidth: "140px" }}>
              <label className="flex items-center capitalize" style={{ fontFamily: "Lexend", fontWeight: 500, fontSize: "clamp(14px, 2.5vw, 18px)", lineHeight: "18px", color: "#060606" }}>
                Select Model
              </label>
              <div className="relative">
                <select 
                  value={selectedModel} 
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="appearance-none w-full bg-transparent outline-none cursor-pointer truncate pr-6"
                  style={{ fontFamily: "Lexend", fontWeight: 400, fontSize: "clamp(13px, 2vw, 15px)", lineHeight: "28px", color: "#999999" }}
                >
                  <option value="">Any Model</option>
                  {models.map(model => <option key={model} value={model}>{model}</option>)}
                </select>
                
              </div>
            </div>

            {/* Year Filter */}
            <div className="flex flex-col gap-1 w-full sm:w-auto" style={{ minWidth: "140px" }}>
              <label className="flex items-center capitalize" style={{ fontFamily: "Lexend", fontWeight: 500, fontSize: "clamp(14px, 2.5vw, 18px)", lineHeight: "18px", color: "#060606" }}>
                Select Year
              </label>
              <div className="relative">
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none w-full bg-transparent outline-none cursor-pointer truncate pr-6"
                  style={{ fontFamily: "Lexend", fontWeight: 400, fontSize: "clamp(13px, 2vw, 15px)", lineHeight: "28px", color: "#999999" }}
                >
                  <option value="">Any Year</option>
                  {years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
                
              </div>
            </div>

            {/* Location Filter (Mock for now or extract from data) */}
            <div className="flex flex-col gap-1 w-full sm:w-auto" style={{ minWidth: "160px" }}>
              <label className="flex items-center capitalize" style={{ fontFamily: "Lexend", fontWeight: 500, fontSize: "clamp(14px, 2.5vw, 18px)", lineHeight: "18px", color: "#060606" }}>
                Location
              </label>
              <div className="relative">
                <select 
                  value={selectedLocation} 
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="appearance-none w-full bg-transparent outline-none cursor-pointer truncate pr-6"
                  style={{ fontFamily: "Lexend", fontWeight: 400, fontSize: "clamp(13px, 2vw, 15px)", lineHeight: "28px", color: "#999999" }}
                >
                  <option value="">Any Location</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                </select>
                
              </div>
            </div>

            {/* Advanced Search Link */}
            <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
              <button
                className="flex items-center underline"
                style={{
                  fontFamily: "Lexend",
                  fontWeight: 500,
                  fontSize: "clamp(14px, 2vw, 16px)",
                  lineHeight: "30px",
                  color: "#005C32",
                  height: "30px",
                  textDecorationLine: "underline",
                }}
                onClick={() => {
                  console.log("SearchBar: Clicking Advanced Search button");
                  setIsAdvancedSearchOpen(true);
                }}
              >
                Advanced Search
              </button>
              {isAdvancedSearchOpen && <span className="text-[10px] text-gray-400">(Modal state: OPEN)</span>}
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="flex justify-center items-center gap-2.5 rounded-[16px] w-full lg:w-auto transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            maxWidth: "648px",
            height: "54px",
            background: "#005C32",
            padding: "13px 20px",
            fontFamily: "Lexend",
            fontWeight: 500,
            fontSize: "clamp(14px, 2vw, 15px)",
            lineHeight: "28px",
            color: "#FFFFFF",
          }}
        >
          {isSearching ? (
            <>
              <Spinner size="sm" variant="white" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="w-[15px] h-[15px]" style={{ transform: "scaleY(-1)" }} />
              <span>Search ({totalCars} Cars)</span>
            </>
          )}
        </button>
      </div>

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
      />
    </div>
  );
}
