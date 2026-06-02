"use client";

import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import styled from "@emotion/styled";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";
import { PROJECTS, type Project } from "@/constants/projects";

gsap.registerPlugin(Observer);

const PAGE_TITLE = "Project,";
const PAGE_TITLE_LETTERS = Array.from(PAGE_TITLE);
const MORPH_DURATION = 0.68;

const Section = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-self: stretch;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 0;
  overflow: hidden;

  @media (max-width: 1100px) {
    height: auto;
    min-height: calc(100dvh - var(--header-height, 88px));
    overflow: visible;
  }
`;

const PageTitle = styled.h1`
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: flex-end;
  gap: 0;
  width: fit-content;
  margin: 0 0 clamp(12px, 1.8svh, 22px);
  padding: clamp(72px, 11svh, 128px) var(--page-gutter) 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(112px, 9.2vw, 168px);
  font-weight: 900;
  line-height: 1.05;
  flex-shrink: 0;
  transform-origin: left bottom;
  will-change: clip-path, transform;

  @media (max-width: 1100px) {
    font-size: 80px;
    line-height: 1;
    margin-bottom: clamp(18px, 2vh, 24px);
    padding: clamp(32px, 8vh, 72px) var(--page-gutter) 0;
  }

  @media (max-width: 640px) {
    font-size: clamp(54px, 17vw, 72px);
    padding-top: clamp(40px, 9vh, 72px);
  }
`;

const TitleLetter = styled.span`
  display: inline-block;
  transform-origin: 50% 85%;
  will-change: transform, opacity;

  &[data-title-letter-index="2"] {
    color: #97c42f;
  }

  &[data-title-letter-index="4"] {
    transform: translateY(-0.08em);
  }
`;

const Content = styled.div`
  display: grid;
  flex: 1;
  box-sizing: border-box;
  min-height: 0;
  width: 100%;
  grid-template-columns:
    minmax(0, 1fr)
    var(--project-details-width)
    var(--project-dots-reserve);
  grid-template-rows: minmax(0, 1fr);
  column-gap: var(--project-content-gap);

  @media (max-width: 1100px) {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: clamp(16px, 2.5svh, 24px);
    min-height: 0;
    padding: 0 var(--page-gutter);
    overflow: hidden;
  }

  @media (max-width: 640px) {
    gap: 18px;
    overflow: visible;
  }
`;

const Preview = styled.div`
  position: relative;
  grid-column: 1;
  grid-row: 1;
  width: 100%;
  height: 100%;
  min-height: 0;
  align-self: stretch;
  border-radius: 0 32px 0 0;
  background: #000;
  overflow: hidden;

  @media (max-width: 1100px) {
    order: 2;
    flex: 1;
    width: 100%;
    min-height: min(44svh, 340px);
    height: auto;
    aspect-ratio: 16 / 11;
    border-radius: 0 24px 0 0;
  }

  @media (max-width: 640px) {
    min-height: 260px;
    aspect-ratio: 4 / 3;
    border-radius: 0 20px 0 0;
  }
`;

const PreviewLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;

  &[data-morph-layer="incoming"] {
    z-index: 1;
  }

  &[data-morph-layer="outgoing"] {
    z-index: 2;
  }
`;

const PreviewLabel = styled.span`
  position: absolute;
  top: 28px;
  left: 28px;
  z-index: 3;
  color: #fff;
  pointer-events: none;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 700;
  line-height: 1.2;
  will-change: opacity;
`;

const PreviewMedia = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  will-change: opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
`;

/** 슬롯 비율과 무관하게 항상 꽉 채움 (center + min-size cover) */
const PreviewMediaImg = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  max-width: none;
  max-height: none;
  transform: translate(-50%, -50%) scale(1.06);
  object-fit: cover;
  filter: grayscale(100%) brightness(0.88);
  transition: filter 0.45s ease;
  backface-visibility: hidden;
`;

/** 기본: 회색 톤 / 호버 시 제거 */
const PreviewTone = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(72, 72, 72, 0.42);
  pointer-events: none;
  transition: opacity 0.45s ease;
