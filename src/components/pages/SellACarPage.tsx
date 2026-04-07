import { useState, useEffect } from 'react';
import { Zap, Layers, PlusCircle, ArrowLeft, Shield } from 'lucide-react';
import { PageTitleBanner } from '../PageTitleBanner';
import { MultiStepListingModal } from '../modals/MultiStepListingModal';
import { UpgradePlanModal, SubscriptionPlan } from '../modals/UpgradePlanModal';
import { PricingCard } from '../ui/PricingCard';
import { toast } from 'sonner';
import { Spinner } from '../ui/Spinner';
import api from '../../lib/api';
import { formatAmount } from '../../lib/formatters';

export function SellACarPage() {
  const [showForm, setShowForm] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));

    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const response = await api.get('/sellers/subscription-plans');
        setPlans(response.data);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
        // Fallback data if API fails
        setPlans([
          {
            id: 'free',
            name: 'Free Plan',
            price: '0',
            duration: 30,
            features: ['Add up to 5 listings', 'Standard visibility']
          },
          {
            id: 'pro',
            name: 'Pro Plan',
            price: '15000',
            duration: 30,
            features: ['Add up to 30 listings', 'Detailed analytics', 'Featured Listings']
          },
          {
            id: 'premium',
            name: 'Premium Plan',
            price: '50000',
            duration: 30,
            features: ['Unlimited listings', 'Premium visibility', 'Advanced analytics']
          }
        ]);
        toast.error('Using offline mode for plans');
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const handleStartSelling = () => {
    setShowForm(true);
  };

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = async (plan: SubscriptionPlan) => {
    setSelectedPlan(plan.name);
    // Here you would typically redirect to payment or subscription flow
    // For now, we simulate selection
    await new Promise(resolve => setTimeout(resolve, 500));
    setSelectedPlan(null);
    toast.success(`${plan.name} selected successfully!`);
    setShowForm(true);
    setShowUpgradeModal(false);
  };

  return (
    <section className="w-full bg-white overflow-x-hidden">
      {/* Page Title Banner */}
      <PageTitleBanner title="Sell a Car" />

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[66px] py-8 md:py-14 lg:py-[56px]">
        {/* Breadcrumb */}
        <div className="mb-8 md:mb-12 lg:mb-14">
          <p
            className="font-light text-[14px] leading-[21px] text-[#52525B]"
          >
            Home / Sell a Car
          </p>
        </div>

        {/* Page Title and Description */}
        <div className="max-w-[1307px] mx-auto mb-12 md:mb-16 lg:mb-[56px]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h2
                className="mb-4 md:mb-5 font-semibold leading-[1.2] text-[#060606]"
                style={{ fontSize: isMobile ? '36px' : '56px' }}
              >
                Sell a Car
              </h2>
              <p
                className="font-medium text-[clamp(16px,3vw,24px)] leading-[1.6] text-[#6B7280] max-w-[1098px]"
              >
                List your car with ease, connect with serious buyers, and close deals faster all on Huce Autos
              </p>
            </div>
            
            <button
              onClick={handleStartSelling}
              className="flex items-center justify-center gap-1.5 bg-[#005C32] text-white rounded-lg hover:bg-[#004a28] transition-colors shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-semibold whitespace-nowrap self-start active:scale-[0.98]"
              style={{ fontSize: '14px', height: '38px', padding: '0 12px' }}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              List Your Car Now
            </button>
          </div>
        </div>

        {/* Why Choose Huce Autos Section */}
        <div className="max-w-[1309px] mx-auto mb-16 md:mb-24 lg:mb-[100px]">
          <h3
            className="mb-8 md:mb-10 lg:mb-[50px] font-semibold text-[clamp(24px,5vw,35px)] leading-[40px] text-[#060606]"
          >
            Why Choose Huce Autos to Sell Your Car?
          </h3>

          {/* Benefits Grid */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 md:gap-12 lg:gap-[90px]">
            {/* Benefits List */}
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-[30px] flex-1 w-full">
              {/* Benefit 1 */}
              <div className="flex items-start gap-3 md:gap-4 lg:gap-[13px]">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: '#005C32',
                    borderRadius: '24px',
                  }}
                >
                  <span
                    className="font-semibold text-[18px] leading-[25px] text-white"
                  >
                    1
                  </span>
                </div>
                <div className="flex-1">
                  <h4
                    className="mb-1 font-medium text-[clamp(16px,3vw,20px)] leading-[26px] text-[#060606]"
                  >
                    Wide Reach
                  </h4>
                  <p
                    className="font-normal text-[clamp(14px,2vw,16px)] leading-[24px] text-[#6B7280]"
                  >
                    Access thousands of verified buyers across Nigeria.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex items-start gap-3 md:gap-4 lg:gap-[13px]">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: '#005C32',
                    borderRadius: '24px',
                  }}
                >
                  <span
                    className="font-semibold text-[18px] leading-[25px] text-white"
                  >
                    2
                  </span>
                </div>
                <div className="flex-1">
                  <h4
                    className="mb-1 font-medium text-[clamp(16px,3vw,20px)] leading-[26px] text-[#060606]"
                  >
                    Easy Listing Process
                  </h4>
                  <p
                    className="font-normal text-[clamp(14px,2vw,16px)] leading-[24px] text-[#6B7280]"
                  >
                    List your car in minutes with our user-friendly platform
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex items-start gap-3 md:gap-4 lg:gap-[13px]">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: '#005C32',
                    borderRadius: '24px',
                  }}
                >
                  <span
                    className="font-semibold text-[18px] leading-[25px] text-white"
                  >
                    3
                  </span>
                </div>
                <div className="flex-1">
                  <h4
                    className="mb-1 font-medium text-[clamp(16px,3vw,20px)] leading-[26px] text-[#060606]"
                  >
                    Secure Transactions
                  </h4>
                  <p
                    className="font-normal text-[clamp(14px,2vw,16px)] leading-[24px] text-[#6B7280]"
                  >
                    Payment is held in escrow for your peace of mind.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="flex items-start gap-3 md:gap-4 lg:gap-[13px]">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: '#005C32',
                    borderRadius: '24px',
                  }}
                >
                  <span
                    className="font-semibold text-[18px] leading-[25px] text-white"
                  >
                    4
                  </span>
                </div>
                <div className="flex-1">
                  <h4
                    className="mb-1 font-medium text-[clamp(16px,3vw,20px)] leading-[26px] text-[#060606]"
                  >
                    Flexible Subscription Plans
                  </h4>
                  <p
                    className="font-normal text-[clamp(14px,2vw,16px)] leading-[24px] text-[#6B7280]"
                  >
                    Affordable plans tailored to your needs.
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <img
                src="https://images.unsplash.com/photo-1687075430355-ed8df51c1670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBrZXlzJTIwaGFuZCUyMGV4Y2hhbmdlfGVufDF8fHx8MTc2NTQ1NTM2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Car key exchange"
                className="w-full h-auto max-w-full lg:max-w-[500px] rounded-[15px] md:rounded-[20px] object-cover"
                style={{
                  aspectRatio: '1/1',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plan Section */}
      <div className="bg-white py-8 md:py-16 lg:py-24 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6 md:mb-10 lg:mb-12">
            <h2
              className="mb-2 md:mb-4 font-semibold text-[clamp(24px,5vw,35px)] leading-[40px] text-[#060606]"
            >
              Subscription Plan
            </h2>
            <p
              className="font-normal text-[clamp(14px,2.5vw,17px)] leading-[1.8] text-[#6B7280] max-w-[600px] mx-auto"
            >
              Choose a plan that suits your needs. Unlock premium features and maximize your car's visibility.
            </p>
          </div>

      {/* Pricing Cards */}
          {loadingPlans ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {plans.length > 0 ? (
                plans.map((plan) => {
                  let Icon = Zap;
                  if (plan.name.toLowerCase().includes('pro')) Icon = Layers;
                  if (plan.name.toLowerCase().includes('premium')) Icon = Shield;

                  return (
                    <PricingCard
                      key={plan.id}
                      icon={<Icon className="w-5 h-5" style={{ color: '#005C32' }} />}
                      title={plan.name}
                      price={Number(plan.price) === 0 ? 'Free' : `₦${formatAmount(plan.price)}/mth`}
                      subtitle={`Billed every ${plan.duration} days`}
                      features={plan.features}
                      buttonText={Number(plan.price) === 0 ? "Continue with Free Plan" : "Get started"}
                      highlighted={plan.name.toLowerCase().includes('pro')}
                      isLoading={selectedPlan === plan.name}
                      onSelect={() => handlePlanSelect(plan)}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No subscription plans available at the moment.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

       <MultiStepListingModal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        onSuccess={() => setShowForm(false)} 
        onLimitReached={() => {
          setShowForm(false);
          setShowUpgradeModal(true);
        }}
      />
      <UpgradePlanModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        plans={plans}
        selectedPlan={selectedPlan}
        onSelect={handlePlanSelect}
      />
    </section>
  );
}
