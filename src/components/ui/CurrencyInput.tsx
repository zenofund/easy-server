import React from 'react';
import { formatAmount, cleanAmount } from '../../lib/formatters';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({ 
  value, 
  onChange, 
  label, 
  error, 
  style, 
  className,
  placeholder,
  ...props 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    onChange(rawValue);
  };

  const formattedValue = formatAmount(value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {label && (
        <label style={{
          fontFamily: 'Lexend',
          fontWeight: 400,
          fontSize: '12.58px',
          lineHeight: '24px',
          color: '#060606',
        }}>
          {label}
        </label>
      )}
      <input
        {...props}
        type="text"
        value={formattedValue}
        onChange={handleChange}
        placeholder={placeholder || "0"}
        style={{
          width: '100%',
          height: '60px',
          padding: '20px',
          border: '1px solid #E2E8F9',
          borderRadius: '6px',
          fontFamily: 'Lexend',
          fontWeight: 200,
          fontSize: '12.68px',
          lineHeight: '20px',
          color: '#060606',
          outline: 'none',
          backgroundColor: '#FFFFFF',
          ...style
        }}
      />
      {error && (
        <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </span>
      )}
    </div>
  );
};
