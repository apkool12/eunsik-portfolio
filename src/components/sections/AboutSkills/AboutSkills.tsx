"use client";

import { useState } from "react";
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
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 0 24px;
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
    aspect-ratio: auto;
    min-height: 260px;
    padding: 28px 24px;
  }
`;

const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(30px, 5vw, 48px);
  font-style: normal;
  font-weight: 700;
  line-height: 123.871%;
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
    width: 46px;
    height: 46px;
    font-size: 26px;
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
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Section>
      {SKILL_GROUPS.map((group, i) => (
        <Card
          key={group.title}
          $active={activeIndex === i}
          onMouseEnter={() => setActiveIndex(i)}
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
