import Image from "next/image";
import BlurEffect from "react-progressive-blur";
import { useState, useEffect } from "react";

interface ProjectLink {
  text: string;
  url: string;
  type: 'swift' | 'blog' | 'github' | 'react' | 'typescript' | 'nextjs' | 'database' | 'fullstack' | 'electron' | 'ios' | 'android';
}

interface ProjectCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  detailedDescription: string;
  links: readonly ProjectLink[];
  isCentered: boolean;
  onCenterClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onShowDetailsChange: (showingDetails: boolean) => void;
}

export default function ProjectCard({ imageSrc, imageAlt, title, description, detailedDescription, links, isCentered, onCenterClick, onMouseEnter, onMouseLeave, onShowDetailsChange }: ProjectCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!isCentered) {
      setShowDetails(false);
    }
  }, [isCentered]);

  useEffect(() => {
    console.log(`[${Date.now()}] ProjectCard showDetails useEffect:`, { showDetails });
    onShowDetailsChange(showDetails);
  }, [showDetails, onShowDetailsChange]);

  const handleClick = () => {
    if (isCentered) {
      const newShowDetails = !showDetails;
      console.log(`[${Date.now()}] ProjectCard handleClick:`, { isCentered, currentShowDetails: showDetails, newShowDetails });
      setShowDetails(newShowDetails);
    } else {
      console.log(`[${Date.now()}] ProjectCard handleClick - calling onCenterClick`);
      onCenterClick();
    }
  };

  const getLinkColor = (type: ProjectLink['type']) => {
    switch (type) {
      case 'swift':
      case 'electron':
        return 'text-orange-300 hover:text-orange-200';
      case 'react':
      case 'nextjs':
        return 'text-blue-300 hover:text-blue-200';
      case 'typescript':
        return 'text-cyan-300 hover:text-cyan-200';
      case 'database':
        return 'text-green-300 hover:text-green-200';
      case 'github':
        return 'text-gray-300 hover:text-gray-200';
      case 'ios':
        return 'text-purple-300 hover:text-purple-200';
      case 'android':
        return 'text-lime-300 hover:text-lime-200';
      default:
        return 'text-indigo-300 hover:text-indigo-200'; // for blog, fullstack etc.
    }
  }

  if (showDetails) {
    return (
      <div 
        className={`relative group transition-transform duration-300 ease-in-out ${isCentered ? 'transform scale-100' : 'transform scale-90'}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div 
          className="aspect-square relative overflow-hidden shadow-lg cursor-pointer flex items-center justify-center"
          onClick={handleClick}
          style={{ cursor: 'none' }}
        >
          {/* Background Image */}
          <Image 
            src={imageSrc} 
            alt={imageAlt} 
            width={1000} 
            height={1000} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Progressive Blur Effect */}
          <BlurEffect 
            position="bottom" 
            intensity={200}
            className="h-full"
          />
          
          {/* Dark Overlay for Better Contrast */}
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          
          {/* Content Overlay */}
          <div className="relative z-20 max-w-[85%] text-center">
            <p className="text-lg lg:text-xl font-noto-serif text-white leading-relaxed tracking-wide font-normal">
              {detailedDescription.split(new RegExp(`(${links.map(l => l.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|')})`, 'i')).map((part, index) => {
                const matchingLink = links.find(link => link.text.toLowerCase() === part.toLowerCase());
                
                if (matchingLink) {
                  return (
                    <a 
                      key={index}
                      href={matchingLink.url}
                      className={`font-medium ${getLinkColor(matchingLink.type)} underline decoration-2 underline-offset-2 transition-colors`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ cursor: 'none' }}
                    >
                      {part}
                    </a>
                  );
                }
                return part;
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative group transition-transform duration-300 ease-in-out ${isCentered ? 'transform scale-100' : 'transform scale-90'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div 
        className="bg-gray-200 aspect-square relative overflow-hidden shadow-lg cursor-pointer"
        onClick={handleClick}
        style={{ cursor: 'none' }}
      >
        <Image src={imageSrc} alt={imageAlt} width={1000} height={1000} className="w-full h-full object-cover" />
        
        {/* Progressive Blur Effect */}
        <BlurEffect 
          position="bottom" 
          intensity={120}
          className="h-40"
        />
        
        {/* Text Content - separate from blur layers */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-serif text-black mb-1 md:mb-2">{title}</h3>
              <p className="text-lg font-serif text-black">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 