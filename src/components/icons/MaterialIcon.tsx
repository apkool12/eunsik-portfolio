import styled from "@emotion/styled";

type MaterialIconProps = {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
};

const Icon = styled.span<{ $size: number; $filled: boolean }>`
  font-family: "Material Symbols Outlined";
  font-weight: normal;
  font-style: normal;
  font-size: ${({ $size }) => $size}px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  font-variation-settings: ${({ $filled }) =>
    $filled ? "'FILL' 1" : "'FILL' 0"}, "wght" 400, "GRAD" 0, "opsz" 24"};
`;

export function MaterialIcon({
  name,
  className,
  filled = false,
  size = 24,
}: MaterialIconProps) {
  return (
    <Icon className={className} $size={size} $filled={filled} aria-hidden>
      {name}
    </Icon>
  );
}
