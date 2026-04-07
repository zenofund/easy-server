import svgPaths from "./svg-jvu1sq6dhn";
import imgCar8660X440Jpg from "figma:asset/7d04d8482ecc7166fa58d6525d6532ae0b2bd2ae.png";
import imgMedracknewlogo3 from "figma:asset/33fdad934e5e2e869921ffdcb711b343ad08d8b9.png";
import img3Huce1 from "figma:asset/7c207ade046d0da27fce32efb7319d641dddfec9.png";

function ItemLink() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[91.81px]" data-name="Item → Link">
      <div className="flex flex-col font-['Lexend:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#060606] text-[16px] text-nowrap">
        <p className="leading-[29.6px] whitespace-pre">Recent Cars</p>
      </div>
      <div className="bg-[#005c32] h-[2px] shrink-0 w-full" data-name="Horizontal Divider" />
    </div>
  );
}

function Frame15() {
  return (
    <div className="absolute content-stretch flex gap-[27px] items-start left-0 top-[-1px]">
      <ItemLink />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[16px] text-nowrap">
        <p className="leading-[29.6px] whitespace-pre">Featured Cars</p>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[16px] text-nowrap">
        <p className="leading-[29.6px] whitespace-pre">Popular Cars</p>
      </div>
    </div>
  );
}

function Tablist() {
  return (
    <div className="absolute border-[#e9e9e9] border-[0px_0px_1px] border-solid h-[40.89px] left-0 right-[260px] top-[-0.3px]" data-name="Tablist">
      <Frame15 />
    </div>
  );
}

function Car8660X440Jpg() {
  return (
    <div className="absolute h-[196.23px] left-0 overflow-clip top-1/2 translate-y-[-50%] w-[294.35px]" data-name="car8-660x440.jpg">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgCar8660X440Jpg} />
      <div className="absolute capitalize flex flex-col font-['Lexend:Light',sans-serif] font-light justify-center leading-[32.225px] left-[148.22px] text-[17.419px] text-center text-nowrap top-[130.83px] translate-x-[-50%] translate-y-[-50%] whitespace-pre">
        <p className="mb-0">Posted On Huce Autos</p>
        <p>by God’s Autos</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute h-[196.23px] left-0 right-0 top-0" data-name="Link">
      <Car8660X440Jpg />
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute bg-[#005c32] content-stretch flex items-center justify-center left-[17.98px] px-[12.583px] py-0 rounded-[26.963px] top-[20.71px]" data-name="Link">
      <div className="capitalize flex flex-col font-['Lexend:Light',sans-serif] font-light justify-center leading-[0] relative shrink-0 text-[12.583px] text-nowrap text-white">
        <p className="leading-[23.278px] whitespace-pre">Great Price</p>
      </div>
    </div>
  );
}

function VuesaxBoldHeart() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/heart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="heart">
          <path d={svgPaths.p32c68c80} fill="var(--fill-0, #005C32)" id="Vector" />
          <g id="Vector_2" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function Like() {
  return (
    <div className="absolute left-[calc(50%-0.45px)] size-[16.178px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Like">
      <VuesaxBoldHeart />
    </div>
  );
}

function Background() {
  return (
    <div className="absolute bg-white left-0 rounded-[16.178px] size-[32.356px] top-1/2 translate-y-[-50%]" data-name="Background">
      <Like />
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute left-[244.02px] size-[32.356px] top-[17.98px]" data-name="Link">
      <Background />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[196.23px] left-0 overflow-clip right-0 top-0" data-name="Container">
      <Link />
      <Link1 />
      <Link2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.595px] items-start leading-[0] left-[12.58px] top-[10.85px]">
      <div className="flex flex-col font-['Lexend:Medium',sans-serif] font-medium justify-center min-w-full relative shrink-0 text-[#060606] text-[16.178px] w-[min-content]">
        <p className="leading-[19.414px]">{`Toyota Camry `}</p>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#999999] text-[10.785px] w-[263.342px]">
        <p className="leading-[normal]">3.5 D5 PowerPulse Momentum 5dr AW Geartronic Estate</p>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[10.785px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="SVG">
          <path d={svgPaths.p1c3649f2} fill="var(--fill-0, #005C32)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[17.077px] items-center relative shrink-0">
      <div className="flex flex-col font-['Lexend:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#005c32] text-[10.785px] text-nowrap">
        <p className="leading-[24.941px] whitespace-pre">View Details</p>
      </div>
      <Svg />
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[calc(50%+2.02px)] px-0 py-[8.988px] top-[137.58px] translate-x-[-50%] w-[271.431px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e2e8f9] border-[0.899px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Lexend:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#050b20] text-[17.976px] text-nowrap">
        <p className="leading-[26.963px] whitespace-pre">N40,000</p>
      </div>
      <Frame14 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_1_1909)" id="Icon">
          <path d={svgPaths.p3515fc00} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_1909">
            <rect fill="white" height="14.3804" width="14.3804" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">20 Miles</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_1_2003)" id="Icon">
          <path d={svgPaths.p67c8900} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_2003">
            <rect fill="white" height="14.3804" width="14.3804" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon1 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Petrol</p>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Icon">
          <path d={svgPaths.p529fb80} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon2 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">CVT</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[12.583px] items-center relative shrink-0">
      <Frame5 />
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame6 />
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame7 />
    </div>
  );
}

