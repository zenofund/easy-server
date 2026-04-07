import imgSedanJpg from 'figma:asset/02d5f7fc9e379ebc1d659e033a30fb8bf3e87766.png';
import imgCoupeJpg from 'figma:asset/d4fbea2a57552923e4d3e5e9c9df20672c2ba3b5.png';
import imgSuvJpg from 'figma:asset/a73e7047e41dd24099fa9a331edc2cfee4705b36.png';
import imgTruckJpg from 'figma:asset/cf31b16eb550993cdbcb9b5f34b1ed839c141895.png';
import imgHatJpg from 'figma:asset/495cd5628cb117b30b61a2ae905668b1df9a9379.png';

const vehicleTypes = [
  { name: 'Sedan', image: imgSedanJpg, count: '2,134' },
  { name: 'Coupe', image: imgCoupeJpg, count: '1,234' },
  { name: 'SUV', image: imgSuvJpg, count: '3,456' },
  { name: 'Truck', image: imgTruckJpg, count: '987' },
  { name: 'Hatch', image: imgHatJpg, count: '1,876' },
];

export function VehicleTypesSection() {
  return (
    <section className="px-4 md:px-8 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-brand-dark text-2xl md:text-3xl">Browse by Type</h2>
          <a href="#all-types" className="text-brand-green hover:underline">
            View All Types →
          </a>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {vehicleTypes.map((type) => (
            <button
              key={type.name}
              className="group bg-white rounded-xl border border-gray-100 p-6 hover:border-brand-green hover:shadow-lg transition-all duration-200"
            >
              <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                <img
                  src={type.image}
                  alt={type.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              <h3 className="text-gray-700 mb-1">{type.name}</h3>
              <p className="text-gray-300 text-sm">{type.count} vehicles</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
