"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type Slider from "react-slick";
import { Carousel } from "@/components/ui/carousel";
import { SparklesText } from "@/components/magicui/sparkles-text";
import ProjectCard, { type ProjectCardProps } from "./ProjectCard";

export type CarouselCursorState = {
  hoveredIndex: number | null;
  activeIndex: number;
  showingDetails: boolean;
  zone: "left" | "right" | "center" | null;
};

type Layout = "mobile" | "tablet" | "desktop";

export type ProjectSectionItem = Omit<
  ProjectCardProps,
  "isCentered" | "onCenterClick" | "onMouseEnter" | "onMouseLeave" | "onShowDetailsChange"
>;

interface ProjectSectionProps {
  id: string;
  title: string;
  items: readonly ProjectSectionItem[];
  /** Small line of helper copy shown on phones. */
  hint?: string;
  onCursorStateChange?: (state: CarouselCursorState | null) => void;
}

const ACCENT_COLORS = ["#FF5900", "#008CFF", "#B2FF00"];

// useLayoutEffect on the client so the correct slide count is applied before
// the first paint, plain useEffect on the server to avoid the SSR warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function measureLayout(): Layout {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

const SLIDES_BY_LAYOUT: Record<Layout, number> = {
  mobile: 1,
  tablet: 1,
  desktop: 3,
};

export default function ProjectSection({
  id,
  title,
  items,
  hint,
  onCursorStateChange,
}: ProjectSectionProps) {
  const [layout, setLayout] = useState<Layout>("desktop");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showingDetails, setShowingDetails] = useState(false);

  const sliderRef = useRef<Slider | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasFinePointerRef = useRef(false);

  // Pick the right slide count before paint so phones never flash a 3-up grid.
  useIsomorphicLayoutEffect(() => {
    const apply = () => {
      const next = measureLayout();
      setLayout((prev) => (prev === next ? prev : next));
    };
    apply();
    window.addEventListener("resize", apply);
    window.addEventListener("orientationchange", apply);
    return () => {
      window.removeEventListener("resize", apply);
      window.removeEventListener("orientationchange", apply);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    hasFinePointerRef.current =
      window.matchMedia("(pointer:fine)").matches &&
      !("ontouchstart" in window) &&
      navigator.maxTouchPoints === 0;
  }, []);

  // After a remount caused by a layout change, keep the user on the same card.
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider && typeof slider.slickGoTo === "function") {
      slider.slickGoTo(selectedIndex, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  const reportCursor = useCallback(
    (next: Partial<CarouselCursorState>) => {
      if (!onCursorStateChange) return;
      onCursorStateChange({
        hoveredIndex,
        activeIndex: selectedIndex,
        showingDetails,
        zone: null,
        ...next,
      });
    },
    [onCursorStateChange, hoveredIndex, selectedIndex, showingDetails]
  );

  const handleSlideChange = useCallback(
    (current: number, next: number) => {
      setSelectedIndex(next);
      setShowingDetails(false);
      reportCursor({ activeIndex: next, showingDetails: false });
    },
    [reportCursor]
  );

  const goToSlide = useCallback((index: number) => {
    const slider = sliderRef.current;
    if (slider && typeof slider.slickGoTo === "function") {
      slider.slickGoTo(index);
    }
  }, []);

  const step = useCallback((direction: -1 | 1) => {
    const slider = sliderRef.current;
    if (!slider) return;
    if (direction === -1 && typeof slider.slickPrev === "function") slider.slickPrev();
    if (direction === 1 && typeof slider.slickNext === "function") slider.slickNext();
  }, []);

  const handleContainerMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hasFinePointerRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const third = rect.width / 3;
      const x = e.clientX - rect.left;
      const zone = x < third ? "left" : x > rect.width - third ? "right" : "center";
      reportCursor({ zone });
    },
    [reportCursor]
  );

  const handleContainerMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    reportCursor({ hoveredIndex: null, zone: null });
  }, [reportCursor]);

  const handleCardEnter = useCallback(
    (index: number) => {
      setHoveredIndex(index);
      reportCursor({ hoveredIndex: index });
    },
    [reportCursor]
  );

  const handleShowDetails = useCallback(
    (index: number, next: boolean) => {
      if (index !== selectedIndex) return;
      setShowingDetails(next);
      reportCursor({ showingDetails: next });
    },
    [reportCursor, selectedIndex]
  );

  const slidesToShow = SLIDES_BY_LAYOUT[layout];
  // Phones keep the single-card view but centre it with a sliver of the
  // neighbouring cards showing, so it reads as a carousel you can swipe.
  const centerMode = true;
  const centerPadding =
    layout === "mobile" ? "7%" : layout === "tablet" ? "12%" : "0px";

  const dots = useMemo(
    () =>
      items.map((_, index) => ({
        index,
        color: ACCENT_COLORS[index % ACCENT_COLORS.length],
        active: index === selectedIndex,
      })),
    [items, selectedIndex]
  );

  return (
    <section
      id={id}
      className="relative z-10 flex flex-col justify-center py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 mb-0 md:grid md:grid-cols-[1fr_1fr] md:items-center md:gap-0">
          <h2 className="font-display text-black text-2xl sm:text-3xl md:text-5xl leading-[1.02]">
            {title}
          </h2>

          {/* Hint text with sparkles - mobile only */}
          {hint && (
            <div className="md:hidden">
              <SparklesText
                className="text-sm text-black whitespace-nowrap"
                colors={{ first: "#B2FF00", second: "#FF5900" }}
                sparklesCount={5}
              >
                {hint}
              </SparklesText>
            </div>
          )}
        </div>
        <div className="w-40 sm:w-44 md:w-52 h-px bg-black mt-[8px] mb-6 md:mb-10"></div>
      </div>

      {/* Carousel */}
      <div
        ref={containerRef}
        className="carousel-container w-full relative"
        onMouseMove={handleContainerMouseMove}
        onMouseLeave={handleContainerMouseLeave}
      >
        <Carousel
          key={layout}
          setApi={(api) => {
            sliderRef.current = api;
          }}
          slidesToShow={slidesToShow}
          centerMode={centerMode}
          centerPadding={centerPadding}
          opts={{
            beforeChange: handleSlideChange,
          }}
          className="w-full"
        >
          {items.map((item, index) => (
            <ProjectCard
              key={`${id}-${item.title}-${index}`}
              {...item}
              isCentered={index === selectedIndex}
              onCenterClick={() => goToSlide(index)}
              onMouseEnter={() => handleCardEnter(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onShowDetailsChange={(next) => handleShowDetails(index, next)}
            />
          ))}
        </Carousel>

        {/* Click zones for carousel navigation - desktop only */}
        <div
          className="pointer-events-none absolute inset-0 z-40 hidden md:block"
          aria-hidden="true"
          role="presentation"
        >
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-y-0 left-0 w-1/3 pointer-events-auto cursor-none"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous project"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 w-1/3 pointer-events-auto cursor-none"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next project"
          />
        </div>
      </div>

      {/* Position indicators */}
      <div className="flex justify-center mt-6 md:mt-8 px-4">
        <div className="flex flex-wrap justify-center gap-1.5 max-w-xs sm:max-w-md">
          {dots.map(({ index, color, active }) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to project ${index + 1} of ${items.length}`}
              aria-current={active ? "true" : undefined}
              className="rounded-full transition-all duration-200 p-0"
              style={{
                width: "10px",
                height: "10px",
                minWidth: "10px",
                minHeight: "10px",
                cursor: "none",
                backgroundColor: active ? color : `${color}40`,
                border: active ? `2px solid ${color}` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
