import bannerImage from 'figma:asset/5c4b06c2389be43ced6cac1380c369b1114aab98.png';

interface PageTitleBannerProps {
  title: string;
  subtitle?: string;
  showCarImage?: boolean;
}

export function PageTitleBanner({ title, subtitle, showCarImage = false }: PageTitleBannerProps) {
  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 33px',
        position: 'relative',
        height: '380px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background Container */}
      <div
        style={{
          position: 'absolute',
          width: '1375px',
          height: '380px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#005C32',
          borderTopLeftRadius: '0px',
          borderTopRightRadius: '0px',
          borderBottomLeftRadius: '23.6462px',
          borderBottomRightRadius: '23.6462px',
          overflow: 'hidden',
        }}
      >
        {/* Decorative Blurred Circle */}
        <div
          style={{
            position: 'absolute',
            width: '396px',
            height: '396px',
            left: '-124px',
            top: '-38px',
            background: '#BC9C22',
            mixBlendMode: 'color-dodge',
            filter: 'blur(136.364px)',
          }}
        />

        {/* Car Image (optional) */}
        {showCarImage && (
          <img
            src={bannerImage}
            alt=""
            style={{
              position: 'absolute',
              width: '996px',
              height: '424.58px',
              right: '-222px',
              top: '50%',
              transform: 'translateY(-50%)',
              objectFit: 'contain',
            }}
          />
        )}
      </div>

      {/* Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '1375px',
          height: '380px',
          left: '0',
          top: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Text Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '17px',
            maxWidth: '800px',
            textAlign: 'center',
          }}
        >
          {/* Main Title */}
          <h1
            className="font-semibold text-[clamp(32px,5vw,64px)] leading-[1.2] text-white m-0"
          >
            {title}
          </h1>

          {/* Subtitle (optional) */}
          {subtitle && (
            <p
              className="font-normal text-[20px] leading-[25px] text-[#E2E8F9] m-0"
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}