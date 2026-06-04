import Image from "next/image";
import {
  BRAND_LOGO,
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_WIDTH,
} from "@/lib/seo/site";

type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

const DEFAULT_WIDTH = 110;

function brandLogoHeight(width: number) {
  return Math.round((width * BRAND_LOGO_HEIGHT) / BRAND_LOGO_WIDTH);
}

/** `public/WooEunsik.svg` 워드마크 */
export function Logo({
  width = DEFAULT_WIDTH,
  height,
  className,
}: LogoProps) {
  const resolvedHeight = height ?? brandLogoHeight(width);

  return (
    <Image
      src={BRAND_LOGO}
      alt=""
      width={width}
      height={resolvedHeight}
      priority
      className={className}
      aria-hidden
    />
  );
}
