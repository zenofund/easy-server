import { useEffect, useMemo, useState } from "react";
import { Search, Eye } from "lucide-react";
import api from "./lib/api";
import { formatID } from "./lib/formatters";

interface Listing {
  id: string;
  carMake: string;
  carModel: string;
  amount: number;
  updatedDate: string;
  views: number;
  status: "active" | "sold";
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<"active" | "sold">("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setUserId(null);
      return;
    }
    const parsed = JSON.parse(userData);
    setUserId(parsed?.id ?? null);
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/sellers/${userId}`, {
          params: {
            page: currentPage,
            limit: 10,
            status: activeTab === "active" ? "AVAILABLE" : "SOLD",
          },
        });
        const { cars, pagination } = response.data;
        if (!Array.isArray(cars)) {
          throw new Error("Invalid response format");
        }
        const mappedListings: Listing[] = cars.map((car: any) => {
          const dateSource = car.updatedAt || car.createdAt;
          const formattedDate = dateSource
            ? new Date(dateSource).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })
            : "-";
          return {
            id: car.id,
            carMake: car.make || "N/A",
            carModel: car.model || "N/A",
            amount: typeof car.price === "number" ? car.price : Number(car.price),
            updatedDate: formattedDate,
            views: typeof car.views === "number" ? car.views : 0,
            status: car.status === "SOLD" ? "sold" : "active",
          };
        });
        setListings(mappedListings);
        setTotalPages(pagination?.pages || 1);
        setTotalCount(pagination?.total || 0);
      } catch (err: any) {
        const message = err.response?.data?.error || err.message || "Failed to load listings";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [activeTab, currentPage, userId]);

  const filteredListings = useMemo(() => {
    if (!searchTerm) {
      return listings;
    }
    const term = searchTerm.toLowerCase();
    return listings.filter((listing) =>
      [listing.id, listing.carMake, listing.carModel].some((value) =>
        value.toLowerCase().includes(term)
      )
    );
  }, [listings, searchTerm]);

  const displayCount = searchTerm ? filteredListings.length : totalCount;
  const activeLabel = activeTab === "active" ? "Active" : "Sold";
  const statusDotClass =
    activeTab === "active"
      ? "bg-status-active-bg text-status-active"
      : "bg-gray-100 text-gray-500";
  const statusInnerClass =
    activeTab === "active" ? "bg-status-active" : "bg-gray-400";

  const pageNumbers: Array<number | string> = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) {
      pageNumbers.push(i);
    }
  } else if (currentPage <= 4) {
    pageNumbers.push(1, 2, 3, 4, 5, "...", totalPages);
  } else if (currentPage >= totalPages - 3) {
    pageNumbers.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[975px] bg-white rounded-[15px] border border-[#E2E8F9] shadow-[0_1px_3px_0_rgba(16,24,40,0.10),0_1px_2px_0_rgba(16,24,40,0.06),0_0_0_4px_#D1CFCF] p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-medium text-black leading-[145%]">
            My Listings
          </h1>
          <button className="w-full sm:w-auto px-4 py-3 bg-brand-green rounded-xl text-white text-sm font-normal leading-6 hover:bg-brand-green/90 transition-colors">
            Add New Listing
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-8">
          <button
            onClick={() => {
              setActiveTab("active");
              setCurrentPage(1);
            }}
            className={`px-4 py-3.5 text-[13px] font-medium transition-colors relative ${
              activeTab === "active"
                ? "text-brand-green"
                : "text-[#667185] font-normal"
            }`}
          >
            Active
            {activeTab === "active" && (
              <div className="absolute bottom-0 left-0 right-0 h-[0.921px] bg-brand-green" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("sold");
              setCurrentPage(1);
            }}
            className={`px-4 py-3.5 text-[13px] font-medium transition-colors relative ${
              activeTab === "sold"
                ? "text-brand-green"
                : "text-[#667185] font-normal"
            }`}
          >
            Sold
            {activeTab === "sold" && (
              <div className="absolute bottom-0 left-0 right-0 h-[0.921px] bg-brand-green" />
            )}
            {activeTab !== "sold" && (
              <div className="absolute bottom-0 left-0 right-0 h-[0.921px] bg-[#E4E7EC]" />
            )}
          </button>
        </div>

        {/* Content Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-[21px] font-semibold text-[#060606] leading-[150%] tracking-[-0.422px]">
              {activeLabel}({displayCount})
            </h2>
            {/* Search Bar */}
            <div className="w-full md:w-auto">
              <div className="relative w-full md:w-[292px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E2E8F9]" />
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-[#D0D5DD] rounded-[10px] text-sm text-[#E2E8F9] placeholder:text-[#E2E8F9] focus:outline-none focus:ring-2 focus:ring-brand-green/20 shadow-[0_4px_8px_-2px_rgba(0,0,0,0.08),0_2px_4px_-2px_rgba(0,0,0,0.04)]"
                />
              </div>
            </div>
          </div>

          {/* Table - Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#F3F5F7]">
                  <th className="text-left py-3 text-[13px] font-medium text-gray-text tracking-[-0.254px] leading-[150%] pr-4">
                    Listing ID
                  </th>
                  <th className="text-left py-3 text-[13px] font-medium text-gray-text tracking-[-0.254px] leading-[150%] pr-4">
                    Car Make
                  </th>
                  <th className="text-left py-3 text-[13px] font-medium text-gray-text tracking-[-0.254px] leading-[150%] pr-4">
                    Car Model
                  </th>
                  <th className="text-left py-3 text-[13px] font-medium text-gray-text tracking-[-0.254px] leading-[150%] pr-4">
                    Amount
                  </th>
                  <th className="text-left py-3 text-[13px] font-medium text-gray-text tracking-[-0.254px] leading-[150%] pr-4">
                    Updated Date
                  </th>
                  <th className="text-left py-3 text-[13px] font-medium text-gray-text tracking-[-0.254px] leading-[150%] pr-4">
                    Views
                  </th>
                  <th className="text-left py-3 text-[13px] font-medium text-gray-text tracking-[-0.254px] leading-[150%] pr-4">
                    Status
                  </th>
                  <th className="py-3"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="border-b border-[#F3F5F7]">
                    <td colSpan={8} className="py-6 text-center text-sm text-gray-text">
                      Loading listings...
                    </td>
                  </tr>
                ) : error ? (
                  <tr className="border-b border-[#F3F5F7]">
                    <td colSpan={8} className="py-6 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredListings.length === 0 ? (
                  <tr className="border-b border-[#F3F5F7]">
                    <td colSpan={8} className="py-6 text-center text-sm text-gray-text">
                      No listings found.
                    </td>
                  </tr>
                ) : filteredListings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="border-b border-[#F3F5F7] hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3 text-[12px] font-extralight text-gray-text-dark tracking-[-0.238px] leading-[150%]">
                      {formatID(listing.id)}
                    </td>
                    <td className="py-3 text-[12px] font-extralight text-gray-text-dark tracking-[-0.238px] leading-[150%]">
                      {listing.carMake}
                    </td>
                    <td className="py-3 text-[12px] font-extralight text-gray-text-dark tracking-[-0.238px] leading-[150%]">
                      {listing.carModel}
                    </td>
                    <td className="py-3 text-[12px] font-extralight text-gray-text-dark tracking-[-0.238px] leading-[150%]">
                      ₦{Number.isFinite(listing.amount) ? listing.amount.toLocaleString() : "0"}
                    </td>
                    <td className="py-3 text-[12px] font-extralight text-gray-text-dark tracking-[-0.238px] leading-[150%]">
                      {listing.updatedDate}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-gray-text" />
                        <span className="text-[12px] font-extralight text-gray-text-dark tracking-[-0.238px] leading-[150%]">
                          {listing.views}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-[17px] h-[17px] rounded-full flex items-center justify-center ${statusDotClass}`}>
                          <div className={`w-[8.5px] h-[8.5px] rounded-full ${statusInnerClass}`} />
                        </div>
                        <span className="text-[12px] font-extralight text-gray-text-dark tracking-[-0.238px]">
                          {activeLabel}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="px-3 py-1.5 bg-brand-green rounded-[11px] text-white text-[12px] font-light leading-[145%] tracking-[-0.058px] hover:bg-brand-green/90 transition-colors">
                          Edit
                        </button>
                        <button className="px-3 py-1.5 bg-delete-red-bg rounded-[11px] text-white text-[12px] font-light leading-[145%] tracking-[-0.058px] hover:bg-delete-red-bg/80 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="border border-border-gray-light rounded-lg p-4 text-sm text-gray-text">
                Loading listings...
              </div>
            ) : error ? (
              <div className="border border-border-gray-light rounded-lg p-4 text-sm text-red-500">
                {error}
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="border border-border-gray-light rounded-lg p-4 text-sm text-gray-text">
                No listings found.
              </div>
            ) : filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="border border-border-gray-light rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-gray-text mb-1">
                      Listing ID
                    </div>
                    <div className="text-sm font-light text-gray-text-dark">
                      {formatID(listing.id)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${statusDotClass}`}>
                      <div className={`w-2 h-2 rounded-full ${statusInnerClass}`} />
                    </div>
                    <span className="text-xs font-light text-gray-text-dark">
                      {activeLabel}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-gray-text mb-1">Car Make</div>
                    <div className="text-sm font-light text-gray-text-dark">
                      {listing.carMake}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-text mb-1">
                      Car Model
                    </div>
                    <div className="text-sm font-light text-gray-text-dark">
                      {listing.carModel}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-text mb-1">Amount</div>
                    <div className="text-sm font-light text-gray-text-dark">
                      ₦{Number.isFinite(listing.amount) ? listing.amount.toLocaleString() : "0"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-text mb-1">Views</div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-gray-text" />
                      <span className="text-sm font-light text-gray-text-dark">
                        {listing.views}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-text mb-1">
                    Updated Date
                  </div>
                  <div className="text-sm font-light text-gray-text-dark">
                    {listing.updatedDate}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-3 py-2 bg-brand-green rounded-lg text-white text-sm font-light hover:bg-brand-green/90 transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-2 bg-delete-red-bg rounded-lg text-white text-sm font-light hover:bg-delete-red-bg/80 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-[#EAECF0]">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 border border-brand-green rounded-[6.778px] bg-white shadow-[0_0.847px_1.695px_0_rgba(16,24,40,0.05)] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.416 8.47263H3.53125M3.53125 8.47263L8.47361 13.415M3.53125 8.47263L8.47361 3.53027"
                stroke="#999999"
                strokeWidth="1.41493"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[12px] font-normal text-[#060606]">
              Previous
            </span>
          </button>

          <div className="flex items-center gap-0.5">
            {pageNumbers.map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-[34px] h-[34px] rounded-[6.778px] flex items-center justify-center text-[12px] transition-colors ${
                    page === currentPage
                      ? "bg-brand-green-light text-brand-green font-medium"
                      : "text-gray-text font-light hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={`ellipsis-${index}`} className="w-[34px] h-[34px] flex items-center justify-center text-[12px] text-gray-text">
                  {page}
                </span>
              )
            )}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-1.5 border border-brand-green rounded-[6.778px] bg-white shadow-[0_0.847px_1.695px_0_rgba(16,24,40,0.05)] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span className="text-[12px] font-normal text-[#060606]">
              Next
            </span>
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.53125 8.47263H13.416M13.416 8.47263L8.47361 3.53027M13.416 8.47263L8.47361 13.415"
                stroke="#999999"
                strokeWidth="1.41493"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
