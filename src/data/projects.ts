/**
 * BlockConnect org project catalog.
 * Sourced from https://github.com/NDBlockConnect — 13 repositories.
 * Static data, bundled at build time.
 */

export type Category =
  | 'rendering'
  | 'crossplay'
  | 'performance'
  | 'ai'
  | 'launcher'
  | 'meta'

export type Language = 'Python' | 'Java' | 'Rust' | 'Other'

export interface Project {
  /** Short code name, e.g. "OLG" */
  code: string
  /** Repository name, e.g. "OpenLumin" */
  name: string
  /** One-line description */
  desc: string
  /** Tech direction */
  category: Category
  /** Primary language */
  language: Language
  /** SPDX license identifier, e.g. "GPL-3.0" */
  license: string
  /** Star count */
  stars: number
  /** Fork count */
  forks: number
  /** Last updated ISO date */
  updated: string
  /** GitHub repository URL */
  url: string
  /** Whether the repo is archived */
  archived?: boolean
  /** Whether to feature on the home page */
  featured?: boolean
}

export interface CategoryMeta {
  id: Category
  label: string
  short: string
  color: string
  glyph: string
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'rendering',   label: 'Rendering & Client',  short: 'Rendering',   color: '#bef264', glyph: 'RND' },
  { id: 'crossplay',   label: 'Cross-Platform Play', short: 'CrossPlay',   color: '#fb923c', glyph: 'CXP' },
  { id: 'performance', label: 'Performance',         short: 'Performance', color: '#a78bfa', glyph: 'PRF' },
  { id: 'ai',          label: 'AI Plays MC',         short: 'AI',          color: '#fb7185', glyph: 'AI' },
  { id: 'launcher',    label: 'Launchers & Tools',   short: 'Launcher',    color: '#38bdf8', glyph: 'TLS' },
  { id: 'meta',        label: 'Organization',        short: 'Meta',        color: '#e879f9', glyph: 'ORG' },
]

export const LANGUAGE_COLORS: Record<Language, string> = {
  Python: '#3776ab',
  Java: '#e76f00',
  Rust: '#dea584',
  Other: '#9098a8',
}

