export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}

// Card Skeleton for vehicle listings
export function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F9] overflow-hidden">
      {/* Image skeleton */}
      <SkeletonLoader className="w-full h-[200px] rounded-none" />
      
      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title */}
        <SkeletonLoader className="h-6 w-3/4" />
        
        {/* Stats row */}
        <div className="flex gap-4">
          <SkeletonLoader className="h-4 w-16" />
          <SkeletonLoader className="h-4 w-16" />
          <SkeletonLoader className="h-4 w-16" />
        </div>
        
        {/* Location */}
        <SkeletonLoader className="h-4 w-1/2" />
        
        {/* Price */}
        <SkeletonLoader className="h-7 w-1/3" />
      </div>
    </div>
  );
}

// Grid of vehicle cards skeleton
export function VehicleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <VehicleCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Detail page skeleton
export function VehicleDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <SkeletonLoader className="w-full h-[400px] rounded-[20px]" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLoader key={i} className="h-20 rounded-[12px]" />
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="space-y-6">
          <SkeletonLoader className="h-10 w-3/4" />
          <SkeletonLoader className="h-8 w-1/2" />
          
          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonLoader key={i} className="h-16 rounded-[12px]" />
            ))}
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4">
            <SkeletonLoader className="h-12 w-1/2 rounded-[12px]" />
            <SkeletonLoader className="h-12 w-1/2 rounded-[12px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// List item skeleton (for sellers, etc.)
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-[12px] border border-[#E2E8F9]">
      <SkeletonLoader className="w-16 h-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonLoader className="h-5 w-1/2" />
        <SkeletonLoader className="h-4 w-3/4" />
      </div>
      <SkeletonLoader className="h-10 w-24 rounded-[8px]" />
    </div>
  );
}

// Admin Home Dashboard Skeleton
export function AdminHomeSkeleton() {
  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] pb-10 lg:pb-[90px]">
      {/* Greeting Skeleton */}
      <div className="mb-8 lg:mb-12">
        <SkeletonLoader className="h-10 w-64 mb-4" />
        <SkeletonLoader className="h-6 w-full max-w-lg" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E2E8F9] rounded-xl p-6 h-[140px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <SkeletonLoader className="h-4 w-24" />
                <SkeletonLoader className="h-8 w-16" />
              </div>
              <SkeletonLoader className="w-12 h-12 rounded-xl" />
            </div>
            {i >= 3 && (
              <div className="flex gap-2 mt-4">
                <SkeletonLoader className="h-5 w-16 rounded-md" />
                <SkeletonLoader className="h-5 w-16 rounded-md" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <div className="bg-white border border-[#E2E8F9] rounded-xl p-6 h-[350px]">
          <div className="flex justify-between mb-8">
            <div className="space-y-2">
              <SkeletonLoader className="h-6 w-32" />
              <SkeletonLoader className="h-5 w-24" />
            </div>
            <SkeletonLoader className="h-10 w-24 rounded-lg" />
          </div>
          <SkeletonLoader className="w-full h-[200px]" />
        </div>
        <div className="bg-white border border-[#E2E8F9] rounded-xl p-6 h-[350px]">
          <div className="flex justify-between mb-8">
            <div className="space-y-2">
              <SkeletonLoader className="h-6 w-32" />
              <SkeletonLoader className="h-5 w-24" />
            </div>
            <SkeletonLoader className="h-10 w-24 rounded-lg" />
          </div>
          <div className="flex items-end justify-between h-[200px] gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <SkeletonLoader key={i} className="flex-1 rounded-t-lg" style={{ height: `${20 + Math.random() * 80}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Finance Skeleton
export function AdminFinanceSkeleton() {
  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] pb-10">
      <div className="bg-white rounded-[14px] p-8">
        <SkeletonLoader className="h-8 w-48 mb-8" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#FAFAFA] rounded-lg p-6 space-y-3">
              <SkeletonLoader className="h-4 w-24" />
              <SkeletonLoader className="h-8 w-32" />
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E2E8F9] rounded-xl p-6 h-[300px] mb-12">
          <SkeletonLoader className="h-6 w-40 mb-6" />
          <SkeletonLoader className="w-full h-[180px]" />
        </div>

        <div className="space-y-6">
          <SkeletonLoader className="h-7 w-56" />
          <div className="border border-[#E2E8F9] rounded-xl overflow-hidden">
            <div className="bg-[#F9FAFB] p-4 border-b border-[#E2E8F9]">
              <div className="grid grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonLoader key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 border-b border-[#E2E8F9] last:border-0">
                <div className="grid grid-cols-6 gap-4">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <SkeletonLoader key={j} className="h-5 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Settings Skeleton
export function AdminSettingsSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="bg-white rounded-2xl p-10 border border-[#F0F0F0]">
        <SkeletonLoader className="h-8 w-64 mb-10" />
        
        <div className="flex items-center gap-6 mb-10">
          <SkeletonLoader className="w-[120px] h-[120px] rounded-full" />
          <div className="space-y-3">
            <SkeletonLoader className="h-7 w-48" />
            <SkeletonLoader className="h-5 w-64" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <SkeletonLoader className="h-6 w-40 mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonLoader className="h-4 w-24" />
                <SkeletonLoader className="h-12 w-full rounded-lg" />
              </div>
            ))}
            <SkeletonLoader className="h-12 w-32 rounded-lg mt-4" />
          </div>
          <div className="space-y-6">
            <SkeletonLoader className="h-6 w-40 mb-4" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonLoader className="h-4 w-24" />
                <SkeletonLoader className="h-12 w-full rounded-lg" />
              </div>
            ))}
            <SkeletonLoader className="h-12 w-32 rounded-lg mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Generic Skeleton for Management Views (User Mgt, Car Inventory, etc.)
