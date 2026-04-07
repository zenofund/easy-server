import type { ReactNode } from 'react';
import { Spinner } from './Spinner';

interface PricingCardProps {
  icon: ReactNode;
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  buttonText: string;
  highlighted: boolean;
  isLoading?: boolean;
  onSelect?: () => void;
}

export function PricingCard({
  icon,
  title,
  price,
  subtitle,
  features,
  buttonText,
  highlighted,
  isLoading,
  onSelect,
}: PricingCardProps) {
  return (
    <div
      className="flex flex-col"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E6EFEB',
        boxShadow:
          '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '32px 32px 0' }}>
        <div className="flex flex-col items-center gap-[20px]" style={{ marginBottom: '24px' }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: '40px',
              height: '40px',
              background: '#E6EFEB',
              border: '6px solid #E6EFEB',
              borderRadius: '28px',
            }}
          >
            {icon}
          </div>
          <h3
            style={{
              fontFamily: 'Lexend',
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '30px',
              textAlign: 'center',
              color: '#005C32',
            }}
          >
            {title}
          </h3>
        </div>
        <div className="text-center">
          <p
            style={{
              fontFamily: 'Lexend',
              fontWeight: 600,
              fontSize: '48px',
              lineHeight: '60px',
              letterSpacing: '-0.02em',
              color: '#060606',
            }}
          >
            {price}
          </p>
          <p
            style={{
              fontFamily: 'Lexend',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#6B7280',
              marginTop: '8px',
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
      <div style={{ padding: '32px' }}>
        <div className="flex flex-col gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: '24px',
                  height: '24px',
                  background: '#E6EFEB',
                  borderRadius: '12px',
                }}
              >
                <svg
                  width="12"
                  height="10"
                  viewBox="0 0 12 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.6667 1.5L4 8.16667L1.33333 5.5"
                    stroke="#005C32"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#6B7280',
                }}
              >
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          padding: '32px',
          background: '#E6EFEB',
        }}
      >
        <button
          onClick={onSelect}
          disabled={isLoading}
          className="w-full hover:opacity-90 transition-all font-medium text-[16px] leading-[24px] text-white cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            padding: '12px 20px',
            background: '#005C32',
            border: '1px solid #005C32',
            boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
            borderRadius: '8px',
          }}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" variant="white" />
              <span>Processing...</span>
            </>
          ) : (
            buttonText
          )}
        </button>
      </div>
    </div>
  );
}
