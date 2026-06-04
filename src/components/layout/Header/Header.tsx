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

const HeaderWrap = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
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

  @media (max-width: 760px) {
    min-height: var(--header-height, 72px);
    padding: 18px var(--page-gutter);
    border-radius: 0 0 22px 22px;
  }

  @media (max-width: 420px) {
    padding: 16px 12px;
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

  img {
    width: clamp(42px, 12vw, 64px);
    height: auto;

    @media (max-width: 420px) {
      width: 34px;
    }
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

  @media (max-width: 760px) {
    gap: clamp(14px, 4vw, 26px);
    justify-content: flex-end;
    max-width: none;
    padding-right: 0;
    margin-left: 18px;
  }

  @media (max-width: 420px) {
    gap: 4px;
    margin-left: 10px;
  }
`;

export function Header() {
  return (
    <HeaderWrap>
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
    </HeaderWrap>
  );
}
