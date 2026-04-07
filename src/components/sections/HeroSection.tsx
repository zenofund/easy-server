import { SearchBar } from '../SearchBar';
import img1Huce1 from 'figma:asset/7b57366a922520a413f007d443e2c1c5568c3fcb.png';

export function HeroSection() {
  return (
    <section className="relative w-full px-4 mb-6 md:px-8 lg:px-0 lg:mx-auto lg:max-w-[1375px]">
      <div 
        className="relative overflow-hidden w-full"
        style={{
          background: '#005C32',
          borderRadius: '0 0 23.6462px 23.6462px',
          minHeight: '528px',
        }}
      >
        {/* Hero Background Image - Full Cover */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${img1Huce1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Content */}
        <div 
          className="relative z-10 px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20 lg:absolute lg:px-0 lg:py-0 w-full"
          style={{
            maxWidth: '542px',
            left: 'auto',
            top: 'auto',
          }}
        >
          <div className="lg:absolute lg:left-[40px] lg:top-[180px] flex flex-col gap-3 lg:gap-[17px] w-full">
            <h1 
              className="text-white flex flex-col"
              style={{
                fontFamily: 'Lexend',
                fontWeight: 600,
                fontSize: 'clamp(28px, 6vw, 45px)',
                lineHeight: 'clamp(36px, 7vw, 56px)',
              }}
            >
              <span className="whitespace-nowrap" style={{ fontSize: 'clamp(20px, 6vw, 45px)' }}>
                Find the <span style={{ color: '#BC9C22' }}>Perfect Car</span>
              </span>
              <span className="whitespace-nowrap" style={{ fontSize: 'clamp(20px, 6vw, 45px)' }}>Fast and Easy</span>
            </h1>
            <p 
              className="flex items-center"
              style={{
                fontFamily: 'Lexend',
                fontWeight: 400,
                fontSize: 'clamp(14px, 3vw, 20px)',
                lineHeight: 'clamp(20px, 4vw, 25px)',
                color: '#E2E8F9',
              }}
            >
              Your Trusted Partner for Cars and Auto Services Across Nigeria – Anytime, Anywhere.
            </p>
          </div>
        </div>
      </div>
      
      {/* Search Bar - Positioned to overlap hero section */}
      <div 
        className="relative z-20 mt-[-140px] md:mt-[-100px] lg:mt-[-70px] w-full"
      >
        <SearchBar />
      </div>
    </section>
  );
}