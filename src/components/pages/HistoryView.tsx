import { VehicleCard } from '../VehicleCard';
import { ChevronLeft, ChevronRight, Search, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { toast } from 'sonner';
import { VehicleGridSkeleton } from '../ui/SkeletonLoader';

interface HistoryViewProps {
  userType?: 'buyer' | 'seller';
}

export function HistoryView({ userType = 'buyer' }: HistoryViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [historyCars, setHistoryCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10
  });

  const fetchHistory = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.get('/view-history', {
        params: {
          page,
          limit: 10 // Showing 10 items per page
        }
      });
      
      // Ensure response.data exists and has history
      if (response.data) {
        setHistoryCars(response.data.history || []);
        setPagination(response.data.pagination || { total: 0, totalPages: 1, currentPage: 1, limit: 10 });
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      // Only show error toast if it's not a 404 (meaning history might just be empty)
      const err = error as any;
      if (err.response?.status !== 404) {
        toast.error('Failed to load view history');
      } else {
        setHistoryCars([]);
        setPagination(prev => ({ ...prev, total: 0, totalPages: 1 }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  const handleClearAll = () => {
    toast('Are you sure you want to clear your entire history?', {
      description: 'This action cannot be undone.',
      action: {
        label: 'Clear All',
        onClick: async () => {
          try {
            await api.delete('/view-history/clear');
            setHistoryCars([]);
            setPagination(prev => ({ ...prev, total: 0, totalPages: 1 }));
            toast.success('History cleared');
          } catch (error) {
            console.error('Error clearing history:', error);
            toast.error('Failed to clear history');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const handleDeleteItem = (carId: string) => {
    toast('Remove this item from your history?', {
      description: 'This car will no longer appear in your viewed history.',
      action: {
        label: 'Remove',
        onClick: async () => {
          try {
            await api.delete(`/view-history/${carId}`);
            setHistoryCars(prev => prev.filter(car => car.id !== carId));
            toast.success('Removed from history');
          } catch (error) {
            console.error('Error deleting history item:', error);
            toast.error('Failed to remove item');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const filteredCars = historyCars.filter(car => 
    car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center mt-16 w-full py-6 border-t border-[#F0F0F0]">
        <div className="flex items-center gap-2 sm:gap-6">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: '#FFFFFF',
              border: '1px solid #005C32',
              borderRadius: '8px',
              color: '#005C32',
              fontFamily: 'Lexend',
              fontSize: '14px',
              fontWeight: 500,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            <ChevronLeft size={18} />
            <span className="hidden md:inline">Previous</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first page, last page, and pages around current page
                return page === 1 || 
                       page === pagination.totalPages || 
                       (page >= currentPage - 1 && page <= currentPage + 1);
              })
              .map((page, index, array) => (
                <div key={page} className="flex items-center">
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="text-[#999999] mx-0.5 sm:mx-1">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border-none font-['Lexend'] text-sm font-medium cursor-pointer transition-all duration-200 ${
                      currentPage === page ? 'bg-[#F0F9F4] text-[#005C32]' : 'bg-transparent text-[#999999]'
                    }`}
                  >
                    {page}
                  </button>
                </div>
              ))}
          </div>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: '#FFFFFF',
              border: '1px solid #005C32',
              borderRadius: '8px',
              color: '#005C32',
              fontFamily: 'Lexend',
              fontSize: '14px',
              fontWeight: 500,
              cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === pagination.totalPages ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Header with Title and Delete Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 style={{ 
            fontFamily: 'Lexend', 
            fontWeight: 600, 
            fontSize: 'clamp(24px, 5vw, 32px)', 
            lineHeight: '1.2', 
            color: '#000000',
            marginBottom: '4px'
          }}>
            Car History
          </h2>
          <p style={{
            fontFamily: 'Lexend',
            fontSize: '16px',
            color: '#999999',
            fontWeight: 400
          }}>
            Car Viewed History
          </p>
        </div>

        {historyCars.length > 0 && (
          <button 
            onClick={handleClearAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#FF3B30',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Lexend',
              fontWeight: 500,
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0px 4px 12px rgba(255, 59, 48, 0.2)'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Trash2 size={20} />
            Delete All History
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-[320px] mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]" size={20} />
        <input
          type="text"
          placeholder="Search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-4 py-3 bg-white border border-[#E2E8F9] rounded-xl focus:outline-none focus:border-[#005C32] transition-colors font-['Lexend']"
          style={{
            paddingLeft: '56px',
            boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)'
          }}
        />
      </div>

      {loading ? (
        <VehicleGridSkeleton count={6} />
      ) : filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full">
          {filteredCars.map((car) => (
            <VehicleCard
              key={car.id}
              id={car.id}
              name={car.title}
              description={car.description}
              price={car.price.toString()}
              image={car.images?.[0] || ''}
              mileage={`${car.mileage} Miles`}
              fuelType={car.fuelType}
              transmission={car.transmission}
              location={car.location || 'Location unavailable'}
              condition={car.condition}
              color={car.color}
              isFavorited={car.isFavorited}
              showDelete={true}
              onDelete={() => handleDeleteItem(car.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-['Lexend']">No view history found.</p>
        </div>
      )}

      {!loading && renderPagination()}
    </>
  );
}
