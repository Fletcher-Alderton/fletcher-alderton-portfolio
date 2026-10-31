import Image from "next/image";
import { useState, useEffect } from "react";
import { TechIcon, techLabel } from "./tech-icons";

export interface ExternalLink {
  type: string;
  url: string;
}

export interface PullRequest {
  number: number;
  state: string;
  title: string;
  url: string;
}

export interface ProjectCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  detailedDescription: string;
  links: readonly ExternalLink[];
  techStack: { [key: string]: boolean | undefined };
  /** Present on the "contributed to" cards. */
  repo?: string;
  stars?: number;
  pullRequests?: readonly PullRequest[];
  isCentered: boolean;
  onCenterClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onShowDetailsChange: (showingDetails: boolean) => void;
}

const LINK_LABELS: Record<string, string> = {
  live: "Visit",
  website: "Visit",
  github: "GitHub",
  blog: "Blog",
  npm: "npm",
};

const PR_STATE_STYLES: Record<string, string> = {
  merged: "bg-[#B2FF00] border-[#B2FF00] text-black",
  open: "bg-[#008CFF] border-[#008CFF] text-white",
  closed: "bg-neutral-300 border-neutral-300 text-black",
};

function formatStars(stars?: number) {
  if (!stars) return null;
  if (stars >= 1000) {
    const k = stars / 1000;
    return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(stars);
}

export default function ProjectCard({
  imageSrc,
  imageAlt,
  title,
  description,
  detailedDescription,
  links,
  techStack,
  repo,
  stars,
  pullRequests,
  isCentered,
  onCenterClick,
  onMouseEnter,
  onMouseLeave,
  onShowDetailsChange,
}: ProjectCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleShowDetailsChange = (newShowDetails: boolean) => {
    setShowDetails(newShowDetails);
    onShowDetailsChange(newShowDetails);
  };

  useEffect(() => {
    if (!isCentered && showDetails) {
      setShowDetails(false);
      onShowDetailsChange(false);
    }
  }, [isCentered, showDetails, onShowDetailsChange]);

  const handleClick = () => {
    if (isCentered) {
      handleShowDetailsChange(!showDetails);
    } else {
      onCenterClick();
    }
  };

  const visibleTech = Object.entries(techStack ?? {})
    .filter(([, isPresent]) => isPresent === true)
    .map(([tech]) => tech);

  const starLabel = formatStars(stars);

  if (showDetails) {
    return (
      <div
        className={`relative group w-full transition-transform duration-300 ease-in-out ${
          isCentered ? "transform scale-100" : "transform scale-90"
        }`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          className="aspect-square relative shadow-lg cursor-pointer"
          onClick={handleClick}
          style={{ cursor: "none" }}
        >
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
          <div className="absolute inset-0 z-20 bg-neutral-50 border border-black p-3 sm:p-5 md:p-6 flex flex-col overflow-y-auto overscroll-contain">
            {/* Title + top-right links */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg sm:text-2xl md:text-3xl font-serif text-black italic leading-tight">
                {title}
              </h3>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-sm sm:text-base text-black underline underline-offset-4 hover:opacity-70"
                    onClick={(e) => e.stopPropagation()}
                    style={{ cursor: "none" }}
                  >
                    {LINK_LABELS[link.type.trim().toLowerCase()] ??
                      link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                  </a>
                ))}
              </div>
            </div>

            <div className="h-px bg-black my-2 shrink-0"></div>

            {/* Description */}
            <p className="text-[13px] sm:text-base md:text-lg font-serif text-black leading-tight sm:leading-relaxed">
              {detailedDescription}
            </p>

            {/* Pull requests (contributed cards) */}
            {pullRequests && pullRequests.length > 0 && (
              <div className="mt-2 sm:mt-3 shrink-0">
                <h4 className="font-serif text-sm sm:text-base md:text-lg text-black italic">
                  {pullRequests.length > 1 ? "My pull requests" : "My pull request"}
                </h4>
                <div className="h-px bg-black mb-2"></div>
                <ul className="space-y-1">
                  {pullRequests.map((pr) => (
                    <li key={pr.number}>
                      <a
                        href={pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group/pr"
                        onClick={(e) => e.stopPropagation()}
                        style={{ cursor: "none" }}
                      >
                        <span className="flex items-center gap-2 flex-wrap">
                          <span className="font-serif text-sm text-black underline underline-offset-4 group-hover/pr:opacity-70">
                            #{pr.number}
                          </span>
                          <span
                            className={`text-[10px] uppercase tracking-wider border px-1.5 py-0.5 font-sans ${
                              PR_STATE_STYLES[pr.state] ?? PR_STATE_STYLES.closed
                            }`}
                          >
                            {pr.state}
                          </span>
                        </span>
                        <span className="block font-serif text-[11px] sm:text-sm text-black/80 leading-snug mt-0.5">
                          {pr.title}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech stack */}
            {visibleTech.length > 0 && (
              <div className="mt-auto pt-2 sm:pt-3 shrink-0">
                <h4 className="font-serif text-base md:text-lg text-black italic">
                  Tech stack
                </h4>
                <div className="h-px bg-black mb-2"></div>
                <div className="flex items-center gap-2 flex-wrap">
                  {visibleTech.map((tech) => (
                    <div
                      key={tech}
                      className="inline-flex items-center gap-1.5 border border-black px-1.5 py-0.5 sm:py-1 bg-white"
                      title={techLabel(tech)}
                    >
                      <TechIcon type={tech} size={18} />
                      <span className="text-[10px] sm:text-xs font-serif text-black">
                        {techLabel(tech)}
                      </span>
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
      className={`relative group w-full transition-transform duration-300 ease-in-out ${
        isCentered ? "transform scale-100" : "transform scale-90"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="bg-neutral-900 aspect-square relative shadow-lg cursor-pointer overflow-hidden"
        onClick={handleClick}
        style={{ cursor: "none" }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1000}
          height={1000}
          className="w-full h-full object-cover"
        />

        {/* Label sits on the dark scrim baked into the artwork */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
          <div className="flex justify-between items-end gap-2">
            <div className="min-w-0">
              <h3 className="text-lg sm:text-2xl font-serif text-white mb-1 md:mb-2 leading-tight">
                {title}
              </h3>
              <p className="text-xs sm:text-base font-serif text-white/85 leading-snug line-clamp-3">
                {description}
              </p>
              {repo && (
                <p className="mt-1 font-sans text-[11px] tracking-wide text-white/60 truncate">
                  {repo}
                  {starLabel ? ` · ★ ${starLabel}` : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
