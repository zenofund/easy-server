import { Button } from '../ui/Button';
import imgBackground from 'figma:asset/f46c0fb052d5790a172eec86f7bf7150c04b4e84.png';
import imgBackground1 from 'figma:asset/0b5f28de140faf882385b621e69e02b3b47fed0c.png';

export function CTASection() {
  return (
    <section className="px-4 md:px-8 lg:px-0 lg:mx-auto lg:max-w-[1375px] py-12 md:py-16">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sell Car CTA */}
          <div className="relative rounded-2xl overflow-hidden h-80 group">
            <img
              src={imgBackground}
              alt="Sell your car"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-8">
              <h3 className="text-white text-3xl mb-2">Are You Looking to Sell a Car?</h3>
              <p className="text-white/90 mb-6">Get the best value for your vehicle</p>
              <div>
                <Button
                  variant="secondary"
                  className="rounded-[10px] bg-white text-brand-green hover:bg-white/90"
                  onClick={() => { window.location.hash = '#sign-up'; }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
          
          {/* Buy Car CTA */}
          <div className="relative rounded-2xl overflow-hidden h-80 group">
            <img
              src={imgBackground1}
              alt="Buy a car"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="relative h-full flex flex-col justify-end p-8">
              <h3 className="text-white text-3xl mb-2">Do You Want to Buy a Car?</h3>
              <p className="text-white/90 mb-6">Find your perfect match today</p>
              <div>
                <Button
                  variant="secondary"
                  className="rounded-[10px] bg-white text-brand-green hover:bg-white/90"
                  onClick={() => { window.location.hash = '#sign-up'; }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
