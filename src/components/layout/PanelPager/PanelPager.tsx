"use client";

import { Children, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Observer);

type PanelPagerProps = {
  children: React.ReactNode;
  showDots?: boolean;
};

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
    display: none;
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

  &:focus-visible {
    outline: 2px solid #97c42f;
    outline-offset: 3px;
  }
`;

function findPanelScrollRoot(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest("[data-panel-scroll], [data-panel]");
}

function isInHorizontalCarousel(e: Event) {
  if (typeof document !== "undefined") {
    if (document.body.dataset.carouselWheelLock === "true") return true;
  }

  const path =
    typeof e.composedPath === "function" ? e.composedPath() : [];

  for (const node of path) {
    if (node instanceof HTMLElement) {
      if (node.dataset.panelScrollAxis === "horizontal") return true;
    }
  }

  if (e.target instanceof Element) {
    return !!e.target.closest("[data-panel-scroll-axis='horizontal']");
  }

  return false;
}

/** 카드 리스트·캐러셀 등 내부 스크롤 영역에서는 패널 전환하지 않음 */
function shouldIgnorePanelScroll(e: Event) {
  if (isInHorizontalCarousel(e)) return true;

  if (e.target instanceof Element) {
    if (e.target.closest("[data-competition-wheel-zone]")) return true;
  }

  const scrollRoot = findPanelScrollRoot(e.target);
  if (!scrollRoot) return false;

  const canScroll = scrollRoot.scrollHeight > scrollRoot.clientHeight + 1;
  if (!canScroll) return false;

  if (!(e instanceof WheelEvent)) {
    return true;
  }

  const scrollingDown = e.deltaY > 0;
  const scrollingUp = e.deltaY < 0;
  const atTop = scrollRoot.scrollTop <= 1;
  const atBottom =
    scrollRoot.scrollTop + scrollRoot.clientHeight >= scrollRoot.scrollHeight - 1;

  if (scrollingDown && !atBottom) return true;
  if (scrollingUp && !atTop) return true;

  return false;
}

const Viewport = styled.div<{ $paged: boolean }>`
  ${({ $paged }) =>
    $paged
      ? `
    position: fixed;
    top: var(--header-height, 88px);
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  `
      : ""}

  @media (max-width: 900px) {
    position: static;
    overflow: visible;
  }
`;

const Stack = styled.div<{ $paged: boolean }>`
  position: relative;
  ${({ $paged }) =>
    $paged
      ? `
    width: 100%;
    height: 100%;
  `
      : ""}

  @media (max-width: 900px) {
    width: 100%;
    height: auto;
  }
`;

const Panel = styled.div<{ $paged: boolean; $initial: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ $paged, $initial }) =>
    $paged
      ? `
    position: absolute;
    inset: 0;
    overflow-x: hidden;
    overflow-y: auto;
    opacity: ${$initial ? 1 : 0};
    visibility: ${$initial ? "visible" : "hidden"};
    pointer-events: ${$initial ? "auto" : "none"};
    will-change: opacity;
    overscroll-behavior: contain;
    scrollbar-width: none;
  `
      : `
    min-height: calc(100dvh - var(--header-height, 88px));
  `}

  @media (max-width: 900px) {
    position: relative;
    inset: auto;
    min-height: auto;
    padding: clamp(56px, 10vh, 88px) 0;
    overflow: visible;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

export function PanelPager({ children, showDots = false }: PanelPagerProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const goToRef = useRef<(index: number) => void>(() => {});
  const [paged, setPaged] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const panels = Children.toArray(children);
  const total = panels.length;

  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      const viewport = viewportRef.current;
      const stack = stackRef.current;
      if (!viewport || !stack) return;

      const panelEls = stack.querySelectorAll<HTMLElement>("[data-panel]");

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion || isMobile || total <= 1) {
        setPaged(false);
        gsap.set(panelEls, { clearProps: "all" });
        return;
      }

      setPaged(true);

      let index = 0;
      let animating = false;

      const clampIndex = gsap.utils.clamp(0, total - 1);

      const showPanel = (i: number, visible: boolean) => {
        const el = panelEls[i];
        if (!el) return;
        gsap.set(el, {
          autoAlpha: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          visibility: visible ? "visible" : "hidden",
        });
      };

      panelEls.forEach((_, i) => showPanel(i, i === 0));
      setActiveIndex(0);

      const goTo = (next: number) => {
        const target = clampIndex(next);
        if (animating || target === index) return;

        const current = panelEls[index];
        const nextPanel = panelEls[target];
        if (!current || !nextPanel) return;

        animating = true;

        current.dispatchEvent(
          new CustomEvent("panel-leave", { bubbles: true })
        );

        gsap.set(nextPanel, {
          visibility: "visible",
          pointerEvents: "none",
          autoAlpha: 0,
        });
        nextPanel.scrollTop = 0;
        gsap.set(current, { pointerEvents: "none" });

        nextPanel.dispatchEvent(
          new CustomEvent("panel-enter", { bubbles: true })
        );

        gsap
          .timeline({
            defaults: { duration: 0.4, ease: "power2.inOut" },
            onComplete: () => {
              gsap.set(current, {
                autoAlpha: 0,
                visibility: "hidden",
                pointerEvents: "none",
              });
              gsap.set(nextPanel, {
                autoAlpha: 1,
                visibility: "visible",
                pointerEvents: "auto",
              });
              index = target;
              setActiveIndex(target);
              animating = false;
            },
          })
          .to(current, { autoAlpha: 0 }, 0)
          .to(nextPanel, { autoAlpha: 1 }, 0);
      };

      goToRef.current = goTo;

      const observer = Observer.create({
        target: viewport,
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        tolerance: 14,
        preventDefault: true,
        ignoreCheck: (e) => shouldIgnorePanelScroll(e),
        onUp: () => goTo(index + 1),
        onDown: () => goTo(index - 1),
      });

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          e.preventDefault();
          goTo(index + 1);
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          e.preventDefault();
          goTo(index - 1);
        }
      };

      window.addEventListener("keydown", onKey);

      return () => {
        observer.kill();
        window.removeEventListener("keydown", onKey);
      };
    },
    { scope: viewportRef, dependencies: [total, isMobile] }
  );

  return (
    <>
      <Viewport ref={viewportRef} $paged={paged}>
        <Stack ref={stackRef} $paged={paged}>
          {panels.map((panel, i) => (
            <Panel key={i} $paged={paged} $initial={i === 0} data-panel>
              {panel}
            </Panel>
          ))}
        </Stack>
      </Viewport>
      {showDots && paged && total > 1 && (
        <DotsNav aria-label="섹션 목록">
          {panels.map((_, i) => (
            <li key={i}>
              <DotButton
                type="button"
                $active={activeIndex === i}
                aria-label={`프로젝트 ${i + 1}`}
                aria-current={activeIndex === i ? "true" : undefined}
                onClick={() => goToRef.current(i)}
              />
            </li>
          ))}
        </DotsNav>
      )}
    </>
  );
}
