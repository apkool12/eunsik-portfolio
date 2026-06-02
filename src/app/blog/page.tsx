"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BLOG_POSTS, type BlogCategory } from "@/constants/blog";

type BlogFilter = "all" | BlogCategory;

const BLOG_FILTERS: { id: BlogFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "dev", label: "Dev Notes" },
  { id: "daily", label: "Daily" },
];

const Page = styled.main`
  --blog-gutter: var(--page-gutter);

  min-height: calc(100dvh - var(--header-height, 88px));
  padding: clamp(112px, 15vh, 168px) var(--blog-gutter) 72px;
  background: #fff;
  overflow-x: hidden;

  @media (max-width: 900px) {
    padding-top: clamp(72px, 12vh, 112px);
  }

  @media (max-width: 480px) {
    --blog-gutter: clamp(28px, 7vw, 34px);

    padding-top: 84px;
    padding-bottom: 56px;
  }
`;

const HeaderArea = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 440px);
  gap: clamp(48px, 7vw, 112px);
  align-items: end;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(72px, 16vw, 180px);
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0;

  @media (max-width: 480px) {
    font-size: clamp(58px, 18vw, 78px);
  }
`;

const Intro = styled.div`
  padding-bottom: 16px;
`;

const IntroEyebrow = styled.span`
  display: block;
  color: #97c42f;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.2;
`;

const IntroText = styled.p`
  margin: 18px 0 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(22px, 2.8vw, 34px);
  font-weight: 300;
  line-height: 1.38;
  word-break: keep-all;

  @media (max-width: 640px) {
    font-size: 18px;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }
`;

const Content = styled.section`
  margin-top: clamp(42px, 6vh, 72px);
`;

const ArchiveBar = styled.div`
  display: grid;
  grid-template-columns: auto minmax(80px, 1fr) auto;
  align-items: center;
  gap: 18px;
  margin-bottom: clamp(24px, 3.5vh, 36px);

  @media (max-width: 640px) {
    grid-template-columns: auto minmax(34px, 1fr);
    gap: 12px;
  }
`;

const ArchiveLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 64px;
  padding: 0 30px;
  border: 3px solid #000;
  border-radius: 999px;
  background: #000;
  color: #fff;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 900;
  line-height: 1;

  @media (max-width: 640px) {
    min-height: 52px;
    padding: 0 22px;
  }
`;

const ArchiveLine = styled.span`
  position: relative;
  height: 3px;
  background: #000;

  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #97c42f;
    transform: translateY(-50%);
  }
`;

const ArchiveCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 20px;
  border: 3px solid #000;
  border-radius: 999px;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 900;
  line-height: 1;

  @media (max-width: 640px) {
    grid-column: 1 / -1;
    justify-self: start;
    min-height: 44px;
    padding: 0 16px;
  }
`;

const Feed = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(34px, 5vh, 54px);

  @media (max-width: 480px) {
    gap: 32px;
  }
`;

const FilterTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0 0 clamp(30px, 4vh, 48px);
`;

const FilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 20px;
  border: 2px solid #000;
  border-radius: 999px;
  background: #fff;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(15px, 1.8vw, 18px);
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &[data-active="true"],
  &:hover,
  &:focus-visible {
    background: #000;
    color: #fff;
    outline: none;
    transform: translateY(-2px);
  }

  &[data-active="true"] {
    box-shadow: inset 0 0 0 4px #97c42f;
  }

  @media (max-width: 480px) {
    min-height: 38px;
    padding: 0 14px;
  }
`;

const PostLink = styled(Link)`
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr) minmax(120px, 180px);
  gap: 26px;
  align-items: start;
  min-height: 132px;
  color: #000;
  color: #000;
  text-decoration: none;
  transition: transform 0.22s ease;

  &:hover,
  &:focus-visible {
    transform: translateX(10px);
    outline: none;

    h2 {
      color: #6f941c;
    }

    [data-blog-thumb] {
      border-color: #97c42f;
      background: #fff;
    }

    [data-blog-thumb-icon],
    [data-blog-tag] {
      border-color: #97c42f;
      color: #6f941c;
    }
  }

  @media (max-width: 760px) {
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 18px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 58px minmax(0, 1fr);
    gap: 16px;
    min-height: 0;

    &:hover,
    &:focus-visible {
      transform: translateX(4px);
    }
  }
`;

