"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type TabId = "affiliation" | "competition" | "external";

/** 탭마다 독립 — 카드 UI만 공통 */
type ActivityCard = {
  id: string;
  role: string;
  org: string;
  start: string;
  end: string;
};

type CompetitionSlide = {
  id: string;
  org?: string;
  title: string;
  members?: string;
  award?: string;
  imageSrc?: string;
  imageSrcFallbacks?: string[];
  imageAlt?: string;
};

type ExternalActivity = {
  id: string;
  title: string;
  category: string;
  period: string;
  status?: "예정";
};

const publicImage = (filename: string) =>
  encodeURI(`/${filename.normalize("NFD")}`);

const publicImageFallbacks = (filename: string) => [
  ...new Set([
    encodeURI(`/${filename.normalize("NFD")}`),
    encodeURI(`/${filename.normalize("NFC")}`),
  ]),
];

/** macOS·배포 환경에서 한글 파일명 404 방지용 ASCII 별칭 */
const COMPETITION_IMAGE_ASCII: Record<string, string> = {
  "멋사_2024.jpg": "/likelion-hackathon-2024.jpg",
  "2025 전국 대학생 프로그래밍 경진대회.jpeg":
    "/competition-programming-2025.jpeg",
};

function competitionImage(filename: string) {
  const ascii = COMPETITION_IMAGE_ASCII[filename];
  const variants = [
    ...new Set([
      ...(ascii ? [ascii] : []),
      publicImage(filename),
      ...publicImageFallbacks(filename),
    ]),
  ];

  return {
    imageSrc: variants[0],
    imageSrcFallbacks: variants.slice(1),
  };
}

const CAROUSEL_WHEEL_COOLDOWN_MS = 280;
const CAROUSEL_DRAG_SNAP_RATIO = 0.06;
const CAROUSEL_DRAG_FLICK_VELOCITY = 0.25;
const CAROUSEL_DRAG_MULTIPLIER = 1.2;

function getCarouselSnapPositions(carousel: HTMLElement) {
  return Array.from(
    carousel.querySelectorAll<HTMLElement>("[data-carousel-slide]")
  ).map((slide) => slide.offsetLeft);
}

function getCarouselSnapIndex(scrollLeft: number, positions: number[]) {
  if (positions.length === 0) return 0;

  let nearest = 0;
  let minDistance = Infinity;

  positions.forEach((position, index) => {
    const distance = Math.abs(scrollLeft - position);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = index;
    }
  });

  return nearest;
}

function getCarouselSlideWidth(carousel: HTMLElement, positions: number[]) {
  if (positions.length > 1) {
    return positions[1] - positions[0];
  }

  const slide = carousel.querySelector<HTMLElement>("[data-carousel-slide]");
  return slide?.offsetWidth ?? carousel.clientWidth;
}

function resolveCarouselSnapIndex(
  carousel: HTMLElement,
  positions: number[],
  scrollStart: number,
  scrollLeft: number,
  velocity: number
) {
  if (positions.length === 0) return 0;

  const slideWidth = getCarouselSlideWidth(carousel, positions);
  const startIndex = getCarouselSnapIndex(scrollStart, positions);
  const dragDelta = scrollLeft - scrollStart;
  let targetIndex = getCarouselSnapIndex(scrollLeft, positions);

  if (Math.abs(velocity) > CAROUSEL_DRAG_FLICK_VELOCITY) {
    targetIndex = startIndex + (velocity > 0 ? 1 : -1);
  } else if (Math.abs(dragDelta) > slideWidth * CAROUSEL_DRAG_SNAP_RATIO) {
    targetIndex = startIndex + (dragDelta > 0 ? 1 : -1);
  }

  return Math.min(positions.length - 1, Math.max(0, targetIndex));
}

function buildImageCandidates(src: string, fallbacks: string[]) {
  return [...new Set([src, ...fallbacks.filter((item) => item !== src)])];
}

function CompetitionSlidePicture({
  src,
  fallbacks = [],
  alt,
}: {
  src: string;
  fallbacks?: string[];
  alt: string;
}) {
  const candidatesRef = useRef(buildImageCandidates(src, fallbacks));
  const [currentSrc, setCurrentSrc] = useState(
    () => candidatesRef.current[0] ?? src
  );

  useEffect(() => {
    const nextCandidates = buildImageCandidates(src, fallbacks);
    candidatesRef.current = nextCandidates;
    setCurrentSrc(nextCandidates[0] ?? src);
  }, [src, fallbacks]);

  return (
    <CarouselSlideImage>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={currentSrc}
        src={currentSrc}
        alt={alt}
        decoding="async"
        loading="eager"
        draggable={false}
        onError={() => {
          const candidates = candidatesRef.current;
          const failedIndex = candidates.indexOf(currentSrc);
          const next = candidates[failedIndex + 1];
          if (next) setCurrentSrc(next);
        }}
      />
    </CarouselSlideImage>
  );
}

