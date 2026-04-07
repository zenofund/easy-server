import { DollarSign, Shield, Wrench, Award } from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: 'Special Financing',
    description: 'Our stress-free finance department can find financial solutions to save you money.',
  },
  {
    icon: Shield,
    title: 'Trusted By Thousands',
    description: 'Rated 4.9/5 by thousands of satisfied customers across Nigeria.',
  },
  {
    icon: Wrench,
    title: 'Expert Mechanics',
    description: 'Professional service and maintenance from certified automotive technicians.',
  },
  {
    icon: Award,
    title: 'Transparent Pricing',
    description: 'No hidden fees. What you see is what you pay - guaranteed fair pricing.',
  },
];

export function FeaturesSection() {
  return (
    <section className="px-4 md:px-8 lg:px-0 lg:mx-auto lg:max-w-[1375px] py-16 md:py-20">
      <div className="w-full mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-brand-dark text-2xl md:text-4xl mb-3 md:mb-4">Why Choose Us?</h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            We provide the best car buying and selling experience with our comprehensive services
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-brand-green rounded-full flex items-center justify-center group-hover:bg-brand-gold transition-colors duration-200">
                  <Icon size={22} className="text-white md:text-[28px]" />
                </div>
                <h3 className="text-gray-700 text-sm md:text-xl mb-1.5 md:mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-xs md:text-base leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