const Thumbnail = styled.div`
  position: relative;
  width: 92px;
  height: 92px;
  border: 3px solid #000;
  border-radius: 50%;
  background:
    radial-gradient(circle at 66% 32%, #97c42f 0 6px, transparent 7px),
    linear-gradient(135deg, #fff 0 34%, #111 34% 44%, #fff 44% 60%, #000 60%);
  overflow: visible;

  &[data-tone="green"] {
    background:
      radial-gradient(circle at 66% 32%, #97c42f 0 6px, transparent 7px),
      repeating-linear-gradient(90deg, #000 0 8px, #fff 8px 16px);
  }

  &[data-tone="mono"] {
    background:
      radial-gradient(circle at 66% 32%, #97c42f 0 6px, transparent 7px),
      repeating-linear-gradient(135deg, #111 0 8px, #fff 8px 16px);
  }

  @media (max-width: 760px) {
    width: 72px;
    height: 72px;
  }

  @media (max-width: 480px) {
    width: 58px;
    height: 58px;
    border-width: 2px;
  }
`;

const ThumbnailIcon = styled.span`
  position: absolute;
  right: -10px;
  bottom: -8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 3px solid #000;
  border-radius: 50%;
  background: #fff;
  font-size: 18px;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 900;

  @media (max-width: 480px) {
    right: -8px;
    bottom: -7px;
    width: 28px;
    height: 28px;
    border-width: 2px;
    font-size: 10px;
  }
`;

const PostMain = styled.div`
  min-width: 0;
`;

const PostTitle = styled.h2`
  margin: 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(24px, 4vw, 42px);
  font-weight: 900;
  line-height: 1.18;
  letter-spacing: 0;
  word-break: keep-all;
  overflow-wrap: anywhere;

  @media (max-width: 480px) {
    font-size: clamp(21px, 6.4vw, 27px);
    line-height: 1.26;
  }
`;

const PostExcerpt = styled.p`
  max-width: 980px;
  margin: 10px 0 0;
  color: #999;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(17px, 2.4vw, 28px);
  font-weight: 600;
  line-height: 1.35;
  word-break: keep-all;

  @media (max-width: 480px) {
    font-size: 15px;
    line-height: 1.5;
    word-break: normal;
    overflow-wrap: anywhere;
  }
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 14px;
  border: 2px solid #000;
  border-radius: 999px;
  background: #fff;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 500;

  @media (max-width: 480px) {
    min-height: 30px;
    padding: 0 10px;
    font-size: 12px;
  }
`;

const DateText = styled.span`
  justify-self: end;
  margin-top: 56px;
  color: #b7b7b7;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(18px, 2.4vw, 26px);
  font-weight: 800;
  line-height: 1.2;

  @media (max-width: 760px) {
    grid-column: 2;
    justify-self: start;
    margin-top: 0;
  }
`;

const AuthorNote = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  margin-top: clamp(64px, 9vh, 96px);
  padding-top: 24px;
  border-top: 2px solid #000;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const AuthorAvatar = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #000;
  color: #fff;
  font-family: "Pretendard", sans-serif;
  font-size: 26px;
  font-weight: 900;
`;

const AuthorCopy = styled.div`
  min-width: 0;
`;

const AuthorTitle = styled.h2`
  margin: 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: 28px;
  font-weight: 900;
  line-height: 1.2;
`;

const AuthorText = styled.p`
  margin: 8px 0 0;
  color: #777;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.55;
  word-break: keep-all;
