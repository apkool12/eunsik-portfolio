"use client";

import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

type Skill = {
  name: string;
  frequent?: boolean;
};

type SkillGroup = {
  index: number;
  title: string;
  skills: Skill[];
};

const SKILL_GROUPS: SkillGroup[] = [
  {
    index: 1,
    title: "개발 기술",
    skills: [
      { name: "TypeScript", frequent: true },
      { name: "React", frequent: true },
      { name: "Next.js", frequent: true },
    ],
  },
  {
    index: 2,
    title: "스타일링",
    skills: [{ name: "Emotion" }, { name: "Styled-Component" }, { name: "Sass" }],
  },
  {
    index: 3,
    title: "백엔드 및 배포",
    skills: [{ name: "Vercel" }, { name: "CloudType" }, { name: "Node.js" }],
  },
];

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  width: 100%;
  padding: 0 64px;

  @media (max-width: 900px) {
    display: flex;
    gap: 16px;
    padding: 0 var(--page-gutter) 8px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-padding-left: var(--page-gutter);
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const Card = styled.div<{ $active: boolean }>`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  width: 100%;
  aspect-ratio: 1 / 1.1;
  padding: 40px 36px;
  border-radius: 16px;
  overflow: hidden;
  color: ${({ $active }) => ($active ? "#fff" : "#000")};
  cursor: default;
  transition: color 0.45s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: #000;
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transform-origin: left center;
    transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
  }

  @media (max-width: 900px) {
    flex: 0 0 min(82vw, 340px);
    aspect-ratio: auto;
    min-height: 300px;
    padding: 28px 24px;
    scroll-snap-align: start;
  }
`;

const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-width: 0;
`;

const CardTitle = styled.h2`
  min-width: 0;
  margin: 0;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(30px, 5vw, 48px);
  font-style: normal;
  font-weight: 700;
  line-height: 123.871%;
  overflow-wrap: anywhere;
`;

const NumberCircle = styled.span`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border: 3px solid currentColor;
  border-radius: 50%;
  font-family: "Pretendard", sans-serif;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 1;

  @media (max-width: 640px) {
    width: 52px;
    height: 52px;
    border-width: 2px;
    font-size: 27px;
  }
`;

const SkillList = styled.ul`
  margin: auto 0 0;
  padding: 0;
  list-style: none;
`;

const SkillRow = styled.li`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid #747474;
`;

const SkillName = styled.span`
  font-family: "Pretendard", sans-serif;
  font-size: clamp(24px, 5.8vw, 36px);
  font-style: normal;
  font-weight: 300;
  line-height: 123.871%;
`;

const Frequent = styled.span`
  color: #97c42f;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(16px, 4vw, 24px);
  font-style: normal;
  font-weight: 400;
  line-height: 123.871%;
`;

export function AboutSkills() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const query = window.matchMedia("(max-width: 900px)");

    const updateActiveCard = () => {
      if (!query.matches) return;

      const sectionRect = section.getBoundingClientRect();
      const sectionCenter = sectionRect.left + sectionRect.width / 2;
      let nextIndex = 0;
      let closest = Number.POSITIVE_INFINITY;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - sectionCenter);

        if (distance < closest) {
          closest = distance;
          nextIndex = index;
        }
      });

      setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    };

    const onQueryChange = () => updateActiveCard();

    updateActiveCard();
    requestAnimationFrame(updateActiveCard);
    section.addEventListener("scroll", updateActiveCard, { passive: true });
    window.addEventListener("resize", updateActiveCard);
    query.addEventListener("change", onQueryChange);

    return () => {
      section.removeEventListener("scroll", updateActiveCard);
      window.removeEventListener("resize", updateActiveCard);
      query.removeEventListener("change", onQueryChange);
    };
  }, []);

  return (
    <Section ref={sectionRef} data-skill-section>
      {SKILL_GROUPS.map((group, i) => (
        <Card
          key={group.title}
          $active={activeIndex === i}
          ref={(node) => {
            cardRefs.current[i] = node;
          }}
          data-skill-card
          onMouseEnter={() => setActiveIndex(i)}
          onFocus={() => setActiveIndex(i)}
          onClick={() => setActiveIndex(i)}
          onTouchStart={() => setActiveIndex(i)}
          tabIndex={0}
        >
          <CardHead>
            <CardTitle>{group.title}</CardTitle>
            <NumberCircle>{group.index}</NumberCircle>
          </CardHead>
          <SkillList>
            {group.skills.map((skill) => (
              <SkillRow key={skill.name}>
                <SkillName>{skill.name}</SkillName>
                {skill.frequent && <Frequent>자주 사용</Frequent>}
              </SkillRow>
            ))}
          </SkillList>
        </Card>
      ))}
    </Section>
  );
}