type TabPanelConfig = {
  title: string;
  subtitle: string;
  cards: ActivityCard[];
  carousel?: CompetitionSlide[];
};

const TABS: { id: TabId; label: string }[] = [
  { id: "affiliation", label: "소속" },
  { id: "competition", label: "대회" },
  { id: "external", label: "대외 활동" },
];

const TAB_WIDTH = "216px";

/** 소속 탭 — 활동·소속 이력 전부 */
const AFFILIATION_CARDS: ActivityCard[] = [
  {
    id: "mobicom",
    role: "Mobicom LAB Member",
    org: "국립한밭대학교",
    start: "2024.11",
    end: "Present",
  },
  {
    id: "president",
    role: "컴퓨터공학과 42대 Byte 학생회 학생회장",
    org: "국립한밭대학교",
    start: "2025.12",
    end: "Present",
  },
  {
    id: "likelion-14",
    role: "멋쟁이사자처럼 14기 운영진",
    org: "멋쟁이사자처럼",
    start: "2026.03",
    end: "Present",
  },
  {
    id: "secretary",
    role: "컴퓨터공학과 41대 Binary 학생회 사무차장",
    org: "국립한밭대학교",
    start: "2024.11",
    end: "2024.12",
  },
  {
    id: "krafton",
    role: "크래프톤 웹개발 집중 캠프",
    org: "국립한밭대학교 x 크래프톤",
    start: "2025.08",
    end: "2025.08",
  },
  {
    id: "likelion-12",
    role: "멋쟁이사자처럼 12기 Member",
    org: "멋쟁이사자처럼",
    start: "2024.03",
    end: "2024.08",
  },
];

/** 대회 탭 — 가로 캐러셀 슬라이드 */
const COMPETITION_SLIDES: CompetitionSlide[] = [
  {
    id: "likelion-hackathon-2024",
    org: "멋쟁이사자처럼",
    title: "2024 멋쟁이사자처럼 중앙 해커톤",
    members: "김영권, 우은식, 남지우, 전지우, 김봉경",
    ...competitionImage("멋사_2024.jpg"),
    imageAlt: "2024 멋쟁이사자처럼 중앙 해커톤",
  },
  {
    id: "sw-ai-2025",
    title: "2025 소중한 SW/AI 경진대회",
    members: "김영권, 채성수, 이민지, 우은식",
    ...competitionImage("2025 소중한 SW:AI 경진대회.jpeg"),
    imageAlt: "2025 소중한 SW/AI 경진대회",
  },
  {
    id: "daejeon-agenda-2025",
    title: "2025 대전 지역의제 발굴 프로젝트",
    members: "안다은, 조문성, 우은식, 이채혁",
    award: "장려상",
    ...competitionImage("대전 지역의제 발굴 프로젝트.jpeg"),
    imageAlt: "2025 대전 지역의제 발굴 프로젝트",
  },
  {
    id: "kics-2025",
    title: "2025 한국통신학회 추계종합학술발표회",
    members: "이민지, 우은식",
    award: "우수상",
    ...competitionImage("한국통신학회 추계종합학술발표회.jpeg"),
    imageAlt: "2025 한국통신학회 추계종합학술발표회",
  },
  {
    id: "programming-2025",
    title: "2025 전국 대학생 프로그래밍 경진대회",
    members: "우은식",
    award: "장려상",
    ...competitionImage("2025 전국 대학생 프로그래밍 경진대회.jpeg"),
    imageAlt: "2025 전국 대학생 프로그래밍 경진대회",
  },
  {
    id: "public-data-2025",
    title: "2025 국립한밭대학교 공공데이터활용공모전",
    members: "우은식, 예다은, 강윤서, 이성지",
    award: "대상",
    ...competitionImage("국립한밭대학교 공공데이터활용공모전.jpeg"),
    imageAlt: "2025 국립한밭대학교 공공데이터활용공모전",
  },
  {
    id: "yuseong-livinglab-2025",
    title: "2025 유성 데이터 기반 실증 리빙랩",
    members: "육종범, 정민성, 우은식, 예다은",
    award: "우수상",
    ...competitionImage("2025 유성 데이터 기반 실증 리빙랩.jpeg"),
    imageAlt: "2025 유성 데이터 기반 실증 리빙랩",
  },
];

