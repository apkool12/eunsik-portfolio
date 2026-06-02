"use client";

import { FormEvent, useRef, useState } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CONTACT_TITLE = "Contact,";
const SEND_MAIL_TEXT = "SendMail";

const Page = styled.main`
  min-height: calc(100dvh - var(--header-height, 88px));
  padding: clamp(120px, 16vh, 176px) var(--page-gutter) clamp(40px, 6vh, 72px);
  background: #fff;
  overflow-x: hidden;

  @media (max-width: 900px) {
    padding-top: clamp(72px, 12vh, 112px);
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: clamp(72px, 15vw, 180px);
  font-style: normal;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0;
`;

const Body = styled.p`
  max-width: 1160px;
  margin: clamp(88px, 12vh, 132px) 0 0;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: 48px;
  font-style: normal;
  font-weight: 300;
  line-height: 123.871%;
  letter-spacing: 0;
  text-align: left;
  word-break: keep-all;

  @media (max-width: 900px) {
    margin-top: clamp(56px, 9vh, 72px);
    font-size: clamp(28px, 7vw, 48px);
  }

  @media (max-width: 480px) {
    font-size: clamp(24px, 8.2vw, 32px);
  }
`;

const BodyLine = styled.span`
  display: block;

  & + & {
    margin-left: clamp(72px, 8vw, 116px);
  }

  @media (max-width: 900px) {
    & + & {
      margin-left: 0;
    }
  }
`;

const Terminal = styled.div`
  width: 100%;
  min-height: 170px;
  margin-top: clamp(84px, 14vh, 132px);
  border-radius: 10px;
  background: #000;
  box-shadow:
    0 22px 60px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
  transform-origin: center bottom;

  @media (max-width: 640px) {
    min-height: 150px;
    margin-top: clamp(52px, 9vh, 84px);
  }
`;

const TerminalTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 38px;
  padding: 0 18px;
  background: linear-gradient(90deg, #303030 0%, #000 100%);
`;

const TerminalTitle = styled.span`
  color: rgba(255, 255, 255, 0.58);
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;

  @media (max-width: 480px) {
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const TerminalBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 132px;
  padding: 28px 48px 30px;

  @media (max-width: 900px) {
    min-height: 112px;
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 22px 18px;
  }
`;

const CommandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  min-width: 0;

  @media (max-width: 900px) {
    flex-wrap: wrap;
    gap: 18px;
  }

  @media (max-width: 480px) {
    align-items: flex-start;
  }
`;

const PathBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 68px;
  padding: 0 24px;
  border-radius: 50px;
  background: linear-gradient(90deg, #303030 0%, #000 100%);
  color: #00b5ff;
  font-family: "Pretendard", sans-serif;
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: 123.871%;
  letter-spacing: 0;

  @media (max-width: 900px) {
    min-height: 54px;
    font-size: clamp(22px, 6vw, 32px);
  }

  @media (max-width: 480px) {
    max-width: 100%;
    min-height: 48px;
    padding: 0 18px;
    font-size: clamp(19px, 5.8vw, 24px);
  }
`;

const SendButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #fff;
  font-family: "Pretendard", sans-serif;
  font-size: 32px;
  font-style: normal;
  font-weight: 300;
  line-height: 123.871%;
  letter-spacing: 0;
  cursor: pointer;
  transition: opacity 0.2s ease;

  svg {
    flex: 0 0 auto;
    transition: transform 0.25s ease;
  }

  &:hover svg,
  &:focus-visible svg {
    transform: translateX(6px);
  }

  &:focus-visible {
    outline: 2px solid #00b5ff;
    outline-offset: 6px;
    border-radius: 8px;
  }

  &:disabled {
    cursor: default;
    opacity: 0.68;
  }

  @media (max-width: 900px) {
    font-size: clamp(24px, 7vw, 32px);
  }

  @media (max-width: 480px) {
    font-size: clamp(22px, 6.6vw, 26px);
  }
`;

const SendText = styled.span`
  display: inline-block;
  align-items: center;
  width: 0;
  overflow: hidden;
  white-space: nowrap;
`;

const ArrowWrap = styled.span`
  display: inline-flex;
  align-items: center;
  width: 0;
  overflow: hidden;
`;

const Cursor = styled.span`
  width: 12px;
  height: 36px;
  margin-left: -14px;
  background: #fff;
  opacity: 0.85;
`;

const StatusStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
  padding-left: 24px;

  @media (max-width: 480px) {
    padding-left: 0;
  }
`;

const StatusLine = styled.span`
  color: rgba(255, 255, 255, 0.68);
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 300;
  line-height: 1.35;

  &::before {
    content: ">";
    margin-right: 10px;
    color: #00b5ff;
  }

  strong {
    color: #fff;
    font-weight: 600;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.44);
  overflow-y: auto;

  @media (max-width: 480px) {
    align-items: flex-start;
    padding: 18px;
  }
`;

const Dialog = styled.div`
  width: min(640px, 100%);
  max-height: calc(100dvh - 36px);
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.28);
  overflow: auto;

  @media (max-width: 480px) {
    border-radius: 18px;
  }
`;

const DialogTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 58px;
  padding: 0 20px;
  background: linear-gradient(90deg, #303030 0%, #000 100%);
`;

const WindowDots = styled.div`
  display: flex;
  gap: 8px;

  span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }

  span:nth-of-type(1) {
    background: #ff5f57;
  }

  span:nth-of-type(2) {
    background: #ffbd2e;
  }

  span:nth-of-type(3) {
    background: #28c840;
  }
`;

const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: #fff;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px;

  @media (max-width: 480px) {
    gap: 14px;
    padding: 20px;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 700;
`;

const Input = styled.input`
  min-height: 54px;
  border: 1px solid #d6d6d6;
  border-radius: 12px;
  padding: 0 16px;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  outline: none;

  &:focus {
    border-color: #00b5ff;
  }
`;

const TextArea = styled.textarea`
  min-height: 160px;
  resize: vertical;
  border: 1px solid #d6d6d6;
  border-radius: 12px;
  padding: 16px;
  color: #000;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  line-height: 1.55;
  outline: none;

  &:focus {
    border-color: #00b5ff;
  }
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  min-width: 132px;
  min-height: 54px;
  border: 0;
  border-radius: 999px;
  background: #000;
  color: #fff;
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: 480px) {
    align-self: stretch;
  }

  &:disabled {
    cursor: default;
    opacity: 0.58;
  }
`;

const FormStatus = styled.p`
  min-height: 24px;
  margin: 0;
  color: #777;
  font-family: "Pretendard", sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;

  &[data-tone="success"] {
    color: #178d3a;
  }

  &[data-tone="error"] {
    color: #d73333;
  }
`;

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 12H20M14 6L20 12L14 18"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactPage() {
  const scopeRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    tone: "idle" | "success" | "error";
    message: string;
  }>({ tone: "idle", message: "" });

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduceMotion) return;

      const title = scope.querySelector("[data-contact-title]");
      const body = scope.querySelector("[data-contact-body]");
      const terminal = scope.querySelector("[data-terminal]");
      const terminalTop = scope.querySelector("[data-terminal-top]");
      const terminalPath = scope.querySelector("[data-terminal-path]");
      const typedText = scope.querySelector("[data-typed-text]");
      const sendArrow = scope.querySelector("[data-send-arrow]");
      const cursor = scope.querySelector("[data-terminal-cursor]");

      gsap.set(typedText, { width: 0 });
      gsap.set(sendArrow, { width: 0, autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(title, { y: 36, autoAlpha: 0, duration: 0.68 })
        .from(body, { y: 28, autoAlpha: 0, duration: 0.62 }, "-=0.32")
        .from(
          terminal,
          {
            y: 34,
            scaleX: 0.96,
            autoAlpha: 0,
            duration: 0.62,
            ease: "expo.out",
          },
          "-=0.24"
        )
        .from(
          terminalTop,
          { y: -20, autoAlpha: 0, duration: 0.38, ease: "power2.out" },
          "-=0.5"
        )
        .from(
          terminalPath,
          { x: -18, autoAlpha: 0, duration: 0.32 },
          "-=0.34"
        )
        .to(
          typedText,
          {
            width: "8ch",
            duration: 0.48,
            ease: "steps(8)",
          },
          "-=0.04"
        )
        .to(
          sendArrow,
          { width: 24, autoAlpha: 1, duration: 0.18, ease: "power2.out" },
          "+=0.04"
        );

      if (cursor) {
        gsap.to(cursor, {
          autoAlpha: 0,
          duration: 0.58,
          repeat: -1,
          yoyo: true,
          ease: "steps(1)",
        });
      }
    },
    { scope: scopeRef }
  );

  useGSAP(
    () => {
      if (!isComposing) return;

      const scope = scopeRef.current;
      if (!scope) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduceMotion) {
        setIsModalOpen(true);
        return;
      }

      const lines = scope.querySelectorAll("[data-status-line]");
      const terminal = scope.querySelector("[data-terminal]");

      gsap
        .timeline({
          onComplete: () => setIsModalOpen(true),
        })
        .to(terminal, {
          boxShadow:
            "0 24px 70px rgba(0, 181, 255, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
          duration: 0.22,
          ease: "power2.out",
        })
        .fromTo(
          lines,
          { x: -10, autoAlpha: 0, clipPath: "inset(0 100% 0 0)" },
          {
            x: 0,
            autoAlpha: 1,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.32,
            stagger: 0.16,
            ease: "steps(12)",
          },
          0
        )
        .to(terminal, {
          boxShadow:
            "0 22px 60px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
          duration: 0.32,
          ease: "power2.out",
        });
    },
    { dependencies: [isComposing], scope: scopeRef }
  );

  useGSAP(
    () => {
      if (!isModalOpen || !dialogRef.current) return;

      gsap.fromTo(
        dialogRef.current,
        { y: 24, scale: 0.96, autoAlpha: 0 },
        { y: 0, scale: 1, autoAlpha: 1, duration: 0.28, ease: "power3.out" }
      );
    },
    { dependencies: [isModalOpen] }
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setIsComposing(false);
    setIsSending(false);
    setFormStatus({ tone: "idle", message: "" });
  };

  const openComposer = () => {
    if (isComposing) return;
    setIsComposing(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "");
    const email = String(formData.get("email") ?? "").trim();
    const content = String(formData.get("content") ?? "");

    setIsSending(true);
    setFormStatus({ tone: "idle", message: "메일을 보내는 중입니다..." });

    try {
      const response = await fetch("/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, email, content }),
      });
      const result = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(result?.message ?? "메일 전송에 실패했습니다.");
      }

      setFormStatus({
        tone: "success",
        message: result?.message ?? "메일을 보냈습니다.",
      });
      form.reset();
      window.setTimeout(closeModal, 900);
    } catch (error) {
      setFormStatus({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "메일 전송에 실패했습니다.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Page ref={scopeRef}>
      <Title data-contact-title>{CONTACT_TITLE}</Title>
      <Body data-contact-body>
        <BodyLine>포트폴리오에 관심을 가져주셔서 감사합니다.</BodyLine>
        <BodyLine>앞으로 더 나은 개발자가 되기 위해 노력하겠습니다.</BodyLine>
      </Body>

      <Terminal data-terminal>
        <TerminalTop data-terminal-top>
          <WindowDots aria-hidden>
            <span />
            <span />
            <span />
          </WindowDots>
          <TerminalTitle>mail-composer — zsh</TerminalTitle>
        </TerminalTop>
        <TerminalBody>
          <CommandRow>
            <PathBadge data-terminal-path>~/Desktop/Eunsik</PathBadge>
            <SendButton
              type="button"
              aria-label={SEND_MAIL_TEXT}
              disabled={isComposing}
              onClick={openComposer}
            >
              <SendText data-typed-text aria-hidden>
                {SEND_MAIL_TEXT}
              </SendText>
              <ArrowWrap data-send-arrow>
                <ArrowIcon />
              </ArrowWrap>
            </SendButton>
            <Cursor data-terminal-cursor aria-hidden />
          </CommandRow>
          {isComposing && (
            <StatusStack aria-live="polite">
              <StatusLine data-status-line>
                command accepted: <strong>sendmail</strong>
              </StatusLine>
              <StatusLine data-status-line>
                opening mail composer...
              </StatusLine>
            </StatusStack>
          )}
        </TerminalBody>
      </Terminal>

      {isModalOpen && (
        <Backdrop
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <Dialog
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="메일 보내기"
          >
            <DialogTop>
              <WindowDots aria-hidden>
                <span />
                <span />
                <span />
              </WindowDots>
              <CloseButton type="button" onClick={closeModal}>
                닫기
              </CloseButton>
            </DialogTop>
            <Form onSubmit={handleSubmit}>
              <Field>
                제목
                <Input name="title" required />
              </Field>
              <Field>
                답장 받을 이메일
                <Input name="email" type="email" required />
              </Field>
              <Field>
                내용
                <TextArea name="content" required />
              </Field>
              <FormStatus data-tone={formStatus.tone} aria-live="polite">
                {formStatus.message}
              </FormStatus>
              <SubmitButton type="submit" disabled={isSending}>
                {isSending ? "보내는 중" : "보내기"}
              </SubmitButton>
            </Form>
          </Dialog>
        </Backdrop>
      )}
    </Page>
  );
}
