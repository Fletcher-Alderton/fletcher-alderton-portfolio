import type { ComponentType } from "react";
import {
  Swift,
  ReactLight,
  TypeScript,
  Nextjs,
  Electron,
  Android,
  Convex,
  VercelLight,
  OpenAILight,
  RustLight,
  Tauri,
  Python,
  MarkdownLight,
  Obsidian,
  JavaScript,
  Ruby,
  BashLight,
  Homebrew,
  AppleLight,
  AnthropicLight,
  GitHubCopilotLight,
} from "@ridemountainpig/svgl-react";

type IconProps = { width?: number; height?: number; className?: string };

/**
 * Single source of truth for the tech chips shown on a project card.
 * Keys are the lowercase identifiers used in projects.json / contributions.json.
 */
const TECH_ICONS: Record<string, ComponentType<IconProps>> = {
  swift: Swift,
  react: ReactLight,
  typescript: TypeScript,
  nextjs: Nextjs,
  electron: Electron,
  android: Android,
  convex: Convex,
  vercel: VercelLight,
  openai: OpenAILight,
  rust: RustLight,
  tauri: Tauri,
  python: Python,
  markdown: MarkdownLight,
  obsidian: Obsidian,
  javascript: JavaScript,
  ruby: Ruby,
  shell: BashLight,
  homebrew: Homebrew,
  macos: AppleLight,
  objc: AppleLight,
  mcp: AnthropicLight,
  copilot: GitHubCopilotLight,
};

/** Human readable labels for the chips (falls back to the raw key). */
const TECH_LABELS: Record<string, string> = {
  nextjs: "Next.js",
  macos: "macOS",
  objc: "Objective-C",
  mcp: "MCP",
  openai: "OpenAI",
  javascript: "JavaScript",
  typescript: "TypeScript",
};

export function techLabel(key: string) {
  return TECH_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

export function TechIcon({ type, size = 28 }: { type: string; size?: number }) {
  const Icon = TECH_ICONS[type];
  if (!Icon) return null;
  return <Icon width={size} height={size} />;
}

export function hasTechIcon(type: string) {
  return Boolean(TECH_ICONS[type]);
}
