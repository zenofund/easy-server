import { Layers, Shield, Zap } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { PricingCard } from '../ui/PricingCard';
import { formatAmount } from '../../lib/formatters';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  duration: number;
  features: string[];
  listingLimit?: number;
  featuredListings?: number;
  prioritySupport?: boolean;
  analyticsAccess?: boolean;
}

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: SubscriptionPlan[];
  selectedPlan: string | null;
  onSelect: (plan: SubscriptionPlan) => void;
}

export function UpgradePlanModal({
  isOpen,
  onClose,
  plans,
  selectedPlan,
  onSelect,
}: UpgradePlanModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade Your Plan" maxWidth="max-w-[980px]" padding="p-0">
      <div className="p-6">
        <p className="text-sm text-[#6B7280] mb-6">
          You have reached your current listing limit. Upgrade to unlock more listings and premium benefits.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
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
                buttonText={Number(plan.price) === 0 ? 'Continue with Free Plan' : 'Get started'}
                highlighted={plan.name.toLowerCase().includes('pro')}
                isLoading={selectedPlan === plan.name}
                onSelect={() => onSelect(plan)}
              />
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
