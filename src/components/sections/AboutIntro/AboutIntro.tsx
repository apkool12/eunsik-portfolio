"use client";

import { useRef } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const SOCIAL_LINKS = [
  { href: "https://github.com/apkool12", label: "GitHub", icon: "/github.svg" },
  {
    href: "https://www.instagram.com/dmd._sik",
    label: "Instagram",
    icon: "/instagram.svg",
  },
];

const TITLE = "About,";
const GREETING_LINES = ["안녕하세요,", "UI 및 프론트엔드 개발자", "우은식입니다."];

const Section = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  width: 100%;
  padding: 0 var(--page-gutter);

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 28px;
  }
`;

const Left = styled.div`
  flex: 1 1 auto;
  min-width: 0;
`;

const PhotoRing = styled.div`
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: clamp(520px, 46vw, 720px);
  aspect-ratio: 1;
  margin-right: clamp(80px, 12vw, 260px);
  padding: 22px;
  border: 1.5px solid #e3e3e3;
  border-radius: 50%;
  will-change: transform, opacity;

  @media (max-width: 900px) {
    order: -1;
    width: min(58vw, 280px);
    margin-right: 0;
    padding: 12px;
  }

  @media (max-width: 480px) {
    width: min(54vw, 220px);
    padding: 9px;
  }
`;

const Photo = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
`;

const Title = styled.h1`
  margin: 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(72px, 14vw, 180px);
  font-style: normal;
  font-weight: 900;
  line-height: 123.871%;

  @media (max-width: 480px) {
    font-size: clamp(50px, 17vw, 72px);
  }
`;

const CharMask = styled.span`
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
`;

const Char = styled.span`
  display: inline-block;
  will-change: transform;
`;

const GreetingWrap = styled.div`
  position: relative;
  margin-top: 24px;
`;

/** 뒤에 배경처럼 깔리는 블러 텍스트 (전경보다 오른쪽으로 살짝 이동) */
const Ghost = styled.p`
  position: absolute;
  top: -10px;
  left: 40px;
  margin: 0;
  white-space: pre-line;
  color: #949494;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(42px, 7vw, 88px);
  font-style: normal;
  font-weight: 900;
  line-height: 123.871%;
  opacity: 0.1;
  filter: blur(4px);
  pointer-events: none;
  user-select: none;
  will-change: transform;

  @media (max-width: 640px) {
    left: 18px;
    font-size: clamp(30px, 9vw, 42px);
    filter: blur(3px);
  }
`;

const Greeting = styled.div`
  position: relative;
  z-index: 1;
`;

const LineMask = styled.span`
  display: block;
  overflow: hidden;
`;

const Line = styled.span`
  display: block;
  color: #000;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.25);
  font-family: "Pretendard", sans-serif;
  font-size: clamp(34px, 6.4vw, 72px);
  font-style: normal;
  font-weight: 100;
  line-height: 123.871%;
  will-change: transform;

  @media (max-width: 480px) {
    font-size: clamp(27px, 8.2vw, 36px);
  }
`;

const InfoCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  width: 100%;
  max-width: 760px;
  min-height: 140px;
  margin-top: 48px;
  padding: 40px;
  border-radius: 10px;
  background: linear-gradient(90deg, #000 0%, #fff 100%);
  will-change: transform, opacity;

  @media (max-width: 640px) {
    min-height: 116px;
    margin-top: 28px;
    padding: 22px;
  }
`;

const InfoText = styled.div`
  color: #bcbcbc;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(17px, 4.2vw, 24px);
  font-style: normal;
  font-weight: 300;
  line-height: 123.871%;
`;

const InfoRow = styled(InfoText)`
  display: flex;
  gap: 32px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 6px;
  }
