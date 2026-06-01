"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

type Phrase = {
  light: string;
  bold: string;
};

const PHRASES: Phrase[] = [
  { light: "Built with", bold: "Passion" },
  { light: "Driven by", bold: "Curiosity" },
];

const scroll = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`;

const Wrapper = styled.div`
  width: 100%;
  overflow: hidden;
  filter: blur(2px);
  user-select: none;
  -webkit-mask-image: linear-gradient(
    90deg,
    transparent 0%,
    #000 8%,
    #000 92%,
    transparent 100%
  );
  mask-image: linear-gradient(
    90deg,
    transparent 0%,
    #000 8%,
    #000 92%,
    transparent 100%
  );
`;

const Track = styled.div`
  display: flex;
  width: max-content;
  animation: ${scroll} 28s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Group = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
`;

const Item = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 0.25em;
  padding: 0 56px;
  white-space: nowrap;
  color: #b7b7b7;
  font-family: "Pretendard", sans-serif;
  font-size: 96px;
  font-style: normal;
  line-height: normal;
`;

const Light = styled.span`
  font-weight: 200;
`;

const Bold = styled.span`
  font-weight: 800;
`;

function PhraseGroup() {
  return (
    <Group aria-hidden>
      {PHRASES.map((phrase) => (
        <Item key={phrase.bold}>
          <Light>{phrase.light}</Light>
          <Bold>{phrase.bold}</Bold>
        </Item>
      ))}
    </Group>
  );
}

export function HeroMarquee() {
  return (
    <Wrapper>
      <Track>
        <PhraseGroup />
        <PhraseGroup />
      </Track>
    </Wrapper>
  );
}