function Location3() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="location-06">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="location-06">
          <path d={svgPaths.pf42400} id="Vector" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p20449900} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <Location3 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Abuja</p>
      </div>
    </div>
  );
}

function Car5() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="car-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="car-01">
          <path d={svgPaths.p2d72fe80} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p10540e00} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p13941400} id="Vector_3" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p399c6a40} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p36216c00} id="Vector_5" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1408a800} id="Vector_6" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1b099f80} id="Vector_7" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1058c200} id="Vector_8" stroke="var(--stroke-0, #999999)" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p237add00} id="Vector_9" stroke="var(--stroke-0, #999999)" strokeLinejoin="round" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <Car5 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Used</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[12.583px] items-center relative shrink-0">
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame20 />
    </div>
  );
}

function PaintBoard() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="paint-board">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="paint-board">
          <path d={svgPaths.p21374780} id="Vector" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.pa6f8700} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.19837" />
          <path d={svgPaths.p21e38280} id="Vector_3" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p1ea26e00} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <PaintBoard />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Red</p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-center relative shrink-0 w-[72.801px]">
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame21 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[16.178px] items-center relative shrink-0">
      <Frame11 />
      <Frame12 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[26.065px] items-center relative shrink-0">
      <Frame16 />
      <Frame13 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8.988px] items-start left-[0.9px] top-[4.49px]">
      <Frame8 />
      <Frame9 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="absolute border-[#e2e8f9] border-[0.899px_0px_0px] border-solid h-[53.927px] left-[12.58px] overflow-clip top-[70.17px] w-[271.431px]">
      <Frame10 />
    </div>
  );
}

function Border() {
  return (
    <div className="absolute border-[#e9e9e9] border-[0px_0.899px_0.899px] border-solid h-[192.77px] left-0 right-0 rounded-bl-[14.38px] rounded-br-[14.38px] top-[196.23px]" data-name="Border">
      <Frame4 />
      <HorizontalBorder />
      <Frame22 />
    </div>
  );
}

function Article() {
  return (
    <div className="bg-white h-[389px] overflow-clip relative rounded-[14.38px] shrink-0 w-[294.35px]" data-name="Article">
      <Container />
      <Border />
    </div>
  );
}

function Car8660X440Jpg1() {
  return (
    <div className="absolute h-[196.23px] left-0 overflow-clip top-1/2 translate-y-[-50%] w-[294.35px]" data-name="car8-660x440.jpg">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgCar8660X440Jpg} />
      <div className="absolute capitalize flex flex-col font-['Lexend:Light',sans-serif] font-light justify-center leading-[32.225px] left-[148.23px] text-[17.419px] text-center text-nowrap top-[130.83px] translate-x-[-50%] translate-y-[-50%] whitespace-pre">
        <p className="mb-0">Posted On Huce Autos</p>
        <p>by God’s Autos</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute h-[196.23px] left-0 right-0 top-0" data-name="Link">
      <Car8660X440Jpg1 />
    </div>
  );
}

function VuesaxLinearHeart() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/heart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="heart">
          <path d={svgPaths.p37792370} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.34817" />
          <g id="Vector_2" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function Like1() {
  return (
    <div className="absolute bg-white left-[calc(50%-0.45px)] size-[16.178px] top-[calc(50%+0.36px)] translate-x-[-50%] translate-y-[-50%]" data-name="Like">
      <VuesaxLinearHeart />
    </div>
  );
}

function Background1() {
  return (
    <div className="absolute bg-white left-0 rounded-[16.178px] size-[32.356px] top-1/2 translate-y-[-50%]" data-name="Background">
      <Like1 />
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute left-[244.02px] size-[32.356px] top-[17.98px]" data-name="Link">
      <Background1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[196.23px] left-0 overflow-clip right-0 top-0" data-name="Container">
      <Link3 />
      <Link4 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.595px] items-start leading-[0] left-[12.58px] top-[10.85px]">
      <div className="flex flex-col font-['Lexend:Medium',sans-serif] font-medium justify-center min-w-full relative shrink-0 text-[#060606] text-[16.178px] w-[min-content]">
        <p className="leading-[19.414px]">{`Toyota Camry `}</p>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#999999] text-[10.785px] w-[263.342px]">
        <p className="leading-[normal]">3.5 D5 PowerPulse Momentum 5dr AW Geartronic Estate</p>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[10.785px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="SVG">
          <path d={svgPaths.p1a094f80} fill="var(--fill-0, #005C32)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[17.077px] items-center relative shrink-0">
      <div className="flex flex-col font-['Lexend:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#005c32] text-[10.785px] text-nowrap">
        <p className="leading-[24.941px] whitespace-pre">View Details</p>
      </div>
      <Svg1 />
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[calc(50%+2.02px)] px-0 py-[8.988px] top-[137.58px] translate-x-[-50%] w-[271.431px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e2e8f9] border-[0.899px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Lexend:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#050b20] text-[17.976px] text-nowrap">
        <p className="leading-[26.963px] whitespace-pre">N40,000</p>
      </div>
      <Frame24 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_1_1948)" id="Icon">
          <path d={svgPaths.p388cfd00} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_1948">
            <rect fill="white" height="14.3804" width="14.3804" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon3 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">20 Miles</p>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_1_1920)" id="Icon">
          <path d={svgPaths.p1f0033f0} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_1920">
            <rect fill="white" height="14.3804" width="14.3804" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon4 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Petrol</p>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Icon">
          <path d={svgPaths.p2f0b1400} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon5 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">CVT</p>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[12.583px] items-center relative shrink-0">
      <Frame25 />
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame26 />
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame27 />
    </div>
  );
}

