"use client";

import styled from "@emotion/styled";

type BlogCodeBlockProps = {
  code: string;
  language?: string;
  caption?: string;
};

const Figure = styled.figure`
  margin: 28px 0 0;
  max-width: 100%;
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 44px;
  padding: 0 16px;
  border: 2px solid #000;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: #000;
  color: #fff;

  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
    padding: 12px 14px;
  }
`;

const Language = styled.span`
  font-family: "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Caption = styled.span`
  color: #97c42f;
  font-family: "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-align: right;
  word-break: keep-all;

  @media (max-width: 640px) {
    text-align: left;
    line-height: 1.35;
  }
`;

const Pre = styled.pre`
  margin: 0;
  padding: 20px 18px;
  overflow-x: auto;
  max-width: 100%;
  border: 2px solid #000;
  border-radius: 0 0 8px 8px;
  background: #fafafa;
  scrollbar-width: thin;

  @media (max-width: 640px) {
    padding: 16px 14px;
    overflow-x: hidden;
  }

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: #cfcfcf;
  }
`;

const Code = styled.code`
  display: block;
  min-width: 0;
  color: #111;
  font-family: "SFMono-Regular", "Menlo", "Monaco", "Consolas", monospace;
  font-size: clamp(13px, 1.6vw, 15px);
  font-weight: 500;
  line-height: 1.7;
  white-space: pre;

  @media (max-width: 640px) {
    font-size: 12px;
    line-height: 1.62;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;
  }
`;

export function BlogCodeBlock({
  code,
  language = "typescript",
  caption,
}: BlogCodeBlockProps) {
  return (
    <Figure>
      <Header>
        <Language>{language}</Language>
        {caption ? <Caption>{caption}</Caption> : null}
      </Header>
      <Pre>
        <Code>{code.trim()}</Code>
      </Pre>
    </Figure>
  );
}
