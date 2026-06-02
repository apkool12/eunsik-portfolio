"use client";

import styled from "@emotion/styled";

const Root = styled.div`
  flex: 1 1 auto;
  width: 100%;
  min-height: 0;
  zoom: var(--global-scale, 1);

  @supports not (zoom: 1) {
    zoom: unset;
    transform: scale(var(--global-scale, 1));
    transform-origin: top center;
    width: calc(100% / var(--global-scale, 1));
  }

  @media (max-width: 900px) {
    zoom: 1;
    transform: none;
    width: 100%;
  }
`;

type PageScaleWrapperProps = {
  children: React.ReactNode;
};

export function PageScaleWrapper({ children }: PageScaleWrapperProps) {
  return <Root>{children}</Root>;
}