function Location() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="location-06">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="location-06">
          <path d={svgPaths.p19f01e80} id="Vector" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p32be9100} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <Location />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Abuja</p>
      </div>
    </div>
  );
}

function Car() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="car-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="car-01">
          <path d={svgPaths.p2b4c730} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p25523020} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p3dc16700} id="Vector_3" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p32c13480} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.pd047200} id="Vector_5" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p35cc1700} id="Vector_6" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1e4cc00} id="Vector_7" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1c404200} id="Vector_8" stroke="var(--stroke-0, #999999)" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1b3f1500} id="Vector_9" stroke="var(--stroke-0, #999999)" strokeLinejoin="round" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <Car />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Used</p>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[12.583px] items-center relative shrink-0">
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame30 />
    </div>
  );
}

function PaintBoard1() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="paint-board">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="paint-board">
          <path d={svgPaths.p1cd97900} id="Vector" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p67c7e00} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.19837" />
          <path d={svgPaths.p1ce33280} id="Vector_3" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p3d1db700} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <PaintBoard1 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Red</p>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-center relative shrink-0 w-[72.801px]">
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame32 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex gap-[16.178px] items-center relative shrink-0">
      <Frame31 />
      <Frame33 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex gap-[26.065px] items-center relative shrink-0">
      <Frame29 />
      <Frame34 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8.988px] items-start left-[0.9px] top-[4.49px]">
      <Frame28 />
      <Frame35 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="absolute border-[#e2e8f9] border-[0.899px_0px_0px] border-solid h-[53.927px] left-[12.58px] overflow-clip top-[70.17px] w-[271.431px]">
      <Frame36 />
    </div>
  );
}

function Border1() {
  return (
    <div className="absolute border-[#e9e9e9] border-[0px_0.899px_0.899px] border-solid h-[192.77px] left-0 right-0 rounded-bl-[14.38px] rounded-br-[14.38px] top-[196.23px]" data-name="Border">
      <Frame23 />
      <HorizontalBorder1 />
      <Frame37 />
    </div>
  );
}

function Article1() {
  return (
    <div className="bg-white h-[389px] overflow-clip relative rounded-[14.38px] shrink-0 w-[294.35px]" data-name="Article">
      <Container1 />
      <Border1 />
    </div>
  );
}

function Car8660X440Jpg2() {
  return (
    <div className="absolute h-[196.23px] left-0 overflow-clip top-1/2 translate-y-[-50%] w-[294.35px]" data-name="car8-660x440.jpg">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgCar8660X440Jpg} />
      <div className="absolute capitalize flex flex-col font-['Lexend:Light',sans-serif] font-light justify-center leading-[32.225px] left-[148.22px] text-[17.419px] text-center text-nowrap top-[130.83px] translate-x-[-50%] translate-y-[-50%] whitespace-pre">
        <p className="mb-0">Posted On Huce Autos</p>
        <p>by God’s Autos</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute h-[196.23px] left-0 right-0 top-0" data-name="Link">
      <Car8660X440Jpg2 />
    </div>
  );
}

function VuesaxLinearHeart1() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/heart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="heart">
          <path d={svgPaths.p37792370} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.34817" />
          <g id="Vector_2" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function Like2() {
  return (
    <div className="absolute bg-white left-[calc(50%-0.45px)] size-[16.178px] top-[calc(50%+0.36px)] translate-x-[-50%] translate-y-[-50%]" data-name="Like">
      <VuesaxLinearHeart1 />
    </div>
  );
}

function Background2() {
  return (
    <div className="absolute bg-white left-0 rounded-[16.178px] size-[32.356px] top-1/2 translate-y-[-50%]" data-name="Background">
      <Like2 />
    </div>
  );
}

function Link6() {
  return (
    <div className="absolute left-[244.02px] size-[32.356px] top-[17.98px]" data-name="Link">
      <Background2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[196.23px] left-0 overflow-clip right-0 top-0" data-name="Container">
      <Link5 />
      <Link6 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.595px] items-start leading-[0] left-[12.58px] top-[10.85px]">
      <div className="flex flex-col font-['Lexend:Medium',sans-serif] font-medium justify-center min-w-full relative shrink-0 text-[#060606] text-[16.178px] w-[min-content]">
        <p className="leading-[19.414px]">{`Toyota Camry `}</p>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#999999] text-[10.785px] w-[263.342px]">
        <p className="leading-[normal]">3.5 D5 PowerPulse Momentum 5dr AW Geartronic Estate</p>
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[10.785px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="SVG">
          <path d={svgPaths.p29673700} fill="var(--fill-0, #005C32)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex gap-[17.077px] items-center relative shrink-0">
      <div className="flex flex-col font-['Lexend:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#005c32] text-[10.785px] text-nowrap">
        <p className="leading-[24.941px] whitespace-pre">View Details</p>
      </div>
      <Svg2 />
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[calc(50%+2.02px)] px-0 py-[8.988px] top-[137.58px] translate-x-[-50%] w-[271.431px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e2e8f9] border-[0.899px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Lexend:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#050b20] text-[17.976px] text-nowrap">
        <p className="leading-[26.963px] whitespace-pre">N40,000</p>
      </div>
      <Frame39 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_1_1929)" id="Icon">
          <path d={svgPaths.p3d741500} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_1929">
            <rect fill="white" height="14.3804" width="14.3804" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon6 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">20 Miles</p>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_1_1915)" id="Icon">
          <path d={svgPaths.p1dd2a980} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_1915">
            <rect fill="white" height="14.3804" width="14.3804" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon7 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Petrol</p>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Icon">
          <path d={svgPaths.p39e97cf0} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon8 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">CVT</p>
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex gap-[12.583px] items-center relative shrink-0">
      <Frame40 />
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame41 />
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame42 />
    </div>
  );
}

