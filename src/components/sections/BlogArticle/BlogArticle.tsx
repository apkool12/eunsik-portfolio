"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BlogCodeBlock } from "@/components/ui/BlogCodeBlock";
import {
  BLOG_POSTS,
  isBlogCodeBlock,
  type BlogPost,
} from "@/constants/blog";

const Page = styled.main`
  --article-gutter: var(--page-gutter);

  min-height: calc(100dvh - var(--header-height, 88px));
  padding: clamp(96px, 13vh, 148px) var(--article-gutter) 84px;
  background: #fff;
  overflow-x: hidden;

  @media (max-width: 640px) {
    --article-gutter: clamp(28px, 7vw, 34px);

    padding-top: 86px;
    padding-bottom: 64px;
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
  text-decoration: none;

  &::before {
    content: "";
    width: 34px;
    height: 2px;
    background: #000;
  }
`;

const Hero = styled.header`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(180px, 260px);
  gap: clamp(40px, 6vw, 80px);
  align-items: end;
  margin-top: clamp(42px, 7vh, 78px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 34px;
  }
`;

const TitleGroup = styled.div`
  min-width: 0;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #999;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;

  @media (max-width: 480px) {
    gap: 8px;
    font-size: 15px;
  }
`;

const Title = styled.h1`
  max-width: 1080px;
  margin: 18px 0 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(40px, 8vw, 104px);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: 0;
  word-break: keep-all;
  overflow-wrap: anywhere;

  @media (max-width: 640px) {
    margin-top: 14px;
    font-size: clamp(32px, 10vw, 42px);
    line-height: 1.12;
  }
`;

const Lead = styled.p`
  max-width: 880px;
  margin: 28px 0 0;
  color: #555;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(19px, 2.8vw, 34px);
  font-weight: 300;
  line-height: 1.46;
  word-break: keep-all;

  @media (max-width: 640px) {
    margin-top: 18px;
    font-size: 17px;
    line-height: 1.62;
    overflow-wrap: anywhere;
  }
`;

const HeroThumb = styled.div`
  position: relative;
  width: min(100%, 260px);
  aspect-ratio: 1;
  justify-self: end;
  border: 3px solid #000;
  border-radius: 50%;
  background:
    radial-gradient(circle at 68% 34%, rgba(151, 196, 47, 0.9) 0 8px, transparent 9px),
    repeating-linear-gradient(135deg, #111 0 10px, #fff 10px 20px);
  overflow: hidden;
  box-shadow: 0 0 0 12px #fff, 0 0 0 15px #000;

  &[data-tone="blue"] {
    background:
      radial-gradient(circle at 68% 34%, rgba(151, 196, 47, 0.9) 0 8px, transparent 9px),
      linear-gradient(135deg, #fff 0 36%, #111 36% 48%, #fff 48% 62%, #000 62%);
  }

  &[data-tone="green"] {
    background:
      radial-gradient(circle at 68% 34%, rgba(151, 196, 47, 0.9) 0 8px, transparent 9px),
      repeating-linear-gradient(90deg, #000 0 12px, #fff 12px 24px);
  }

  &::before {
    content: attr(data-number);
    position: absolute;
    left: 50%;
    top: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border: 3px solid #000;
    border-radius: 50%;
    background: #fff;
    color: #000;
    font-family: "Pretendard", sans-serif;
    font-size: 24px;
    font-weight: 900;
    line-height: 1;
    transform: translate(-50%, -50%);
  }

  @media (max-width: 900px) {
    justify-self: start;
    width: 180px;
  }

  @media (max-width: 480px) {
    width: 144px;
    box-shadow: 0 0 0 8px #fff, 0 0 0 10px #000;
  }
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 14px;
  border: 2px solid #000;
  border-radius: 999px;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: 15px;
  font-weight: 700;

  @media (max-width: 480px) {
    min-height: 32px;
    padding: 0 12px;
    font-size: 13px;
  }
`;

const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(180px, 260px) minmax(0, 860px);
  gap: clamp(36px, 6vw, 92px);
  margin-top: clamp(70px, 10vh, 112px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 28px;
    margin-top: 54px;
  }
`;

const IndexRail = styled.aside`
  position: sticky;
  top: calc(var(--header-height, 88px) + 34px);
  z-index: 5;
  align-self: start;
  padding-bottom: 24px;

  @media (max-width: 900px) {
    position: static;
    top: auto;
    z-index: auto;
    padding-bottom: 0;
  }
`;

const IndexRailInner = styled.div`
  position: relative;
  padding-top: 8px;
  background: #fff;

  @media (max-width: 900px) {
    margin: 0;
    padding: 18px 0 4px;
    border-top: 2px solid #000;
    border-bottom: 1px solid #dedede;
    box-shadow: none;
  }

  @media (max-width: 480px) {
    padding-top: 12px;
  }
