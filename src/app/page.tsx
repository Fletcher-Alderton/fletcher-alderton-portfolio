"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SparklesText } from "@/components/magicui/sparkles-text";
import ProjectCard from "./components/ProjectCard";
import {
  Carousel,
} from "@/components/ui/carousel";
import type Slider from "react-slick";

// Extend window interface to include carouselSlider
declare global {
  interface Window {
    carouselSlider: Slider | null;
  }
}
 
import projects from "../../public/projects.json";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [screenShape, setScreenShape] = useState<'phone' | 'square' | 'classic' | 'mac' | 'wide_short' | 'wide' | 'ultrawide' | 'unknown'>('wide'); // Default to wide for SSR
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorIcon, setCursorIcon] = useState<'plus' | 'minus' | 'arrow-left' | 'arrow-right' | 'arrow-up' | null>(null);
  const [centerProjectShowingDetails, setCenterProjectShowingDetails] = useState(false);
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNoteValid, setIsNoteValid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasFinePointer, setHasFinePointer] = useState(true);

  // Refs
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(async () => {
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, note }),
      });

      if (response.ok) {
        setName('');
        setEmail('');
        setNote('');
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
        }, 2000); // Hide after 2 seconds
      } else {
        console.error('Failed to send email');
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error('An error occurred while sending the email:', error);
      // Optionally, show an error message to the user
    }
  }, [name, email, note]);

  // (clean) Removed debug effects

  // Form validation effect
  useEffect(() => {
    const validateEmail = (email: string) => {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    };
    setIsNameValid(name.trim() !== '');
    setIsEmailValid(validateEmail(email));
    setIsNoteValid(note.trim() !== '');
  }, [name, email, note]);

  const isFormValid = isNameValid && isEmailValid && isNoteValid;
  const formCompletionCount = (isNameValid ? 1 : 0) + (isEmailValid ? 1 : 0) + (isNoteValid ? 1 : 0);

  // Detect whether the current device has a precise pointer (mouse/track-pad)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer:fine)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    // Only enable fine pointer features if it's a fine pointer device AND not a touch device
    setHasFinePointer(isFinePointer && !isTouchDevice);
  }, []);

  // Global click listener for form submission (mouse devices only)
  useEffect(() => {
    if (typeof window === 'undefined' || !hasFinePointer) return;

    const handleGlobalClick = async (e: MouseEvent) => {
      if (isFormValid) {
        // Stop links from navigating and other default click actions
        e.preventDefault();
        e.stopPropagation();
        await handleSubmit();
      }
    };

    // Using capture phase to intercept clicks early
    window.addEventListener('click', handleGlobalClick, true);
    return () => {
      window.removeEventListener('click', handleGlobalClick, true);
    };
  }, [isFormValid, name, email, note, hasFinePointer, handleSubmit]); // Ensure handleSubmit has fresh state

  // Update cursor icon reactively: show arrows based on carousel thirds, plus/minus for center card, arrow-up for form
  useEffect(() => {
    if (isFormValid) {
      setCursorIcon('arrow-up');
      return;
    }

    const container = carouselContainerRef.current;
    if (container && hasFinePointer) {
      const rect = container.getBoundingClientRect();
      const { x, y } = mousePosition;
      const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      if (inside) {
        const thirdWidth = rect.width / 3;
        const leftBoundary = rect.left + thirdWidth;
        const rightBoundary = rect.right - thirdWidth;

        if (x < leftBoundary) {
          setCursorIcon('arrow-left');
          return;
        }
        if (x > rightBoundary) {
          setCursorIcon('arrow-right');
          return;
        }

        // Center third: prefer plus/minus for centered card if hovered
        if (hoveredProjectIndex !== null && hoveredProjectIndex === selectedIndex) {
          const newIcon = centerProjectShowingDetails ? 'minus' : 'plus';
          setCursorIcon(newIcon);
        } else {
          setCursorIcon(null);
        }
        return;
      }
    }

    // Outside carousel: plus/minus for centered card hover, else nothing
    if (hoveredProjectIndex !== null && hoveredProjectIndex === selectedIndex) {
      setCursorIcon(centerProjectShowingDetails ? 'minus' : 'plus');
    } else {
      setCursorIcon(null);
    }
  }, [isFormValid, hoveredProjectIndex, selectedIndex, centerProjectShowingDetails, mousePosition, hasFinePointer]);

  const handleMouseLeave = () => {
    setHoveredProjectIndex(null);
  };

  const handleProjectCardHover = (index: number) => {
    setHoveredProjectIndex(index);
  };

  // Handle carousel slide changes
  const handleSlideChange = useCallback((current: number, next: number) => {
    setSelectedIndex(next);
    setCenterProjectShowingDetails(false);
  }, []);

  // Handle center click for project cards
  const handleCenterClick = useCallback((index: number) => {
    // With React Slick, we don't need to manually scroll to slides
    // The carousel handles navigation automatically
    if (index !== selectedIndex) {
      // This will be handled by the carousel's built-in navigation
      const slider = window.carouselSlider;
      if (slider && slider.slickGoTo) {
        slider.slickGoTo(index);
      }
    }
  }, [selectedIndex]);

  const updateScreenShape = () => {
    if (typeof window === 'undefined') return;

    const aspectRatio = window.innerWidth / window.innerHeight;

    if (aspectRatio <= 3/4) {
      setScreenShape('phone'); // Portrait phones and very tall screens - too many to count
    } else if (aspectRatio <= 4/3) {
      setScreenShape('square'); // 4:3 screens (old monitors, tablets) - 1920x1440
    } else if (aspectRatio <= 3/2) {
      setScreenShape('classic'); // 3:2 screens (~1.5) - 1920x1280
    } else if (aspectRatio <= 1.58) {
      setScreenShape('mac'); // Mac laptop screens (~1.54) - 1512x982
    } else if (aspectRatio <= 1.7) {
      setScreenShape('wide_short'); // 16:10 monitors (~1.6) - 1920x1200
    } else if (aspectRatio <= 21/9) {
      setScreenShape('wide'); // 16:9 and similar monitors (~1.78) - 1920x1080
    } else {
      setScreenShape('ultrawide'); // 21:9 and wider ultrawide monitors - 2520x1080
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    setMounted(true);
    updateScreenShape();
    window.addEventListener('resize', updateScreenShape);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', updateScreenShape);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  let cursorBgClass = 'bg-gray-300/30 border-gray-300/50';
  if (formCompletionCount === 1) cursorBgClass = 'bg-orange-500/20 border-orange-400/30';
  if (formCompletionCount === 2) cursorBgClass = 'bg-orange-500/50 border-orange-400/60';
  if (formCompletionCount === 3) cursorBgClass = 'bg-orange-500 border-orange-400';

  return (
    <div className="relative min-h-screen bg-neutral-50" style={hasFinePointer ? { cursor: 'none' } : undefined}>
      {/* Custom Cursor */}
      {mounted && hasFinePointer && (
        <div
          className="fixed top-0 left-0 pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            zIndex: 2147483647,
          }}
        >
          {/* The actual cursor circle */}
          <div
            className={`transition-all duration-100 border ease-out shadow-lg flex items-center justify-center rounded-full backdrop-blur-md w-10 h-10 ${cursorBgClass}`}
            style={{
              transform: `translate(-50%, -50%)`,
            }}
          >
            {cursorIcon === 'plus' && <span className="text-[#9fe202] text-3xl font-thin leading-none relative top-[-1px]">+</span>}
            {cursorIcon === 'minus' && <span className="text-[#FF5900] text-3xl font-thin leading-none relative top-[-1px]">−</span>}
            {cursorIcon === 'arrow-left' && (
              <svg className="w-6 h-6 text-[#008CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            )}
            {cursorIcon === 'arrow-right' && (
              <svg className="w-6 h-6 text-[#008CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {cursorIcon === 'arrow-up' && (
              <svg className="w-6 h-6 text-[#008CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
          </div>
          {/* "Click to send" text */}
          <div
            className={`text-black font-serif transition-opacity mt-0 duration-300 whitespace-nowrap ${isFormValid || showConfirmation ? 'opacity-100' : 'opacity-0'}`}
            style={{
              transform: `translate(-50%, -10px)`,
            }}
          >
            {showConfirmation ? 'Sent!' : 'click to send'}
          </div>
        </div>
      )}

      {/* Decorative Background Circles */}
      {/* Animated Background Circles - single set that moves based on screen shape */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Circle 1 - Top Left Orange */}
        <div 
          className={`absolute bg-[#FF5900] rounded-full transition-all duration-1000 ease-in-out ${
            screenShape === 'phone' ? '-left-[40vw] -top-[43vh] w-[120vw] h-[120vw]' :
            screenShape === 'square' ? '-left-[19.53vw] -top-[26.04vh] w-[52.08vw] h-[52.08vw]' :
            screenShape === 'classic' ? '-left-[17.60vw] -top-[26.41vh] w-[52.08vw] h-[52.08vw]' :
            screenShape === 'mac' ? '-left-[19.84vw] -top-[30.55vh] w-[52.91vw] h-[52.91vw]' :
            screenShape === 'wide_short' ? '-left-[17.60vw] -top-[28.17vh] w-[46.88vw] h-[46.88vw]' :
            screenShape === 'wide' ? '-left-[17.60vw] -top-[31.30vh] w-[46.88vw] h-[46.88vw]' :
            '-left-[9.92vw] -top-[41.20vh] w-[47.62vw] h-[47.62vw]' // ultrawide
          }`}
        ></div>
        
        {/* Circle 2 - Right Blue */}
        <div 
          className={`absolute bg-[#008CFF] rounded-full transition-all duration-1000 ease-in-out ${
            screenShape === 'phone' ? 'right-[-50vw] top-[60vh] w-[110vw] h-[110vw]' :
            screenShape === 'square' ? 'right-[-13.02vw] top-[41.67vh] w-[41.67vw] h-[41.67vw]' :
            screenShape === 'classic' ? 'right-[-15.63vw] top-[54.69vh] w-[39.06vw] h-[39.06vw]' :
            screenShape === 'mac' ? 'right-[-21.49vw] top-[61.10vh] w-[43.00vw] h-[43.00vw]' :
            screenShape === 'wide_short' ? 'right-[-15.63vw] top-[58.33vh] w-[39.06vw] h-[39.06vw]' :
            screenShape === 'wide' ? 'right-[-15.63vw] top-[64.81vh] w-[39.06vw] h-[39.06vw]' :
            'right-[-13.89vw] top-[60.19vh] w-[33.73vw] h-[33.73vw]' // ultrawide
          }`}
        ></div>
        
        {/* Circle 3 - Bottom Left Green */}
        <div 
          className={`absolute bg-[#B2FF00] rounded-full transition-all duration-1000 ease-in-out ${
            screenShape === 'phone' ? '-left-[50vw] top-[130vh] w-[120vw] h-[120vw]' :
            screenShape === 'square' ? '-left-[16.93vw] top-[125.00vh] w-[52.08vw] h-[52.08vw]' :
            screenShape === 'classic' ? '-left-[16.93vw] top-[125.47vh] w-[52.08vw] h-[52.08vw]' :
            screenShape === 'mac' ? '-left-[17.59vw] top-[132.38vh] w-[52.91vw] h-[52.91vw]' :
            screenShape === 'wide_short' ? '-left-[16.93vw] top-[141.67vh] w-[52.08vw] h-[52.08vw]' :
            screenShape === 'wide' ? '-left-[16.93vw] top-[125.00vh] w-[52.08vw] h-[52.08vw]' :
            '-left-[12.90vw] top-[138.89vh] w-[39.68vw] h-[39.68vw]' // ultrawide
          }`}
        ></div>
        
        {/* Circle 4 - Bottom Left Blue */}
        <div 
          className={`absolute bg-[#008CFF] rounded-full transition-all duration-1000 ease-in-out ${
            screenShape === 'phone' ? 'left-[-30vw] bottom-[-15vh] w-[100vw] h-[100vw]' :
            screenShape === 'square' ? 'left-[-13.02vw] bottom-[-17.36vh] w-[36.46vw] h-[36.46vw]' :
            screenShape === 'classic' ? 'left-[-13.02vw] bottom-[-19.53vh] w-[36.46vw] h-[36.46vw]' :
            screenShape === 'mac' ? 'left-[-16.53vw] bottom-[-25.46vh] w-[43.00vw] h-[43.00vw]' :
            screenShape === 'wide_short' ? 'left-[-13.02vw] bottom-[-20.83vh] w-[36.46vw] h-[36.46vw]' :
            screenShape === 'wide' ? 'left-[-13.02vw] bottom-[-23.15vh] w-[36.46vw] h-[36.46vw]' :
            'left-[-11.90vw] bottom-[-27.78vh] w-[31.75vw] h-[31.75vw]' // ultrawide
          }`}
        ></div>
        
        {/* Circle 5 - Bottom Right Orange */}
        <div 
          className={`absolute bg-[#FF5900] rounded-full transition-all duration-1000 ease-in-out ${
            screenShape === 'phone' ? 'right-[-40vw] bottom-[-5vh] w-[120vw] h-[120vw]' :
            screenShape === 'square' ? 'right-[-20.83vw] bottom-[0vh] w-[41.67vw] h-[41.67vw]' :
            screenShape === 'classic' ? 'right-[-23.44vw] bottom-[0vh] w-[52.08vw] h-[52.08vw]' :
            screenShape === 'mac' ? 'right-[-21.49vw] bottom-[0vh] w-[43.00vw] h-[43.00vw]' :
            screenShape === 'wide_short' ? 'right-[-23.44vw] bottom-[0vh] w-[38.44vw] h-[38.44vw]' :
            screenShape === 'wide' ? 'right-[-23.44vw] bottom-[0vh] w-[38.44vw] h-[38.44vw]' :
            'right-[-19.05vw] bottom-[0vh] w-[33.73vw] h-[33.73vw]' // ultrawide
          }`}
        ></div>
      </div>

      {/* Header */}
      <header className={`relative z-30 px-4 sm:px-6 lg:px-8 py-4 md:py-6 ${isMenuOpen ? 'bg-neutral-50' : ''}`}>
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-2xl md:text-3xl font-serif text-black">Fletcher Alderton</h1>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-black p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'none' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            <a href="#info" className="text-xl lg:text-3xl font-serif text-black hover:opacity-70 transition-opacity" style={{ cursor: 'none' }} onMouseLeave={handleMouseLeave}>Info</a>
            <a href="#projects" className="text-xl lg:text-3xl font-serif text-black hover:opacity-70 transition-opacity" style={{ cursor: 'none' }} onMouseLeave={handleMouseLeave}>Projects</a>
            <a href="#contact" className="text-xl lg:text-3xl font-serif text-black hover:opacity-70 transition-opacity" style={{ cursor: 'none' }} onMouseLeave={handleMouseLeave}>Contact</a>
          </div>
        </nav>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-neutral-50 z-50">
            <div className="px-4 divide-y divide-black border-t border-black mx-4">
              <a href="#info" className="block text-2xl font-serif text-black hover:opacity-70 transition-opacity py-4" onClick={() => setIsMenuOpen(false)} style={{ cursor: 'none' }} onMouseLeave={handleMouseLeave}>Info</a>
              <a href="#projects" className="block text-2xl font-serif text-black hover:opacity-70 transition-opacity py-4" onClick={() => setIsMenuOpen(false)} style={{ cursor: 'none' }} onMouseLeave={handleMouseLeave}>Projects</a>
              <a href="#contact" className="block text-2xl font-serif text-black hover:opacity-70 transition-opacity py-4" onClick={() => setIsMenuOpen(false)} style={{ cursor: 'none' }} onMouseLeave={handleMouseLeave}>Contact</a>
            </div>
          </div>
        )}

        <div className={`w-full h-px bg-black mt-4 md:mt-6 max-w-7xl mx-auto ${isMenuOpen ? 'hidden' : 'block'}`}></div>
      </header>

      {/* About Section */}
      <section id="info" className={`relative z-10 px-4 sm:px-6 lg:px-8 flex items-center md:-ml-50 transition-all duration-1000 ease-in-out ${
        screenShape === 'phone' ? 'min-h-[45vh] max-h-[60vh]' :
        screenShape === 'square' ? 'min-h-[55vh] max-h-[65vh]' :
        screenShape === 'classic' ? 'min-h-[59vh] max-h-[69vh]' :
        screenShape === 'mac' ? 'min-h-[55vh] max-h-[65vh]' :
        screenShape === 'wide_short' ? 'min-h-[65vh] max-h-[75vh]' :
        screenShape === 'wide' ? 'min-h-[65vh] max-h-[75vh]' :
        'min-h-[77vh] max-h-[87vh]' // ultrawide
      }`}>
        <div className="max-w-7xl mx-auto w-full">
          <div className={`flex transition-all duration-1000 ease-in-out ${
            screenShape === 'classic' ? 'justify-center md:justify-end' : 'justify-center md:justify-end'
          }`}>
            <div className={`transition-all duration-1000 ease-in-out ${
              screenShape === 'classic' ? 'max-w-xl md:mr-24' : 'max-w-2xl md:mr-8 lg:mr-16'
            }`}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-serif italic text-black mb-3 md:mb-4">About me!</h2>
              <div className="w-32 sm:w-40 md:w-48 h-px bg-black mb-6 md:mb-8"></div>
              <p className={`font-serif text-black leading-relaxed transition-all duration-1000 ease-in-out ${
                screenShape === 'ultrawide' ? 'text-3xl' :
                screenShape === 'classic' ? 'text-xl' :
                screenShape === 'wide' ? 'text-2xl' :
                screenShape === 'wide_short' ? 'text-xl' :
                'text-lg sm:text-xl md:text-2xl lg:text-xl '
              }`}>
                Hi, I&apos;m Fletcher, a full-stack developer based in Melbourne, Australia. I&apos;m passionate about creating everything from complex, over-engineered apps to simple tools that make everyday life easier. With over 5 years of curiosity-driven experience in technology.
                <br />
                <br />
                Right now, I&apos;m interning at Westpac while completing my university degree, gaining hands-on experience in building scalable, real-world applications.
                <br />
                <br />
                When I&apos;m not coding, you&apos;ll probably find me exploring Melbourne&apos;s coffee scene, enjoying a glass of wine with friends, or jotting down my latest dev struggles and lessons learned here on the <a href="https://mostlytech.xyz" target="_blank" rel="noopener noreferrer" className="text-black font-bold hover:text-orange-500">blog</a>.
                <br />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 min-h-screen flex flex-col justify-center py-16 md:py-24">
        <div className="max-w-7xl mx-auto w-full px-2 ml-5 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-[1fr_1fr] items-center mb-3 md:mb-4">
            <h2 className={`font-serif italic text-black transition-all duration-1000 ease-in-out ${
              screenShape === 'classic' ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-3xl sm:text-4xl md:text-5xl'
            }`}>My Projects</h2>
            
            {/* Hint text with sparkles - mobile only */}
            <div className="md:hidden text-center">
              <SparklesText 
                className="text-md lg:text-lg text-black font-thin whitespace-nowrap"
                colors={{ first: "#B2FF00", second: "#FF5900" }}
                sparklesCount={5}
              >
                Click on any project <br />
                for more details
              </SparklesText>
            </div>
          </div>
          <div className="w-40 sm:w-44 md:w-52 h-px bg-black mb-8 md:mb-12 lg:mb-16"></div>
        </div>
        
        {/* Carousel Container */}
        <div ref={carouselContainerRef} className="carousel-container w-full relative px-4 sm:px-6 md:px-8 lg:px-0">
          <Carousel
            setApi={(api) => {
              // Store the slider API for navigation
              window.carouselSlider = api;
            }}
            opts={{
              beforeChange: handleSlideChange,
            }}
            className="w-full"
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                {...project}
                isCentered={index === selectedIndex}
                onCenterClick={() => handleCenterClick(index)}
                onMouseEnter={() => handleProjectCardHover(index)}
                onMouseLeave={handleMouseLeave}
                                  onShowDetailsChange={(showingDetails) => {
                    if(index !== selectedIndex) return; // ignore non-centered cards
                    // Debounce the state update to prevent rapid true/false switching
                    setTimeout(() => {
                      setCenterProjectShowingDetails(showingDetails);
                    }, 10);
                  }}
              />
            ))}
          </Carousel>

          {/* Click overlay for carousel navigation - desktop only */}
          {hasFinePointer && (
            <div className="pointer-events-none absolute inset-0 z-40" aria-hidden="true" role="presentation">
              {/* Left third clickable zone */}
              <div
                className="absolute inset-y-0 left-0 pointer-events-auto"
                style={{ width: '33.3333%' }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Use React Slick's slickPrev method via window reference
                  const slider = window.carouselSlider;
                  if (slider && slider.slickPrev) {
                    slider.slickPrev();
                  }
                }}
                aria-label="Previous slide"
              />
              {/* Center third (pass-through) */}
              <div
                className="absolute inset-y-0"
                style={{ left: '33.3333%', width: '33.3333%' }}
              />
              {/* Right third clickable zone */}
              <div
                className="absolute inset-y-0 right-0 pointer-events-auto"
                style={{ width: '33.3333%' }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Use React Slick's slickNext method via window reference
                  const slider = window.carouselSlider;
                  if (slider && slider.slickNext) {
                    slider.slickNext();
                  }
                }}
                aria-label="Next slide"
              />
            </div>
          )}
        </div>
        
        {/* Position Indicators - Mobile Only */}
        <div className="flex justify-center mt-6 md:hidden">
          <div className="flex gap-1">
            {projects.map((_, index) => {
              // Cycle through the three colors: FF5900 (orange), 008CFF (blue), B2FF00 (green)
              const colors = ['#FF5900', '#008CFF', '#B2FF00'];
              const colorIndex = index % colors.length;
              const isActive = index === selectedIndex;
              
              return (
                <span
                  key={index}
                  className="inline-block rounded-full transition-all duration-200"
                  style={{
                    width: '10px',
                    height: '10px',
                    cursor: 'none',
                    backgroundColor: isActive ? colors[colorIndex] : colors[colorIndex] + '40', // 40 = 25% opacity for inactive
                    border: isActive ? `2px solid ${colors[colorIndex]}` : 'none'
                  }}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`relative z-10 px-4 sm:px-6 lg:px-8 flex items-center transition-all duration-1000 ease-in-out ${
        screenShape === 'classic' ? 'min-h-[70vh]' : 'min-h-screen'
      }`}>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          {/* Header with underline - centered */}
          <div className="text-center mb-20">
            <h2 className={`font-serif italic text-black mb-4 transition-all duration-1000 ease-in-out ${
              screenShape === 'classic' ? 'text-4xl md:text-5xl' : 'text-4xl md:text-5xl'
            }`}>Get in contact</h2>
            <div className="w-60 h-px bg-black mx-auto"></div>
          </div>
          
          <form className="relative">
            {/* Your Name Input - nearly center but slightly to the left */}
            <div className="w-full md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:translate-x-[-80px] md:w-80 mb-12">
              <label 
                className={`block font-serif text-black mb-4 transition-all duration-1000 ease-in-out ${
                  screenShape === 'classic' ? 'text-2xl md:text-3xl' : 'text-2xl md:text-3xl'
                }`}
                style={{ cursor: 'none' }}
                onMouseLeave={handleMouseLeave}
              >Your Name</label>
              <input 
                type="text" 
                className={`w-full border border-black bg-transparent px-4 focus:outline-none focus:ring-0 transition-all duration-1000 ease-in-out ${
                  screenShape === 'classic' ? 'h-14' : 'h-14'
                }`}
                style={{ cursor: 'none' }}
                onMouseLeave={handleMouseLeave}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            {/* Email Input - off-centered to the right */}
            <div className={`w-full mb-12 md:absolute md:top-48 md:left-1/2 md:transform md:-translate-x-1/2 md:w-96 ${
              screenShape === 'mac' ? 'md:translate-x-[70px]' :
              screenShape === 'classic' ? 'md:translate-x-[-300px]' :
              'md:translate-x-[120px]'
            }`}>
              <label 
                className={`block font-serif text-black mb-4 transition-all duration-1000 ease-in-out ${
                  screenShape === 'classic' ? 'text-2xl md:text-3xl' : 'text-2xl md:text-3xl'
                }`}
                style={{ cursor: 'none' }}
                onMouseLeave={handleMouseLeave}
              >Email</label>
              <input 
                type="email" 
                className={`w-full border border-black bg-transparent px-4 focus:outline-none focus:ring-0 transition-all duration-1000 ease-in-out ${
                  screenShape === 'classic' ? 'h-14' : 'h-14'
                }`}
                style={{ cursor: 'none' }}
                onMouseLeave={handleMouseLeave}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {/* A little Note - off-center to the left, further than Your Name */}
            <div className={`w-full md:absolute md:top-96 md:left-1/2 md:transform md:-translate-x-1/2 transition-all duration-1000 ease-in-out ${
              screenShape === 'classic' ? 'md:translate-x-[-200px] md:w-[400px]' : 'md:translate-x-[-200px] md:w-[500px]'
            }`}>
              <label 
                className={`block font-serif text-black mb-4 transition-all duration-1000 ease-in-out ${
                  screenShape === 'classic' ? 'text-2xl md:text-3xl' : 'text-2xl md:text-3xl'
                }`}
                style={{ cursor: 'none' }}
                onMouseLeave={handleMouseLeave}
              >A little Note</label>
              <textarea 
                className={`w-full border border-black bg-transparent resize-none px-4 py-3 focus:outline-none focus:ring-0 transition-all duration-1000 ease-in-out ${
                  screenShape === 'classic' ? 'h-28' : 'h-28'
                }`}
                placeholder=""
                style={{ cursor: 'none' }}
                onMouseLeave={handleMouseLeave}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
            
            {/* Mobile-only Submit Button */}
            <div className="flex justify-center mt-6 md:hidden">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`font-serif text-lg px-6 py-2 transition-colors duration-200 ${
                  isFormValid ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'backdrop-blur-md border border-black text-black cursor-not-allowed'
                }`}
              >
                Send
              </button>
            </div>
            
            {/* Spacer to ensure proper section height */}
            <div className="h-[200px] md:h-[600px]"></div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm sm:text-base font-serif text-black">Not copy right Fletcher Alderton 2025</p>
        </div>
      </footer>
    </div>
  );
}