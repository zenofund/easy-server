import { Heart, ArrowRight, Car, Gauge, Fuel, Calendar, Settings, Compass, DoorClosed, Palette, FileText } from 'lucide-react';
import { formatAmount } from '../../lib/formatters';

interface VehicleSpec {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface CompareVehicleCardProps {
  image: string;
  title: string;
  subtitle: string;
  price: string;
  specs: VehicleSpec[];
  carId?: string;
}

export function CompareVehicleCard({
  image,
  title,
  subtitle,
  price,
  specs,
  carId
}: CompareVehicleCardProps) {
  return (
    <div
      className="bg-white border border-[#E2E8F9] rounded-[15px] flex flex-col w-full max-w-[450px]"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[309/206]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-t-[15px] cursor-pointer"
          onClick={() => carId && (window.location.hash = `#car-detail/${carId}`)}
        />
        
        {/* Heart Icon */}
        <button className="absolute top-3 right-3 md:top-[18.87px] md:right-[18.87px] w-8 h-8 md:w-[33.97px] md:h-[33.97px] bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Heart className="w-4 h-4 md:w-[17px] md:h-[17px] text-[#666666]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Title Section */}
      <div
        className="flex flex-col gap-1 px-3 md:px-[14.15px] pt-2 md:pt-[11.39px]"
      >
        <h3
          className="cursor-pointer hover:text-[#005C32] transition-colors"
          onClick={() => carId && (window.location.hash = `#car-detail/${carId}`)}
          style={{
            fontFamily: 'Lexend',
            fontWeight: 500,
            fontSize: 'clamp(16px, 3vw, 20px)',
            lineHeight: '1.2',
            color: '#060606',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: 'Lexend',
            fontWeight: 400,
            fontSize: 'clamp(10px, 2vw, 11.32px)',
            lineHeight: '1.4',
            color: '#4B5563',
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Specifications List */}
      <div className="px-3 md:px-[14px] pt-6 md:pt-[37.84px] flex-grow">
        <div className="flex flex-col gap-4 md:gap-[22px]">
          {specs.map((spec, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-[18px] h-[18px] text-[#4B5563] flex items-center justify-center flex-shrink-0">
                  {spec.icon}
                </div>
                <span
                  style={{
                    fontFamily: 'DM Sans',
                    fontWeight: 400,
                    fontSize: 'clamp(13px, 2vw, 15px)',
                    lineHeight: '1.6',
                    color: '#4B5563',
                  }}
                >
                  {spec.label}
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'DM Sans',
                  fontWeight: 500,
                  fontSize: 'clamp(13px, 2vw, 15px)',
                  lineHeight: '1.6',
                  color: '#1F2937',
                }}
              >
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price and View Details Footer */}
      <div
        className="border-t border-[#E2E8F9] flex items-center justify-between px-3 md:px-[12px] py-2 md:py-[9.99px] mt-4 md:mt-6"
      >
        <span
          style={{
            fontFamily: 'Lexend',
            fontWeight: 600,
            fontSize: 'clamp(16px, 3vw, 19.99px)',
            lineHeight: '1.5',
            color: '#050B20',
          }}
        >
          {price.startsWith('₦') ? price : `₦${formatAmount(price)}`}
        </span>
        <button
          className="flex items-center gap-2 md:gap-[19px] hover:opacity-80 transition-opacity cursor-pointer"
          onClick={() => carId && (window.location.hash = `#car-detail/${carId}`)}
        >
          <span
            style={{
              fontFamily: 'Lexend',
              fontWeight: 500,
              fontSize: 'clamp(11px, 2vw, 11.99px)',
              lineHeight: '1.5',
              color: '#005C32',
            }}
          >
            View Details
          </span>
          <ArrowRight className="w-3 h-3 md:w-[11.32px] md:h-[11.32px] text-[#005C32]" />
        </button>
      </div>
    </div>
  );
}