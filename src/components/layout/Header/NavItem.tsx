"use client";

import Link from "next/link";
import styled from "@emotion/styled";

type NavItemProps = {
  href: string;
  label: string;
};

const NavLink = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 28px;
  color: #fff;
  font-family: "Pretendard", sans-serif;
  font-size: 21px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: #97c42f;
    opacity: 0;
    transform: scaleX(0.9);
    z-index: 0;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  &:hover,
  &:focus-visible {
    color: #000;
    outline: none;

    &::before {
      opacity: 1;
      transform: scaleX(1);
    }

    span {
      font-weight: 600;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &::before {
      transform: none;
      transition: opacity 0.1s linear;
    }
  }
`;

const Label = styled.span`
  position: relative;
  z-index: 1;
  /* 굵어질 때 폭이 늘어나 옆 메뉴가 밀리는 것을 방지 (semibold 폭을 미리 확보) */
  &::after {
    content: attr(data-text);
    display: block;
    height: 0;
    overflow: hidden;
    visibility: hidden;
    font-weight: 600;
  }
`;

export function NavItem({ href, label }: NavItemProps) {
  return (
    <NavLink href={href}>
      <Label data-text={label}>{label}</Label>
    </NavLink>
  );
}