function Location1() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="location-06">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="location-06">
          <path d={svgPaths.p324c5980} id="Vector" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p10c5e00} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <Location1 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Abuja</p>
      </div>
    </div>
  );
}

function Car1() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="car-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="car-01">
          <path d={svgPaths.p7313100} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p11e68840} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p3a3b3f80} id="Vector_3" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.pd36a600} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p51a8000} id="Vector_5" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p3d383a60} id="Vector_6" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1334cf00} id="Vector_7" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1aaddc00} id="Vector_8" stroke="var(--stroke-0, #999999)" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.ped05470} id="Vector_9" stroke="var(--stroke-0, #999999)" strokeLinejoin="round" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <Car1 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Used</p>
      </div>
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex gap-[12.583px] items-center relative shrink-0">
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame45 />
    </div>
  );
}

function PaintBoard2() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="paint-board">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="paint-board">
          <path d={svgPaths.p26391cf0} id="Vector" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p287fba80} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.19837" />
          <path d={svgPaths.p26f9cd80} id="Vector_3" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p27e49900} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <PaintBoard2 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Red</p>
      </div>
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-center relative shrink-0 w-[72.801px]">
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame47 />
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex gap-[16.178px] items-center relative shrink-0">
      <Frame46 />
      <Frame48 />
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex gap-[26.065px] items-center relative shrink-0">
      <Frame44 />
      <Frame49 />
    </div>
  );
}

function Frame51() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8.988px] items-start left-[0.9px] top-[4.49px]">
      <Frame43 />
      <Frame50 />
    </div>
  );
}

function Frame52() {
  return (
    <div className="absolute border-[#e2e8f9] border-[0.899px_0px_0px] border-solid h-[53.927px] left-[12.58px] overflow-clip top-[70.17px] w-[271.431px]">
      <Frame51 />
    </div>
  );
}

function Border2() {
  return (
    <div className="absolute border-[#e9e9e9] border-[0px_0.899px_0.899px] border-solid h-[192.77px] left-0 right-0 rounded-bl-[14.38px] rounded-br-[14.38px] top-[196.23px]" data-name="Border">
      <Frame38 />
      <HorizontalBorder2 />
      <Frame52 />
    </div>
  );
}

function Article2() {
  return (
    <div className="bg-white h-[389px] overflow-clip relative rounded-[14.38px] shrink-0 w-[294.35px]" data-name="Article">
      <Container2 />
      <Border2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#b3cec2] content-stretch flex items-center justify-center px-[8.259px] py-[6.035px] relative rounded-[8px] shrink-0">
      <p className="font-['Lexend:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#005c32] text-[14.981px] text-nowrap whitespace-pre">Get Started</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[19px] items-start justify-center left-[19.31px] top-[87px] w-[261.604px]">
      <p className="font-['Lexend:SemiBold',sans-serif] font-semibold leading-[0.91] min-w-full relative shrink-0 text-[32.086px] text-white w-[min-content]">Find Your Perfect Car, Hassle-Free.</p>
      <Frame />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#bc9c22] h-[389px] overflow-clip relative rounded-[14px] shrink-0 w-[294px]">
      <Frame1 />
      <div className="absolute left-[73.31px] size-[585.666px] top-[218px]" data-name="Circle - 03">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 586 586">
          <circle cx="292.833" cy="292.833" id="Circle - 03" r="210.012" stroke="var(--stroke-0, #E2E8F9)" strokeOpacity="0.2" strokeWidth="165.643" />
        </svg>
      </div>
      <div className="absolute h-[39px] left-[19.31px] top-[23px] w-[143.749px]" data-name="medracknewlogo3">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[368.59%] left-[-11.45%] max-w-none top-[-115.04%] w-full" src={imgMedracknewlogo3} />
        </div>
      </div>
      <div className="absolute flex h-[185.22px] items-center justify-center left-[calc(50%-122.84px)] top-[calc(50%+111.89px)] translate-x-[-50%] translate-y-[-50%] w-[548.425px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[185.22px] relative w-[548.425px]" data-name="3 Huce 1">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={img3Huce1} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[41px] items-center relative shrink-0">
      <Article />
      <Article1 />
      <Article2 />
      <Frame2 />
    </div>
  );
}

function Car8660X440Jpg3() {
  return (
    <div className="absolute h-[196.23px] left-0 overflow-clip top-1/2 translate-y-[-50%] w-[294.35px]" data-name="car8-660x440.jpg">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgCar8660X440Jpg} />
      <div className="absolute capitalize flex flex-col font-['Lexend:Light',sans-serif] font-light justify-center leading-[32.225px] left-[148.23px] text-[17.419px] text-center text-nowrap top-[130.83px] translate-x-[-50%] translate-y-[-50%] whitespace-pre">
        <p className="mb-0">Posted On Huce Autos</p>
        <p>by God’s Autos</p>
      </div>
    </div>
  );
}

