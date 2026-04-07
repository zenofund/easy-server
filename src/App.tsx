import { Navigation } from './components/Navigation';
import { HeroSection } from './components/sections/HeroSection';
import { BrowseByTypeSection } from './components/sections/BrowseByTypeSection';
import { CTASection } from './components/sections/CTASection';
import { ExploreVehiclesSection } from './components/sections/ExploreVehiclesSection';
import { FeaturesSection } from './components/sections/FeaturesSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { AppDownloadSection } from './components/sections/AppDownloadSection';
import { NewsSection } from './components/sections/NewsSection';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { useState, useEffect, Suspense, lazy } from 'react';
import { getDashboardUrl } from './utils/rbac';
import { toast } from 'sonner';

// Lazy load pages
const BuyACarPage = lazy(() => import('./components/pages/BuyACarPage').then(module => ({ default: module.BuyACarPage })));
const CompareCarsPage = lazy(() => import('./components/pages/CompareCarsPage').then(module => ({ default: module.CompareCarsPage })));
const CarDetailPage = lazy(() => import('./components/pages/CarDetailPage').then(module => ({ default: module.CarDetailPage })));
const CarSellersPage = lazy(() => import('./components/pages/CarSellersPage').then(module => ({ default: module.CarSellersPage })));
const SellACarPage = lazy(() => import('./components/pages/SellACarPage').then(module => ({ default: module.SellACarPage })));
const SellerDetailPage = lazy(() => import('./components/pages/SellerDetailPage').then(module => ({ default: module.SellerDetailPage })));
const SellerReviewsPage = lazy(() => import('./components/pages/SellerReviewsPage').then(module => ({ default: module.SellerReviewsPage })));
const SignInPage = lazy(() => import('./components/pages/SignInPage').then(module => ({ default: module.SignInPage })));
const SignUpPage = lazy(() => import('./components/pages/SignUpPage').then(module => ({ default: module.SignUpPage })));
const ForgotPasswordPage = lazy(() => import('./components/pages/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const BuyerDashboardPage = lazy(() => import('./components/pages/BuyerDashboardPage').then(module => ({ default: module.BuyerDashboardPage })));
const SellerDashboardPage = lazy(() => import('./components/pages/SellerDashboardPage').then(module => ({ default: module.SellerDashboardPage })));
const SellerVerificationPage = lazy(() => import('./components/pages/SellerVerificationPage').then(module => ({ default: module.SellerVerificationPage })));
const InspectorDashboardPage = lazy(() => import('./components/pages/InspectorDashboardPage').then(module => ({ default: module.InspectorDashboardPage })));
const PaystackCallback = lazy(() => import('./components/pages/PaystackCallback').then(module => ({ default: module.PaystackCallback })));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'buy' | 'compare' | 'car-detail' | 'car-sellers' | 'sell-your-car' | 'seller-detail' | 'seller-reviews' | 'sign-in' | 'sign-up' | 'forgot-password' | 'buyer-dashboard' | 'seller-dashboard' | 'seller-verification' | 'inspector-dashboard' | 'admin' | 'paystack-callback'>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth state on mount and handle initial routing
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      
    };

    initAuth();
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = hash.split('?')[0];

      // Map hash paths to page IDs
      const routeMap: Record<string, typeof currentPage> = {
        '#buy': 'buy',
        '#compare': 'compare',
        '#sellers': 'car-sellers',
        '#sell-your-car': 'sell-your-car',
        '#sign-in': 'sign-in',
        '#sign-up': 'sign-up',
        '#forgot-password': 'forgot-password',
        '#buyer-dashboard': 'buyer-dashboard',
        '#seller-dashboard': 'seller-dashboard',
        '#seller-verification': 'seller-verification',
        '#inspector-dashboard': 'inspector-dashboard',
        '#admin': 'admin',
        '#paystack-callback': 'paystack-callback',
        '#home': 'home',
        '': 'home',
        '#': 'home'
      };

      let newPage: typeof currentPage | null = routeMap[path];

      // Handle dynamic routes
      if (!newPage) {
        if (path.startsWith('#seller-detail')) newPage = 'seller-detail';
        else if (path.startsWith('#seller-reviews')) newPage = 'seller-reviews';
        else if (path.startsWith('#car-detail')) newPage = 'car-detail';
      }

      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      // Prevention logic: Redirect authenticated users away from sign-in/sign-up
      if ((newPage === 'sign-in' || newPage === 'sign-up') && token && userStr) {
        try {
          const user = JSON.parse(userStr);
          const dashboardUrl = getDashboardUrl(user.role);
          
          // Only show toast if we are actually redirecting from a direct navigation attempt
          // and not just because the app is initializing
          toast.info("You're already logged in! Redirecting to your dashboard...");
          
          setTimeout(() => {
             window.location.hash = dashboardUrl;
           }, 500);
          return; // Stop further processing for this hash change
        } catch (e) {
          console.error('Error in auth redirection:', e);
        }
      }

      // Protection logic: Redirect unauthenticated users or wrong dashboard roles
      const dashboardPages: (typeof currentPage)[] = ['buyer-dashboard', 'seller-dashboard', 'seller-verification', 'inspector-dashboard', 'admin'];

      if (newPage && dashboardPages.includes(newPage)) {
        if (!token) {
          // Unauthenticated: Redirect to home
          window.location.hash = '#home';
          return;
        }

        // Authenticated: Ensure correct dashboard for role
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            const correctDashboardUrl = getDashboardUrl(user.role);
            const correctDashboard = correctDashboardUrl.replace('#', '') as typeof currentPage;
            
            // Check identity status for Sellers
            if (user.role === 'SELLER') {
              const identityStatus = user.sellerProfile?.identityStatus || 'UNVERIFIED';
              if (identityStatus === 'UNVERIFIED' || identityStatus === 'REJECTED') {
                if (newPage !== 'seller-verification') {
                  window.location.hash = '#seller-verification';
                  return;
                }
              } else if (identityStatus === 'PENDING') {
                 // Pending sellers can still go to the dashboard to see the banner, or they can view verification page
                 if (newPage !== 'seller-verification' && newPage !== 'seller-dashboard') {
                    window.location.hash = '#seller-dashboard';
                    return;
                 }
              } else {
                 // Approved sellers should not go back to verification page
                 if (newPage === 'seller-verification') {
                   window.location.hash = '#seller-dashboard';
                   return;
                 }
              }
            }

            if (newPage !== correctDashboard && newPage !== 'seller-verification') {
              window.location.hash = correctDashboardUrl;
              return;
            }
          } catch (e) {
            console.error('Error checking dashboard access:', e);
          }
        }
      }

      if (newPage) {
        // Use a functional update to avoid stale closure issues or check against latest state
        setCurrentPage(current => {
          if (newPage !== current) {
            setIsTransitioning(true);
            setIsTransitioning(false);
            window.scrollTo({ top: 0, behavior: 'instant' });
            return newPage!;
          }
          return current;
        });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); // We keep it empty but use functional update for setCurrentPage

  return (
    <div className="min-h-screen bg-white w-full max-w-[100vw] overflow-x-hidden">
      {/* Show regular navigation on all pages except super admin */}
      {currentPage !== 'admin' && <Navigation isDashboard={isAuthenticated || currentPage === 'buyer-dashboard' || currentPage === 'seller-dashboard' || currentPage === 'inspector-dashboard' || currentPage === 'seller-verification'} currentPage={currentPage} />}
      <main className="w-full max-w-[100vw]">
        <Suspense fallback={null}>
          {/* Hero Section Area - Smooth vertical transition */}
        <div className="relative w-full">
          {/* Home Page - Hero Section */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'home'
                ? 'translate-y-0 opacity-100 relative z-10'
                : '-translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            <HeroSection />
          </div>

          {/* Buy A Car Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'buy'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            <BuyACarPage />
          </div>

          {/* Compare Cars Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'compare'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            <CompareCarsPage />
          </div>

          {/* Car Detail Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'car-detail'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            <CarDetailPage />
          </div>

          {/* Sell A Car Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'car-sellers'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            <CarSellersPage />
          </div>

          {/* Sell Your Car Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'sell-your-car'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            <SellACarPage />
          </div>

          {/* Seller Detail Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'seller-detail'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            <SellerDetailPage />
          </div>

          {/* Seller Reviews Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'seller-reviews'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            <SellerReviewsPage />
          </div>

          {/* Sign In Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'sign-in'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            <SignInPage />
          </div>

          {/* Sign Up Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'sign-up'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
          <SignUpPage key={currentPage === 'sign-up' ? window.location.hash : 'sign-up'} />
        </div>

        {/* Forgot Password Page - Slides up gracefully */}
        <div
          className={`transition-all duration-500 ease-in-out w-full ${
            currentPage === 'forgot-password'
              ? 'translate-y-0 opacity-100 relative z-10'
              : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
          }`}
        >
          <ForgotPasswordPage />
        </div>

          {/* Buyer Dashboard Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'buyer-dashboard'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            {currentPage === 'buyer-dashboard' && <BuyerDashboardPage />}
          </div>

          {/* Seller Dashboard Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'seller-dashboard'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            {currentPage === 'seller-dashboard' && <SellerDashboardPage />}
          </div>

          {/* Seller Verification Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'seller-verification'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            {currentPage === 'seller-verification' && <SellerVerificationPage />}
          </div>

          {/* Inspector Dashboard Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'inspector-dashboard'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            {currentPage === 'inspector-dashboard' && <InspectorDashboardPage />}
          </div>

          {/* Paystack Callback Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'paystack-callback'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            {currentPage === 'paystack-callback' && <PaystackCallback />}
          </div>

          {/* Admin Page - Slides up gracefully */}
          <div
            className={`transition-all duration-500 ease-in-out w-full ${
              currentPage === 'admin'
                ? 'translate-y-0 opacity-100 relative z-10'
                : 'translate-y-8 opacity-0 fixed top-0 left-0 right-0 pointer-events-none z-0'
            }`}
          >
            {currentPage === 'admin' && <AdminLayout />}
          </div>
        </div>
        </Suspense>

        {/* Home Page Sections - Only show on home */}
        <div
          className={`transition-all duration-500 ease-in-out w-full ${
            currentPage === 'home'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 h-0 overflow-hidden pointer-events-none'
          }`}
        >
          <BrowseByTypeSection />
          <CTASection />
          <ExploreVehiclesSection />
          <FeaturesSection />
          <TestimonialsSection />
        </div>

        {/* Testimonials Section - Show on Sell Your Car page */}
        <div
          className={`transition-all duration-500 ease-in-out w-full ${
            currentPage === 'sell-your-car'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-4 h-0 overflow-hidden pointer-events-none'
          }`}
        >
          <TestimonialsSection />
        </div>

        {/* Shared sections that always show */}
        <div
          className={`transition-all duration-500 ease-in-out w-full ${
            currentPage === 'buyer-dashboard' || currentPage === 'seller-dashboard' || currentPage === 'seller-verification' || currentPage === 'inspector-dashboard' || currentPage === 'admin' || currentPage === 'paystack-callback'
              ? 'opacity-0 -translate-y-4 h-0 overflow-hidden pointer-events-none'
              : 'opacity-100 translate-y-0'
          }`}
        >
          <AppDownloadSection />
          <NewsSection />
        </div>
      </main>
      <div
        className={`transition-all duration-500 ease-in-out w-full ${
          currentPage === 'buyer-dashboard' || currentPage === 'seller-dashboard' || currentPage === 'seller-verification' || currentPage === 'inspector-dashboard' || currentPage === 'admin' || currentPage === 'paystack-callback'
            ? 'opacity-0 -translate-y-4 h-0 overflow-hidden pointer-events-none'
            : 'opacity-100 translate-y-0'
        }`}
      >
        <Footer />
      </div>
      <ScrollToTop />
    </div>
  );
}