`;

const RailTitle = styled.h2`
  margin: 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: 22px;
  font-weight: 900;
  line-height: 1.2;
`;

const RailList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;

  @media (max-width: 900px) {
    flex-direction: row;
    gap: 8px;
    margin-top: 12px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const RailItem = styled.li`
`;

const RailLink = styled.a`
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 10px 0;
  color: #999;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  text-decoration: none;
  word-break: keep-all;
  transition: color 0.2s ease, transform 0.2s ease;

  @media (max-width: 900px) {
    grid-template-columns: 26px minmax(86px, 1fr);
    min-width: min(58vw, 184px);
    padding: 10px 12px;
    border: 1px solid #dedede;
    border-radius: 999px;
    font-size: 13px;
    line-height: 1.25;
    background: #fff;
  }

  @media (max-width: 480px) {
    min-width: min(68vw, 174px);
    font-size: 12px;
  }

  &::before {
    content: attr(data-index);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 2px solid currentColor;
    border-radius: 50%;
    font-size: 12px;
    line-height: 1;
  }

  &[data-active="true"] {
    color: #6f941c;
    transform: translateX(6px);

    &::before {
      background: #97c42f;
      border-color: #97c42f;
      color: #fff;
    }

    @media (max-width: 900px) {
      color: #000;
      transform: none;
      border-color: #97c42f;
      background: #f4ffd9;
    }
  }
`;

const Article = styled.article`
  min-width: 0;
`;

const Section = styled.section`
  scroll-margin-top: calc(var(--header-height, 88px) + 112px);
  padding-top: 44px;
  border-top: 1px solid #dedede;

  & + & {
    margin-top: 56px;
  }

  @media (max-width: 640px) {
    scroll-margin-top: calc(var(--header-height, 72px) + 28px);
    padding-top: 32px;

    & + & {
      margin-top: 42px;
    }
  }
`;

const SectionHeading = styled.h2`
  margin: 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 900;
  line-height: 1.2;
  word-break: keep-all;

  @media (max-width: 640px) {
    font-size: clamp(24px, 7.2vw, 32px);
    line-height: 1.25;
    overflow-wrap: anywhere;
  }
`;

const Paragraph = styled.p`
  margin: 22px 0 0;
  color: #3f3f3f;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(17px, 2vw, 22px);
  font-weight: 300;
  line-height: 1.82;
  word-break: keep-all;

  @media (max-width: 640px) {
    margin-top: 18px;
    font-size: 16px;
    line-height: 1.72;
    word-break: normal;
    overflow-wrap: anywhere;
  }
`;

const FooterNav = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 72px;
  padding-top: 24px;
  border-top: 2px solid #000;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const FooterLink = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 112px;
  padding: 20px;
  border: 2px solid #000;
  border-radius: 8px;
  background: #fff;
  color: #000;
  font-family: "Pretendard", sans-serif;
  text-align: center;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;

  &:hover,
  &:focus-visible {
    background: #000;
    color: #fff;
    outline: none;
    transform: translateY(-4px);
  }
`;

const FooterLabel = styled.span`
  font-size: 15px;
  font-weight: 800;
  line-height: 1.2;
`;

const FooterTitle = styled.span`
  margin-top: 10px;
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 900;
  line-height: 1.2;
  word-break: keep-all;
`;