function Link7() {
  return (
    <div className="absolute h-[196.23px] left-0 right-0 top-0" data-name="Link">
      <Car8660X440Jpg3 />
    </div>
  );
}

function VuesaxLinearHeart2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/heart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="heart">
          <path d={svgPaths.p37792370} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.34817" />
          <g id="Vector_2" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function Like3() {
  return (
    <div className="absolute bg-white left-[calc(50%-0.45px)] size-[16.178px] top-[calc(50%+0.36px)] translate-x-[-50%] translate-y-[-50%]" data-name="Like">
      <VuesaxLinearHeart2 />
    </div>
  );
}

function Background3() {
  return (
    <div className="absolute bg-white left-0 rounded-[16.178px] size-[32.356px] top-1/2 translate-y-[-50%]" data-name="Background">
      <Like3 />
    </div>
  );
}

function Link8() {
  return (
    <div className="absolute left-[244.02px] size-[32.356px] top-[17.98px]" data-name="Link">
      <Background3 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[196.23px] left-0 overflow-clip right-0 top-0" data-name="Container">
      <Link7 />
      <Link8 />
    </div>
  );
}

function Frame53() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.595px] items-start leading-[0] left-[12.58px] top-[10.85px]">
      <div className="flex flex-col font-['Lexend:Medium',sans-serif] font-medium justify-center min-w-full relative shrink-0 text-[#060606] text-[16.178px] w-[min-content]">
        <p className="leading-[19.414px]">{`Toyota Camry `}</p>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#999999] text-[10.785px] w-[263.342px]">
        <p className="leading-[normal]">3.5 D5 PowerPulse Momentum 5dr AW Geartronic Estate</p>
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[10.785px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="SVG">
          <path d={svgPaths.p1a094f80} fill="var(--fill-0, #005C32)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex gap-[17.077px] items-center relative shrink-0">
      <div className="flex flex-col font-['Lexend:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#005c32] text-[10.785px] text-nowrap">
        <p className="leading-[24.941px] whitespace-pre">View Details</p>
      </div>
      <Svg3 />
    </div>
  );
}

function HorizontalBorder3() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[calc(50%+2.02px)] px-0 py-[8.988px] top-[137.58px] translate-x-[-50%] w-[271.431px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e2e8f9] border-[0.899px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Lexend:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#050b20] text-[17.976px] text-nowrap">
        <p className="leading-[26.963px] whitespace-pre">N40,000</p>
      </div>
      <Frame54 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_1_1948)" id="Icon">
          <path d={svgPaths.p388cfd00} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_1948">
            <rect fill="white" height="14.3804" width="14.3804" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon9 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">20 Miles</p>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_1_1920)" id="Icon">
          <path d={svgPaths.p1f0033f0} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_1920">
            <rect fill="white" height="14.3804" width="14.3804" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame56() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon10 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Petrol</p>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Icon">
          <path d={svgPaths.p2f0b1400} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon11 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">CVT</p>
      </div>
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex gap-[12.583px] items-center relative shrink-0">
      <Frame55 />
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame56 />
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame57 />
    </div>
  );
}

function Location2() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="location-06">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="location-06">
          <path d={svgPaths.p19f01e80} id="Vector" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p32be9100} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <Location2 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Abuja</p>
      </div>
    </div>
  );
}

function Car2() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="car-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="car-01">
          <path d={svgPaths.p2b4c730} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p25523020} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p3dc16700} id="Vector_3" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p32c13480} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.pd047200} id="Vector_5" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p35cc1700} id="Vector_6" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1e4cc00} id="Vector_7" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1c404200} id="Vector_8" stroke="var(--stroke-0, #999999)" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1b3f1500} id="Vector_9" stroke="var(--stroke-0, #999999)" strokeLinejoin="round" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <Car2 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Used</p>
      </div>
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex gap-[12.583px] items-center relative shrink-0">
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame60 />
    </div>
  );
}

function PaintBoard3() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="paint-board">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="paint-board">
          <path d={svgPaths.p1cd97900} id="Vector" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p67c7e00} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.19837" />
          <path d={svgPaths.p1ce33280} id="Vector_3" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p3d1db700} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <PaintBoard3 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Red</p>
      </div>
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-center relative shrink-0 w-[72.801px]">
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame62 />
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex gap-[16.178px] items-center relative shrink-0">
      <Frame61 />
      <Frame63 />
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex gap-[26.065px] items-center relative shrink-0">
      <Frame59 />
      <Frame64 />
    </div>
  );
}

function Frame66() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8.988px] items-start left-[0.9px] top-[4.49px]">
      <Frame58 />
      <Frame65 />
    </div>
  );
}

function Frame67() {
  return (
    <div className="absolute border-[#e2e8f9] border-[0.899px_0px_0px] border-solid h-[53.927px] left-[12.58px] overflow-clip top-[70.17px] w-[271.431px]">
      <Frame66 />
    </div>
  );
}

