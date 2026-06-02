"use client";

import { useRef } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const HERO_PADDING_LEFT = 64;
const BOX_RIGHT_GAP = 12;

const Title = styled.h1`
  margin: 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(64px, 15vw, 216px);
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  letter-spacing: 0;

  @media (max-width: 480px) {
    font-size: clamp(52px, 18vw, 72px);
    line-height: 1.05;
  }
`;

const Line = styled.span`
  display: block;
`;

const Line2 = styled.span`
  position: relative;
  display: block;
`;

/** overflow를 잘라 타이핑처럼 글자가 좌→우로 드러나게 하는 래퍼 */
const TypeWrap = styled.span`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
`;

const Caret = styled.span`
  display: inline-block;
  width: 0.06em;
  height: 0.78em;
  margin-left: 0.04em;
  background: currentColor;
  vertical-align: baseline;
  transform: translateY(0.06em);
`;

/** 왼쪽 화면 끝까지 차오르는 검은 블록 */
const Box = styled.span`
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(-1 * var(--hero-padding-left, ${HERO_PADDING_LEFT}px));
  background: #000;
  transform-origin: left center;
  z-index: 0;
`;

const MChar = styled.span`
  position: relative;
  z-index: 1;
  color: #fff;
`;

const Line2Type = styled(TypeWrap)`
  position: relative;
  z-index: 1;
`;

export function HeroTitle() {
  const scopeRef = useRef<HTMLHeadingElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const caret1Ref = useRef<HTMLSpanElement>(null);
  const boxRef = useRef<HTMLSpanElement>(null);
  const mRef = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const caret2Ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const line1 = line1Ref.current;
      const line2 = line2Ref.current;
      const mEl = mRef.current;
      const box = boxRef.current;
      if (!line1 || !line2 || !mEl || !box) return;

      const line1Width = line1.scrollWidth;
      const line2Width = line2.scrollWidth;
      const mWidth = mEl.offsetWidth;
      const cssHeroPadding = Number.parseFloat(
        window
          .getComputedStyle(scopeRef.current ?? line1)
          .getPropertyValue("--hero-padding-left")
      );
      const heroPadding = Number.isFinite(cssHeroPadding)
        ? cssHeroPadding
        : HERO_PADDING_LEFT;
      const boxWidth = heroPadding + mWidth - BOX_RIGHT_GAP;

      const line1Chars = "This is".length;
      const line2Chars = "y Journey".length;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      gsap.set(box, { width: boxWidth });

      if (reduceMotion) {
        gsap.set([line1, line2], { width: "auto" });
        gsap.set(mEl, { autoAlpha: 1 });
        gsap.set(box, { scaleX: 1 });
        gsap.set([caret1Ref.current, caret2Ref.current], { autoAlpha: 0 });
        return;
      }

      gsap.set(line1, { width: 0 });
      gsap.set(line2, { width: 0 });
      gsap.set(mEl, { autoAlpha: 0 });
      gsap.set(box, { scaleX: 0 });
      gsap.set(caret2Ref.current, { autoAlpha: 0 });

      const blink = gsap.to([caret1Ref.current, caret2Ref.current], {
        autoAlpha: 0,
        duration: 0.45,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
      });

      const tl = gsap.timeline({ defaults: { ease: "none" } });

      tl.to(line1, {
        width: line1Width,
        duration: line1Chars * 0.1,
        ease: `steps(${line1Chars})`,
      })
        .to(caret1Ref.current, { autoAlpha: 0, duration: 0.2 }, "+=0.4")
        .to(
          box,
          { scaleX: 1, duration: 0.5, ease: "power3.out" },
          "+=0.05"
        )
        .set(caret2Ref.current, { autoAlpha: 1 })
        .to(mEl, { autoAlpha: 1, duration: 0.12 }, "+=0.1")
        .to(line2, {
          width: line2Width,
          duration: line2Chars * 0.1,
          ease: `steps(${line2Chars})`,
        });

      return () => {
        blink.kill();
        tl.kill();
      };
    },
    { scope: scopeRef }
  );

  return (
    <Title ref={scopeRef}>
      <Line>
        <TypeWrap ref={line1Ref}>This is</TypeWrap>
        <Caret ref={caret1Ref} />
      </Line>
      <Line2>
        <Box ref={boxRef} />
        <MChar ref={mRef}>M</MChar>
        <Line2Type ref={line2Ref}>y Journey</Line2Type>
        <Caret ref={caret2Ref} />
      </Line2>
    </Title>
  );
}
