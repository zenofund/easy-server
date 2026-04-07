import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X, Shield, Zap, Layers, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Label } from '../ui/label';
import { formatAmount } from '../../lib/formatters';
import { AdminSubscriptionsSkeleton } from '../ui/SkeletonLoader';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  listingLimit: number;
  featuredListings: number;
  prioritySupport: boolean;
  analyticsAccess: boolean;
  isActive: boolean;
}

export function AdminSubscriptionsContent() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '30',
    features: '',
    listingLimit: '5',
    featuredListings: '0',
    prioritySupport: false,
    analyticsAccess: false
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/subscriptions/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        listingLimit: parseInt(formData.listingLimit),
        featuredListings: parseInt(formData.featuredListings),
        features: formData.features.split('\n').filter(f => f.trim())
      };

      if (editingPlan) {
        await api.put(`/admin/subscriptions/plans/${editingPlan.id}`, payload);
        toast.success('Plan updated successfully');
      } else {
        await api.post('/admin/subscriptions/plans', payload);
        toast.success('Plan created successfully');
      }
      
      setIsModalOpen(false);
      setEditingPlan(null);
      resetForm();
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error('Failed to save subscription plan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      await api.delete(`/admin/subscriptions/plans/${id}`);
      toast.success('Plan deleted successfully');
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    }
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      features: plan.features.join('\n'),
      listingLimit: plan.listingLimit.toString(),
      featuredListings: plan.featuredListings.toString(),
      prioritySupport: plan.prioritySupport,
      analyticsAccess: plan.analyticsAccess
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      duration: '30',
      features: '',
      listingLimit: '5',
      featuredListings: '0',
      prioritySupport: false,
      analyticsAccess: false
    });
  };

  if (loading) return <AdminSubscriptionsSkeleton />;

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] pb-10 lg:pb-[90px]">
      <div className="bg-white rounded-[14.32px] p-5 sm:p-8 lg:p-[34px]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-lexend font-semibold text-[clamp(18px,3vw,22.912px)] text-[#060606]">
            Subscription Plans
          </h1>
          <Button 
            onClick={() => {
              setEditingPlan(null);
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-[#005C32] hover:bg-[#004a28] text-white flex items-center gap-2"
          >
            <Plus size={18} />
            Create Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`border rounded-2xl p-6 relative group transition-all duration-300 hover:shadow-lg ${
                !plan.isActive ? 'opacity-60 bg-gray-50' : 'bg-white border-[#E2E8F9]'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#E6F2EB] rounded-xl">
                  {plan.name.toLowerCase().includes('pro') ? (
                    <Layers className="w-6 h-6 text-[#005C32]" />
                  ) : plan.name.toLowerCase().includes('premium') ? (
                    <Shield className="w-6 h-6 text-[#005C32]" />
                  ) : (
                    <Zap className="w-6 h-6 text-[#005C32]" />
                  )}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditModal(plan)}
                    className="p-2 text-gray-500 hover:text-[#005C32] hover:bg-[#E6F2EB] rounded-full transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="font-lexend font-bold text-xl text-[#060606] mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-lexend font-bold text-2xl text-[#005C32]">
                  ₦{formatAmount(plan.price)}
                </span>
                <span className="text-gray-500 text-sm">/ {plan.duration} days</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-[#005C32]" />
                  <span>{plan.listingLimit} Car Listings</span>
                </div>
                {plan.featuredListings > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={16} className="text-[#005C32]" />
                    <span>{plan.featuredListings} Featured Listings</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {plan.prioritySupport ? (
                    <Check size={16} className="text-[#005C32]" />
                  ) : (
                    <X size={16} className="text-gray-400" />
                  )}
                  <span>Priority Support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {plan.analyticsAccess ? (
                    <Check size={16} className="text-[#005C32]" />
                  ) : (
                    <X size={16} className="text-gray-400" />
                  )}
                  <span>Analytics Access</span>
                </div>
              </div>

              {!plan.isActive && (
                <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <AlertCircle size={12} />
                  Inactive
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? "Edit Subscription Plan" : "Create New Plan"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Basic Plan"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₦)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (Days)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="30"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="listingLimit">Listing Limit</Label>
              <Input
                id="listingLimit"
                type="number"
                value={formData.listingLimit}
                onChange={(e) => setFormData({ ...formData, listingLimit: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="featuredListings">Featured Listings</Label>
              <Input
                id="featuredListings"
                type="number"
                value={formData.featuredListings}
                onChange={(e) => setFormData({ ...formData, featuredListings: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.prioritySupport}
                onChange={(e) => setFormData({ ...formData, prioritySupport: e.target.checked })}
                className="w-4 h-4 text-[#005C32] rounded focus:ring-[#005C32]"
              />
              <span className="text-sm font-medium text-gray-700">Priority Support</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.analyticsAccess}
                onChange={(e) => setFormData({ ...formData, analyticsAccess: e.target.checked })}
                className="w-4 h-4 text-[#005C32] rounded focus:ring-[#005C32]"
              />
              <span className="text-sm font-medium text-gray-700">Analytics Access</span>
            </label>
          </div>

          <div>
            <Label htmlFor="features">Additional Features (One per line)</Label>
            <textarea
              id="features"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-[#005C32] focus:border-transparent outline-none resize-y"
              placeholder="24/7 Support&#10;Custom Badge&#10;..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#005C32] hover:bg-[#004a28] text-white"
            >
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
