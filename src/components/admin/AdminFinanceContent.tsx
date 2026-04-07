import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { formatAmount } from '../../lib/formatters';
import { AdminFinanceSkeleton, TableSkeleton } from '../ui/SkeletonLoader';

export function AdminFinanceContent() {
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1];
  }, []);
  const [selectedYearIndex, setSelectedYearIndex] = useState(1);
  const defaultRevenueChart = useMemo(
    () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => ({ month, total: 0 })),
    []
  );
  const [summary, setSummary] = useState({
    totals: {
      totalRevenue: 0,
      monthlyRevenue: 0,
      subscriptionRevenue: 0,
      escrowFees: 0,
      totalEarnings: 0,
      monthlyEarnings: 0,
      subscriptionEarnings: 0,
      escrowEarnings: 0
    },
    revenueChart: defaultRevenueChart
  });

  useEffect(() => {
    fetchData();
  }, [selectedYearIndex]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchPendingTransactions(), fetchFinanceSummary()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${(import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000'}/api/admin/wallet/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPendingTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching pending:', error);
    }
  };

  const fetchFinanceSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const selectedYear = yearOptions[selectedYearIndex];
      const response = await fetch(`${(import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000'}/api/admin/finance/summary?year=${selectedYear}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setSummary({
          totals: {
            totalRevenue: Number(data?.totals?.totalRevenue || 0),
            monthlyRevenue: Number(data?.totals?.monthlyRevenue || 0),
            subscriptionRevenue: Number(data?.totals?.subscriptionRevenue || 0),
            escrowFees: Number(data?.totals?.escrowFees || 0),
            totalEarnings: Number(data?.totals?.totalEarnings || 0),
            monthlyEarnings: Number(data?.totals?.monthlyEarnings || 0),
            subscriptionEarnings: Number(data?.totals?.subscriptionEarnings || 0),
            escrowEarnings: Number(data?.totals?.escrowEarnings || 0)
          },
          revenueChart: Array.isArray(data?.revenueChart) && data.revenueChart.length > 0 ? data.revenueChart : defaultRevenueChart
        });
      } else {
        toast.error(data?.error || 'Failed to load finance summary');
      }
    } catch (error) {
      console.error('Error fetching finance summary:', error);
      toast.error('Failed to load finance summary');
    }
  };

  const handleApprove = async (txId: string) => {
    if (!window.confirm('Are you sure you want to approve this transaction?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/admin/wallet/approve/${txId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        fetchPendingTransactions();
      } else {
        toast.error(data.error || 'Approval failed');
      }
    } catch (error) {
      console.error('Approval error:', error);
      toast.error('Failed to approve transaction');
    }
  };

  const formatCurrency = (value: number) => `₦${formatAmount(value || 0)}`;
  const handleYearClick = () => {
    setSelectedYearIndex((prev) => (prev + 1) % yearOptions.length);
  };
  const chartData = summary.revenueChart.length > 0 ? summary.revenueChart : defaultRevenueChart;
  const chartPoints = chartData.slice(-7);
  const chartMax = Math.max(...chartPoints.map(p => Number(p.total || 0)), 0);
  const chartStep = chartMax === 0 ? 10000 : Math.ceil(chartMax / 5 / 1000) * 1000;
  const yLabels = [chartStep * 5, chartStep * 4, chartStep * 3, chartStep * 2, chartStep];
  const chartWidth = 700;
  const chartHeight = 165;
  const xStep = chartPoints.length > 1 ? chartWidth / (chartPoints.length - 1) : chartWidth;
  const points = chartPoints.map((point, index) => {
    const value = Number(point.total || 0);
    const x = index * xStep;
    const y = chartMax === 0 ? chartHeight : chartHeight - (value / chartMax) * chartHeight;
    return { x, y };
  });
  const linePath = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ${points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`
    : '';
  const areaPath = points.length > 0
    ? `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`
    : '';
  const currentMonthIndex = new Date().getMonth();
  const currentMonthTotal = chartData[currentMonthIndex]?.total || 0;
  const prevMonthTotal = chartData[currentMonthIndex - 1]?.total || 0;
  const monthChange = prevMonthTotal === 0 ? (currentMonthTotal > 0 ? 100 : 0) : Math.round(((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100);
  const monthChangeLabel = `${monthChange >= 0 ? '+' : ''}${monthChange}%`;

  return (
    <>
      {loading && <AdminFinanceSkeleton />}
      <div style={{ display: loading ? 'none' : 'block' }}>
        {/* Sub Navigation - Mobile First */}
      <div style={{ background: '#FFFFFF', boxShadow: '0px 5px 8px rgba(70, 78, 95, 0.02)', minHeight: '60px', display: 'flex', alignItems: 'center', width: '100%' }} className="mb-6 lg:mb-10">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[102px] w-full">
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }} className="lg:gap-[30px] -mx-4 px-4 sm:mx-0 sm:px-0">
            <div style={{ background: '#CCDED6', borderRadius: '6px', padding: '12px 24px', whiteSpace: 'nowrap' }} className="lg:px-[33px] lg:py-[15px]">
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '12px', lineHeight: '15px', color: '#005C32' }}>Finances</span>
            </div>
            <button style={{ background: 'none', border: 'none', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '12px', lineHeight: '15px', color: '#6B7280', cursor: 'pointer', whiteSpace: 'nowrap' }}>Transaction History</button>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile First */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] pb-10 lg:pb-[90px]">
        <div style={{ background: '#FFFFFF', borderRadius: '14.32px' }} className="p-5 sm:p-8 lg:p-[34px]">
          {/* Title */}
          <h1 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: 'clamp(18px, 3vw, 22.912px)', lineHeight: '150%', letterSpacing: '-0.02em', color: '#060606' }} className="mb-6 lg:mb-[34px]">Finances</h1>

          {/* Metrics Row 1 - Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[45px] mb-6 lg:mb-[43px]">
            <MetricCard title="Total Revenue" value={formatCurrency(summary.totals.totalRevenue)} />
            <MetricCard title="Monthly Revenue" value={formatCurrency(summary.totals.monthlyRevenue)} />
            <MetricCard title="Subscription Revenue" value={formatCurrency(summary.totals.subscriptionRevenue)} />
            <MetricCard title="Escrow Fees" value={formatCurrency(summary.totals.escrowFees)} />
          </div>

          {/* Metrics Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-[45px] mb-10 lg:mb-[86px]">
            <MetricCard title="Total Earnings" value={formatCurrency(summary.totals.totalEarnings)} />
            <MetricCard title="Monthly Earnings" value={formatCurrency(summary.totals.monthlyEarnings)} />
            <MetricCard title="Subscription Earnings" value={formatCurrency(summary.totals.subscriptionEarnings)} />
            <MetricCard title="Escrow Earnings" value={formatCurrency(summary.totals.escrowEarnings)} />
          </div>

          {/* Overall Revenue Chart */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F9', borderRadius: '12px' }} className="p-4 sm:p-6 lg:p-[24px_28px]">
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 lg:mb-[18px]">
              <div className="flex-1">
                <div className="flex items-center gap-2 lg:gap-[11px] mb-1">
                  <h2 style={{ fontFamily: 'Lexend', fontWeight: 700, fontSize: '16px', lineHeight: '160%', color: '#060606', margin: 0 }} className="sm:text-lg">Overall Revenue</h2>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '14px', lineHeight: '140%', letterSpacing: '0.2px', color: '#6B7280' }} className="sm:text-[15px]">{formatCurrency(summary.totals.totalRevenue)}</span>
                  <span style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '12px', lineHeight: '160%', color: monthChange >= 0 ? '#34D399' : '#EF4444' }}>{monthChangeLabel}</span>
                </div>
              </div>
                <div onClick={handleYearClick} style={{ border: '1px solid #F1F5F9', borderRadius: '8px', padding: '8px', display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer', width: 'fit-content' }}>
                <span style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '12px', lineHeight: '160%', color: '#6B7280' }}>{yearOptions[selectedYearIndex]}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Chart Area - Responsive */}
            <div className="relative h-[180px] sm:h-[200px] lg:h-[200px]">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-[30px] lg:bottom-[35px] flex flex-col justify-between w-[30px] lg:w-[38px]">
                {yLabels.map((label) => (
                  <span key={label} style={{ fontFamily: 'Lexend', fontWeight: 400, fontSize: '10px', lineHeight: '160%', textAlign: 'right', color: '#6B7280' }} className="sm:text-xs">
                    {label >= 1000 ? `${Math.round(label / 1000)}K` : label}
                  </span>
                ))}
              </div>

              {/* Grid lines */}
              <div className="absolute left-[40px] lg:left-[52px] right-0 top-0 bottom-[30px] lg:bottom-[35px] flex flex-col justify-between">
                <div style={{ height: '1px', background: '#F1F5F9' }}></div>
                <div style={{ height: '1px', background: '#F1F5F9' }}></div>
                <div style={{ height: '1px', background: '#F1F5F9' }}></div>
                <div style={{ height: '1px', background: '#F1F5F9' }}></div>
                <div style={{ height: '1px', background: '#F1F5F9' }}></div>
              </div>

              {/* Chart SVG */}
              <svg className="absolute left-[40px] lg:left-[52px] right-0 top-0 bottom-[30px] lg:bottom-[35px]" style={{ width: 'calc(100% - 40px)', height: 'calc(100% - 30px)' }} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="financeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(204, 220, 214, 0)" />
                    <stop offset="100%" stopColor="rgba(204, 220, 214, 0.12)" />
                  </linearGradient>
                </defs>
                {areaPath && <path d={areaPath} fill="url(#financeGradient)" />}
                {linePath && <path d={linePath} stroke="#28A745" strokeWidth="2" fill="none" />}
              </svg>

              {/* X-axis labels */}
              <div className="absolute left-[40px] lg:left-[52px] right-0 bottom-0 flex justify-between">
                {chartPoints.map((point) => (
                  <span key={point.month} style={{ fontFamily: 'Lexend', fontWeight: 400, fontSize: '10px', lineHeight: '160%', color: '#6B7280' }} className="sm:text-xs">
                    {point.month}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Wallet Requests */}
          <div style={{ marginTop: '64px' }}>
            <h2 style={{ fontFamily: 'Lexend', fontWeight: 600, fontSize: '18px', color: '#060606', marginBottom: '24px' }}>
              Pending Wallet Requests
            </h2>
            {loading ? (
              <TableSkeleton rows={3} cols={6} />
            ) : pendingTransactions.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#FFFFFF', border: '1px solid #E2E8F9', borderRadius: '12px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #F0F0F0', backgroundColor: '#F9FAFB' }}>
                      <th style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>User</th>
                      <th style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>Type</th>
                      <th style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>Amount</th>
                      <th style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>Description</th>
                      <th style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>Date</th>
                      <th style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#6B7280' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTransactions.map((tx) => (
                      <tr key={tx.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#060606' }}>
                          {tx.user?.firstName} {tx.user?.lastName} ({tx.user?.email})
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#060606' }}>{tx.type}</td>
                        <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600, color: '#005C32' }}>
                          ₦{formatAmount(tx.amount)}
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280' }}>{tx.description}</td>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280' }}>
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <button 
                            onClick={() => handleApprove(tx.id)}
                            style={{ 
                              padding: '8px 16px', 
                              backgroundColor: '#005C32', 
                              color: '#FFFFFF', 
                              border: 'none', 
                              borderRadius: '6px', 
                              fontSize: '12px', 
                              fontWeight: 600, 
                              cursor: 'pointer' 
                            }}
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E2E8F9' }}>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>No pending requests found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
}

function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div style={{ background: '#FAFAFA', borderRadius: '8px' }} className="p-4 sm:p-5 lg:p-6">
      <div style={{ fontFamily: 'Lexend', fontWeight: 500, fontSize: '12px', lineHeight: '160%', color: '#6B7280' }} className="sm:text-sm mb-2 lg:mb-3">
        {title}
      </div>
      <div style={{ fontFamily: 'Lexend', fontWeight: 700, fontSize: '20px', lineHeight: '130%', color: '#060606' }} className="sm:text-2xl lg:text-[28px]">
        {value}
      </div>
    </div>
  );
}
