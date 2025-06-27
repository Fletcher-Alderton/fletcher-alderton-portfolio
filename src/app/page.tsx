"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [screenShape, setScreenShape] = useState<'phone' | 'square' | 'classic' | 'mac' | 'wide_short' | 'wide' | 'ultrawide' | 'unknown'>('wide'); // Default to wide for SSR
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
    updateScreenShape();
    window.addEventListener('resize', updateScreenShape);
    return () => window.removeEventListener('resize', updateScreenShape);
  }, []);

  return (
    <div className="relative min-h-screen bg-neutral-50 overflow-hidden">
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
      </div>
      )}

      {/* Decorative Background Circles */}
      {/* Animated Background Circles - single set that moves based on screen shape */}
      <div>
        {/* Circle 1 - Top Left Orange */}
        <div 
          className={`absolute bg-[#FF5900] rounded-full transition-all duration-1000 ease-in-out ${
            screenShape === 'phone' ? '-left-60 -top-60 w-[600px] h-[600px]' :
            screenShape === 'square' ? '-left-80 -top-80 w-[1000px] h-[1000px]' :
            screenShape === 'classic' ? '-left-55 -top-55 w-[900px] h-[900px]' :
            screenShape === 'mac' ? '-left-60 -top-60 w-[800px] h-[800px]' :
            screenShape === 'wide_short' ? '-left-55 -top-55 w-[900px] h-[900px]' :
            screenShape === 'wide' ? '-left-55 -top-55 w-[900px] h-[900px]' :
            '-left-80 -top-125 w-[1200px] h-[1200px]' // ultrawide
          }`}
        ></div>
        
        {/* Circle 2 - Right Blue */}
        <div 
          className={`absolute bg-[#008CFF] rounded-full transition-all duration-1000 ease-in-out ${
            screenShape === 'phone' ? 'right-[-200px] top-[400px] w-[500px] h-[500px]' :
            screenShape === 'square' ? 'right-[-250px] top-[600px] w-[800px] h-[800px]' :
            screenShape === 'classic' ? 'right-[-300px] top-[700px] w-[750px] h-[750px]' :
            screenShape === 'mac' ? 'right-[-325px] top-[600px] w-[650px] h-[650px]' :
            screenShape === 'wide_short' ? 'right-[-300px] top-[700px] w-[750px] h-[750px]' :
            screenShape === 'wide' ? 'right-[-300px] top-[700px] w-[750px] h-[750px]' :
            'right-[-350px] top-[650px] w-[850px] h-[850px]' // ultrawide
          }`}
        ></div>
        
        {/* Circle 3 - Bottom Left Green */}
        <div 
          className={`absolute bg-[#B2FF00] rounded-full transition-all duration-1000 ease-in-out ${
            screenShape === 'phone' ? '-left-60 top-[1400px] w-[600px] h-[600px]' :
            screenShape === 'square' ? '-left-80 top-[1800px] w-[1000px] h-[1000px]' :
            screenShape === 'classic' ? '-left-80 top-[1350px] w-[1000px] h-[1000px]' :
            screenShape === 'mac' ? '-left-70 top-[1300px] w-[800px] h-[800px]' :
            screenShape === 'wide_short' ? '-left-80 top-[1700px] w-[1000px] h-[1000px]' :
            screenShape === 'wide' ? '-left-80 top-[1350px] w-[1000px] h-[1000px]' :
            '-left-90 top-[1500px] w-[1000px] h-[1000px]' // ultrawide
          }`}
        ></div>
        
        {/* Circle 4 - Bottom Left Blue */}
        <div 
          className={`absolute bg-[#008CFF] rounded-full transition-all duration-1000 ease-in-out ${
            screenShape === 'phone' ? 'left-[-200px] bottom-[-200px] w-[500px] h-[500px]' :
            screenShape === 'square' ? 'left-[-250px] bottom-[-250px] w-[700px] h-[700px]' :
            screenShape === 'classic' ? 'left-[-250px] bottom-[-250px] w-[700px] h-[700px]' :
            screenShape === 'mac' ? 'left-[-250px] bottom-[-250px] w-[650px] h-[650px]' :
            screenShape === 'wide_short' ? 'left-[-250px] bottom-[-250px] w-[700px] h-[700px]' :
            screenShape === 'wide' ? 'left-[-250px] bottom-[-250px] w-[700px] h-[700px]' :
            'left-[-300px] bottom-[-300px] w-[800px] h-[800px]' // ultrawide
          }`}
        ></div>
        
        {/* Circle 5 - Bottom Right Orange */}
        <div 
          className={`absolute bg-[#FF5900] rounded-full transition-all duration-1000 ease-in-out ${
            screenShape === 'phone' ? 'right-[-300px] bottom-[0px] w-[600px] h-[600px]' :
            screenShape === 'square' ? 'right-[-400px] bottom-[0px] w-[800px] h-[800px]' :
            screenShape === 'classic' ? 'right-[-450px] bottom-[0px] w-[1000px] h-[1000px]' :
            screenShape === 'mac' ? 'right-[-325px] bottom-[0px] w-[650px] h-[650px]' :
            screenShape === 'wide_short' ? 'right-[-450px] bottom-[0px] w-[738px] h-[738px]' :
            screenShape === 'wide' ? 'right-[-450px] bottom-[0px] w-[738px] h-[738px]' :
            'right-[-480px] bottom-[0px] w-[850px] h-[850px]' // ultrawide
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
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-12">
            <a href="#info" className="text-xl lg:text-3xl font-serif text-black hover:opacity-70 transition-opacity">Info</a>
            <a href="#projects" className="text-xl lg:text-3xl font-serif text-black hover:opacity-70 transition-opacity">Projects</a>
            <a href="#contact" className="text-xl lg:text-3xl font-serif text-black hover:opacity-70 transition-opacity">Contact</a>
          </div>
        </nav>

        {/* Mobile navigation menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-neutral-50 border-t border-black z-20">
            <div className="px-4 py-4 space-y-4">
              <a href="#info" className="block text-2xl font-serif text-black hover:opacity-70 transition-opacity" onClick={() => setIsMenuOpen(false)}>Info</a>
              <a href="#projects" className="block text-2xl font-serif text-black hover:opacity-70 transition-opacity" onClick={() => setIsMenuOpen(false)}>Projects</a>
              <a href="#contact" className="block text-2xl font-serif text-black hover:opacity-70 transition-opacity" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </div>
          </div>
        )}

        <div className="w-full h-px bg-black mt-4 md:mt-6 max-w-7xl mx-auto"></div>
      </header>

      {/* About Section */}
      <section id="info" className={`relative z-10 px-4 sm:px-6 lg:px-8 flex items-center transition-all duration-1000 ease-in-out ${
        screenShape === 'phone' ? 'min-h-[calc(50vh-4vh)]' :
        screenShape === 'square' ? 'min-h-[calc(63vh-1vh)]' :
        screenShape === 'classic' ? 'min-h-[calc(65vh-1vh)]' :
        screenShape === 'mac' ? 'min-h-[calc(65vh-5vh)]' :
        screenShape === 'wide_short' ? 'min-h-[calc(70vh-5vh)]' :
        screenShape === 'wide' ? 'min-h-[calc(70vh-5vh)]' :
        'min-h-[calc(100vh-25vh)]' // ultrawide
      }`}>
        <div className="max-w-7xl mx-auto w-full">
          <div className={`flex transition-all duration-1000 ease-in-out ${
            screenShape === 'classic' ? 'justify-end' : 'justify-center md:justify-end'
          }`}>
            <div className={`transition-all duration-1000 ease-in-out ${
              screenShape === 'classic' ? 'max-w-lg mr-18' : 'max-w-2xl md:mr-8 lg:mr-16'
            }`}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-serif italic text-black mb-3 md:mb-4">About me!</h2>
              <div className="w-32 sm:w-40 md:w-48 h-px bg-black mb-6 md:mb-8"></div>
              <p className={`font-serif text-black leading-relaxed transition-all duration-1000 ease-in-out ${
                screenShape === 'ultrawide' ? 'text-3xl' :
                screenShape === 'classic' ? 'text-2xl' :
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
      <section id="projects" className="relative z-10 px-2 sm:px-4 md:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-none mx-auto w-full">
          <h2 className={`font-serif italic text-black mb-3 md:mb-4 transition-all duration-1000 ease-in-out ${
            screenShape === 'classic' ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-3xl sm:text-4xl md:text-5xl'
          }`}>My Projects</h2>
          <div className="w-40 sm:w-44 md:w-52 h-px bg-black mb-8 md:mb-12 lg:mb-16"></div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            {/* Project Card 1 - Task Management Interface */}
            <div className="relative group">
              <div className="bg-gray-200 aspect-square relative overflow-hidden shadow-lg">
                <Image src="/floating-notes.png" alt="Task Management Interface" width={1000} height={1000} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm p-4 md:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-black mb-1 md:mb-2">Floating Notes</h3>
                    <p className="text-sm sm:text-base md:text-lg font-serif text-black">A simple note taking app</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Card 2 - Quotes Display System */}
            <div className="relative group">
              <div className="bg-gray-200 aspect-square relative overflow-hidden shadow-lg">
                <Image src="/qtm.png" alt="Task Management Interface" width={1000} height={1000} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm p-4 md:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-black mb-1 md:mb-2">Quotes that Matter</h3>
                    <p className="text-sm sm:text-base md:text-lg font-serif text-black">Giving great quotes the attention they deserve</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Card 3 - Just Save It */}
            <div className="relative group">
              <div className="bg-gray-200 aspect-square relative overflow-hidden shadow-lg">
                <Image src="/just-save-it.png" alt="Task Management Interface" width={1000} height={1000} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm p-4 md:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-black mb-1 md:mb-2">Just $ave It</h3>
                    <p className="text-sm sm:text-base md:text-lg font-serif text-black">See what you could be worth if you just saved it</p>
                  </div>
                </div>
              </div>
            </div>
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
            <div className="absolute left-1/2 transform -translate-x-1/2 translate-x-[-80px] w-80">
              <label className={`block font-serif text-black mb-4 transition-all duration-1000 ease-in-out ${
                screenShape === 'classic' ? 'text-2xl md:text-3xl' : 'text-2xl md:text-3xl'
              }`}>Your Name</label>
              <input 
                type="text" 
                className={`w-full border border-black bg-transparent px-4 focus:outline-none focus:ring-0 transition-all duration-1000 ease-in-out ${
                  screenShape === 'classic' ? 'h-14' : 'h-14'
                }`}
              />
            </div>
            
            {/* Email Input - off-centered to the right */}
            <div className={`absolute top-48 left-1/2 transform -translate-x-1/2 w-96 ${
              screenShape === 'mac' ? 'translate-x-[70px]' :
              screenShape === 'classic' ? 'translate-x-[-300px]' :
              'translate-x-[120px]'
            }`}>
              <label className={`block font-serif text-black mb-4 transition-all duration-1000 ease-in-out ${
                screenShape === 'classic' ? 'text-2xl md:text-3xl' : 'text-2xl md:text-3xl'
              }`}>Email</label>
              <input 
                type="email" 
                className={`w-full border border-black bg-transparent px-4 focus:outline-none focus:ring-0 transition-all duration-1000 ease-in-out ${
                  screenShape === 'classic' ? 'h-14' : 'h-14'
                }`}
              />
            </div>
            
            {/* A little Note - off-center to the left, further than Your Name */}
            <div className={`absolute top-96 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-in-out ${
              screenShape === 'classic' ? 'translate-x-[-200px] w-[400px]' : 'translate-x-[-200px] w-[500px]'
            }`}>
              <label className={`block font-serif text-black mb-4 transition-all duration-1000 ease-in-out ${
                screenShape === 'classic' ? 'text-2xl md:text-3xl' : 'text-2xl md:text-3xl'
              }`}>A little Note</label>
              <textarea 
                className={`w-full border border-black bg-transparent resize-none px-4 py-3 focus:outline-none focus:ring-0 transition-all duration-1000 ease-in-out ${
                  screenShape === 'classic' ? 'h-28' : 'h-28'
                }`}
                placeholder=""
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