export function AdminManagementSkeleton({ title }: { title?: string }) {
  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] pb-10">
      <div className="bg-white rounded-[14px] p-8">
        <div className="flex justify-between items-center mb-8">
          {title ? (
            <h2 className="text-[22px] font-semibold text-[#060606] font-lexend">{title}</h2>
          ) : (
            <SkeletonLoader className="h-8 w-64" />
          )}
          <SkeletonLoader className="h-10 w-40 rounded-lg" />
        </div>
        
        {/* Filters/Search Row */}
        <div className="flex gap-4 mb-8">
          <SkeletonLoader className="h-11 flex-1 rounded-lg" />
          <SkeletonLoader className="h-11 w-32 rounded-lg" />
          <SkeletonLoader className="h-11 w-32 rounded-lg" />
        </div>

        <TableSkeleton rows={8} cols={6} />
      </div>
    </div>
  );
}

// Admin Subscriptions Skeleton
export function AdminSubscriptionsSkeleton({ title = "Subscriptions" }: { title?: string }) {
  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] pb-10">
      <div className="bg-white rounded-[14px] p-8">
        <h2 className="text-[22px] font-semibold text-[#060606] font-lexend mb-10">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-[#E2E8F9] rounded-2xl p-6 space-y-6">
              <div className="space-y-2">
                <SkeletonLoader className="h-6 w-32" />
                <SkeletonLoader className="h-10 w-24" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex gap-2">
                    <SkeletonLoader className="w-5 h-5 rounded-full" />
                    <SkeletonLoader className="h-4 flex-1" />
                  </div>
                ))}
              </div>
              <SkeletonLoader className="h-12 w-full rounded-xl" />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <SkeletonLoader className="h-7 w-48" />
          <TableSkeleton rows={5} cols={5} />
        </div>
      </div>
    </div>
  );
}

// Admin CMS Skeleton
export function AdminCMSSkeleton({ title = "CMS" }: { title?: string }) {
  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] pb-10">
      <div className="bg-white rounded-[14px] p-8">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-[22px] font-semibold text-[#060606] font-lexend">{title}</h2>
          <SkeletonLoader className="h-10 w-40 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar-like list */}
          <div className="lg:col-span-1 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLoader key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-[#FAFAFA] rounded-xl p-6 space-y-6">
              <SkeletonLoader className="h-6 w-48" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <SkeletonLoader className="h-4 w-24" />
                    <SkeletonLoader className="h-24 w-full rounded-lg" />
                  </div>
                ))}
              </div>
              <SkeletonLoader className="h-12 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Placeholder/Generic Skeleton
