import Image from "next/image";
import BlurEffect from "react-progressive-blur";
import { useState, useEffect } from "react";
import { 
  Swift, 
  ReactLight,
  TypeScript,
  Nextjs,
  Electron,
  Android,
  Convex,
  VercelLight,
  OpenAILight
} from "@ridemountainpig/svgl-react";

interface ExternalLink {
  type: string;
  url: string;
}
interface ProjectCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  detailedDescription: string;
  links: readonly ExternalLink[];
  techStack: { [key: string]: boolean | undefined };
  isCentered: boolean;
  onCenterClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onShowDetailsChange: (showingDetails: boolean) => void;
}

export default function ProjectCard({ imageSrc, imageAlt, title, description, detailedDescription, links, techStack, isCentered, onCenterClick, onMouseEnter, onMouseLeave, onShowDetailsChange }: ProjectCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Function to handle showDetails changes and notify parent
  const handleShowDetailsChange = (newShowDetails: boolean) => {
    setShowDetails(newShowDetails);
    onShowDetailsChange(newShowDetails);
  };

  useEffect(() => {
    if (!isCentered && showDetails) {
      // Only hide details if card is not centered AND currently showing details
      setShowDetails(false);
      onShowDetailsChange(false);
    }
  }, [isCentered, showDetails, onShowDetailsChange]);

  const handleClick = () => {
    if (isCentered) {
      const newShowDetails = !showDetails;
      handleShowDetailsChange(newShowDetails);
    } else {
      onCenterClick();
    }
  };

  const TechIcon = ({ type }: { type: string }) => {
    const size = 28;
    const commonProps = { width: size, height: size } as const;
    switch (type) {
      case 'swift':
        return <Swift {...commonProps} />;
      case 'react':
        return <ReactLight {...commonProps} />;
      case 'typescript':
        return <TypeScript {...commonProps} />;
      case 'nextjs':
        return <Nextjs {...commonProps} />;
      case 'electron':
        return <Electron {...commonProps} />;
      case 'android':
        return <Android {...commonProps} />;
      case 'convex':
        return <Convex {...commonProps} />;
      case 'vercel':
        return <VercelLight {...commonProps} />;
      case 'openai':
        return <OpenAILight {...commonProps} />;
      default:
        return null;
    }
  };

  if (showDetails) {
    return (
      <div 
        className={`relative group transition-transform duration-300 ease-in-out ${isCentered ? 'transform scale-100' : 'transform scale-90'}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div 
          className="aspect-square relative shadow-lg cursor-pointer"
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

          {/* Subtle base tint to reduce noise behind details */}
          <div className="absolute inset-0 bg-white/40" />

          {/* Full-card Details Panel - Minimal brutalist */}
          <div className="absolute inset-0 z-20 bg-neutral-50 border border-black p-5 md:p-6 flex flex-col">
            {/* Title + top-right links */}
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-2xl md:text-3xl font-serif text-black italic">{title}</h3>
              <div className="flex items-center gap-4">
                {links
                  .filter(l => /^(github|blog)$/i.test(l.type.trim()))
                  .map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-serif text-black underline underline-offset-4 hover:opacity-70"
                      onClick={(e) => e.stopPropagation()}
                      style={{ cursor: 'none' }}
                    >
                      {link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                    </a>
                ))}
              </div>
            </div>

            <div className="h-px bg-black my-3"></div>

            {/* Description */}
            <p className="text-base md:text-lg font-serif text-black leading-relaxed max-w-prose">
              {detailedDescription}
            </p>

            {/* Tech stack */}
            {techStack && Object.keys(techStack).length > 0 && (
              <div className="mt-auto">
                <h4 className="font-serif text-lg font-regular text-black italic">Tech stack</h4>
                <div className="h-px bg-black mb-3"></div>
                <div className="flex items-center gap-3 flex-wrap">
                  {Object.entries(techStack)
                    .filter(([, isPresent]) => isPresent === true)
                    .map(([tech], idx) => (
                    <div key={idx} className="inline-flex items-center gap-2 border border-black px-2 py-1 bg-white" title={tech}>
                      <TechIcon type={tech} />
                      <span className="text-sm font-serif text-black">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative group transition-transform duration-300 ease-in-out mb-8 ${isCentered ? 'transform scale-100' : 'transform scale-90'}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="bg-gray-200 aspect-square relative shadow-lg cursor-pointer"
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