function Border3() {
  return (
    <div className="absolute border-[#e9e9e9] border-[0px_0.899px_0.899px] border-solid h-[192.77px] left-0 right-0 rounded-bl-[14.38px] rounded-br-[14.38px] top-[196.23px]" data-name="Border">
      <Frame53 />
      <HorizontalBorder3 />
      <Frame67 />
    </div>
  );
}

function Article3() {
  return (
    <div className="bg-white h-[389px] overflow-clip relative rounded-[14.38px] shrink-0 w-[294.35px]" data-name="Article">
      <Container3 />
      <Border3 />
    </div>
  );
}

function Car8660X440Jpg4() {
  return (
    <div className="absolute h-[196.23px] left-0 overflow-clip top-1/2 translate-y-[-50%] w-[294.35px]" data-name="car8-660x440.jpg">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgCar8660X440Jpg} />
      <div className="absolute capitalize flex flex-col font-['Lexend:Light',sans-serif] font-light justify-center leading-[32.225px] left-[148.22px] text-[17.419px] text-center text-nowrap top-[130.83px] translate-x-[-50%] translate-y-[-50%] whitespace-pre">
        <p className="mb-0">Posted On Huce Autos</p>
        <p>by God’s Autos</p>
      </div>
    </div>
  );
}

function Link9() {
  return (
    <div className="absolute h-[196.23px] left-0 right-0 top-0" data-name="Link">
      <Car8660X440Jpg4 />
    </div>
  );
}

function VuesaxLinearHeart3() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/heart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="heart">
          <path d={svgPaths.p37792370} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.34817" />
          <g id="Vector_2" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function Like4() {
  return (
    <div className="absolute bg-white left-[calc(50%-0.45px)] size-[16.178px] top-[calc(50%+0.36px)] translate-x-[-50%] translate-y-[-50%]" data-name="Like">
      <VuesaxLinearHeart3 />
    </div>
  );
}

function Background4() {
  return (
    <div className="absolute bg-white left-0 rounded-[16.178px] size-[32.356px] top-1/2 translate-y-[-50%]" data-name="Background">
      <Like4 />
    </div>
  );
}

function Link10() {
  return (
    <div className="absolute left-[244.02px] size-[32.356px] top-[17.98px]" data-name="Link">
      <Background4 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute h-[196.23px] left-0 overflow-clip right-0 top-0" data-name="Container">
      <Link9 />
      <Link10 />
    </div>
  );
}

function Frame68() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.595px] items-start leading-[0] left-[12.58px] top-[10.85px]">
      <div className="flex flex-col font-['Lexend:Medium',sans-serif] font-medium justify-center min-w-full relative shrink-0 text-[#060606] text-[16.178px] w-[min-content]">
        <p className="leading-[19.414px]">{`Toyota Camry `}</p>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#999999] text-[10.785px] w-[263.342px]">
        <p className="leading-[normal]">3.5 D5 PowerPulse Momentum 5dr AW Geartronic Estate</p>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-[10.785px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="SVG">
          <path d={svgPaths.p29673700} fill="var(--fill-0, #005C32)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame69() {
  return (
    <div className="content-stretch flex gap-[17.077px] items-center relative shrink-0">
      <div className="flex flex-col font-['Lexend:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#005c32] text-[10.785px] text-nowrap">
        <p className="leading-[24.941px] whitespace-pre">View Details</p>
      </div>
      <Svg4 />
    </div>
  );
}

function HorizontalBorder4() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[calc(50%+2.02px)] px-0 py-[8.988px] top-[137.58px] translate-x-[-50%] w-[271.431px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e2e8f9] border-[0.899px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Lexend:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#050b20] text-[17.976px] text-nowrap">
        <p className="leading-[26.963px] whitespace-pre">N40,000</p>
      </div>
      <Frame69 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_1_1929)" id="Icon">
          <path d={svgPaths.p3d741500} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_1929">
            <rect fill="white" height="14.3804" width="14.3804" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon12 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">20 Miles</p>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_1_1915)" id="Icon">
          <path d={svgPaths.p1dd2a980} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_1915">
            <rect fill="white" height="14.3804" width="14.3804" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon13 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Petrol</p>
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Icon">
          <path d={svgPaths.p39e97cf0} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame72() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon14 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">CVT</p>
      </div>
    </div>
  );
}

function Frame73() {
  return (
    <div className="content-stretch flex gap-[12.583px] items-center relative shrink-0">
      <Frame70 />
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame71 />
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame72 />
    </div>
  );
}

function Location4() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="location-06">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="location-06">
          <path d={svgPaths.p324c5980} id="Vector" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p10c5e00} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame74() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <Location4 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Abuja</p>
      </div>
    </div>
  );
}

function Car3() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="car-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="car-01">
          <path d={svgPaths.p7313100} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p11e68840} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p3a3b3f80} id="Vector_3" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.pd36a600} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p51a8000} id="Vector_5" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p3d383a60} id="Vector_6" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1334cf00} id="Vector_7" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1aaddc00} id="Vector_8" stroke="var(--stroke-0, #999999)" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.ped05470} id="Vector_9" stroke="var(--stroke-0, #999999)" strokeLinejoin="round" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame75() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <Car3 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Used</p>
      </div>
    </div>
  );
}

function Frame76() {
  return (
    <div className="content-stretch flex gap-[12.583px] items-center relative shrink-0">
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame75 />
    </div>
  );
}

