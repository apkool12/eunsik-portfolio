import Image from "next/image";

type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

/** `public/logo.svg` 기준 W7 모노그램 */
export function Logo({ width = 72, height = 36, className }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt=""
      width={width}
      height={height}
      priority
      className={className}
      aria-hidden
    />
  );
}
