import { ChevronDown, MoreVertical } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import api from '../../lib/api';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { UserAvatar } from '../UserAvatar';

interface Stats {
  users: {
    total: number;
    buyers: number;
    sellers: number;
    inspectors: number;
  };
  listings: {
    total: number;
    active: number;
    sold: number;
    pending: number;
  };
  tickets: {
    total: number;
    resolved: number;
    unresolved: number;
  };
  revenue: number;
  periodRevenue: number;
  revenueChange: number;
  periodListings: number;
  listingsChange: number;
  pendingInspections: number;
  recentTransactions: {
    id: string;
    type: string;
    amount: number;
    status: string;
    createdAt: string;
    user: string;
  }[];
  revenueChart: { month: string; total: number }[];
  listingsChart: { label: string; count: number }[];
  bestSellers: {
    id: string;
    name: string;
    avatar: string | null;
    sold: number;
    unsold: number;
    offers: number;
    earnings: number;
  }[];
}

export function AdminHomeContent() {
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeYear, setActiveYear] = useState(new Date().getFullYear().toString());
  const [activeWeek, setActiveWeek] = useState('This Week');
  const [activeDateRange, setActiveDateRange] = useState(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return { label: 'Last 7 Days', start, end };
  });
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1].map(String);
  }, []);
  const weekOptions = useMemo(() => ['This Week', 'Last Week', 'Last Month'], []);
  const dateRangeOptions = useMemo(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const buildRange = (days: number, label: string) => {
      const start = new Date(end);
      start.setDate(end.getDate() - (days - 1));
      start.setHours(0, 0, 0, 0);
      return { label, start, end };
    };
    return [
      buildRange(7, 'Last 7 Days'),
      buildRange(30, 'Last 30 Days'),
      buildRange(90, 'Last 90 Days')
    ];
  }, []);

  useEffect(() => {
    fetchStats(activeYear, activeWeek, activeDateRange);
  }, []);

  const fetchStats = async (year?: string, week?: string, dateRange?: { start: Date; end: Date }) => {
    setIsLoadingMetrics(true);
    try {
      const response = await api.get('/admin/stats', {
        params: {
          year,
          week,
          startDate: dateRange?.start.toISOString(),
          endDate: dateRange?.end.toISOString()
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const handleFilterChange = async (
    type: 'year' | 'week' | 'dateRange',
    value: string | { label: string; start: Date; end: Date }
  ) => {
    if (type === 'year') {
      setActiveYear(value as string);
      await fetchStats(value as string, activeWeek, activeDateRange);
    } else if (type === 'week') {
      setActiveWeek(value as string);
      await fetchStats(activeYear, value as string, activeDateRange);
    } else {
      const range = value as { label: string; start: Date; end: Date };
      setActiveDateRange(range);
      await fetchStats(activeYear, activeWeek, range);
    }
  };

  const handleYearClick = () => {
    const currentIndex = yearOptions.indexOf(activeYear);
    const nextIndex = currentIndex === -1 ? 1 : (currentIndex + 1) % yearOptions.length;
    handleFilterChange('year', yearOptions[nextIndex]);
  };

  const handleWeekClick = () => {
    const currentIndex = weekOptions.indexOf(activeWeek);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % weekOptions.length;
    handleFilterChange('week', weekOptions[nextIndex]);
  };

  const handleDateRangeClick = () => {
    const currentIndex = dateRangeOptions.findIndex(option => option.label === activeDateRange.label);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % dateRangeOptions.length;
    handleFilterChange('dateRange', dateRangeOptions[nextIndex]);
  };

  const formatDateRange = (range: { start: Date; end: Date }) => {
    const format = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    return `${format(range.start)} - ${format(range.end)}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('NGN', 'N');
  };

  return (
    <>
      {/* Sub Navigation - Mobile First */}
      <div style={{ background: '#FFFFFF', boxShadow: '0px 5px 8px rgba(70, 78, 95, 0.02)', minHeight: '60px', display: 'flex', alignItems: 'center', width: '100%' }} className="mb-6 lg:mb-10">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[102px] w-full">
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }} className="lg:gap-[30px] -mx-4 px-4 sm:mx-0 sm:px-0">
            <div style={{ background: '#CCDED6', borderRadius: '6px', padding: '12px 24px', whiteSpace: 'nowrap' }} className="lg:px-[33px] lg:py-[15px]">
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '12px', lineHeight: '15px', color: '#005C32' }}>Admin Home</span>
            </div>
            <button style={{ background: 'none', border: 'none', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '12px', lineHeight: '15px', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap' }}>Reports</button>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile First */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] pb-10 lg:pb-[90px]">
        {/* Greeting */}
        <div className="mb-8 lg:mb-12">
          <h1 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: 'clamp(24px, 5vw, 32px)', lineHeight: '1.25', color: '#060606', margin: '0 0 8px 0' }}>
            Hello, Admin 👋👋
          </h1>
          <p style={{ fontFamily: 'Lexend', fontWeight: 400, fontSize: 'clamp(14px, 2vw, 16px)', lineHeight: '1.5', color: '#6B7280', margin: 0 }}>
            Monitor platform activity, manage users, and optimize performance in one place
          </p>
        </div>

        {/* Metrics Grid - Fluid and Balanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <MetricCard icon="car" title="Users (Buyers)" value={isLoadingMetrics ? '...' : (stats?.users.buyers || 0).toString()} />
          <MetricCard icon="seller" title="Users (Sellers)" value={isLoadingMetrics ? '...' : (stats?.users.sellers || 0).toString()} />
          <MetricCard icon="inspector" title="Users (Inspector)" value={isLoadingMetrics ? '...' : (stats?.users.inspectors || 0).toString()} />
          <MetricCard 
            icon="listings" 
            title="Total Listings" 
            value={isLoadingMetrics ? '...' : (stats?.listings.total || 0).toString()}
            badges={[
              { label: `${stats?.listings.active || 0} Active Listings`, color: '#28A745' },
              { label: `0 Expired Listings`, color: '#6B7280' },
              { label: `${stats?.listings.sold || 0} Sold Listings`, color: '#DC2626' }
            ]}
          />
          <MetricCard 
            icon="ticket" 
            title="Tickets" 
            value={isLoadingMetrics ? '...' : (stats?.tickets.total || 0).toString()}
            badges={[
              { label: `${stats?.tickets.resolved || 0} Resolved`, color: '#28A745' },
              { label: `${stats?.tickets.unresolved || 0} Unresolved`, color: '#BC9C22' }
            ]}
          />
          <MetricCard icon="revenue" title="Revenue" value={isLoadingMetrics ? '...' : formatCurrency(stats?.revenue || 0)} />
        </div>

        {/* Infographics Section */}
        <div className="mb-6">
          <h2 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: 'clamp(20px, 3vw, 24px)', lineHeight: '1.25', color: '#060606', margin: 0 }}>
            Infographics
          </h2>
        </div>

        {/* Charts Row - Mobile: 1 col, Desktop: 2 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
          {/* Overall Revenue Chart */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F9', borderRadius: '12px' }} className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <div className="flex-1">
                <h3 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', lineHeight: '1.25', color: '#060606', margin: '0 0 8px 0' }} className="sm:text-lg">
                  Total Revenue
                </h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '14px', lineHeight: '1.25', color: '#060606' }} className="sm:text-base">
                    {isLoadingMetrics ? '...' : formatCurrency(stats?.periodRevenue || 0)}
                  </span>
                  <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '12px', lineHeight: '15px', color: (stats?.revenueChange || 0) >= 0 ? '#34D399' : '#DC2626' }}>
                    {(stats?.revenueChange || 0) >= 0 ? '+' : ''}{stats?.revenueChange || 0}%
                  </span>
                </div>
              </div>
              <div onClick={handleYearClick} style={{ border: '1px solid #F1F5F9', borderRadius: '8px', padding: '8px', display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer', width: 'fit-content' }}>
                <span style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '12px', lineHeight: '160%', color: '#6B7280' }}>{activeYear}</span>
                <ChevronDown width={16} height={16} stroke="#6B7280" strokeWidth={2} />
              </div>
            </div>
            <div className="relative h-[200px] sm:h-[250px]">
              {isLoadingMetrics ? (
                <div className="flex items-end justify-between h-full pt-4">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonLoader key={i} className="w-12 h-[60%] rounded-t-lg" />
                  ))}
                </div>
              ) : (
                <RevenueChart data={stats?.revenueChart || []} />
              )}
            </div>
          </div>

          {/* Car Listings Chart */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F9', borderRadius: '12px' }} className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <div className="flex-1">
                <h3 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', lineHeight: '1.25', color: '#060606', margin: '0 0 8px 0' }} className="sm:text-lg">
                  Car Listings Chart
                </h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '14px', lineHeight: '1.25', color: '#060606' }} className="sm:text-base">
                    {isLoadingMetrics ? '...' : (stats?.periodListings || 0).toLocaleString()}
                  </span>
                  <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '12px', lineHeight: '15px', color: (stats?.listingsChange || 0) >= 0 ? '#34D399' : '#DC2626' }}>
                    {(stats?.listingsChange || 0) >= 0 ? '+' : ''}{stats?.listingsChange || 0}%
                  </span>
                </div>
              </div>
              <div onClick={handleWeekClick} style={{ border: '1px solid #F1F5F9', borderRadius: '8px', padding: '8px', display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer', width: 'fit-content' }}>
                <span style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '12px', lineHeight: '160%', color: '#6B7280' }}>{activeWeek}</span>
                <ChevronDown width={16} height={16} stroke="#6B7280" strokeWidth={2} />
              </div>
            </div>
            <div className="relative h-[200px] sm:h-[250px]">
              {isLoadingMetrics ? (
                <div className="flex items-end justify-between h-full pt-4">
                  {[...Array(7)].map((_, i) => (
                    <SkeletonLoader key={i} className="w-8 h-[70%] rounded-t-lg" />
                  ))}
                </div>
              ) : (
                <BarChart data={stats?.listingsChart || []} />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Best Dealer and Transaction History - Mobile: 1 col, Desktop: 2 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 lg:gap-6">
          {/* Best Dealer Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F9', borderRadius: '12px' }} className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h3 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', lineHeight: '1.25', color: '#060606', margin: 0 }} className="sm:text-lg">
                Best Dealer(Seller)
              </h3>
              <div 
                onClick={handleDateRangeClick}
                style={{ 
                  border: '1px solid #E2E8F9', 
                  borderRadius: '6px', 
                  padding: '6px 12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: isLoadingMetrics ? 'not-allowed' : 'pointer',
                  background: '#FFFFFF',
                  width: 'fit-content',
                  opacity: isLoadingMetrics ? 0.7 : 1,
                  transition: 'all 0.2s'
                }}
                className={`active:scale-[0.98] ${isLoadingMetrics ? 'animate-pulse' : ''}`}
              >
                <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '12px', lineHeight: '15px', color: '#6B7280', whiteSpace: 'nowrap' }}>
                  {isLoadingMetrics ? <SkeletonLoader className="h-4 w-24" /> : formatDateRange(activeDateRange)}
                </span>
                {!isLoadingMetrics && <ChevronDown size={14} color="#6B7280" />}
              </div>
            </div>
            {isLoadingMetrics ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <DealerTable data={stats?.bestSellers || []} formatCurrency={formatCurrency} />
            )}
          </div>

          {/* Transaction History */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F9', borderRadius: '12px' }} className="p-4 sm:p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="mb-6">
              <h3 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '16px', lineHeight: '1.25', color: '#060606', margin: 0 }} className="sm:text-lg">
                Transaction history
              </h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <MoreVertical size={20} color="#6B7280" />
              </button>
            </div>
            {isLoadingMetrics ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <TransactionList data={stats?.recentTransactions || []} formatCurrency={formatCurrency} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

interface MetricCardProps {
  icon: string;
  title: string;
  value: string;
  badges?: { label: string; color: string }[];
}

function MetricCard({ icon, title, value, badges }: MetricCardProps) {
  return (
    <div 
      style={{ 
        background: '#FFFFFF', 
        border: '1px solid #E2E8F9', 
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '140px'
      }} 
      className="p-4 lg:p-6 transition-all hover:shadow-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '13px', lineHeight: '1.2', color: '#6B7280', marginBottom: '8px' }} className="lg:text-sm">
            {title}
          </div>
          <div style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '20px', lineHeight: '1.2', color: '#060606' }} className="lg:text-2xl">
            {value}
          </div>
        </div>
        <div 
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            background: 'rgba(0, 92, 50, 0.05)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}
          className="lg:w-12 lg:h-12"
        >
          <IconComponent type={icon} />
        </div>
      </div>
      
      {badges && badges.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: 'auto' }} className="pt-2">
          {badges.map((badge, index) => (
            <span
              key={index}
              style={{
                fontFamily: 'Lexend',
                fontWeight: 500,
                fontSize: '10px',
                lineHeight: '1.3',
                color: badge.color,
                padding: '4px 8px',
                background: `${badge.color}10`,
                borderRadius: '6px',
                whiteSpace: 'nowrap'
              }}
              className="lg:text-[11px]"
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function IconComponent({ type }: { type: string }) {
  const size = "20";
  const smSize = "24";
  
  if (type === 'car') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
        <path d="M4 12H20M4 12V15M4 12L6 8H18L20 12M4 15V18C4 18.5523 4.44772 19 5 19H6C6.55228 19 7 18.5523 7 18V15M4 15H7M20 12V15M20 15V18C20 18.5523 19.5523 19 19 19H18C17.4477 19 17 18.5523 17 18V15M20 15H17M7 15H17" stroke="#005C32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (type === 'seller' || type === 'inspector') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#005C32" strokeWidth="1.5"/>
        <path d="M8 10H16M8 14H12" stroke="#005C32" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (type === 'listings') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
        <path d="M9 3H15M9 3C9 4.65685 7.65685 6 6 6H5C4.44772 6 4 6.44772 4 7V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V7C20 6.44772 19.5523 6 19 6H18C16.3431 6 15 4.65685 15 3M9 3C9 4.65685 10.3431 6 12 6C13.6569 6 15 4.65685 15 3" stroke="#005C32" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (type === 'ticket') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
        <path d="M9 12H15M9 16H12M3 5H21M5 5H19V19H5V5Z" stroke="#005C32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (type === 'revenue') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="sm:w-6 sm:h-6">
        <path d="M12 21V19M12 5V3M3 12H5M19 12H21M6 6L7.5 7.5M17.5 16.5L19 18M6 18L7.5 16.5M17.5 7.5L19 6M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z" stroke="#005C32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return null;
}

function RevenueChart({ data }: { data: { month: string; total: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.total), 1);
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 600;
    const y = 200 - (d.total / maxVal) * 150;
    return { x, y };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length-1].x} 250 L ${points[0].x} 250 Z`
    : '';

  return (
    <svg width="100%" height="100%" viewBox="0 0 600 250" preserveAspectRatio="none">
      <defs>
        <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(40, 167, 69, 0.1)" />
          <stop offset="100%" stopColor="rgba(40, 167, 69, 0)" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 50, 100, 150, 200].map(y => (
        <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#F1F5F9" strokeWidth="1" />
      ))}
      
      {/* Area */}
      {areaD && <path d={areaD} fill="url(#revenueGradient)" />}
      
      {/* Line */}
      {pathD && <path d={pathD} stroke="#28A745" strokeWidth="2" fill="none" />}
      
      {/* Data Points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#28A745" stroke="#FFFFFF" strokeWidth="1" />
      ))}
    </svg>
  );
}

function BarChart({ data }: { data: { label: string; count: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.count), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', paddingTop: '20px' }} className="sm:pt-[30px]">
      {data.map((bar, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }} className="sm:gap-2">
          <div 
            style={{ 
              height: `${(bar.count / maxVal) * 150}px`, 
              background: index === data.length - 1 ? '#28A745' : '#CCDED6', 
              borderRadius: '4px 4px 0 0',
              width: data.length > 7 ? '80%' : '32px'
            }} 
          />
          <span 
            style={{ 
              fontFamily: 'Lexend', 
              fontWeight: 500, 
              fontSize: data.length > 7 ? '8px' : '10px', 
              lineHeight: '1.3', 
              color: '#6B7280',
              display: data.length > 7 && index % 5 !== 0 ? 'none' : 'block'
            }} 
            className="sm:text-xs"
          >
            {bar.label}
          </span>
        </div>
      ))}
      {data.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-[#6B7280] font-lexend text-sm">
          No data available
        </div>
      )}
    </div>
  );
}

function DealerTable({ data, formatCurrency }: { data: Stats['bestSellers'], formatCurrency: (v: number) => string }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle px-4 sm:px-0">
        {/* Table Header - Hidden on mobile, shown on tablet+ */}
        <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-4 py-3 border-b border-[#E2E8F9]">
          <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '12px', lineHeight: '15px', color: '#6B7280' }}>Seller Name</span>
          <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '12px', lineHeight: '15px', color: '#6B7280', textAlign: 'center' }}>Total Car Sold</span>
          <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '12px', lineHeight: '15px', color: '#6B7280', textAlign: 'center' }}>Total Car Unsold</span>
          <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '12px', lineHeight: '15px', color: '#6B7280', textAlign: 'center' }}>Offers</span>
          <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '12px', lineHeight: '15px', color: '#6B7280', textAlign: 'right' }}>Total Earnings</span>
        </div>

        {/* Table Rows */}
        {data.map((dealer, index) => (
          <div key={dealer.id}>
            {/* Mobile Layout - Stack vertically */}
            <div className="sm:hidden py-4 border-b border-[#F1F5F9] last:border-b-0">
              <div className="flex items-center gap-3 mb-3">
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F0F9F4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <UserAvatar 
                    firstName={dealer.name.split(' ')[0]} 
                    lastName={dealer.name.split(' ')[1] || ''} 
                    avatar={dealer.avatar}
                    className="w-full h-full"
                    fallbackClassName="text-xs"
                  />
                </div>
                <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '14px', lineHeight: '1.3', color: '#060606' }}>{dealer.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div style={{ fontFamily: 'Lexend', fontWeight: 400, fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Cars Sold</div>
                  <div style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '14px', color: '#060606' }}>{dealer.sold}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Lexend', fontWeight: 400, fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Cars Unsold</div>
                  <div style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '14px', color: '#060606' }}>{dealer.unsold}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Lexend', fontWeight: 400, fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Offers</div>
                  <div style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '14px', color: '#060606' }}>{dealer.offers}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Lexend', fontWeight: 400, fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Earnings</div>
                  <div style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '14px', color: '#060606' }}>{formatCurrency(dealer.earnings)}</div>
                </div>
              </div>
            </div>

            {/* Desktop Layout - Grid */}
            <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-4 py-4 border-b border-[#F1F5F9] last:border-b-0 items-center">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F0F9F4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <UserAvatar 
                    firstName={dealer.name.split(' ')[0]} 
                    lastName={dealer.name.split(' ')[1] || ''} 
                    avatar={dealer.avatar}
                    className="w-full h-full"
                    fallbackClassName="text-xs"
                  />
                </div>
                <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '14px', lineHeight: '18px', color: '#060606' }}>{dealer.name}</span>
              </div>
              <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '14px', lineHeight: '18px', color: '#060606', textAlign: 'center' }}>{dealer.sold}</span>
              <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '14px', lineHeight: '18px', color: '#060606', textAlign: 'center' }}>{dealer.unsold}</span>
              <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '14px', lineHeight: '18px', color: '#060606', textAlign: 'center' }}>{dealer.offers}</span>
              <span style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '14px', lineHeight: '18px', color: '#060606', textAlign: 'right' }}>{formatCurrency(dealer.earnings)}</span>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="py-8 text-center text-[#6B7280] font-lexend text-sm">
            No dealers found
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionList({ data, formatCurrency }: { data: Stats['recentTransactions'], formatCurrency: (v: number) => string }) {
  const formatType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const formatNarration = (type: string, user: string) => {
    const narration = `${formatType(type)} by ${user}`;
    return narration.length > 22 ? narration.substring(0, 19) + '...' : narration;
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'SUCCESS') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#005C32" />
          <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (status === 'PENDING') {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    }
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} className="gap-3 sm:gap-4">
      {data.map((transaction) => (
        <div key={transaction.id} style={{ display: 'flex', alignItems: 'center', background: '#FAFAFA', borderRadius: '8px' }} className="gap-3 p-3 sm:gap-3 sm:p-3">
          <div 
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0"
          >
            <StatusIcon status={transaction.status} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '12px', lineHeight: '1.3', color: '#060606' }} className="sm:text-[13px] mb-1 truncate">
              {formatNarration(transaction.type, transaction.user)}
            </div>
            <div style={{ fontFamily: 'Lexend', fontWeight: 400, fontSize: '10px', lineHeight: '1.3', color: '#6B7280' }} className="sm:text-[11px] truncate">
              {new Date(transaction.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          <div style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '13px', lineHeight: '1.3', color: '#060606', flexShrink: 0 }} className="sm:text-[14px]">
            {formatCurrency(transaction.amount)}
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <div className="py-8 text-center text-[#6B7280] font-lexend text-sm">
          No transactions found
        </div>
      )}
    </div>
  );
}
