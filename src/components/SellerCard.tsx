import { Star, Car } from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface SellerCardProps {
  seller: {
    id: number;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    carsAvailable: number;
    image: string;
    verified: boolean;
  };
}

export function SellerCard({ seller }: SellerCardProps) {
  return (
    <article
      className="hover:shadow-lg transition-shadow cursor-pointer"
      style={{
        width: '294.35px',
        height: '389px',
        background: '#FFFFFF',
        borderRadius: '14.38px',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          height: '196.23px',
          width: '100%',
          borderRadius: '14.38px 14.38px 0 0',
          overflow: 'hidden',
        }}
      >
        <UserAvatar 
          firstName={seller.name.split(' ')[0]} 
          lastName={seller.name.split(' ')[1] || ''} 
          avatar={seller.image}
          className="w-full h-full rounded-none"
          fallbackClassName="text-5xl"
        />

        {/* Verified Badge - Top Right */}
        {seller.verified && (
          <div
            style={{
              position: 'absolute',
              right: '17.98px',
              top: '17.98px',
              width: '32.36px',
              height: '32.36px',
              background: '#005C32',
              borderRadius: '16.18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Checkmark Badge Icon */}
            <svg
              width="16.18"
              height="16.18"
              viewBox="0 0 17 17"
              fill="none"
              style={{
                width: '16.18px',
                height: '16.18px',
              }}
            >
              {/* Outer Circle */}
              <circle
                cx="8.5"
                cy="8.5"
                r="7"
                stroke="#FFFFFF"
                strokeWidth="1.01"
                fill="none"
              />
              {/* Inner Circle/Checkmark Area */}
              <circle
                cx="8.5"
                cy="8.5"
                r="2.5"
                stroke="#FFFFFF"
                strokeWidth="1.01"
                fill="none"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Border Container */}
      <div
        style={{
          boxSizing: 'border-box',
          position: 'absolute',
          height: '192.77px',
          left: '0px',
          right: '0px',
          top: '196.23px',
          borderWidth: '0px 0.9px 0.9px 0.9px',
          borderStyle: 'solid',
          borderColor: '#E9E9E9',
          borderRadius: '0px 0px 14.38px 14.38px',
          background: '#FFFFFF',
        }}
      >
        {/* Seller Info */}
        <div
          style={{
            position: 'absolute',
            left: '13.48px',
            top: '10.85px',
            display: 'flex',
            flexDirection: 'column',
            gap: '3.6px',
          }}
        >
          <h3
            style={{
              fontFamily: 'Lexend',
              fontWeight: 500,
              fontSize: '16.18px',
              lineHeight: '19px',
              color: '#060606',
            }}
          >
            {seller.name}
          </h3>
          <p
            style={{
              fontFamily: 'Lexend',
              fontWeight: 400,
              fontSize: '10.79px',
              lineHeight: '13px',
              color: '#6B7280',
            }}
          >
            Location: {seller.location}
          </p>
        </div>

        {/* Metadata Section */}
        <div
          style={{
            position: 'absolute',
            left: '13.48px',
            top: '70.17px',
            boxSizing: 'border-box',
            width: '271.43px',
            borderTop: '0.9px solid #E2E8F9',
            paddingTop: '5.39px',
          }}
        >
          {/* Rating and Cars Available Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '0.9px',
              gap: '16.18px',
            }}
          >
            {/* Star Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12.58px',
              }}
            >
              <svg
                width="14.38"
                height="14.38"
                viewBox="0 0 15 15"
                fill="none"
                style={{
                  width: '14.38px',
                  height: '14.38px',
                  flexShrink: 0,
                }}
              >
                <path
                  d="M7.5 1.5L9.5 5.5L14 6.2L10.75 9.4L11.5 14L7.5 11.9L3.5 14L4.25 9.4L1 6.2L5.5 5.5L7.5 1.5Z"
                  stroke="#6B7280"
                  strokeWidth="0.9"
                  fill="none"
                />
              </svg>
              <span
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 400,
                  fontSize: '12.58px',
                  lineHeight: '13px',
                  color: '#6B7280',
                  whiteSpace: 'nowrap',
                }}
              >
                {seller.reviews} Review
              </span>
            </div>

            {/* Vertical Divider */}
            <div
              style={{
                width: '19.77px',
                height: '0px',
                border: '0.9px solid #E2E8F9',
                transform: 'rotate(90deg)',
              }}
            />

            {/* Cars Available */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9.89px',
              }}
            >
              <Car
                style={{
                  width: '14.38px',
                  height: '14.38px',
                  color: '#6B7280',
                  strokeWidth: '0.9px',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 400,
                  fontSize: '12.58px',
                  lineHeight: '13px',
                  color: '#6B7280',
                  whiteSpace: 'nowrap',
                }}
              >
                {seller.carsAvailable} Cars Available
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Border with View Details */}
        <div
          style={{
            position: 'absolute',
            left: '11.45px',
            right: '11.45px',
            top: '137.58px',
            boxSizing: 'border-box',
            height: '42.98px',
            borderTop: '0.9px solid #E2E8F9',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '8.99px',
          }}
        >
          <button
            onClick={() => {
              window.location.hash = `#seller-detail/${seller.id}`;
            }}
            className="hover:opacity-70 transition-all active:scale-[0.98]"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '17.08px',
            }}
          >
            <span
              style={{
                fontFamily: 'Lexend',
                fontWeight: 500,
                fontSize: '10.79px',
                lineHeight: '25px',
                color: '#005C32',
              }}
            >
              View Details
            </span>
            <svg
              width="10.79"
              height="10.79"
              viewBox="0 0 11 11"
              fill="none"
              style={{
                width: '10.79px',
                height: '10.79px',
              }}
            >
              <path
                d="M2 5.5H9M9 5.5L5.5 2M9 5.5L5.5 9"
                stroke="#005C32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}