import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { SellerCard } from '../SellerCard';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Spinner } from '../ui/Spinner';
import { getAvatarUrl } from '../../utils/avatarUtils';

interface Seller {
  id: string | number;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  carsAvailable: number;
  image: string;
  verified: boolean;
}

export function CarSellersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching sellers...');
        const response = await api.get('/sellers', {
          params: {
            page: currentPage,
            limit: 10,
            search: searchQuery,
          },
        });
        console.log('Sellers API Response:', response.data);
        
        const { sellers: fetchedSellers, pagination } = response.data;
        
        if (!Array.isArray(fetchedSellers)) {
          throw new Error('Invalid response format: sellers is not an array');
        }

        // Map backend data to frontend Seller interface
        const mappedSellers: Seller[] = fetchedSellers.map((seller: any) => ({
          id: seller.id,
          name: seller.sellerProfile?.companyName || `${seller.firstName} ${seller.lastName}`,
          location: seller.sellerProfile?.address || 'Abuja, Nigeria',
          rating: 4.5, // Default for now
          reviews: 15, // Default for now
          carsAvailable: seller._count?.cars || 0,
          image: getAvatarUrl(seller.avatar),
          verified: seller.sellerProfile?.verified || seller.verified || false,
        }));

        setSellers(mappedSellers);
        setTotalPages(pagination?.pages || 1);
        setTotalCount(pagination?.total || 0);
      } catch (err: any) {
        console.error('Error fetching sellers:', err);
        setError(err.message || 'Failed to load sellers');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchSellers();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, searchQuery]);

  // Generate page numbers
  const pageNumbers = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 4) {
      pageNumbers.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pageNumbers.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  return (
    <div
      className="w-full bg-white py-8 md:py-10"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Breadcrumb */}
        <div
          className="px-4 md:px-8 lg:px-[66px]"
          style={{
            marginBottom: '29px',
          }}
        >
          <p
            className="font-light text-[14px] leading-[21px] text-[#52525B]"
          >
            Home / Car Sellers
          </p>
        </div>

        {/* Main Content Container */}
        <div
          className="px-4 md:px-8 lg:px-[63px]"
          style={{
            maxWidth: '1315px',
            margin: '0 auto',
          }}
        >
          {/* Header Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '45px',
              marginBottom: '56px',
            }}
          >
            {/* Title and Description */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                maxWidth: '630px',
              }}
            >
              <h1
                className="font-medium text-[clamp(24px,4vw,36px)] leading-tight text-[#060606]"
              >
                Browse Verified Car Sellers
              </h1>
              <p
                className="font-light text-[16px] leading-[30px] text-[#999999]"
              >
                Connect with trusted car sellers offering a wide range of vehicles to suit your needs.
              </p>
            </div>

            {/* Search Input */}
            <div
              style={{
                position: 'relative',
                maxWidth: '630px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10.71px 16.06px',
                  gap: '16.06px',
                  height: '48.42px',
                  border: '1.34px solid #E2E8F9',
                  boxShadow: '0px 5.35px 10.71px -2.68px rgba(0, 0, 0, 0.08), 0px 2.68px 5.35px -2.68px rgba(0, 0, 0, 0.04)',
                  borderRadius: '8.03px',
                }}
              >
                <Search
                  style={{
                    width: '26.77px',
                    height: '26.77px',
                    color: '#90A3BF',
                    strokeWidth: '2.24px',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none bg-transparent font-normal text-[18.74px] leading-[145%] text-[#90A3BF]"
                />
              </div>
            </div>

            {/* Results Count */}
            <div>
              <h2
                className="font-medium text-[24px] leading-[30px] text-[#060606]"
              >
                All ({totalCount} Results)
              </h2>
            </div>
          </div>

          {/* Sellers Grid Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '29px',
            }}
          >
            {loading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">
                <p>Error: {error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-[#005C32] text-white rounded hover:bg-opacity-90"
                >
                  Retry
                </button>
              </div>
            ) : sellers.length > 0 ? (
              <>
                {/* Desktop & Tablet: Grid Layout | Mobile: Horizontal Scroll */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-[29px] lg:gap-[41px]">
                  {sellers.map((seller) => (
                    <SellerCard key={seller.id} seller={seller} />
                  ))}
                </div>

                {/* Mobile: Horizontal Scroll */}
                <div className="md:hidden overflow-x-auto pb-4">
                  <div className="flex gap-4" style={{ paddingRight: '16px' }}>
                    {sellers.map((seller) => (
                      <SellerCard key={seller.id} seller={seller} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-gray-500">
                No sellers found.
              </div>
            )}

            {/* Pagination */}
            {!loading && sellers.length > 0 && totalPages > 1 && (
              <div
                className="hidden md:flex"
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: '23.65px',
                  borderTop: '1.18px solid #EAECF0',
                  marginTop: '29px',
                  gap: '23.65px',
                  position: 'relative',
                }}
              >
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="hover:opacity-70 transition-opacity disabled:opacity-40"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '9.46px 16.56px',
                    gap: '9.46px',
                    width: '135.23px',
                    height: '42.92px',
                    background: '#FFFFFF',
                    border: '1.18px solid #005C32',
                    boxShadow: '0px 1.18px 2.37px rgba(16, 24, 40, 0.05)',
                    borderRadius: '9.46px',
                    position: 'absolute',
                    left: '0',
                  }}
                >
                  <ChevronLeft
                    style={{
                      width: '23.65px',
                      height: '23.65px',
                      color: '#999999',
                      strokeWidth: '1.98px',
                    }}
                  />
                  <span
                    className="font-normal text-[16.56px] leading-[24px] text-[#060606]"
                  >
                    Previous
                  </span>
                </button>

                {/* Page Numbers - Centered */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '2.37px',
                  }}
                >
                  {pageNumbers.map((page, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (typeof page === 'number') {
                          setCurrentPage(page);
                        }
                      }}
                      disabled={page === '...'}
                      className="hover:bg-opacity-80 transition-all"
                      style={{
                        width: '47.31px',
                        height: '47.31px',
                        background: page === currentPage ? 'rgba(0, 92, 50, 0.1)' : 'transparent',
                        borderRadius: '9.46px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontFamily: 'Lexend',
                        fontWeight: page === currentPage ? 500 : 300,
                        fontSize: '16.56px',
                        lineHeight: '24px',
                        color: page === currentPage ? '#005C32' : '#999999',
                        cursor: page === '...' ? 'default' : 'pointer',
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="hover:opacity-70 transition-opacity disabled:opacity-40"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '9.46px 16.56px',
                    gap: '9.46px',
                    width: '105.23px',
                    height: '42.92px',
                    background: '#FFFFFF',
                    border: '1.18px solid #005C32',
                    boxShadow: '0px 1.18px 2.37px rgba(16, 24, 40, 0.05)',
                    borderRadius: '9.46px',
                    position: 'absolute',
                    right: '0',
                  }}
                >
                  <span
                    className="font-normal text-[16.56px] leading-[24px] text-[#060606]"
                  >
                    Next
                  </span>
                  <ChevronRight
                    style={{
                      width: '23.65px',
                      height: '23.65px',
                      color: '#999999',
                      strokeWidth: '1.98px',
                    }}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