const EXTERNAL_ACTIVITIES: ExternalActivity[] = [
  {
    id: "likelion-12-external",
    title: "멋쟁이사자처럼 12기 참여",
    category: "Community",
    period: "2024",
  },
  {
    id: "abc-mentoring",
    title: "abc 프로젝트 멘토링 참여",
    category: "Mentoring",
    period: "2025",
  },
  {
    id: "daejeon-agenda-external",
    title: "대전 지역의제 발굴 프로그램 참여",
    category: "Project",
    period: "2025",
  },
  {
    id: "krafton-web-camp-external",
    title: "크래프톤 웹 집중 개발 캠프 참여",
    category: "Camp",
    period: "2025",
  },
  {
    id: "likelion-14-external",
    title: "멋쟁이사자처럼 14기 참여",
    category: "Community",
    period: "2026",
  },
  {
    id: "daejeon-youth-network",
    title: "대전 청년 네트워크사업 참여",
    category: "Network",
    period: "2026",
  },
  {
    id: "iwate-capstone",
    title: "이와테대학교 국제캡스톤 디자인 참여",
    category: "Global",
    period: "2026",
    status: "예정",
  },
];

const TAB_PANELS: Record<TabId, TabPanelConfig> = {
  affiliation: {
    title: "Affiliation",
    subtitle: "소속 / 활동",
    cards: AFFILIATION_CARDS,
  },
  competition: {
    title: "Challenge",
    subtitle: "대회",
    cards: [],
    carousel: COMPETITION_SLIDES,
  },
  external: {
    title: "Activity",
    subtitle: "대외 활동",
    cards: [],
  },
};

const Section = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  gap: clamp(40px, 5vw, 76px);
  width: 100%;
  min-height: calc(100dvh - var(--header-height, 88px));
  padding: 0 64px;
  transform: translateY(-28px);

  @media (max-width: 1100px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    padding: 0 24px;
    transform: translateY(-12px);
  }

  @media (max-width: 900px) {
    min-height: auto;
    padding: 0 var(--page-gutter);
    transform: none;
  }
`;

const WooVerticalBar = styled.div`
  position: absolute;
  left: 30px;
  top: 64px;
  width: clamp(330px, 28vw, 420px);
  height: calc(100% - 64px);
  background: #242424;
  z-index: 0;
  pointer-events: none;
  transform-origin: top center;
  transform: scaleY(0);

  @media (max-width: 1100px) {
    left: 24px;
    top: 24px;
    width: min(52vw, 220px);
    height: calc(42dvh - 24px);
  }

  @media (max-width: 640px) {
    left: var(--page-gutter);
    top: 16px;
    width: min(48vw, 160px);
    height: 224px;
  }
`;

const NameSide = styled.div`
  position: relative;
  z-index: 1;
  flex: 0 0 auto;
  margin-left: 32px;
  line-height: 0;
  opacity: 0;

  img {
    width: clamp(320px, 42vw, 720px) !important;
    height: auto !important;
  }

  @media (max-width: 1100px) {
    margin-left: 0;
    width: 100%;

    img {
      width: min(100%, 360px) !important;
    }
  }
`;

const TabAnim = styled.button`
  opacity: 0;
  border: none;
  background: none;
`;

const DividerAnim = styled.div`
  transform: scaleX(0);
`;

const HeadAnim = styled.div`
  opacity: 0;
`;

/** 소속·대회 탭 기준 높이 — 탭 전환 시 탭·구분선 위치 고정 */
const TabContent = styled.div`
  width: 100%;
  min-height: calc(max(min(43dvh, 430px), clamp(300px, 36vh, 390px)) + 150px);

  @media (max-width: 1100px) {
    min-height: calc(max(min(42dvh, 380px), clamp(280px, 36vh, 360px)) + 136px);
  }

  @media (max-width: 900px) {
    min-height: 0;
  }
`;

const CardAnim = styled.li`
  opacity: 0;
`;

const ContentSide = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  width: min(100%, 860px);
  min-width: 0;
  margin-left: auto;
  padding-left: 32px;
  padding-top: clamp(72px, 9svh, 108px);
  /* 탭 전환해도 블록 높이 동일 → 세로 중앙 정렬 시 탭 위치 유지 */
  min-height: calc(112px + min(43dvh, 430px) + 150px);

  @media (max-width: 1100px) {
    min-height: calc(104px + min(42dvh, 380px) + 136px);
    width: 100%;
    margin-left: 0;
    padding-left: 0;
    padding-top: clamp(56px, 8svh, 84px);
  }

  @media (max-width: 900px) {
    min-height: 0;
    padding-top: 0;
  }
`;

const TabRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 12px;

  @media (max-width: 1100px) {
    gap: 12px;
    width: 100%;
  }

  @media (max-width: 640px) {
    gap: 8px;
  }
