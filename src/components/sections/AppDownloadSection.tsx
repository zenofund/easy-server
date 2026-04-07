import { Button } from '../ui/Button';
import { Apple, Play } from 'lucide-react';
import imgFreeMockup from 'figma:asset/0f00b422d3416d7ed7e44c6b16ded8a9ce9eba98.png';

export function AppDownloadSection() {
  return (
    <section className="w-full overflow-hidden px-4 md:px-8 lg:px-0 lg:mx-auto lg:max-w-[1375px] py-8 md:py-10">
      <div className="w-full mx-auto">
        <div className="bg-brand-light/30 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[rgba(140,132,140,0.15)] rounded-3xl">
            <div className="p-8 md:p-12 lg:p-16">
              <h2 
                className="text-brand-dark mb-4"
                style={{
                  fontSize: 'clamp(20px, 4vw, 36px)',
                  lineHeight: '1.2',
                }}
              >
                Shop New & Used Cars, On The Lot Or On The Go
              </h2>
              <p className="text-gray-700 text-lg mb-8">
                Download our mobile app and browse thousands of cars at your fingertips. 
                Get instant notifications for new listings and price drops.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 bg-brand-dark text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-brand-dark/90 transition-colors w-full sm:w-auto">
                  <Apple className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-[10px] sm:text-xs leading-tight">Download on the</div>
                    <div className="text-sm sm:text-base leading-tight" style={{ fontWeight: 600 }}>App Store</div>
                  </div>
                </button>
                
                <button className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 bg-brand-dark text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-brand-dark/90 transition-colors w-full sm:w-auto">
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-[10px] sm:text-xs leading-tight">GET IT ON</div>
                    <div className="text-sm sm:text-base leading-tight" style={{ fontWeight: 600 }}>Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-8 lg:p-0 lg:pt-8">
              <img
                src={imgFreeMockup}
                alt="Mobile app preview"
                className="max-w-full h-auto max-h-[500px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}