function PaintBoard4() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="paint-board">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="paint-board">
          <path d={svgPaths.p26391cf0} id="Vector" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p287fba80} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.19837" />
          <path d={svgPaths.p26f9cd80} id="Vector_3" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p27e49900} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame77() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <PaintBoard4 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Red</p>
      </div>
    </div>
  );
}

function Frame78() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-center relative shrink-0 w-[72.801px]">
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame77 />
    </div>
  );
}

function Frame79() {
  return (
    <div className="content-stretch flex gap-[16.178px] items-center relative shrink-0">
      <Frame76 />
      <Frame78 />
    </div>
  );
}

function Frame80() {
  return (
    <div className="content-stretch flex gap-[26.065px] items-center relative shrink-0">
      <Frame74 />
      <Frame79 />
    </div>
  );
}

function Frame81() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8.988px] items-start left-[0.9px] top-[4.49px]">
      <Frame73 />
      <Frame80 />
    </div>
  );
}

function Frame82() {
  return (
    <div className="absolute border-[#e2e8f9] border-[0.899px_0px_0px] border-solid h-[53.927px] left-[12.58px] overflow-clip top-[70.17px] w-[271.431px]">
      <Frame81 />
    </div>
  );
}

function Border4() {
  return (
    <div className="absolute border-[#e9e9e9] border-[0px_0.899px_0.899px] border-solid h-[192.77px] left-0 right-0 rounded-bl-[14.38px] rounded-br-[14.38px] top-[196.23px]" data-name="Border">
      <Frame68 />
      <HorizontalBorder4 />
      <Frame82 />
    </div>
  );
}

function Article4() {
  return (
    <div className="bg-white h-[389px] overflow-clip relative rounded-[14.38px] shrink-0 w-[294.35px]" data-name="Article">
      <Container4 />
      <Border4 />
    </div>
  );
}

function Car8660X440Jpg5() {
  return (
    <div className="absolute h-[196.23px] left-0 overflow-clip top-1/2 translate-y-[-50%] w-[294.35px]" data-name="car8-660x440.jpg">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgCar8660X440Jpg} />
      <div className="absolute capitalize flex flex-col font-['Lexend:Light',sans-serif] font-light justify-center leading-[32.225px] left-[148.22px] text-[17.419px] text-center text-nowrap top-[130.83px] translate-x-[-50%] translate-y-[-50%] whitespace-pre">
        <p className="mb-0">Posted On Huce Autos</p>
        <p>by God’s Autos</p>
      </div>
    </div>
  );
}

function Link11() {
  return (
    <div className="absolute h-[196.23px] left-0 right-0 top-0" data-name="Link">
      <Car8660X440Jpg5 />
    </div>
  );
}

function VuesaxLinearHeart4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/heart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 17">
        <g id="heart">
          <path d={svgPaths.p37792370} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.34817" />
          <g id="Vector_2" opacity="0"></g>
        </g>
      </svg>
    </div>
  );
}

function Like5() {
  return (
    <div className="absolute bg-white left-[calc(50%-0.45px)] size-[16.178px] top-[calc(50%+0.36px)] translate-x-[-50%] translate-y-[-50%]" data-name="Like">
      <VuesaxLinearHeart4 />
    </div>
  );
}

function Background5() {
  return (
    <div className="absolute bg-white left-0 rounded-[16.178px] size-[32.356px] top-1/2 translate-y-[-50%]" data-name="Background">
      <Like5 />
    </div>
  );
}

function Link12() {
  return (
    <div className="absolute left-[244.02px] size-[32.356px] top-[17.98px]" data-name="Link">
      <Background5 />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[196.23px] left-0 overflow-clip right-0 top-0" data-name="Container">
      <Link11 />
      <Link12 />
    </div>
  );
}

function Frame83() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[3.595px] items-start leading-[0] left-[12.58px] top-[10.85px]">
      <div className="flex flex-col font-['Lexend:Medium',sans-serif] font-medium justify-center min-w-full relative shrink-0 text-[#060606] text-[16.178px] w-[min-content]">
        <p className="leading-[19.414px]">{`Toyota Camry `}</p>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[#999999] text-[10.785px] w-[263.342px]">
        <p className="leading-[normal]">3.5 D5 PowerPulse Momentum 5dr AW Geartronic Estate</p>
      </div>
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-[10.785px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
        <g id="SVG">
          <path d={svgPaths.p29673700} fill="var(--fill-0, #005C32)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame84() {
  return (
    <div className="content-stretch flex gap-[17.077px] items-center relative shrink-0">
      <div className="flex flex-col font-['Lexend:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#005c32] text-[10.785px] text-nowrap">
        <p className="leading-[24.941px] whitespace-pre">View Details</p>
      </div>
      <Svg5 />
    </div>
  );
}

function HorizontalBorder5() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[calc(50%+2.02px)] px-0 py-[8.988px] top-[137.58px] translate-x-[-50%] w-[271.431px]" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e2e8f9] border-[0.899px_0px_0px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Lexend:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#050b20] text-[17.976px] text-nowrap">
        <p className="leading-[26.963px] whitespace-pre">N40,000</p>
      </div>
      <Frame84 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_1_1863)" id="Icon">
          <path d={svgPaths.p97a8e00} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_1863">
            <rect fill="white" height="14.3804" width="14.3804" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame85() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon15 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">20 Miles</p>
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g clipPath="url(#clip0_1_1860)" id="Icon">
          <path d={svgPaths.p2afafd80} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_1860">
            <rect fill="white" height="14.3804" width="14.3804" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame86() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon16 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Petrol</p>
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative size-[14.38px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Icon">
          <path d={svgPaths.p3d75c400} fill="var(--fill-0, #999999)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame87() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none scale-y-[-100%]">
          <Icon17 />
        </div>
      </div>
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">CVT</p>
      </div>
    </div>
  );
}

