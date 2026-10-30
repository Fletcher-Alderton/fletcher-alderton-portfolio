"use client";

import * as React from "react";
import Slider, { Settings } from "react-slick";
import { cn } from "@/lib/utils";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type CarouselProps = {
  opts?: Settings
  /**
   * How many slides are visible at the current breakpoint.
   *
   * react-slick's own `responsive` support only registers `matchMedia`
   * listeners, so on first paint the breakpoint is `null` and the base
   * settings win. That is why the projects carousel rendered three tiny
   * cards on phones. The caller measures the viewport instead and we remount
   * the slider (via `key`) when the layout changes.
   */
  slidesToShow?: number
  centerMode?: boolean
  setApi?: (api: Slider | null) => void
  className?: string
  children: React.ReactNode
}

function Carousel({
  opts,
  slidesToShow = 3,
  centerMode = true,
  setApi,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const sliderRef = React.useRef<Slider>(null);

  const settings: Settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    centerMode,
    centerPadding: "0px",
    swipeToSlide: true,
    touchThreshold: 12,
    accessibility: true,
    ...opts,
  };

  React.useEffect(() => {
    setApi?.(sliderRef.current ?? null);
    return () => setApi?.(null);
  }, [setApi]);

  return (
    <div
      className={cn("relative", className)}
      role="region"
      aria-roledescription="carousel"
      data-slot="carousel"
      {...props}
    >
      <Slider ref={sliderRef} {...settings}>
        {children}
      </Slider>
    </div>
  );
}

function CarouselItem({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn("px-2 sm:px-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Carousel, CarouselItem };