export function AdminPlaceholderSkeleton() {
  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-[92px] pb-10">
      <div className="bg-white rounded-2xl p-8 space-y-6">
        <SkeletonLoader className="h-8 w-64" />
        <SkeletonLoader className="h-5 w-full max-w-md" />
        <div className="space-y-4 pt-4">
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-full" />
          <SkeletonLoader className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}

// Wallet Balance Skeleton
export function WalletBalanceSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-12">
      <div className="flex-1 bg-white rounded-[24px] border border-[#E2E8F9] p-10 min-h-[180px] flex flex-col justify-center gap-4">
        <SkeletonLoader className="h-4 w-24" />
        <SkeletonLoader className="h-12 w-48" />
        <div className="flex gap-3 mt-4">
          <SkeletonLoader className="h-8 w-32 rounded-full" />
          <SkeletonLoader className="h-8 w-32 rounded-full" />
        </div>
      </div>
      <div className="w-full md:w-[320px] bg-white rounded-[24px] border border-[#E2E8F9] p-8 flex flex-col gap-6">
        <SkeletonLoader className="h-12 w-full rounded-[12px]" />
        <SkeletonLoader className="h-12 w-full rounded-[12px]" />
      </div>
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-5 border-b border-[#F0F0F0]">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonLoader key={i} className={`h-4 flex-1 ${i === 0 ? 'w-8' : ''}`} />
      ))}
    </div>
  );
}

// Full Wallet Page Skeleton
export function WalletPageSkeleton() {
  return (
    <div className="w-full animate-in fade-in duration-500">
      <SkeletonLoader className="h-8 w-32 mb-8" />
      <WalletBalanceSkeleton />
      <div className="bg-white rounded-[24px] border border-[#E2E8F9] overflow-hidden">
        <div className="p-6 border-b border-[#F0F0F0] flex justify-between">
          <SkeletonLoader className="h-6 w-40" />
          <div className="flex gap-4">
            <SkeletonLoader className="h-10 w-48 rounded-xl" />
            <SkeletonLoader className="h-10 w-10 rounded-xl" />
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <ListItemSkeleton key={index} />
      ))}
    </div>
  );
}

// Table skeleton (for admin/seller/buyer dashboards)
export function TableSkeleton({ rows = 5, cols = 5, hasHeader = true }: { rows?: number; cols?: number; hasHeader?: boolean }) {
  return (
    <div className="bg-white rounded-[12px] border border-[#E2E8F9] overflow-hidden w-full">
      {/* Header */}
      {hasHeader && (
        <div className="flex gap-4 p-4 border-b border-[#E2E8F9]">
          {Array.from({ length: cols }).map((_, i) => (
            <SkeletonLoader key={i} className="h-5 flex-1" />
          ))}
        </div>
      )}
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b border-[#E2E8F9] last:border-b-0">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <SkeletonLoader key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-[20px] border border-[#E2E8F9] flex items-center gap-4">
      <SkeletonLoader className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonLoader className="h-4 w-20" />
        <SkeletonLoader className="h-7 w-32" />
      </div>
    </div>
  );
}

// Stats Grid Skeleton
export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </>
  );
}

// Chart Skeleton
export function ChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-[#E2E8F9] h-[400px] flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <SkeletonLoader className="h-6 w-40" />
        <SkeletonLoader className="h-6 w-24" />
      </div>
      <div className="flex-1 flex items-end gap-2 px-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonLoader 
            key={i} 
            className="flex-1 rounded-t-lg" 
            style={{ height: `${Math.random() * 60 + 20}%` }} 
          />
        ))}
      </div>
    </div>
  );
}

// Dashboard Home Skeleton
export function DashboardHomeSkeleton() {
  return (
    <div className="w-full animate-in fade-in duration-500">
      <SkeletonLoader className="h-8 w-48 mb-8" />
      <StatsGridSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[24px] border border-[#E2E8F9] h-[400px] flex flex-col gap-4">
            <SkeletonLoader className="h-6 w-40 mb-4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <SkeletonLoader className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <SkeletonLoader className="h-4 w-3/4" />
                  <SkeletonLoader className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