export const PROJECTS: Project[] = [
  {
    code: 'OLG',
    name: 'OpenLumin',
    desc: 'A rendering framework for Minecraft Java Edition 26.1+, split out from NekoyaHouse/Epsilon for reuse across mods.',
    category: 'rendering',
    language: 'Java',
    license: 'GPL-3.0',
    stars: 2,
    forks: 0,
    updated: '2026-07-25',
    url: 'https://github.com/NDBlockConnect/OpenLumin',
  },
  {
    code: 'EBC',
    name: 'EpsilonBC',
    desc: 'Open source Minecraft utility mod for Fabric & NeoForge/Forge. Maintained by the Block Connect team.',
    category: 'rendering',
    language: 'Java',
    license: 'GPL-3.0',
    stars: 10,
    forks: 44,
    updated: '2026-07-25',
    url: 'https://github.com/NDBlockConnect/EpsilonBC',
    featured: true,
  },
  {
    code: 'ECS',
    name: 'EpsilonCommunitySupport',
    desc: 'Non-functional extensions, bug fixes, version support and performance optimizations for the Epsilon client.',
    category: 'rendering',
    language: 'Java',
    license: 'GPL-3.0',
    stars: 1,
    forks: 44,
    updated: '2026-07-18',
    url: 'https://github.com/NDBlockConnect/EpsilonCommunitySupport',
  },
  {
    code: 'MnMCP',
    name: 'MnMCP',
    desc: 'Connect the Worlds, Enjoy with Players. A protocol bridge between Minecraft Java Edition and MiniWorld.',
    category: 'crossplay',
    language: 'Python',
    license: 'Apache-2.0',
    stars: 8,
    forks: 2,
    updated: '2026-07-24',
    url: 'https://github.com/NDBlockConnect/MnMCP',
    featured: true,
  },
  {
    code: 'MBC',
    name: 'minecraftBC',
    desc: 'Based on FastLink, lets Minecraft players connect with each other and with players of other games through Minecraft.',
    category: 'crossplay',
    language: 'Python',
    license: 'Apache-2.0',
    stars: 2,
    forks: 0,
    updated: '2026-06-07',
    url: 'https://github.com/NDBlockConnect/minecraftBC',
  },
  {
    code: 'FTN',
    name: 'Forge2NeoForge',
    desc: 'Enables interoperability between Forge mods and NeoForge mods.',
    category: 'crossplay',
    language: 'Other',
    license: 'Apache-2.0',
    stars: 0,
    forks: 0,
    updated: '2026-07-24',
    url: 'https://github.com/NDBlockConnect/Forge2NeoForge',
  },
  {
    code: 'FLNMC',
    name: 'FastLinkMC',
    desc: 'Friend and multiplayer features for Minecraft JE 26.2+, optimized for China\'s network and offline players.',
    category: 'crossplay',
    language: 'Java',
    license: 'GPL-3.0',
    stars: 1,
    forks: 0,
    updated: '2026-07-13',
    url: 'https://github.com/NDBlockConnect/FastLinkMC',
  },
  {
    code: 'MMW',
    name: 'MC ↔ MiniWorld CrossPlay',
    desc: 'Open source technology solving CrossPlay interconnection between Minecraft and MiniWorld: Creata. Predecessor of MnMCP.',
    category: 'crossplay',
    language: 'Python',
    license: 'MIT',
    stars: 30,
    forks: 10,
    updated: '2026-05-09',
    url: 'https://github.com/NDBlockConnect/Minecraft.and.MiniWorldCreata-CrossPlatform-CrossPlay',
    archived: true,
    featured: true,
  },
  {
    code: 'JEB',
    name: 'MCJEBooster',
    desc: 'Minecraft Java Edition Multi-Core Optimization Engine. JVM-level performance library and compatibility pack.',
    category: 'performance',
    language: 'Java',
    license: 'LGPL-2.1',
    stars: 1,
    forks: 0,
    updated: '2026-07-13',
    url: 'https://github.com/NDBlockConnect/MCJEBooster',
  },
  {
    code: 'OML',
    name: 'OxygenMinecraftLLM',
    desc: 'A mod enabling models to play Minecraft via mainstream format APIs or MCP servers. Supported by Oxygen AI Lab.',
    category: 'ai',
    language: 'Other',
    license: 'Apache-2.0',
    stars: 1,
    forks: 0,
    updated: '2026-07-13',
    url: 'https://github.com/NDBlockConnect/OxygenMinecraftLLM',
  },
  {
    code: 'NML',
    name: 'NML',
    desc: 'A lightweight cross-platform launcher for Minecraft Java Edition. Flutter, Dart & Kotlin powered.',
    category: 'launcher',
    language: 'Rust',
    license: 'MIT',
    stars: 1,
    forks: 0,
    updated: '2026-07-05',
    url: 'https://github.com/NDBlockConnect/NML',
  },
  {
    code: 'MBE',
    name: 'MiniWorld-BlockID-Extraction',
    desc: 'MiniWorld BlockID extraction tooling for cross-game block mapping research.',
    category: 'launcher',
    language: 'Python',
    license: 'MIT',
    stars: 1,
    forks: 0,
    updated: '2026-02-26',
    url: 'https://github.com/NDBlockConnect/MiniWorld-BlockID-Extraction',
  },
  {
    code: 'BC',
    name: 'BlockConnect',
    desc: 'Block Connect to Play. The organization\'s main repository — this very site lives here.',
    category: 'meta',
    language: 'Python',
    license: 'MIT',
    stars: 1,
    forks: 0,
    updated: '2026-02-27',
    url: 'https://github.com/NDBlockConnect/BlockConnect',
  },
]

export function categoryMeta(id: Category): CategoryMeta {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1]
}

export function featuredProjects(): Project[] {
  return PROJECTS.filter((p) => p.featured)
}

export function projectsByCategory(id: Category): Project[] {
  return PROJECTS.filter((p) => p.category === id)
}

export function totalStars(): number {
  return PROJECTS.reduce((sum, p) => sum + p.stars, 0)
}
