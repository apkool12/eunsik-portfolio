"use client";

import Link from "next/link";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { Logo } from "@/components/icons/Logo";
import { NAV_ITEMS } from "@/constants/navigation";
import { NavItem } from "./NavItem";

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 88px;
  padding: 24px 64px;
  border-radius: 0 0 30px 30px;
  background: linear-gradient(90deg, #111 0%, #1c2013 100%);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  animation: ${slideDown} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const LogoLink = styled(Link)`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:focus-visible {
    outline: none;
    opacity: 0.85;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  margin-left: clamp(48px, 12vw, 200px);
  padding-right: clamp(16px, 4vw, 48px);
  max-width: 920px;
  margin-right: 0;
  margin-left: auto;
`;

export function Header() {
  return (
    <HeaderBar>
      <LogoLink href="/" aria-label="홈으로 이동">
        <Logo />
      </LogoLink>
      <Nav aria-label="주요 메뉴">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label} />
        ))}
      </Nav>
    </HeaderBar>
  );
}
