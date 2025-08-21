"use client"

import * as React from "react"
import Slider, { Settings } from "react-slick"
import { cn } from "@/lib/utils"

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

type CarouselProps = {
  opts?: Settings
  orientation?: "horizontal" | "vertical"
  setApi?: (api: Slider | null) => void
  className?: string
  children: React.ReactNode
}

type CarouselContextProps = {
  slider: Slider | null
  goToSlide: (index: number) => void
  currentSlide: number
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const sliderRef = React.useRef<Slider>(null)

  const defaultSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "0px",
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        }
      }
    ],
    ...opts,
  }

  const goToSlide = React.useCallback((index: number) => {
    sliderRef.current?.slickGoTo(index)
  }, [])

  React.useEffect(() => {
    if (sliderRef.current && setApi) {
      setApi(sliderRef.current)
    }
  }, [setApi])

  const handleBeforeChange = (current: number, next: number) => {
    if (opts?.beforeChange) {
      opts.beforeChange(current, next)
    }
  }

  const handleAfterChange = (current: number) => {
    setCurrentSlide(current)
    if (opts?.afterChange) {
      opts.afterChange(current)
    }
  }

  return (
    <CarouselContext.Provider
      value={{
        slider: sliderRef.current,
        goToSlide,
        currentSlide,
        opts,
        orientation,
        setApi,
        className,
        children,
      }}
    >
      <div
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        <Slider
          ref={sliderRef}
          {...defaultSettings}
          beforeChange={handleBeforeChange}
          afterChange={handleAfterChange}
        >
          {children}
        </Slider>
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("", className)}
      data-slot="carousel-content"
      {...props}
    >
      {children}
    </div>
  )
}

function CarouselItem({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "px-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
}