function Frame88() {
  return (
    <div className="content-stretch flex gap-[12.583px] items-center relative shrink-0">
      <Frame85 />
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame86 />
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame87 />
    </div>
  );
}

function Location5() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="location-06">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="location-06">
          <path d={svgPaths.p11aaa440} id="Vector" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p3b2c8d00} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame89() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <Location5 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Abuja</p>
      </div>
    </div>
  );
}

function Car4() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="car-01">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="car-01">
          <path d={svgPaths.pf3bb900} id="Vector" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1e0835e0} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p11a1a00} id="Vector_3" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p21521e00} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p336d7e40} id="Vector_5" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p36f25400} id="Vector_6" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p1aea1f80} id="Vector_7" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p2255fd00} id="Vector_8" stroke="var(--stroke-0, #999999)" strokeLinejoin="round" strokeWidth="0.898778" />
          <path d={svgPaths.p257efe00} id="Vector_9" stroke="var(--stroke-0, #999999)" strokeLinejoin="round" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame90() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <Car4 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Used</p>
      </div>
    </div>
  );
}

function Frame91() {
  return (
    <div className="content-stretch flex gap-[12.583px] items-center relative shrink-0">
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame90 />
    </div>
  );
}

function PaintBoard5() {
  return (
    <div className="relative shrink-0 size-[14.38px]" data-name="paint-board">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="paint-board">
          <path d={svgPaths.p2fd54e80} id="Vector" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.p19ec9a80} id="Vector_2" stroke="var(--stroke-0, #999999)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.19837" />
          <path d={svgPaths.p284eb780} id="Vector_3" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
          <path d={svgPaths.pacf2380} id="Vector_4" stroke="var(--stroke-0, #999999)" strokeWidth="0.898778" />
        </g>
      </svg>
    </div>
  );
}

function Frame92() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-start justify-center relative shrink-0">
      <PaintBoard5 />
      <div className="flex flex-col font-['Lexend:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#999999] text-[12.583px] text-center text-nowrap">
        <p className="leading-[12.583px] whitespace-pre">Red</p>
      </div>
    </div>
  );
}

function Frame93() {
  return (
    <div className="content-stretch flex gap-[9.887px] items-center relative shrink-0 w-[72.801px]">
      <div className="flex h-[19.773px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[19.773px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-0.9px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 1">
                <line id="Line 33" stroke="var(--stroke-0, #E2E8F9)" strokeWidth="0.898778" x2="19.7731" y1="0.449389" y2="0.449389" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame92 />
    </div>
  );
}

function Frame94() {
  return (
    <div className="content-stretch flex gap-[16.178px] items-center relative shrink-0">
      <Frame91 />
      <Frame93 />
    </div>
  );
}

function Frame95() {
  return (
    <div className="content-stretch flex gap-[26.065px] items-center relative shrink-0">
      <Frame89 />
      <Frame94 />
    </div>
  );
}

function Frame96() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8.988px] items-start left-[0.9px] top-[4.49px]">
      <Frame88 />
      <Frame95 />
    </div>
  );
}

function Frame97() {
  return (
    <div className="absolute border-[#e2e8f9] border-[0.899px_0px_0px] border-solid h-[53.927px] left-[12.58px] overflow-clip top-[70.17px] w-[271.431px]">
      <Frame96 />
    </div>
  );
}

function Border5() {
  return (
    <div className="absolute border-[#e9e9e9] border-[0px_0.899px_0.899px] border-solid h-[192.77px] left-0 right-0 rounded-bl-[14.38px] rounded-br-[14.38px] top-[196.23px]" data-name="Border">
      <Frame83 />
      <HorizontalBorder5 />
      <Frame97 />
    </div>
  );
}

function Article5() {
  return (
    <div className="bg-white h-[389px] overflow-clip relative rounded-[14.38px] shrink-0 w-[294.35px]" data-name="Article">
      <Container5 />
      <Border5 />
    </div>
  );
}

function Frame98() {
  return (
    <div className="content-stretch flex gap-[39px] items-center relative shrink-0">
      {[...Array(2).keys()].map((_, i) => (
        <Article3 key={i} />
      ))}
      <Article4 />
      <Article5 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[29px] items-start left-0 top-[90px] w-[1329px]">
      <Frame17 />
      <Frame98 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[897px] overflow-clip relative shrink-0 w-[1315px]" data-name="Container">
      <Tablist />
      <Frame18 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[56px] items-start left-[66px] top-[30px] w-[1315px]">
      <div className="flex flex-col font-['Lexend:SemiBold',sans-serif] font-semibold justify-center leading-[0] min-w-full relative shrink-0 text-[#060606] text-[35px] w-[min-content]">
        <p className="leading-[40px]">Explore All Vehicles</p>
      </div>
      <Container6 />
    </div>
  );
}

export default function Frame3() {
  return (
    <div className="relative size-full">
      <Frame19 />
    </div>
  );
}