`;

const TabDivider = styled(DividerAnim)`
  width: 100%;
  max-width: 860px;
  height: 9px;
  margin: 24px 0;
  border-radius: 0;
  background: linear-gradient(90deg, #242424 0%, #fff 100%);
  transform-origin: left center;

  @media (max-width: 640px) {
    height: 8px;
    margin: 22px 0;
  }
`;

const Tab = styled(TabAnim)<{ $active: boolean }>`
  box-sizing: border-box;
  width: min(${TAB_WIDTH}, 12vw);
  min-width: 172px;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Pretendard", sans-serif;
  font-size: 21px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  line-height: normal;
  text-align: center;
  color: #fff;
  background: ${({ $active }) => ($active ? "#000" : "#b7b7b7")};
  transition: background 0.25s ease, font-weight 0.2s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#000" : "#9a9a9a")};
  }

  @media (max-width: 1100px) {
    width: auto;
    min-width: 0;
    flex: 1;
    font-size: 16px;
    padding: 10px 8px;
  }

  @media (max-width: 420px) {
    font-size: 14px;
    padding: 9px 4px;
  }
`;

const SectionHead = styled(HeadAnim)`
  display: flex;
  flex-direction: column;
  margin-bottom: 22px;

  @media (max-width: 640px) {
    margin-bottom: 22px;
  }
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(40px, 7vw, 70px);
  font-weight: 700;
  line-height: 1.1;
`;

const SectionSub = styled.p`
  margin: 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(18px, 3vw, 27px);
  font-weight: 800;
  line-height: 1.1;
`;

const CardListViewport = styled.div`
  max-height: min(43dvh, 430px);
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  max-width: 860px;
  padding-right: 4px;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1100px) {
    max-height: min(42dvh, 380px);
  }

  @media (max-width: 900px) {
    max-height: none;
  }
`;

const CardList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 640px) {
    gap: 18px;
  }
`;

const Card = styled(CardAnim)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 26px;
  border-radius: 12px;
  background: #000;
  color: #fff;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 20px;
  }
`;

const CardMain = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CardRole = styled.span`
  font-family: "Pretendard", sans-serif;
  font-size: clamp(22px, 5.5vw, 28px);
  font-weight: 400;
  line-height: 123.871%;
`;

const CardOrg = styled.span`
  font-family: "Pretendard", sans-serif;
  font-size: clamp(17px, 4.5vw, 22px);
  font-weight: 300;
  line-height: 123.871%;
  color: #bcbcbc;
`;

const CardPeriod = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  text-align: right;

  @media (max-width: 640px) {
    align-items: flex-start;
    text-align: left;
  }
`;

const CardPeriodLine = styled.span`
  font-family: "Pretendard", sans-serif;
  font-size: 22px;
  color: #939393;
  font-weight: 200;
  line-height: 123.871%;
  white-space: nowrap;
`;

const CarouselViewport = styled.div`
  width: 100%;
  max-width: 860px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 4px 0 12px;
  touch-action: pan-x;
  -webkit-overflow-scrolling: touch;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: 24px;
  width: max-content;
  padding: 0 4px;

  @media (max-width: 640px) {
    gap: 16px;
  }
`;

const CarouselSlide = styled.article`
  flex: 0 0 auto;
  width: clamp(500px, 66vw, 640px);
  height: clamp(300px, 38svh, 400px);
  border-radius: 12px;
  background: #000;
  overflow: hidden;
  position: relative;

  img {
    filter: grayscale(100%);
    transition: filter 0.4s ease;
  }

  &:hover img {
    filter: grayscale(0%);
  }

  @media (prefers-reduced-motion: reduce) {
    img {
      filter: none;
      transition: none;
    }
  }

  @media (max-width: 640px) {
    width: calc(100vw - (var(--page-gutter) * 2));
    height: min(62vh, 420px);
  }
`;

const CarouselSlideImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  transform: translateZ(0);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const TabPanelsWrap = styled.div`
  width: 100%;
`;

const TabPanel = styled.div<{ $active: boolean }>`
  display: ${({ $active }) => ($active ? "block" : "none")};
  width: 100%;
`;

const CarouselSlideInfo = styled.div`
  position: absolute;
  inset: auto 0 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px 32px;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.88) 72%);
  color: #fff;
  pointer-events: none;

  @media (max-width: 640px) {
    padding: 22px 20px;
  }
`;

const CarouselSlideOrg = styled.span`
  font-family: "Pretendard", sans-serif;
  font-size: clamp(16px, 4.4vw, 22px);
  font-weight: 300;
  line-height: 1.3;
  color: #bcbcbc;
`;

const CarouselSlideTitle = styled.h3`
  margin: 0;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(22px, 5.5vw, 28px);
  font-weight: 700;
  line-height: 1.25;
`;

const CarouselSlideMembers = styled.p`
  margin: 0;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(15px, 4vw, 20px);
  font-weight: 300;
  line-height: 1.4;
  color: #d4d4d4;
`;

