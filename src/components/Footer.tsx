import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import brandLogo from 'figma:asset/8b04b977d8cbd6e0cf36a61ed07b88c9ffdd53d2.png';
import imgTopCar from 'figma:asset/595666db9426510b9577a240d9672a8e1c1ee882.png';
import imgBlurredCar from 'figma:asset/bf7ddc5c54286bf171b514671c5f7ac7b2bd1504.png';

export function Footer() {
  return (
    <footer style={{ background: '#005C32', position: 'relative', overflow: 'hidden' }} className="w-full">
      {/* Top Banner Section */}
      <div
        className="h-20 lg:h-[120px] w-full"
        style={{
          background: '#EBE1BD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div className="relative w-full max-w-[1440px] h-full flex items-center px-4 sm:px-8 lg:px-[68px]">
          <img
            src={imgTopCar}
            alt=""
            className="w-auto h-12 lg:h-20 object-contain ml-auto max-w-full"
          />
        </div>
      </div>

      {/* Main Footer Content - Mobile-First with Stacked Layout */}
      <div className="relative min-h-[452px] py-8 lg:py-0 w-full">
        {/* Blurred Car Background - Hidden on mobile */}
        <div
          className="hidden lg:block absolute w-[758px] h-[256px] left-[363px] top-[70px] pointer-events-none"
        >
          <img
            src={imgBlurredCar}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'blur(5px)',
              mixBlendMode: 'color-burn',
              transform: 'scaleX(-1)',
              opacity: 0.6,
            }}
          />
        </div>

        {/* Content Container - Responsive */}
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-0 h-full w-full">
          {/* Mobile & Tablet: Stacked Layout, Desktop: Absolute Positioned */}
          <div className="flex flex-col lg:block space-y-8 lg:space-y-0 w-full">
            {/* Logo and Description */}
            <div className="lg:absolute lg:left-[68px] lg:top-[101px] lg:w-[383px] flex flex-col gap-3 lg:gap-[13px] w-full">
              <div className="w-40 lg:w-48 h-auto">
                <img
                  src={brandLogo}
                  alt="Huce Autos"
                  className="w-full h-full object-contain"
                />
              </div>
              <p
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: '18px',
                  color: '#FFFFFF',
                  margin: 0,
                }}
              >
                Huce Autos is your trusted platform for buying, selling cars in Nigeria. We connect you to verified sellers and seamless solutions to meet all your automotive needs.
              </p>
            </div>

            {/* Footer Links - Stacked on mobile, side-by-side on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:absolute lg:left-[619px] lg:top-[96px] lg:flex lg:flex-row gap-8 sm:gap-6 lg:gap-[72px] w-full lg:w-auto">
              {/* Quick Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '100px' }}>
                <h4
                  style={{
                    fontFamily: 'Lexend',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '18px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Quick Links
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '18px', listStyle: 'none', padding: 0, margin: 0 }}>
                  {['Buy a Car', 'Sell a Car', 'News'].map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        style={{
                          fontFamily: 'Lexend',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '20px',
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                        className="hover:text-[#BC9C22] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '120px' }}>
                <h4
                  style={{
                    fontFamily: 'Lexend',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '18px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Company
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '18px', listStyle: 'none', padding: 0, margin: 0 }}>
                  {['About Us', 'Contact Us', 'Careers', 'How it Works', "FAQ's"].map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        style={{
                          fontFamily: 'Lexend',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '20px',
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                        className="hover:text-[#BC9C22] transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Get the app & Connect With Us */}
              <div className="lg:ml-[60px] flex flex-col gap-5">
                {/* Get the app */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '18px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Get the app
                  </h4>
                  <div className="flex gap-3">
                    {/* App Store Badge */}
                    <a
                      href="#"
                      className="flex items-center justify-center bg-[#060606] border border-[#A6A6A6] rounded-lg hover:opacity-80 transition-opacity"
                      style={{
                        width: '121.5px',
                        height: '40.5px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Lexend',
                          fontSize: '9px',
                          color: '#FFFFFF',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        App Store
                      </span>
                    </a>

                    {/* Google Play Badge */}
                    <a
                      href="#"
                      className="flex items-center justify-center bg-[#060606] border border-[#A6A6A6] rounded-lg hover:opacity-80 transition-opacity"
                      style={{
                        width: '136.69px',
                        height: '40.5px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Lexend',
                          fontSize: '9px',
                          color: '#FFFFFF',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Google Play
                      </span>
                    </a>
                  </div>
                </div>

                {/* Connect With Us */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4
                    style={{
                      fontFamily: 'Lexend',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '18px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Connect With Us
                  </h4>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="w-10 h-10 bg-[#060606] rounded-full flex items-center justify-center hover:bg-[#BC9C22] transition-colors"
                    >
                      <Facebook size={20} style={{ color: '#FFFFFF' }} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-[#060606] rounded-full flex items-center justify-center hover:bg-[#BC9C22] transition-colors"
                    >
                      <Twitter size={20} style={{ color: '#FFFFFF' }} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-[#060606] rounded-full flex items-center justify-center hover:bg-[#BC9C22] transition-colors"
                    >
                      <Instagram size={20} style={{ color: '#FFFFFF' }} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-[#060606] rounded-full flex items-center justify-center hover:bg-[#BC9C22] transition-colors"
                    >
                      <Linkedin size={20} style={{ color: '#FFFFFF' }} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section - Mobile-First */}
      <div
        className="border-t border-[#E2E8F9] min-h-14 lg:h-14 flex flex-col lg:flex-row items-center justify-between gap-4 px-4 sm:px-8 lg:px-16 py-4 lg:py-0"
      >
        <p
          style={{
            fontFamily: 'Lexend',
            fontWeight: 400,
            fontSize: '11.25px',
            lineHeight: '21px',
            color: '#FFFFFF',
            margin: 0,
          }}
        >
          © {new Date().getFullYear()} Huce Autos. All rights reserved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
          {[
            'Terms & Conditions',
            'Privacy Policy',
            'Refund Policy',
            'Verified Sellers Program',
          ].map((link, index) => (
            <div key={link} className="flex items-center gap-4 lg:gap-6">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  fontFamily: 'Lexend',
                  fontWeight: 400,
                  fontSize: '11.25px',
                  lineHeight: '21px',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
                className="hover:text-[#BC9C22] transition-colors"
              >
                {link}
              </a>
              {index < 3 && (
                <div
                  className="hidden lg:block w-[6.42px] h-[6.42px] bg-white rounded-full"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}