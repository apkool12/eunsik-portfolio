"use client";

import { useRef } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/constants/projects";

const PAGE_TITLE = "Project,";

/** Projects 전용: 헤더 아래 뷰포트 고정, 페이지 스크롤 없음 */
export const ProjectsPageFrame = styled.div`
  position: fixed;
  top: var(--header-height, 88px);
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
`;

/** PanelPager 세로 중앙 정렬을 무시하고 화면 전체 높이 사용 */
export const ProjectPanelShell = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  align-self: stretch;
  width: 100%;
  min-height: 0;
  height: 100%;
`;

const Section = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-self: stretch;
  width: 100%;
  min-height: 0;
  padding: 0;
  overflow: hidden;

  @media (max-width: 1100px) {
    overflow-y: auto;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 clamp(12px, 2vh, 20px);
  padding: max(0px, calc((100dvh - var(--header-height, 88px) - min(680px, 72vh)) / 2 - 56px))
    var(--page-gutter) 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: 180px;
  font-weight: 900;
  line-height: 123.871%;
  flex-shrink: 0;

  @media (max-width: 1100px) {
    font-size: clamp(72px, 14vw, 120px);
    padding-top: max(
      0px,
      calc((100dvh - var(--header-height, 88px) - min(520px, 62vh)) / 2 - 40px)
    );
  }
`;

const Content = styled.div`
  display: grid;
  flex: 1;
  box-sizing: border-box;
  min-height: 0;
  width: 100%;
  /* [미리보기] — [설명] — [점 네비 여백] */
  grid-template-columns:
    minmax(0, 1fr)
    var(--project-details-width)
    var(--project-dots-reserve);
  grid-template-rows: minmax(0, 1fr);
  column-gap: var(--project-content-gap);

  @media (max-width: 1100px) {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: 0 var(--page-gutter);
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
    width: 100%;
    height: clamp(280px, 50vh, 480px);
    flex-shrink: 0;
  }
`;

const PreviewLabel = styled.span`
  position: absolute;
  top: 28px;
  left: 28px;
  z-index: 2;
  color: #fff;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 700;
  line-height: 1.2;
`;

const PreviewImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  padding: 12px 0 32px;

  @media (max-width: 1100px) {
    order: 1;
    padding: 8px 0 24px;
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
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.3;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

const Description = styled.p`
  margin: 16px 0 0;
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
  gap: 20px;
  margin: clamp(28px, 4vh, 48px) 0 0;
  padding: 0;
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
  word-break: keep-all;
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
  margin-top: clamp(28px, 4vh, 40px);
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
  line-height: 1;
`;

const GithubLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  margin-top: clamp(24px, 3vh, 32px);
  padding: 12px 24px 12px 20px;
  border-radius: 999px;
  background: #000;
  color: #fff;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: opacity 0.2s ease;

  img {
    display: block;
    width: 22px;
    height: 22px;
    filter: brightness(0) invert(1);
  }

  &:hover {
    opacity: 0.85;
  }

  &:focus-visible {
    outline: 2px solid #97c42f;
    outline-offset: 3px;
  }
`;

type ProjectPanelProps = {
  project: Project;
};

export function ProjectPanel({ project }: ProjectPanelProps) {
  const scopeRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      const panel = scope?.closest<HTMLElement>("[data-panel]");
      if (!scope || !panel) return;

      const title = scope.querySelector<HTMLElement>("[data-project-title]");
      const preview = scope.querySelector<HTMLElement>("[data-project-preview]");
      const details = scope.querySelector<HTMLElement>("[data-project-details]");

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const targets = [title, preview, details].filter(
        (el): el is HTMLElement => !!el
      );

      const setVisible = () => {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
      };

      if (reduceMotion) {
        setVisible();
        return;
      }

      gsap.set(targets, { autoAlpha: 1, y: 0 });

      const onPanelEnter = () => {
        gsap.set(targets, { autoAlpha: 1, y: 0 });
      };

      panel.addEventListener("panel-enter", onPanelEnter);

      return () => {
        panel.removeEventListener("panel-enter", onPanelEnter);
      };
    },
    { scope: scopeRef, dependencies: [project.id] }
  );

  return (
    <Section ref={scopeRef} aria-label={project.name}>
      <PageTitle data-project-title>{PAGE_TITLE}</PageTitle>
      <Content>
        <Preview data-project-preview>
          <PreviewLabel>{project.name}</PreviewLabel>
          {project.imageSrc && (
            <PreviewImage>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.imageSrc}
                alt={project.imageAlt ?? project.name}
                loading="lazy"
              />
            </PreviewImage>
          )}
        </Preview>
        <Details data-project-details>
          <DetailLabel>프로젝트 설명</DetailLabel>
          <ProjectName>{project.name}</ProjectName>
          <Description>{project.description}</Description>
          <MetaList>
            <MetaRow>
              <MetaTerm>제작기간</MetaTerm>
              <MetaValue>{project.period}</MetaValue>
            </MetaRow>
            <MetaRow>
              <MetaTerm>팀원</MetaTerm>
              <MetaValue>{project.members}</MetaValue>
            </MetaRow>
          </MetaList>
          {project.techStack.length > 0 && (
            <TechRow aria-label="기술 스택">
              {project.techStack.map((tech) => (
                <TechPill key={tech}>{tech}</TechPill>
              ))}
            </TechRow>
          )}
          {project.githubUrl && (
            <GithubLink
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/github.svg" alt="" width={22} height={22} />
              GITHUB
            </GithubLink>
          )}
        </Details>
      </Content>
    </Section>
  );
}