`;

const Divider = styled.div`
  width: 100%;
  max-width: 760px;
  height: 2px;
  margin-top: 56px;
  border-radius: 2px;
  background: linear-gradient(90deg, #000 0%, #fff 100%);
  transform-origin: left center;
  will-change: transform;
`;

const Socials = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 28px;
  will-change: transform, opacity;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    transform: translateY(-3px);
  }

  &:active {
    opacity: 0.7;
  }

  img {
    width: clamp(32px, 9vw, 40px);
    height: clamp(32px, 9vw, 40px);
  }
`;

export function AboutIntro() {
  const scopeRef = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      const ghost = ghostRef.current;
      if (!scope) return;

      const chars = scope.querySelectorAll<HTMLElement>("[data-char]");
      const lines = scope.querySelectorAll<HTMLElement>("[data-line]");
      const card = scope.querySelector<HTMLElement>("[data-card]");
      const divider = scope.querySelector<HTMLElement>("[data-divider]");
      const foot = scope.querySelectorAll<HTMLElement>("[data-foot]");
      const photo = scope.querySelector<HTMLElement>("[data-photo]");

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) {
        gsap.set([chars, lines, card, foot], {
          yPercent: 0,
          y: 0,
          autoAlpha: 1,
        });
        gsap.set(divider, { scaleX: 1, autoAlpha: 1 });
        gsap.set(photo, { scale: 1, autoAlpha: 1 });
        return;
      }

      gsap.set(chars, { yPercent: 120 });
      gsap.set(lines, { yPercent: 110, autoAlpha: 0 });
      gsap.set(card, { y: 30, autoAlpha: 0 });
      gsap.set(divider, { scaleX: 0 });
      gsap.set(foot, { y: 24, autoAlpha: 0 });
      gsap.set(photo, { scale: 0.9, autoAlpha: 0 });

      const tl = gsap.timeline({ delay: 0.15 });

      tl.to(
        photo,
        { scale: 1, autoAlpha: 1, duration: 1.1, ease: "power3.out" },
        0.1
      ).to(chars, {
        yPercent: 0,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.06,
      }, 0.25)
        .to(
          lines,
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
          },
          "-=0.45"
        )
        .to(
          card,
          { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" },
          "-=0.3"
        )
        .to(
          divider,
          { scaleX: 1, duration: 0.6, ease: "power3.inOut" },
          "-=0.3"
        )
        .to(
          foot,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.12,
          },
          "-=0.2"
        );

      // D. 고스트 마우스 패럴럭스
      let parallax: ((e: MouseEvent) => void) | null = null;
      if (ghost) {
        const xTo = gsap.quickTo(ghost, "x", {
          duration: 0.9,
          ease: "power3.out",
        });
        const yTo = gsap.quickTo(ghost, "y", {
          duration: 0.9,
          ease: "power3.out",
        });

        parallax = (e: MouseEvent) => {
          const relX = e.clientX / window.innerWidth - 0.5;
          const relY = e.clientY / window.innerHeight - 0.5;
          xTo(-relX * 60);
          yTo(-relY * 40);
        };
        window.addEventListener("mousemove", parallax);
      }

      return () => {
        tl.kill();
        if (parallax) window.removeEventListener("mousemove", parallax);
      };
    },
    { scope: scopeRef }
  );

  return (
    <Section ref={scopeRef}>
      <Left>
        <Title aria-label={TITLE}>
          {TITLE.split("").map((char, i) => (
            <CharMask key={`${char}-${i}`} aria-hidden>
              <Char data-char>{char}</Char>
            </CharMask>
          ))}
        </Title>
        <GreetingWrap>
          <Ghost ref={ghostRef} aria-hidden>
            {`안녕하세요,\n프론트엔드 개발자\n우은식입니다.`}
          </Ghost>
          <Greeting>
            {GREETING_LINES.map((line, i) => (
              <LineMask key={`${line}-${i}`}>
                <Line data-line>{line}</Line>
              </LineMask>
            ))}
          </Greeting>
        </GreetingWrap>
        <InfoCard data-card>
          <InfoRow>
            <span>2005.08.22</span>
            <span>Daejeon</span>
          </InfoRow>
          <InfoText>Hanbat National University</InfoText>
        </InfoCard>
        <Divider data-divider />
        <Socials data-foot>
          {SOCIAL_LINKS.map((social) => (
            <SocialLink
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
            >
              <Image src={social.icon} alt="" width={40} height={40} />
            </SocialLink>
          ))}
        </Socials>
      </Left>
      <PhotoRing data-photo>
        <Photo>
          <Image
            src="/eunsik.png"
            alt="우은식 프로필 사진"
            fill
            sizes="480px"
            style={{ objectFit: "cover" }}
            priority
          />
        </Photo>
      </PhotoRing>
    </Section>
  );
}