export function BlogArticle({ post }: { post: BlogPost }) {
  const scopeRef = useRef<HTMLElement>(null);
  const railLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [activeSection, setActiveSection] = useState(0);
  const currentPostIndex = BLOG_POSTS.findIndex((item) => item.slug === post.slug);
  const previousPost =
    BLOG_POSTS[(currentPostIndex - 1 + BLOG_POSTS.length) % BLOG_POSTS.length];
  const nextPost = BLOG_POSTS[(currentPostIndex + 1) % BLOG_POSTS.length];
  const sectionIds = post.sections.map(
    (_, index) => `${post.slug}-section-${index + 1}`
  );

  useLayoutEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();
    requestAnimationFrame(scrollToTop);
  }, [post.slug]);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduceMotion) return;

      const back = scope.querySelector("[data-article-back]");
      const title = scope.querySelector("[data-article-title]");
      const lead = scope.querySelector("[data-article-lead]");
      const thumb = scope.querySelector("[data-article-thumb]");
      const tags = scope.querySelectorAll("[data-article-tag]");
      const rail = scope.querySelector("[data-article-rail]");
      const sections = scope.querySelectorAll("[data-article-section]");

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(back, { x: -18, autoAlpha: 0, duration: 0.36 })
        .from(title, { y: 40, autoAlpha: 0, duration: 0.72 }, "-=0.08")
        .from(lead, { y: 24, autoAlpha: 0, duration: 0.56 }, "-=0.36")
        .from(
          thumb,
          {
            scale: 0.9,
            rotation: -4,
            autoAlpha: 0,
            duration: 0.62,
            ease: "back.out(1.35)",
          },
          "-=0.54"
        )
        .from(tags, { y: 10, autoAlpha: 0, stagger: 0.05, duration: 0.28 }, "-=0.2")
        .from(rail, { x: -20, autoAlpha: 0, duration: 0.42 }, "-=0.1")
        .from(
          sections,
          { y: 34, autoAlpha: 0, stagger: 0.16, duration: 0.58 },
          "-=0.24"
        );
    },
    { scope: scopeRef }
  );

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const sections = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-article-section]")
    );
    if (sections.length === 0) return;

    const getScrollAnchorY = () => {
      const headerHeight = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-height")
      );
      return (Number.isFinite(headerHeight) ? headerHeight : 88) + 120;
    };

    const updateActiveSection = () => {
      const anchorY = getScrollAnchorY();
      let nextIndex = 0;

      sections.forEach((section, index) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop - anchorY <= 0) {
          nextIndex = index;
        }
      });

      setActiveSection((prev) => (prev === nextIndex ? prev : nextIndex));
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [post.slug]);

  return (
    <Page ref={scopeRef}>
      <BackLink href="/blog" data-article-back>
        Blog으로 돌아가기
      </BackLink>

      <Hero>
        <TitleGroup>
          <MetaRow>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </MetaRow>
          <Title data-article-title>{post.title}</Title>
          <Lead data-article-lead>{post.lead}</Lead>
          <TagRow>
            {post.tags.map((tag) => (
              <Tag key={tag} data-article-tag>
                {tag}
              </Tag>
            ))}
          </TagRow>
        </TitleGroup>
        <HeroThumb
          data-tone={post.tone}
          data-number={post.number}
          data-article-thumb
          aria-hidden
        />
      </Hero>

      <ArticleGrid>
        <IndexRail data-article-rail>
          <IndexRailInner>
            <RailTitle>Index</RailTitle>
            <RailList>
              {post.sections.map((section, index) => (
                <RailItem key={section.heading}>
                  <RailLink
                    href={`#${sectionIds[index]}`}
                    data-index={String(index + 1).padStart(2, "0")}
                    data-active={activeSection === index}
                    ref={(node) => {
                      railLinkRefs.current[index] = node;
                    }}
                    onClick={(event) => {
                      event.preventDefault();
                      const target = document.getElementById(sectionIds[index]);
                      if (!target) return;

                      setActiveSection(index);
                      const headerHeight = Number.parseFloat(
                        getComputedStyle(document.documentElement).getPropertyValue(
                          "--header-height"
                        )
                      );
                      const offset = Number.isFinite(headerHeight)
                        ? headerHeight + 112
                        : 200;
                      const targetTop =
                        target.getBoundingClientRect().top + window.scrollY - offset;

                      window.scrollTo({
                        top: Math.max(targetTop, 0),
                        behavior: "smooth",
                      });
                      window.history.pushState(null, "", `#${sectionIds[index]}`);
                    }}
                  >
                    {section.heading}
                  </RailLink>
                </RailItem>
              ))}
            </RailList>
          </IndexRailInner>
        </IndexRail>
        <Article data-article-content>
          {post.sections.map((section, index) => (
            <Section
              key={section.heading}
              id={sectionIds[index]}
              data-article-section
            >
              <SectionHeading>{section.heading}</SectionHeading>
              {section.body.map((block, blockIndex) =>
                isBlogCodeBlock(block) ? (
                  <BlogCodeBlock
                    key={`${section.heading}-code-${blockIndex}`}
                    code={block.code}
                    language={block.language}
                    caption={block.caption}
                  />
                ) : (
                  <Paragraph key={`${section.heading}-text-${blockIndex}`}>
                    {block}
                  </Paragraph>
                )
              )}
            </Section>
          ))}
          <FooterNav>
            <FooterLink href={`/blog/${previousPost.slug}`} scroll={false}>
              <FooterLabel>Previous Note</FooterLabel>
              <FooterTitle>{previousPost.title}</FooterTitle>
            </FooterLink>
            <FooterLink href={`/blog/${nextPost.slug}`} scroll={false}>
              <FooterLabel>Next Note</FooterLabel>
              <FooterTitle>{nextPost.title}</FooterTitle>
            </FooterLink>
          </FooterNav>
        </Article>
      </ArticleGrid>
    </Page>
  );
}
