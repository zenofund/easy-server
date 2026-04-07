import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Upload, Check, Trash2, Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';
import { Spinner } from '../ui/Spinner';

interface MultiStepListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editCar?: any;
  onLimitReached?: () => void;
}

type Step = 1 | 2 | 3 | 4;

const FEATURES = {
    Interior: ['Air Conditioner', 'Digital Odometer', 'Heater', 'Leather Seats', 'Panoramic Moonroof', 'Tachometer'],
    Safety: ['Antilock Braking', 'Brake Assist', 'Child Safety Locks', 'Driver Air Bag', 'Power Door Locks'],
    Exterior: ['Fog Lights Front', 'Rain Sensing Wiper', 'Rear Spoiler', 'Windows - Electric'],
    'Comfort & Convenience': ['Android Auto', 'Apple CarPlay', 'Bluetooth', 'HomeLink', 'Power Steering']
};

const CAR_MAKES = [
    'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Buick', 'Cadillac', 'Chevrolet', 
    'Chrysler', 'Citroen', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 'Genesis', 'GMC', 'Honda', 'Hyundai', 
    'Infiniti', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Maserati', 
    'Mazda', 'McLaren', 'Mercedes-Benz', 'MINI', 'Mitsubishi', 'Nissan', 'Pagani', 'Peugeot', 'Porsche', 'Ram', 
    'Renault', 'Rolls-Royce', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
 ].sort();
 
 const CAR_TYPES = [
     'Sedan', 'SUV', 'Coupe', 'Hatchback', 'Convertible', 'Wagon', 'Luxury', 'Pickup Truck', 
     'Van', 'Minivan', 'Electric', 'Hybrid', 'Diesel', 'Sport', 'Classic', 'Compact', 
     'Crossover', 'Truck', 'Supercar', 'Bus'
 ].sort();
 