const CarouselSlideAward = styled.p`
  margin: 0;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(17px, 4.5vw, 22px);
  font-weight: 600;
  line-height: 1.3;
  color: #97c42f;
`;

const CarouselSlidePlaceholder = styled.span`
  position: absolute;
  left: 24px;
  bottom: 24px;
  font-family: "Pretendard", sans-serif;
  font-size: 22px;
  font-weight: 400;
  color: #939393;
`;

const ExternalViewport = styled.div`
  width: 100%;
  max-width: 860px;
  max-height: min(43dvh, 430px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1100px) {
    max-height: min(42dvh, 380px);
  }

  @media (max-width: 900px) {
    max-height: none;
  }
`;

const ExternalTimeline = styled.ol`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0;
  padding: 0 0 0 52px;
  list-style: none;

  &::before {
    content: "";
    position: absolute;
    left: 18px;
    top: 18px;
    bottom: 18px;
    width: 3px;
    border-radius: 999px;
    background: #000;
  }

  @media (max-width: 640px) {
    padding-left: 42px;
  }
`;

const ExternalItem = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;
  min-height: 104px;
  padding: 24px 26px;
  border: 2px solid #000;
  border-radius: 18px;
  background: #fff;
  color: #000;
  transform-origin: left center;

  &::before {
    content: attr(data-index);
    position: absolute;
    left: -52px;
    top: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border: 2px solid #000;
    border-radius: 50%;
    background: #fff;
    color: #000;
    font-family: "Pretendard", sans-serif;
    font-size: 15px;
    font-weight: 900;
    line-height: 1;
    transform: translateY(-50%);
  }

  &:nth-of-type(2n) {
    background: #000;
    color: #fff;

    [data-external-meta] {
      color: #bcbcbc;
    }

    [data-external-chip] {
      border-color: #fff;
      color: #fff;
    }
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: 640px) {
    min-height: 0;
    padding: 20px 18px;
    border-radius: 14px;
  }
`;

const ExternalMain = styled.div`
  min-width: 0;
`;

const ExternalMeta = styled.span`
  display: block;
  color: #777;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
`;

const ExternalTitle = styled.h3`
  margin: 8px 0 0;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 800;
  line-height: 1.28;
  word-break: keep-all;
`;

const ExternalChipRow = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 760px) {
    justify-content: flex-start;
  }
`;

const ExternalChip = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 14px;
  border: 2px solid #000;
  border-radius: 999px;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
`;

const ExternalStatusChip = styled(ExternalChip)`
  background: #000;
  color: #fff;
