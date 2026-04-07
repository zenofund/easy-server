import { Star, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    title: 'Reliable and Trustworthy.',
    text: 'Selling my car was hassle-free. The platform\'s verification process ensured I only dealt with serious buyers.',
    name: 'Apeli Benibo',
    verified: true,
    rating: 5,
  },
  {
    id: 2,
    title: 'Safe and Secure Transactions.',
    text: 'I was worried about online scams, but this platform\'s secure payment system gave me peace of mind.',
    name: 'Oluwadamilola Oyedepo',
    verified: true,
    rating: 5,
  },
  {
    id: 3,
    title: 'A Seamless Experience!',
    text: 'I found the perfect car within days using this platform. The verified listings gave me confidence, and the financing options made everything so easy!',
    name: 'Umar Bashir',
    verified: true,
    rating: 5,
  },
  {
    id: 4,
    title: 'Incredible Customer Support.',
    text: 'The support team was quick to resolve my issue and guided me through every step. Truly impressive service!',
    name: 'Bilkisu Zubairu',
    verified: true,
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('testimonials-container');
    if (container) {
      const scrollAmount = 388; // card width (360) + gap (28)
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  return (
    <section className="py-8 md:py-10 px-4 md:px-8 lg:px-0 lg:mx-auto lg:max-w-[1375px] bg-white">
      <div className="w-full mx-auto">
        <div className="flex flex-col gap-10 md:gap-[56px]">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2
              style={{
                fontFamily: 'Lexend',
                fontWeight: 600,
                fontSize: 'clamp(24px, 5vw, 35px)',
                lineHeight: '1.2',
                color: '#060606',
              }}
            >
              What Customers Say
            </h2>

            {/* Navigation Arrows - Desktop */}
            <div className="hidden md:flex items-center gap-5">
              <button
                onClick={() => handleScroll('left')}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ background: '#005C32' }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-3 h-3" style={{ color: '#FFFFFF' }} />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ 
                  background: 'transparent',
                  border: '1px solid #BC9C22',
                }}
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-3 h-3" style={{ color: '#BC9C22' }} />
              </button>
            </div>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative overflow-hidden">
            <div
              id="testimonials-container"
              className="flex gap-7 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="flex-shrink-0"
                  style={{
                    width: index >= 2 ? '409px' : '360px',
                    height: '240px',
                    background: '#F9FBFC',
                    borderRadius: '16px',
                    padding: '19px 20px',
                  }}
                >
                  <div className="flex flex-col gap-[17px]">
                    {/* Rating and Verified Badge */}
                    <div className="flex items-center justify-start gap-5">
                      {/* 5 Stars */}
                      <div className="flex items-center gap-0">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="relative flex items-center justify-center"
                            style={{
                              width: '19.25px',
                              height: '20.5px',
                              background: '#00B67A',
                            }}
                          >
                            <Star
                              className="fill-white text-white"
                              style={{
                                width: '11.58px',
                                height: '10px',
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Verified Badge */}
                      <div className="flex items-center gap-2">
                        <div
                          className="flex items-center justify-center"
                          style={{
                            width: '17px',
                            height: '17.5px',
                            background: '#BC9C22',
                            borderRadius: '8.5px',
                          }}
                        >
                          <Check
                            className="text-white"
                            style={{
                              width: '8.38px',
                              height: '8.38px',
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: 'Lexend',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '26px',
                            color: '#BC9C22',
                          }}
                        >
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '30px',
                        color: '#060606',
                      }}
                    >
                      {testimonial.title}
                    </h3>

                    {/* Review Text */}
                    <p
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '26px',
                        color: '#999999',
                      }}
                    >
                      {testimonial.text}
                    </p>

                    {/* Customer Name */}
                    <p
                      style={{
                        fontFamily: 'Lexend',
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '17px',
                        color: '#060606',
                      }}
                    >
                      {testimonial.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Mobile */}
          <div className="flex md:hidden items-center justify-center gap-5">
            <button
              onClick={() => handleScroll('left')}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: '#005C32' }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-3 h-3" style={{ color: '#FFFFFF' }} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ 
                background: 'transparent',
                border: '1px solid #BC9C22',
              }}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-3 h-3" style={{ color: '#BC9C22' }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}