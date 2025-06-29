"use client";

import { useState, useEffect } from "react";
import ProjectCard from "./components/ProjectCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import React from "react";

const projects = [
  {
    imageSrc: "/floating-notes.png",
    imageAlt: "Floating Notes App",
    title: "Floating Notes",
    description: "A simple note taking app",
    detailedDescription: "Floating notes was made in SwiftUI as an alternative to raycast notes but free and open source, you can read about troubled development here or check it out on GitHub",
    links: [
      { text: "SwiftUI", url: "#", type: "swift" },
      { text: "here", url: "#", type: "blog" },
      { text: "GitHub", url: "#", type: "github" }
    ]
  },
  {
    imageSrc: "/qtm.png",
    imageAlt: "Quotes that Matter App",
    title: "Quotes that Matter",
    description: "Giving great quotes the attention they deserve",
    detailedDescription: "Quotes that Matter is a React application designed to showcase meaningful quotes in an elegant interface. Built with modern web technologies, you can learn more about the development process here or view the source code on GitHub",
    links: [
      { text: "here", url: "#", type: "blog" },
      { text: "GitHub", url: "#", type: "github" }
    ]
  },
  {
    imageSrc: "/just-save-it.png",
    imageAlt: "Just $ave It App",
    title: "Just $ave It",
    description: "See what you could be worth if you just saved it",
    detailedDescription: "Just $ave It helps you visualize the power of saving money over time with compound interest calculations. This web application demonstrates financial growth scenarios, read about the development here or explore the code on GitHub",
    links: [
      { text: "here", url: "#", type: "blog" },
      { text: "GitHub", url: "#", type: "github" }
    ]
  },
  {
    imageSrc: "/weather-app.png",
    imageAlt: "Weather Dashboard",
    title: "Weather Dashboard",
    description: "Real-time weather tracking with beautiful visualizations",
    detailedDescription: "A modern weather application built with React and TypeScript, featuring real-time data visualization, location-based forecasts, and responsive design. Learn more about the development process here or view the source on GitHub",
    links: [
      { text: "React", url: "#", type: "react" },
      { text: "TypeScript", url: "#", type: "typescript" },
      { text: "here", url: "#", type: "blog" },
      { text: "GitHub", url: "#", type: "github" }
    ]
  },
  {
    imageSrc: "/task-manager.png",
    imageAlt: "Task Management System",
    title: "TaskFlow Pro",
    description: "Full-stack task management with team collaboration",
    detailedDescription: "A comprehensive task management system built with Next.js and a robust database backend. Features team collaboration, real-time updates, and advanced project tracking. This fullstack application showcases modern web development practices, read about it here or check the code on GitHub",
    links: [
      { text: "Next.js", url: "#", type: "nextjs" },
      { text: "database", url: "#", type: "database" },
      { text: "fullstack", url: "#", type: "fullstack" },
      { text: "here", url: "#", type: "blog" },
      { text: "GitHub", url: "#", type: "github" }
    ]
  },
  {
    imageSrc: "/desktop-app.png",
    imageAlt: "Desktop Productivity App",
    title: "Focus Timer",
    description: "Cross-platform productivity app for desktop",
    detailedDescription: "A powerful desktop application built with Electron and React, featuring customizable pomodoro timers, productivity tracking, and system notifications. Available for Windows, macOS, and Linux. Learn about the development journey here or explore the source on GitHub",
    links: [
      { text: "Electron", url: "#", type: "electron" },
      { text: "React", url: "#", type: "react" },
      { text: "here", url: "#", type: "blog" },
      { text: "GitHub", url: "#", type: "github" }
    ]
  },
  {
    imageSrc: "/mobile-app.png",
    imageAlt: "Mobile Fitness Tracker",
    title: "FitTrack Mobile",
    description: "Cross-platform fitness tracking app",
    detailedDescription: "A comprehensive fitness tracking application built with React Native, featuring workout logging, progress visualization, and social features. Available for both iOS and Android platforms. The app integrates with wearable devices and provides detailed analytics. Read about the development process here or view the code on GitHub",
    links: [
      { text: "React", url: "#", type: "react" },
      { text: "iOS", url: "#", type: "ios" },
      { text: "Android", url: "#", type: "android" },
      { text: "here", url: "#", type: "blog" },
      { text: "GitHub", url: "#", type: "github" }
    ]
  }
] as const;

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [screenShape, setScreenShape] = useState<'phone' | 'square' | 'classic' | 'mac' | 'wide_short' | 'wide' | 'ultrawide' | 'unknown'>('wide'); // Default to wide for SSR
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [cursorIcon, setCursorIcon] = useState<'plus' | 'minus' | 'arrow-left' | 'arrow-right' | 'arrow-up' | null>(null);
  const [centerProjectShowingDetails, setCenterProjectShowingDetails] = useState(false);
  const prevIndexRef = React.useRef(0);
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNoteValid, setIsNoteValid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasFinePointer, setHasFinePointer] = useState(true);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, note }),
      });

      if (response.ok) {
        console.log('Email sent successfully');
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
  };

  // Debug effect to track centerProjectShowingDetails changes
  useEffect(() => {
    console.log(`[${Date.now()}] centerProjectShowingDetails changed to:`, centerProjectShowingDetails);
  }, [centerProjectShowingDetails]);

  // Debug effect to track cursorIcon changes
  useEffect(() => {
    console.log(`[${Date.now()}] cursorIcon changed to:`, cursorIcon);
  }, [cursorIcon]);

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
    setHasFinePointer(window.matchMedia('(pointer:fine)').matches);
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
  }, [isFormValid, name, email, note, hasFinePointer]); // Ensure handleSubmit has fresh state

  // Update cursor icon reactively
  useEffect(() => {
    if (isFormValid) {
      setCursorIcon('arrow-up');
      return; // Form submission is the highest priority cursor
    }

    if (hoveredProjectIndex === null) {
      setCursorIcon(null); // No project card is hovered
      return;
    }

    if (hoveredProjectIndex === selectedIndex) {
      setCursorIcon(centerProjectShowingDetails ? 'minus' : 'plus');
    } else {
      const num = projects.length;
      const distRight = (hoveredProjectIndex - selectedIndex + num) % num;
      const distLeft  = (selectedIndex - hoveredProjectIndex + num) % num;
      setCursorIcon(distLeft < distRight ? 'arrow-left' : 'arrow-right');
    }
  }, [isFormValid, hoveredProjectIndex, selectedIndex, centerProjectShowingDetails]);

  const handleMouseEnter = () => {
    console.log(`[${Date.now()}] handleMouseEnter. formCompletionCount: ${formCompletionCount}`);
    if(formCompletionCount > 0) return;
    setIsHoveringInteractive(true);
  }
  const handleMouseLeave = () => {
    console.log(`[${Date.now()}] handleMouseLeave. formCompletionCount: ${formCompletionCount}`);
    setHoveredProjectIndex(null);
    setIsHoveringInteractive(false);
  };

  const handleProjectCardHover = (index: number) => {
    console.log(`[${Date.now()}] handleProjectCardHover. formCompletionCount: ${formCompletionCount}, index: ${index}`);
    if(formCompletionCount === 0) setIsHoveringInteractive(true);
    setHoveredProjectIndex(index);
  };

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

  useEffect(() => {
    if (!api) {
      console.log(`[${Date.now()}] Carousel API not ready yet`);
      return;
    }

    console.log(`[${Date.now()}] Carousel API is ready, setting up listeners`);
    
    const handleSelect = () => {
      const newIndex = api.selectedScrollSnap();
      const prevIndex = prevIndexRef.current;
      console.log(`[${Date.now()}] Carousel select event:`, { prevIndex, newIndex });
      
      if (newIndex !== prevIndex) {
        console.log(`[${Date.now()}] Slide changed from ${prevIndex} to ${newIndex} - resetting details`);
        setCenterProjectShowingDetails(false);
        prevIndexRef.current = newIndex;
      } else {
        console.log(`[${Date.now()}] Slide did not change (index ${newIndex}) - keeping details state`);
      }
      
      setSelectedIndex(newIndex);
    };

    // Initialize ref with current index
    prevIndexRef.current = api.selectedScrollSnap();

    api.on("select", handleSelect);
    handleSelect(); 

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  let cursorBgClass = 'bg-gray-300/30 border-gray-300/50';
  if (formCompletionCount === 1) cursorBgClass = 'bg-orange-500/20 border-orange-400/30';
  if (formCompletionCount === 2) cursorBgClass = 'bg-orange-500/50 border-orange-400/60';
  if (formCompletionCount === 3) cursorBgClass = 'bg-orange-500 border-orange-400';

  const shouldShrink = isHoveringInteractive && !cursorIcon && formCompletionCount === 0;

  return (
    <div className="relative min-h-screen bg-neutral-50 overflow-x-hidden overflow-y-auto" style={hasFinePointer ? { cursor: 'none' } : undefined}>
      {/* Custom Cursor */}
      {mounted && hasFinePointer && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[9999]"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          {/* The actual cursor circle */}
          <div
            className={`transition-all duration-100 border ease-out shadow-lg flex items-center justify-center rounded-full backdrop-blur-md ${
              shouldShrink ? 'w-4 h-4' : 'w-10 h-10'
            } ${cursorBgClass}`}
            style={{
              transform: `translate(-50%, -50%)`,
            }}
          >
            {cursorIcon === 'plus' && <span className="text-white text-3xl font-thin leading-none">+</span>}
            {cursorIcon === 'minus' && <span className="text-white text-3xl font-thin leading-none">−</span>}
            {cursorIcon === 'arrow-left' && (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            )}
            {cursorIcon === 'arrow-right' && (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {cursorIcon === 'arrow-up' && (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* DEBUG: Aspect-ratio category indicator */}
      {mounted && (
      <div className="fixed bottom-4 right-4 z-50 bg-black text-white p-2 text-sm">
        {screenShape === 'phone' && <span>📱 PHONE (≤3:4)</span>}
        {screenShape === 'square' && <span>🟫 SQUARE (3:4-4:3)</span>}
        {screenShape === 'classic' && <span>💻 CLASSIC (4:3-3:2)</span>}
        {screenShape === 'mac' && <span>🍎 MAC (3:2-1.58)</span>}
        {screenShape === 'wide_short' && <span>🖥️ WIDE_SHORT (1.58-1.7)</span>}
        {screenShape === 'wide' && <span>🖥️ WIDE (1.7-21:9)</span>}
        {screenShape === 'ultrawide' && <span>🖥️ ULTRAWIDE (&gt;21:9)</span>}
        <br />
        <span>Selected: {selectedIndex}</span>
        <br />
        <span>Details: {centerProjectShowingDetails ? 'YES' : 'NO'}</span>
        <br />
        <span>Cursor: {cursorIcon || 'none'}</span>
      </div>
      )}

      {/* Decorative Background Circles */}
      {/* Animated Background Circles - single set that moves based on screen shape */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Circle 1 - Top Left Orange */}
        <div 
          className={`absolute bg-[#FF5900] rounded-full transition-all duration-1000 ease-in-out ${
            screenShape === 'phone' ? '-left-[225px] -top-[225px] w-[600px] h-[600px]' :
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
            screenShape === 'phone' ? 'right-[-200px] top-[400px] w-[500px] h-[500px]' :
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
            screenShape === 'phone' ? '-left-[200px] top-[1400px] w-[600px] h-[600px]' :
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
            screenShape === 'phone' ? 'left-[-200px] bottom-[-200px] w-[500px] h-[500px]' :
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
            screenShape === 'phone' ? 'right-[-300px] bottom-[0px] w-[600px] h-[600px]' :
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
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-serif text-black">Fletcher Alderton</h1>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-black p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'none' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-12">
            <a href="#info" className="text-xl lg:text-3xl font-serif text-black hover:opacity-70 transition-opacity" style={{ cursor: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Info</a>
            <a href="#projects" className="text-xl lg:text-3xl font-serif text-black hover:opacity-70 transition-opacity" style={{ cursor: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Projects</a>
            <a href="#contact" className="text-xl lg:text-3xl font-serif text-black hover:opacity-70 transition-opacity" style={{ cursor: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Contact</a>
          </div>
        </nav>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-neutral-50 border-t border-black z-20">
            <div className="px-4 py-4 space-y-4">
              <a href="#info" className="block text-2xl font-serif text-black hover:opacity-70 transition-opacity" onClick={() => setIsMenuOpen(false)} style={{ cursor: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Info</a>
              <a href="#projects" className="block text-2xl font-serif text-black hover:opacity-70 transition-opacity" onClick={() => setIsMenuOpen(false)} style={{ cursor: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Projects</a>
              <a href="#contact" className="block text-2xl font-serif text-black hover:opacity-70 transition-opacity" onClick={() => setIsMenuOpen(false)} style={{ cursor: 'none' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Contact</a>
            </div>
          </div>
        )}

        <div className="w-full h-px bg-black mt-4 md:mt-6 max-w-7xl mx-auto"></div>
      </header>

      {/* About Section */}
      <section id="info" className={`relative z-10 px-4 sm:px-6 lg:px-8 flex items-center md:-ml-[50px] transition-all duration-1000 ease-in-out ${
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla 
                eget justo nec sapien malesuada placerat. Phasellus id est tortor, 
                ac rhoncus lectus. Donec in nulla at tellus elementum 
                ullamcorper. Sed a arcu a elit interdum eleifend. Integer sit amet 
                mauris eu nisi auctor euismod. In hac habitasse platea dictumst. 
                Nulla non purus sed augue ullamcorper sodales eu vel nisi. 
                Aenean faucibus, arcu et interdum fringilla, nulla libero 
                rhoncus diam, sed faucibus augue justo ac lacus. Vivamus at 
                libero non nibh aliquam tincidunt non sed quam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 min-h-screen flex flex-col justify-center py-16 md:py-24">
        <div className="max-w-7xl mx-auto w-full px-2 ml-5 sm:px-4 md:px-6 lg:px-8">
          <h2 className={`font-serif italic text-black mb-3 md:mb-4 transition-all duration-1000 ease-in-out ${
            screenShape === 'classic' ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-3xl sm:text-4xl md:text-5xl'
          }`}>My Projects</h2>
          <div className="w-40 sm:w-44 md:w-52 h-px bg-black mb-8 md:mb-12 lg:mb-16"></div>
        </div>
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {projects.map((project, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <ProjectCard
                  {...project}
                  isCentered={index === selectedIndex}
                  onCenterClick={() => {
                    console.log('onCenterClick called:', { index, selectedIndex, isCenter: index === selectedIndex });
                    if (index === selectedIndex) {
                      console.log('Clicking on center project - should toggle details');
                    } else {
                      console.log('Clicking on non-center project - scrolling to:', index);
                      api?.scrollTo(index);
                    }
                  }}
                  onMouseEnter={() => handleProjectCardHover(index)}
                  onMouseLeave={handleMouseLeave}
                  onShowDetailsChange={(showingDetails) => {
                    if(index !== selectedIndex) return; // ignore non-centered cards
                    console.log(`[${Date.now()}] onShowDetailsChange (center card) called:`, {index, selectedIndex, showingDetails});
                    setCenterProjectShowingDetails(showingDetails);
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >Your Name</label>
              <input 
                type="text" 
                className={`w-full border border-black bg-transparent px-4 focus:outline-none focus:ring-0 transition-all duration-1000 ease-in-out ${
                  screenShape === 'classic' ? 'h-14' : 'h-14'
                }`}
                style={{ cursor: 'none' }}
                onMouseEnter={handleMouseEnter}
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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >Email</label>
              <input 
                type="email" 
                className={`w-full border border-black bg-transparent px-4 focus:outline-none focus:ring-0 transition-all duration-1000 ease-in-out ${
                  screenShape === 'classic' ? 'h-14' : 'h-14'
                }`}
                style={{ cursor: 'none' }}
                onMouseEnter={handleMouseEnter}
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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >A little Note</label>
              <textarea 
                className={`w-full border border-black bg-transparent resize-none px-4 py-3 focus:outline-none focus:ring-0 transition-all duration-1000 ease-in-out ${
                  screenShape === 'classic' ? 'h-28' : 'h-28'
                }`}
                placeholder=""
                style={{ cursor: 'none' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              ></textarea>
            </div>
            
            {/* Spacer to ensure proper section height */}
            <div className="h-[600px]"></div>
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