`;

function ActivityCardItem({ item }: { item: ActivityCard }) {
  return (
    <Card data-card data-affiliation-card>
      <CardMain>
        <CardRole>{item.role}</CardRole>
        <CardOrg>{item.org}</CardOrg>
      </CardMain>
      <CardPeriod>
        <CardPeriodLine>{item.start}</CardPeriodLine>
        <CardPeriodLine>{item.end}</CardPeriodLine>
      </CardPeriod>
    </Card>
  );
}

function ExternalActivityList() {
  return (
    <ExternalViewport data-panel-scroll>
      <ExternalTimeline aria-label="대외 활동 목록">
        {EXTERNAL_ACTIVITIES.map((item, index) => (
          <ExternalItem
            key={item.id}
            data-index={String(index + 1).padStart(2, "0")}
            data-external-item
          >
            <ExternalMain>
              <ExternalMeta data-external-meta>
                {item.period} / {item.category}
              </ExternalMeta>
              <ExternalTitle>{item.title}</ExternalTitle>
            </ExternalMain>
            <ExternalChipRow>
              <ExternalChip data-external-chip>{item.category}</ExternalChip>
              {item.status && (
                <ExternalStatusChip data-external-chip>
                  {item.status}
                </ExternalStatusChip>
              )}
            </ExternalChipRow>
          </ExternalItem>
        ))}
      </ExternalTimeline>
    </ExternalViewport>
  );
}

function ActivityCardList({
  items,
  listRef,
}: {
  items: ActivityCard[];
  listRef?: RefObject<HTMLDivElement | null>;
}) {
  if (items.length === 0) return null;

  return (
    <CardListViewport ref={listRef} data-panel-scroll>
      <CardList>
        {items.map((item) => (
          <ActivityCardItem key={item.id} item={item} />
        ))}
      </CardList>
    </CardListViewport>
  );
}

function CompetitionCarousel({
  slides,
  carouselRef,
  active,
}: {
  slides: CompetitionSlide[];
  carouselRef?: RefObject<HTMLDivElement | null>;
  active: boolean;
}) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    scrollStart: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });

  const setViewportRef = useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (carouselRef) {
        carouselRef.current = node;
      }
    },
    [carouselRef]
  );

  useLayoutEffect(() => {
    if (!active) return;
    const el = localRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const now = performance.now();
      dragRef.current.dragging = true;
      dragRef.current.startX = e.clientX;
      dragRef.current.lastX = e.clientX;
      dragRef.current.lastTime = now;
      dragRef.current.velocity = 0;
      dragRef.current.scrollStart = el.scrollLeft;
      el.style.scrollBehavior = "auto";
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current.dragging) return;
      e.preventDefault();

      const now = performance.now();
      const deltaX = e.clientX - dragRef.current.lastX;
      const deltaTime = now - dragRef.current.lastTime;

      if (deltaTime > 0) {
        dragRef.current.velocity = -deltaX / deltaTime;
      }

      dragRef.current.lastX = e.clientX;
      dragRef.current.lastTime = now;

      el.scrollLeft =
        dragRef.current.scrollStart -
        (e.clientX - dragRef.current.startX) * CAROUSEL_DRAG_MULTIPLIER;
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragRef.current.dragging) return;
      dragRef.current.dragging = false;
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }

      const positions = getCarouselSnapPositions(el);
      if (positions.length === 0) return;

      const index = resolveCarouselSnapIndex(
        el,
        positions,
        dragRef.current.scrollStart,
        el.scrollLeft,
        dragRef.current.velocity
      );

      el.style.scrollBehavior = "smooth";
      el.scrollTo({ left: positions[index], behavior: "smooth" });
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
    };
  }, [active, slides.length]);

  if (slides.length === 0) return null;

  return (
    <CarouselViewport
      ref={setViewportRef}
      data-panel-scroll
      data-panel-scroll-axis="horizontal"
      aria-label="대회 캐러셀"
    >
      <CarouselTrack>
        {slides.map((slide) => (
          <CarouselSlide
            key={slide.id}
            data-carousel-slide
            tabIndex={0}
          >
            {slide.imageSrc ? (
              <>
                <CompetitionSlidePicture
                  src={slide.imageSrc}
                  fallbacks={slide.imageSrcFallbacks}
                  alt={slide.imageAlt ?? slide.title}
                />
                <CarouselSlideInfo>
                  {slide.org && (
                    <CarouselSlideOrg>{slide.org}</CarouselSlideOrg>
                  )}
                  <CarouselSlideTitle>{slide.title}</CarouselSlideTitle>
                  {slide.members && (
                    <CarouselSlideMembers>
                      팀원 : {slide.members}
                    </CarouselSlideMembers>
                  )}
                  {slide.award && (
                    <CarouselSlideAward>{slide.award}</CarouselSlideAward>
                  )}
                </CarouselSlideInfo>
              </>
            ) : (
              <CarouselSlidePlaceholder>{slide.title}</CarouselSlidePlaceholder>
            )}
          </CarouselSlide>
        ))}
      </CarouselTrack>
    </CarouselViewport>
  );
}

export function AboutAffiliation() {
  const scopeRef = useRef<HTMLElement>(null);
  const listViewportRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);
  const contentSideRef = useRef<HTMLDivElement>(null);
  const carouselWheelCooldown = useRef(0);
  const tabSwitchTl = useRef<gsap.core.Timeline | null>(null);
  const isTabAnimating = useRef(false);
  const hasIntroPlayed = useRef(false);
  const [activeTab, setActiveTab] = useState<TabId>("affiliation");

  const { title, subtitle } = TAB_PANELS[activeTab];

  useEffect(() => {
    if (activeTab === "competition") {
      document.body.dataset.carouselWheelLock = "true";
    } else {
      delete document.body.dataset.carouselWheelLock;
    }
    return () => {
      delete document.body.dataset.carouselWheelLock;
    };
  }, [activeTab]);

  useLayoutEffect(() => {
    if (activeTab !== "competition") return;

    const zone = contentSideRef.current;
    const carousel = carouselRef.current;
    if (!zone || !carousel) return;

    const onWheel = (e: WheelEvent) => {
      if (!zone.contains(e.target as Node)) return;

      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      const now = Date.now();
      if (now - carouselWheelCooldown.current < CAROUSEL_WHEEL_COOLDOWN_MS) {
        return;
      }
      carouselWheelCooldown.current = now;

      const positions = getCarouselSnapPositions(carousel);
      if (positions.length === 0) return;

      const currentIndex = getCarouselSnapIndex(carousel.scrollLeft, positions);
      const nextIndex = Math.min(
        positions.length - 1,
        Math.max(0, currentIndex + (delta > 0 ? 1 : -1))
      );

      if (nextIndex === currentIndex) return;

      carousel.scrollTo({
        left: positions[nextIndex],
        behavior: "smooth",
      });
    };

    window.addEventListener("wheel", onWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
    };
  }, [activeTab]);

  useEffect(() => {
    const section = scopeRef.current;
    const panel = section?.closest<HTMLElement>("[data-panel]");
    if (!panel) return;

    const preloadCompetitionImages = () => {
      COMPETITION_SLIDES.forEach((slide) => {
        if (!slide.imageSrc) return;
        const img = new window.Image();
        img.src = slide.imageSrc;
      });
    };

    panel.addEventListener("panel-enter", preloadCompetitionImages);
    return () =>
      panel.removeEventListener("panel-enter", preloadCompetitionImages);
  }, []);

  const handleTabClick = (tabId: TabId) => {
    if (tabId === activeTab || isTabAnimating.current) return;

    const scope = scopeRef.current;
    const head = scope?.querySelector<HTMLElement>("[data-head]");
    const outPanel = scope?.querySelector<HTMLElement>(
      `[data-tab-panel="${activeTab}"]`
    );

    const releaseWheelLock = () => {
      delete document.body.dataset.carouselWheelLock;
    };

    const resetScroll = () => {
      const panelScroller = scope?.querySelector<HTMLElement>(
        `[data-tab-panel="${tabId}"] [data-panel-scroll]:not([data-panel-scroll-axis])`
      );
      if (panelScroller) panelScroller.scrollTop = 0;
      if (listViewportRef.current) listViewportRef.current.scrollTop = 0;
      if (carouselRef.current) carouselRef.current.scrollLeft = 0;
      releaseWheelLock();
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!scope || !head || !outPanel || reduceMotion) {
      resetScroll();
      setActiveTab(tabId);
      return;
    }

    isTabAnimating.current = true;
    tabSwitchTl.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        isTabAnimating.current = false;
      },
    });

    tabSwitchTl.current = tl;

    tl.to(head, {
      autoAlpha: 0,
      y: -10,
      duration: 0.2,
      ease: "power2.in",
    }).to(
      outPanel,
      {
        autoAlpha: 0,
        y: -12,
        duration: 0.22,
        ease: "power2.in",
      },
      "<"
    );

    tl.add(() => {
      if (activeTab === "competition") {
        gsap.set(outPanel.querySelectorAll("[data-carousel-slide]"), {
          clearProps: "all",
        });
      }

      flushSync(() => {
        resetScroll();
        setActiveTab(tabId);
      });

      const inPanel = scope.querySelector<HTMLElement>(
        `[data-tab-panel="${tabId}"]`
      );
      const nextHead = scope.querySelector<HTMLElement>("[data-head]");
      if (!inPanel || !nextHead) return;

      gsap.set(nextHead, { autoAlpha: 0, y: 12 });
      gsap.set(inPanel, { autoAlpha: 1, visibility: "visible", y: 16 });

      if (tabId === "competition") {
        gsap.set(inPanel.querySelectorAll("[data-carousel-slide]"), {
          autoAlpha: 0,
          x: 48,
        });
      }
    });

    tl.to(scope.querySelector("[data-head]"), {
      autoAlpha: 1,
      y: 0,
      duration: 0.32,
      ease: "power3.out",
    })
      .to(
        scope.querySelector(`[data-tab-panel="${tabId}"]`),
        { y: 0, duration: 0.34, ease: "power3.out" },
        "-=0.22"
      );

    if (tabId === "competition") {
      tl.to(
        scope.querySelectorAll<HTMLElement>(
          `[data-tab-panel="competition"] [data-carousel-slide]`
        ),
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.1,
        },
        "-=0.2"
      );
    } else {
      tl.set(scope.querySelector(`[data-tab-panel="${tabId}"]`), {
        clearProps: "transform",
      });
    }
  };

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope || activeTab === "competition") return;

      const list = scope.querySelector<HTMLElement>(
        `[data-tab-panel="${activeTab}"] [data-panel-scroll]:not([data-panel-scroll-axis])`
      );
      if (!list) return;

      const stopBubble = (e: Event) => e.stopPropagation();
      list.addEventListener("wheel", stopBubble, { passive: true });
      return () => list.removeEventListener("wheel", stopBubble);
    },
    { scope: scopeRef, dependencies: [activeTab] }
  );

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const panel = scope.closest<HTMLElement>("[data-panel]");
      const bar = scope.querySelector<HTMLElement>("[data-bar]");
      const name = scope.querySelector<HTMLElement>("[data-name]");
      const tabs = scope.querySelectorAll<HTMLElement>("[data-tab]");
      const divider = scope.querySelector<HTMLElement>("[data-divider]");
      const head = scope.querySelector<HTMLElement>("[data-head]");
      const cards = scope.querySelectorAll<HTMLElement>(
        "[data-affiliation-card]"
      );

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const setHidden = () => {
        gsap.set(bar, { scaleY: 0, opacity: 1 });
        gsap.set(name, { autoAlpha: 0, x: -40 });
        gsap.set(tabs, { autoAlpha: 0, y: 24 });
        gsap.set(divider, { scaleX: 0 });
        gsap.set(head, { autoAlpha: 0, y: 20 });
        gsap.set(cards, { autoAlpha: 0, y: 32 });
      };

      const setVisible = () => {
        gsap.set(bar, { scaleY: 1, opacity: 1 });
        gsap.set(name, { autoAlpha: 1, x: 0 });
        gsap.set(tabs, { autoAlpha: 1, y: 0 });
        gsap.set(divider, { scaleX: 1 });
        gsap.set(head, { autoAlpha: 1, y: 0 });
        gsap.set(cards, { autoAlpha: 1, y: 0 });
      };

      if (reduceMotion) {
        setVisible();
        return;
      }

      setHidden();

      const buildTimeline = () => {
        const tl = gsap.timeline({ paused: true });

        tl.to(bar, {
          scaleY: 1,
          opacity: 1,
          duration: 0.85,
          ease: "power3.inOut",
        })
          .to(
            name,
            { autoAlpha: 1, x: 0, duration: 0.7, ease: "power3.out" },
            "-=0.55"
          )
          .to(
            tabs,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
              stagger: 0.08,
            },
            "-=0.35"
          )
          .to(
            divider,
            { scaleX: 1, duration: 0.55, ease: "power3.inOut" },
            "-=0.25"
          )
          .to(
            head,
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
            "-=0.35"
          )
          .to(
            cards,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
              stagger: 0.1,
            },
            "-=0.3"
          );

        return tl;
      };

      let tl = buildTimeline();

      const play = () => {
        if (hasIntroPlayed.current) {
          setVisible();
          return;
        }
        if (tl.isActive()) return;
        tl.kill();
        setHidden();
        tl = buildTimeline();
        tl.eventCallback("onComplete", () => {
          hasIntroPlayed.current = true;
        });
        tl.play(0);
      };

      const reset = () => {
        tl.kill();
        setVisible();
      };

      const onPanelEnter = () => play();
      const onPanelLeave = () => reset();

      panel?.addEventListener("panel-enter", onPanelEnter);
      panel?.addEventListener("panel-leave", onPanelLeave);

      let io: IntersectionObserver | null = null;
      if (panel) {
        io = new IntersectionObserver(
          ([entry]) => {
            const el = entry.target as HTMLElement;
            const visible =
              getComputedStyle(el).visibility === "visible" &&
              Number(getComputedStyle(el).opacity) > 0.05;
            if (
              visible &&
              entry.isIntersecting &&
              entry.intersectionRatio > 0.2
            ) {
              play();
            }
          },
          { threshold: [0, 0.2, 0.5] }
        );
        io.observe(panel);
      }

      return () => {
        tl.kill();
        io?.disconnect();
        panel?.removeEventListener("panel-enter", onPanelEnter);
        panel?.removeEventListener("panel-leave", onPanelLeave);
      };
    },
    { scope: scopeRef }
  );

  return (
    <Section ref={scopeRef} data-about-affiliation>
      <WooVerticalBar data-bar aria-hidden />
      <NameSide data-name>
        <Image
          src="/WooEunsik.svg"
          alt="Woo Eunsik"
          width={784}
          height={492}
          priority
          sizes="(max-width: 1100px) 90vw, 720px"
        />
      </NameSide>
      <ContentSide
        ref={contentSideRef}
        data-competition-wheel-zone={
          activeTab === "competition" ? "" : undefined
        }
      >
        <TabRow>
          {TABS.map((tab) => (
            <Tab
              key={tab.id}
              data-tab
              type="button"
              $active={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabRow>
        <TabDivider data-divider />
        <TabContent ref={tabContentRef} data-tab-content>
          <SectionHead data-head>
            <SectionTitle>{title}</SectionTitle>
            <SectionSub>{subtitle}</SectionSub>
          </SectionHead>
          <TabPanelsWrap>
            <TabPanel
              data-tab-panel="affiliation"
              $active={activeTab === "affiliation"}
            >
              <ActivityCardList
                items={AFFILIATION_CARDS}
                listRef={listViewportRef}
              />
            </TabPanel>
            <TabPanel
              data-tab-panel="competition"
              $active={activeTab === "competition"}
            >
              <CompetitionCarousel
                slides={COMPETITION_SLIDES}
                carouselRef={carouselRef}
                active={activeTab === "competition"}
              />
            </TabPanel>
            <TabPanel
              data-tab-panel="external"
              $active={activeTab === "external"}
            >
              <ExternalActivityList />
            </TabPanel>
          </TabPanelsWrap>
        </TabContent>
      </ContentSide>
    </Section>
  );
}