`;

const PreviewLink = styled.a`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: block;
  overflow: hidden;
  text-decoration: none;
  cursor: pointer;
  pointer-events: auto;

  &:hover img,
  &:focus-visible img {
    filter: none;
  }

  &:hover [data-preview-tone],
  &:focus-visible [data-preview-tone] {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    img {
      filter: none;
      transition: none;
    }

    [data-preview-tone] {
      opacity: 0;
      transition: none;
    }
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 2;
  grid-row: 1;
  align-self: start;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: clamp(6px, 1.3svh, 12px) 0 clamp(18px, 3svh, 32px);

  @media (max-width: 1100px) {
    order: 1;
    flex-shrink: 0;
    max-height: none;
    padding: 4px 0 8px;
    overflow: visible;
  }
`;

const DetailLabel = styled.span`
  color: #949494;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(14px, 2vw, 18px);
  font-weight: 400;
  line-height: 1.4;
`;

const ProjectName = styled.h2`
  margin: 8px 0 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(30px, 4.4vw, 50px);
  font-weight: 800;
  line-height: 1.3;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

const Description = styled.p`
  margin: clamp(10px, 1.5svh, 16px) 0 0;
  color: #6b6b6b;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(15px, 2vw, 18px);
  font-weight: 400;
  line-height: 1.65;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

const MetaList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2svh, 20px);
  margin: clamp(20px, 3svh, 36px) 0 0;
  padding: 0;

  @media (max-width: 640px) {
    gap: 14px;
    margin-top: 22px;
  }
`;

const MetaRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MetaTerm = styled.dt`
  margin: 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(18px, 2.5vw, 24px);
  font-weight: 800;
  line-height: 1.35;
`;

const MetaValue = styled.dd`
  margin: 0;
  color: #949494;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 400;
  line-height: 1.55;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

const TechRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: clamp(18px, 3svh, 30px);
`;

const TechPill = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  padding: 10px 16px;
  border-radius: 999px;
  background: #000;
  color: #fff;
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 500;

  @media (max-width: 640px) {
    min-width: 0;
    padding: 9px 13px;
    font-size: 13px;
  }
`;

const GithubLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  margin-top: clamp(18px, 2.8svh, 28px);
  padding: 12px 24px 12px 20px;
  border-radius: 999px;
  background: #000;
  color: #fff;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none;

  img {
    display: block;
    width: 22px;
    height: 22px;
    filter: brightness(0) invert(1);
  }

  &:hover {
    opacity: 0.85;
  }

  @media (max-width: 640px) {
    padding: 10px 18px 10px 16px;
    font-size: 15px;
  }
`;

const DotsNav = styled.nav`
  position: fixed;
  right: clamp(20px, 3vw, 40px);
  top: 50%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
  transform: translateY(-50%);
  pointer-events: none;

  @media (max-width: 1100px) {
    right: 50%;
    top: auto;
    bottom: 18px;
    flex-direction: row;
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    transform: translateX(50%);
  }
`;

const DotButton = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? 14 : 9)}px;
  height: ${({ $active }) => ($active ? 14 : 9)}px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#000" : "#b7b7b7")};
  cursor: pointer;
  pointer-events: auto;
  transition:
    width 0.25s ease,
    height 0.25s ease,
    background 0.25s ease;
`;

function PreviewStack({
  project,
  layer,
}: {
  project: Project;
  layer: "single" | "outgoing" | "incoming";
}) {
  const layerAttr =
    layer === "single" ? undefined : (layer as "outgoing" | "incoming");
  const isInteractive = layer === "single" && Boolean(project.githubUrl);

  const cover = project.imageSrc ? (
    <PreviewMedia
      data-preview-img={layer === "single" ? "" : layer}
      aria-hidden={layer !== "single"}
    >
      <PreviewMediaImg
        src={project.imageSrc}
        alt={project.imageAlt ?? project.name}
        loading="eager"
        decoding="async"
        draggable={false}
      />
      <PreviewTone data-preview-tone aria-hidden />
    </PreviewMedia>
  ) : null;

  return (
    <PreviewLayer data-morph-layer={layerAttr}>
      {cover &&
        (isInteractive ? (
          <PreviewLink
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} GitHub 저장소`}
          >
            {cover}
          </PreviewLink>
        ) : (
          cover
        ))}
    </PreviewLayer>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  return (
    <>
      <DetailLabel data-project-detail-label>프로젝트 설명</DetailLabel>
      <ProjectName data-morph>{project.name}</ProjectName>
      <Description data-morph>{project.description}</Description>
      <MetaList>
        <MetaRow data-morph>
          <MetaTerm>제작기간</MetaTerm>
          <MetaValue>{project.period}</MetaValue>
        </MetaRow>
        <MetaRow data-morph>
          <MetaTerm>팀원</MetaTerm>
          <MetaValue>{project.members}</MetaValue>
        </MetaRow>
      </MetaList>
      {project.techStack.length > 0 && (
        <TechRow aria-label="기술 스택">
          {project.techStack.map((tech) => (
            <TechPill key={tech} data-morph>
              {tech}
            </TechPill>
          ))}
        </TechRow>
      )}
      {project.githubUrl && (
        <GithubLink
          data-morph
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/github.svg" alt="" width={22} height={22} />
          GITHUB
        </GithubLink>
      )}
    </>
  );
}