export function MultiStepListingModal({ isOpen, onClose, onSuccess, editCar, onLimitReached }: MultiStepListingModalProps) {
   const [currentStep, setCurrentStep] = useState<Step>(1);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
   const contentRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormatting = (tag: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const replacement = `<${tag}>${selectedText}</${tag}>`;
    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    setFormData(prev => ({ ...prev, description: newValue }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length + 2, end + tag.length + 2);
    }, 0);
  };

  const applyList = (type: 'ul' | 'ol') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const items = selectedText.split('\n').filter(i => i.trim()).map(item => `  <li>${item}</li>`).join('\n');
    const replacement = `<${type}>\n${items}\n</${type}>`;
    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    setFormData(prev => ({ ...prev, description: newValue }));
  };

  const [formData, setFormData] = useState({
    make: '',
    priceType: '',
    mileage: '',
    driveType: '',
    color: '',
    model: '',
    location: '',
    fuelType: '',
    condition: '',
    vin: '',
    year: '',
    bodyType: '',
    transmission: '',
    doors: '',
    price: '',
    description: '',
    features: [] as string[],
    existingImages: [] as string[]
  });
  const [isMobile, setIsMobile] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserName(parsed.sellerProfile?.companyName || `${parsed.firstName} ${parsed.lastName}`);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (editCar) {
      console.log('Editing car data:', editCar);
      setFormData({
        make: editCar.make || '',
        priceType: editCar.priceType || '',
        mileage: editCar.mileage !== undefined && editCar.mileage !== null ? String(editCar.mileage) : '',
        driveType: editCar.driveType || '',
        color: editCar.color || '',
        model: editCar.model || '',
        location: editCar.location || '',
        fuelType: editCar.fuelType || '',
        condition: editCar.condition || '',
        vin: editCar.vin || '',
        year: editCar.year ? String(editCar.year) : '',
        bodyType: editCar.bodyType || '',
        transmission: editCar.transmission || '',
        doors: editCar.doors !== undefined && editCar.doors !== null ? String(editCar.doors) : '',
        price: editCar.price ? String(editCar.price).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '',
        description: editCar.description || '',
        features: Array.isArray(editCar.features) ? editCar.features : (typeof editCar.features === 'string' ? JSON.parse(editCar.features) : []),
        existingImages: Array.isArray(editCar.images) ? editCar.images : (typeof editCar.images === 'string' ? JSON.parse(editCar.images) : [])
      });
    } else {
      setFormData({
        make: '',
        priceType: '',
        mileage: '',
        driveType: '',
        color: '',
        model: '',
        location: '',
        fuelType: '',
        condition: '',
        vin: '',
        year: '',
        bodyType: '',
        transmission: '',
        doors: '',
        price: '',
        description: '',
        features: [],
        existingImages: []
      });
    }
    setCurrentStep(1);
    setSelectedFiles([]);
  }, [editCar, isOpen]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Remove any non-digit characters
      const rawValue = value.replace(/\D/g, '');
      // Format with thousand separators
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === 'mileage') {
       // Prevent negative numbers
       if (parseInt(value) < 0) return;
       setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleFeature = (feature: string) => {
      setFormData(prev => {
          const currentFeatures = prev.features;
          if (currentFeatures.includes(feature)) {
              return { ...prev, features: currentFeatures.filter(f => f !== feature) };
          } else {
              return { ...prev, features: [...currentFeatures, feature] };
          }
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.make || !formData.model || !formData.price) {
        toast.error('Please fill in required fields (Make, Model, Price)');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const interiorFeatures = formData.features.filter(f => FEATURES.Interior.includes(f));
      if (interiorFeatures.length < 3) {
        toast.error('Please select at least 3 options from the Interior section');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!formData.description) {
          toast.error('Please enter a description');
          return;
      }
      if (selectedFiles.length === 0 && formData.existingImages.length === 0) {
          toast.error('Please upload at least one photo');
          return;
      }
      setCurrentStep(4);
    }
    
    // Scroll to top
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep === 2) setCurrentStep(1);
    else if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 4) setCurrentStep(3);

    // Scroll to top
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'price') {
           data.append(key, (value as string).replace(/,/g, ''));
        } else if (key === 'features' || key === 'existingImages') {
            data.append(key, JSON.stringify(value));
        } else {
           data.append(key, value as string);
        }
      });
      data.append('title', `${formData.year} ${formData.make} ${formData.model}`);

      selectedFiles.forEach((file) => {
        data.append('images', file);
      });

      if (editCar) {
        await api.put(`/cars/${editCar.id}`, data);
        toast.success('Listing updated successfully!');
      } else {
        await api.post('/cars', data);
        toast.success('Car listed successfully!');
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Error saving car:', error);
      const code = error.response?.data?.code;
      if (code === 'LISTING_LIMIT_REACHED') {
        if (onLimitReached) {
          onLimitReached();
        } else {
          toast.error('Listing limit reached. Upgrade your plan to continue.');
        }
      } else if (code === 'SELLER_PENDING') {
        toast.error('Your seller account is pending admin approval.');
      } else {
        const message = error.response?.data?.error || 'Failed to save car. Please try again.';
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity"
        onClick={onClose}
        style={{
          backdropFilter: 'blur(2px)',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-[20px] shadow-2xl z-10 w-full max-w-[742px] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Hidden on Step 4 (Custom Header) */}
        {currentStep !== 4 && (
        <div className="flex flex-col p-8 pb-4">
            <div className="flex items-center mb-4">
                <button 
                    onClick={currentStep === 1 ? onClose : handleBack}
                    className="flex items-center text-gray-400 hover:text-gray-600 transition-colors mr-4"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back
                </button>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontWeight: 700 }}>Add Listing</h2>
            
            <p className="text-gray-600 font-medium">
                {currentStep === 1 && 'Car Overview'}
                {currentStep === 2 && 'Features'}
                {currentStep === 3 && 'Description'}
            </p>

            {/* Progress Bar */}
            <div className="flex items-center mt-6 mb-2">
                {[1, 2, 3, 4].map((step, index) => (
                    <div key={step} className="flex items-center">
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 500,
                            backgroundColor: currentStep >= step ? '#005C32' : '#E5E7EB',
                            color: currentStep >= step ? '#FFFFFF' : '#6B7280'
                        }}>
                            {step}
                        </div>
                        {index < 3 && (
                            <div style={{
                                width: isMobile ? '32px' : '64px',
                                height: '4px',
                                margin: '0 8px',
                                borderRadius: '9999px',
                                backgroundColor: currentStep > step ? '#005C32' : '#E5E7EB'
                            }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
        )}

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-8 py-4">
          {currentStep === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '24px' : '32px 24px' }}>
                {/* Column 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Car Make</label>
                        <select
                            name="make"
                            value={formData.make}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32] bg-white"
                        >
                            <option value="">Select Car Make</option>
                            {CAR_MAKES.map(make => (
                                <option key={make} value={make}>{make}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Price</label>
                         <select
                            name="priceType"
                            value={formData.priceType}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32] bg-white"
                        >
                            <option value="">Select Car Price</option>
                            <option value="Negotiable">Negotiable</option>
                            <option value="Fixed">Fixed</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Mileage</label>
                        <input
                            type="number"
                            name="mileage"
                            value={formData.mileage}
                            onChange={handleInputChange}
                            min="0"
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32]"
                            placeholder="Enter Mileage"
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Drive Type</label>
                         <select
                            name="driveType"
                            value={formData.driveType}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32] bg-white"
                        >
                            <option value="">Select Drive Type</option>
                            <option value="FWD">Front Wheel Drive</option>
                            <option value="RWD">Rear Wheel Drive</option>
                            <option value="AWD">All Wheel Drive</option>
                            <option value="4WD">4 Wheel Drive</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Color</label>
                        <select
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32] bg-white"
                        >
                            <option value="">Select Color</option>
                            <option value="Black">Black</option>
                            <option value="White">White</option>
                            <option value="Silver">Silver</option>
                            <option value="Blue">Blue</option>
                            <option value="Red">Red</option>
                        </select>
                    </div>
                </div>

                {/* Column 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Model</label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32]"
                            placeholder="Eg RX 350"
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Location</label>
                         <select
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32] bg-white"
                        >
                            <option value="">Select Location</option>
                            <option value="Lagos">Lagos</option>
                            <option value="Abuja">Abuja</option>
                            <option value="Port Harcourt">Port Harcourt</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Fuel Type</label>
                         <select
                            name="fuelType"
                            value={formData.fuelType}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32] bg-white"
                        >
                            <option value="">Select Fuel Type</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Electric">Electric</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Condition</label>
                         <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32] bg-white"
                        >
                            <option value="">Select Car Condition</option>
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                            <option value="Foreign Used">Foreign Used</option>
                            <option value="Nigerian Used">Nigerian Used</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">VIN</label>
                        <input
                            type="text"
                            name="vin"
                            value={formData.vin}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32]"
                            placeholder="Enter VIN Number"
                        />
                    </div>
                </div>

                {/* Column 3 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Year</label>
                         <select
                            name="year"
                            value={formData.year}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32] bg-white"
                        >
                            <option value="">Select Car Year</option>
                            {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Car Type</label>
                         <select
                            name="bodyType"
                            value={formData.bodyType}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32] bg-white"
                        >
                            <option value="">Select Type</option>
                            {CAR_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Transmission</label>
                         <select
                            name="transmission"
                            value={formData.transmission}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32] bg-white"
                        >
                            <option value="">Select Transmission</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                            <option value="CVT">CVT</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Door</label>
                         <select
                            name="doors"
                            value={formData.doors}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32] bg-white"
                        >
                            <option value="">Select Doors</option>
                            <option value="2">2 Doors</option>
                            <option value="4">4 Doors</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-sm font-medium text-gray-900">Price</label>
                        <input
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-[#005C32]"
                            placeholder="Enter Car Price"
                        />
                    </div>
                </div>
            </div>
          )}
          
          {currentStep === 2 && (
             <div className="space-y-8">
                {Object.entries(FEATURES).map(([category, features]) => (
                    <div key={category}>
                        <h3 className="text-sm font-bold text-gray-900 mb-4">{category}</h3>
                        <div className="flex flex-wrap gap-y-4" style={{ columnGap: isMobile ? '24px' : '48px' }}>
                            {features.map((feature) => (
                                <button
                                    key={feature}
                                    onClick={() => toggleFeature(feature)}
                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                        formData.features.includes(feature)
                                            ? 'border-[#005C32] bg-[#005C32]'
                                            : 'border-gray-300'
                                    }`}>
                                        {formData.features.includes(feature) && (
                                            <Check className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                    {feature}
                                </button>
                            ))}
                        </div>
                        {category === 'Interior' && (
                            <p style={{ 
                                color: 'red', 
                                marginTop: '8px', 
                                fontFamily: 'Lexend',
                                fontSize: '11px'
                            }}>
                                Note: You must select 3 or 4 options
                            </p>
                        )}
                    </div>
                ))}
             </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Description</label>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <textarea
                            ref={textareaRef}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={8}
                            className="w-full p-4 focus:outline-none resize-none"
                            placeholder="Enter Description"
                        />
                        <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-100 bg-gray-50 text-gray-500">
                            <button onClick={() => applyFormatting('b')} className="hover:text-gray-900"><Bold className="w-4 h-4" /></button>
                            <button onClick={() => applyFormatting('i')} className="hover:text-gray-900"><Italic className="w-4 h-4" /></button>
                            <button onClick={() => applyFormatting('u')} className="hover:text-gray-900"><Underline className="w-4 h-4" /></button>
                            <div className="w-px h-4 bg-gray-300" />
                            <button onClick={() => applyList('ul')} className="hover:text-gray-900"><List className="w-4 h-4" /></button>
                            <button onClick={() => applyList('ol')} className="hover:text-gray-900"><ListOrdered className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-900">Photos, Videos</label>
                    <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#005C32] hover:bg-gray-50 transition-colors">
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <div className="w-12 h-12 bg-[#005C32] rounded-lg flex items-center justify-center mb-4">
                            <Upload className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Drag & Drop or <span className="text-[#005C32]">choose file</span> to upload</h4>
                        <p className="text-xs text-gray-400">Supported formats : Mp4, Jpeg, Png</p>
                    </label>

                    {(selectedFiles.length > 0 || formData.existingImages.length > 0) && (
                        <div className="space-y-3">
                            {/* Existing Images */}
                            {formData.existingImages.map((url, index) => (
                                <div key={`existing-${index}`} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                            <img src={url} alt="Car" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Existing Photo {index + 1}</p>
                                            <p className="text-xs text-gray-400">Previously uploaded</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    existingImages: prev.existingImages.filter((_, i) => i !== index)
                                                }));
                                            }}
                                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* New Files */}
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#005C32]">
                                            <Check className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date().toLocaleDateString()} • {(file.size / (1024 * 1024)).toFixed(2)}MB
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => removeFile(index)}
                                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
          )}

           {currentStep === 4 && (
             <div style={{ paddingTop: '32px', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '80px' }}>
                {/* Header Section */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <button 
                            onClick={handleBack} 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px', 
                                fontSize: '14px', 
                                fontWeight: 500, 
                                color: '#666666', 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer' 
                            }}
                        >
                            <ChevronLeft style={{ width: '16px', height: '16px' }} /> Back
                        </button>
                    </div>
                    <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '24px', fontFamily: 'Lexend' }}>
                        {formData.make} {formData.model}, {formData.year}
                    </h1>

                    {/* Summary Stats Table */}
                    <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
                        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    {['Car Details', "Seller's Name:", 'Amount', 'Upload Date'].map((header) => (
                                        <th key={header} style={{ textAlign: 'left', paddingBottom: '8px', fontSize: '12px', color: '#6B7280', fontWeight: 'normal', fontFamily: 'Lexend' }}>
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', fontFamily: 'Lexend', paddingRight: '16px' }}>
                                        {formData.make} {formData.model}, {formData.year}
                                    </td>
                                    <td style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', fontFamily: 'Lexend', paddingRight: '16px' }}>
                                        {userName || 'Seller'}
                                    </td>
                                    <td style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', fontFamily: 'Lexend', paddingRight: '16px' }}>
                                        N {Number(formData.price.replace(/,/g, '')).toLocaleString()}
                                    </td>
                                    <td style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', fontFamily: 'Lexend', paddingRight: '16px' }}>
                                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #E5E7EB', marginBottom: '32px' }}>
                        <button style={{ 
                            paddingBottom: '12px', 
                            fontSize: '14px', 
                            fontWeight: 'bold', 
                            color: '#111827', 
                            borderBottom: '2px solid #005C32', 
                            background: 'none', 
                            border: 'none', 
                            borderTop: 'none', 
                            borderLeft: 'none', 
                            borderRight: 'none', 
                            borderBottomWidth: '2px', 
                            borderBottomStyle: 'solid', 
                            borderBottomColor: '#005C32', 
                            cursor: 'pointer',
                            fontFamily: 'Lexend'
                        }}>
                            Car Overview
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '48px' }}>
                        {/* Left Side */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '24px', fontFamily: 'Lexend' }}>Car Overview</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', columnGap: '48px', rowGap: '16px' }}>
                                    {[
                                        { label: 'CarType', value: formData.bodyType },
                                        { label: 'Condition', value: formData.condition },
                                        { label: 'Mileage', value: formData.mileage },
                                        { label: 'Door', value: `${formData.doors} Doors` },
                                        { label: 'Fuel Type', value: formData.fuelType },
                                        { label: 'Color', value: formData.color },
                                        { label: 'Year', value: formData.year },
                                        { label: 'VIN', value: formData.vin },
                                        { label: 'Transmission', value: formData.transmission },
                                        { label: 'Drive Type', value: formData.driveType, fullWidth: true },
                                    ].map((item, index) => (
                                        <div key={index} style={{ 
                                            gridColumn: item.fullWidth ? '1 / -1' : 'auto', 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center', 
                                            paddingBottom: '8px', 
                                            borderBottom: '1px solid #F9FAFB' 
                                        }}>
                                            <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Lexend' }}>{item.label}</span>
                                            <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827', fontFamily: 'Lexend' }}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px', fontFamily: 'Lexend' }}>Features</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '32px' }}>
                                    {Object.entries(FEATURES).map(([category, features]) => {
                                        const selectedFeatures = features.filter(f => formData.features.includes(f));
                                        if (selectedFeatures.length === 0) return null;
                                        return (
                                            <div key={category}>
                                                <h4 style={{ fontWeight: 'bold', fontSize: '14px', color: '#111827', marginBottom: '12px', fontFamily: 'Lexend', whiteSpace: 'nowrap' }}>{category}</h4>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {selectedFeatures.map(feature => (
                                                        <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#4B5563', fontFamily: 'Lexend' }}>
                                                            <div style={{ 
                                                                width: '12px', 
                                                                height: '12px', 
                                                                borderRadius: '50%', 
                                                                backgroundColor: '#DCFCE7', 
                                                                display: 'flex', 
                                                                alignItems: 'center', 
                                                                justifyContent: 'center', 
                                                                color: '#005C32' 
                                                            }}>
                                                                <Check style={{ width: '8px', height: '8px' }} />
                                                            </div>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <div>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px', fontFamily: 'Lexend' }}>Description</h3>
                            <div 
                                style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6', fontFamily: 'Lexend' }}
                                dangerouslySetInnerHTML={{ __html: formData.description }}
                            />
                        </div>

                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px', fontFamily: 'Lexend' }}>Photos</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {selectedFiles.map((file, i) => (
                                        <a key={i} href="#" style={{ display: 'block', color: '#005C32', textDecoration: 'underline', fontSize: '14px', fontFamily: 'Lexend' }}>
                                            ViewImage
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 flex justify-center">
             <button
              onClick={currentStep === 4 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#005C32] text-white font-medium rounded-xl hover:bg-[#004a28] transition-all active:scale-[0.98] shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 4 ? (
                isSubmitting ? (
                  <>
                    <Spinner size="sm" variant="white" />
                    <span>Submitting Listing...</span>
                  </>
                ) : (
                  'Submit Listing'
                )
              ) : (
                'Next'
              )}
            </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