`;

export default function BlogPage() {
  const scopeRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<BlogFilter>("all");
  const visiblePosts = useMemo(
    () =>
      activeFilter === "all"
        ? BLOG_POSTS
        : BLOG_POSTS.filter((post) => post.category === activeFilter),
    [activeFilter]
  );

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduceMotion) return;

      const title = scope.querySelector("[data-blog-title]");
      const intro = scope.querySelector("[data-blog-intro]");
      const archive = scope.querySelector("[data-blog-archive]");
      const filters = scope.querySelectorAll("[data-blog-filter]");
      const posts = scope.querySelectorAll("[data-blog-post]");
      const thumbs = scope.querySelectorAll("[data-blog-thumb]");
      const author = scope.querySelector("[data-blog-author]");

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(title, { y: 42, autoAlpha: 0, duration: 0.72 })
        .from(intro, { y: 26, autoAlpha: 0, duration: 0.58 }, "-=0.34")
        .from(
          archive,
          { clipPath: "inset(0 100% 0 0)", autoAlpha: 0, duration: 0.58 },
          "-=0.18"
        )
        .from(
          filters,
          { y: 12, autoAlpha: 0, stagger: 0.05, duration: 0.32 },
          "-=0.24"
        )
        .from(
          thumbs,
          {
            scale: 0.72,
            rotation: -10,
            autoAlpha: 0,
            duration: 0.48,
            stagger: 0.1,
            ease: "back.out(1.6)",
          },
          "-=0.32"
        )
        .from(
          posts,
          {
            x: -28,
            autoAlpha: 0,
            duration: 0.52,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.18"
        )
        .from(author, { y: 18, autoAlpha: 0, duration: 0.42 }, "-=0.28");
    },
    { scope: scopeRef }
  );

  return (
    <Page ref={scopeRef}>
      <HeaderArea>
        <Title data-blog-title>Blog,</Title>
        <Intro data-blog-intro>
          <IntroEyebrow>write, debug, refine</IntroEyebrow>
          <IntroText>
            만들면서 배운 것들을 짧고 선명하게 남깁니다. 코드와 화면 사이에서
            오래 고민한 흔적을 모으는 공간입니다.
          </IntroText>
        </Intro>
      </HeaderArea>

      <Content>
        <ArchiveBar data-blog-archive aria-label="블로그 아카이브">
          <ArchiveLabel>Archive</ArchiveLabel>
          <ArchiveLine />
          <ArchiveCount>{visiblePosts.length} Notes</ArchiveCount>
        </ArchiveBar>

        <FilterTabs aria-label="블로그 카테고리">
          {BLOG_FILTERS.map((filter) => (
            <FilterButton
              key={filter.id}
              type="button"
              data-active={activeFilter === filter.id}
              data-blog-filter
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterTabs>

        <Feed aria-label="블로그 글 목록">
          {visiblePosts.map((post) => (
            <PostLink
              key={post.number}
              href={`/blog/${post.slug}`}
              data-blog-post
              scroll={false}
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              <Thumbnail data-tone={post.tone} data-blog-thumb>
                <ThumbnailIcon data-blog-thumb-icon>
                  {post.mark}
                </ThumbnailIcon>
              </Thumbnail>
              <PostMain>
                <PostTitle>{post.title}</PostTitle>
                <PostExcerpt>{post.excerpt}</PostExcerpt>
                <TagRow>
                  {post.tags.map((tag) => (
                    <Tag key={tag} data-blog-tag>
                      {tag}
                    </Tag>
                  ))}
                </TagRow>
              </PostMain>
              <DateText>{post.date}</DateText>
            </PostLink>
          ))}
        </Feed>

        <AuthorNote data-blog-author>
          <AuthorAvatar>EW</AuthorAvatar>
          <AuthorCopy>
            <AuthorTitle>Eunsik Woo</AuthorTitle>
            <AuthorText>
              배운 내용을 그냥 지나치지 않기 위해 기록합니다. 구현 과정의 선택,
              막혔던 지점, 다시 읽고 싶은 생각들을 블로그에 차곡차곡 남깁니다.
            </AuthorText>
          </AuthorCopy>
        </AuthorNote>
      </Content>
    </Page>
  );
}