type MorphPair = { from: number; to: number };

export function ProjectMorphView() {
  const scopeRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [morphPair, setMorphPair] = useState<MorphPair | null>(null);
  const indexRef = useRef(0);
  const morphingRef = useRef(false);
  const project = PROJECTS[index];
  const previewLabelProject = morphPair ? PROJECTS[morphPair.to] : project;

  const morphTo = useCallback((next: number) => {
    const scope = scopeRef.current;
    if (!scope) return;

    const clamped = gsap.utils.clamp(0, PROJECTS.length - 1, next);
    const current = indexRef.current;
    if (morphingRef.current || clamped === current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      indexRef.current = clamped;
      setMorphPair(null);
      setIndex(clamped);
      return;
    }

    morphingRef.current = true;
    const pair: MorphPair = { from: current, to: clamped };

    flushSync(() => setMorphPair(pair));

    const morphEls = scope.querySelectorAll<HTMLElement>("[data-morph]");
    const outgoingLayer = scope.querySelector<HTMLElement>(
      '[data-morph-layer="outgoing"]'
    );
    const incomingLayer = scope.querySelector<HTMLElement>(
      '[data-morph-layer="incoming"]'
    );
    const outImg = outgoingLayer?.querySelector<HTMLElement>(
      '[data-preview-img="outgoing"]'
    );
    const inImg = incomingLayer?.querySelector<HTMLElement>(
      '[data-preview-img="incoming"]'
    );
    const titleLetters = scope.querySelectorAll<HTMLElement>(
      "[data-project-letter]"
    );

    const direction = clamped > current ? 1 : -1;
    const slideOutY = 28 * direction;
    const slideInY = -24 * direction;

    if (incomingLayer) gsap.set(incomingLayer, { autoAlpha: 1 });
    if (inImg) gsap.set(inImg, { autoAlpha: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        flushSync(() => setMorphPair(null));
        morphingRef.current = false;
        const label = scope.querySelector<HTMLElement>("[data-preview-label]");
        if (label) gsap.set(label, { clearProps: "opacity,visibility" });
      },
    });

    const crossfade = MORPH_DURATION * 0.5;

    tl.to(
      titleLetters,
      {
        y: (i) => (i % 2 === 0 ? -10 : 8) * direction,
        rotation: (i) => (i % 2 === 0 ? -3 : 3) * direction,
        duration: MORPH_DURATION * 0.22,
        stagger: 0.012,
        ease: "power3.out",
        yoyo: true,
        repeat: 1,
      },
      0
    );
    tl.to(morphEls, {
      y: slideOutY,
      scale: 0.985,
      autoAlpha: 0,
      duration: MORPH_DURATION * 0.34,
      stagger: 0.018,
      ease: "power4.in",
    }, 0);

    if (outImg) {
      tl.to(outImg, { autoAlpha: 0, duration: crossfade, ease: "power2.in" }, 0);
    }
    if (inImg) {
      tl.to(
        inImg,
        { autoAlpha: 1, duration: crossfade, ease: "expo.out" },
        MORPH_DURATION * 0.14
      );
    }
    tl.add(() => {
      flushSync(() => {
        setIndex(clamped);
        indexRef.current = clamped;
      });
      const nextMorphEls = scope.querySelectorAll<HTMLElement>("[data-morph]");
      return gsap.fromTo(
        nextMorphEls,
        { y: slideInY, scale: 1.02, autoAlpha: 0 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: MORPH_DURATION * 0.46,
          stagger: 0.022,
          ease: "back.out(1.35)",
          clearProps: "transform",
        }
      );
    });

  }, []);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope || PROJECTS.length <= 1) return;
      const isMobile = window.matchMedia("(max-width: 1100px)").matches;
      if (isMobile) return;

      const observer = Observer.create({
        target: scope,
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        tolerance: 20,
        preventDefault: true,
        onUp: () => morphTo(indexRef.current + 1),
        onDown: () => morphTo(indexRef.current - 1),
      });

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          e.preventDefault();
          morphTo(indexRef.current + 1);
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          morphTo(indexRef.current - 1);
        }
      };

      window.addEventListener("keydown", onKey);

      return () => {
        observer.kill();
        window.removeEventListener("keydown", onKey);
      };
    },
    { scope: scopeRef, dependencies: [morphTo] }
  );

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const title = scope.querySelector("[data-project-title]");
      const titleLetters = scope.querySelectorAll("[data-project-letter]");
      const preview = scope.querySelector("[data-project-preview]");
      const previewLabel = scope.querySelector("[data-preview-label]");
      const detailLabel = scope.querySelector("[data-project-detail-label]");
      const detailItems = scope.querySelectorAll("[data-morph]");

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) {
        gsap.set([title, preview, previewLabel, detailLabel, detailItems], {
          autoAlpha: 1,
          clearProps: "transform",
        });
        return;
      }

      gsap.set(title, { autoAlpha: 1 });
      gsap.set(titleLetters, {
        autoAlpha: 0,
        yPercent: 80,
        rotation: 8,
        scaleY: 0.7,
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.to(titleLetters, {
        autoAlpha: 1,
        yPercent: 0,
        rotation: 0,
        scaleY: 1,
        duration: 0.86,
        stagger: 0.055,
        ease: "elastic.out(1, 0.72)",
      })
        .from(preview, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, "-=0.3")
        .from(
          previewLabel,
          {
            autoAlpha: 0,
            y: 14,
            duration: 0.54,
            ease: "expo.out",
          },
          "-=0.5"
        )
        .from(
          detailLabel,
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.48,
            ease: "power3.out",
          },
          "-=0.42"
        )
        .from(
          detailItems,
          {
            autoAlpha: 0,
            y: 26,
            duration: 0.54,
            stagger: 0.05,
            ease: "back.out(1.2)",
          },
          "-=0.46"
        );
    },
    { scope: scopeRef }
  );

  return (
    <>
      <Section ref={scopeRef} aria-label={project.name}>
        <PageTitle data-project-title aria-label={PAGE_TITLE}>
          {PAGE_TITLE_LETTERS.map((letter, i) => (
            <TitleLetter
              key={`${letter}-${i}`}
              data-project-letter
              data-title-letter-index={i}
              aria-hidden
            >
              {letter}
            </TitleLetter>
          ))}
        </PageTitle>
        <Content>
          <Preview data-project-preview>
            <PreviewLabel data-preview-label>
              {previewLabelProject.name}
            </PreviewLabel>
            {morphPair ? (
              <>
                <PreviewStack
                  project={PROJECTS[morphPair.from]}
                  layer="outgoing"
                />
                <PreviewStack
                  project={PROJECTS[morphPair.to]}
                  layer="incoming"
                />
              </>
            ) : (
              <PreviewStack project={project} layer="single" />
            )}
          </Preview>
          <Details data-project-details>
            <ProjectDetails project={project} />
          </Details>
        </Content>
      </Section>
      {PROJECTS.length > 1 && (
        <DotsNav aria-label="프로젝트 목록">
          {PROJECTS.map((item, i) => (
            <li key={item.id}>
              <DotButton
                type="button"
                $active={index === i}
                aria-label={item.name}
                aria-current={index === i ? "true" : undefined}
                onClick={() => morphTo(i)}
              />
            </li>
          ))}
        </DotsNav>
      )}
    </>
  );
}
