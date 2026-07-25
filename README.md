# BlockConnect

> A third-party tool development organization for Minecraft.

This repository hosts the official website for the [NDBlockConnect](https://github.com/NDBlockConnect) GitHub organization, deployed to GitHub Pages at **[blockconnect.n0th1n3ssd0ma1n.top](https://blockconnect.n0th1n3ssd0ma1n.top)**.

## Overview

The site is a single-page application showcasing the organization's thirteen open-source projects across six technical directions: rendering, crossplay, performance, AI, launchers, and tooling. It features a WebGL constellation scene in the hero, an editorial project index, and a filterable projects page.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite 6
- **Styling**: Tailwind CSS 3
- **WebGL**: Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing
- **Routing**: React Router 6 (HashRouter)
- **State**: Zustand
- **Icons**: lucide-react
- **Fonts**: Bricolage Grotesque, Sora, IBM Plex Mono

## Project Structure

```
src/
├── components/        # Navbar, Footer, ProjectRow, LanguageBadge, SectionHeading
├── sections/          # Home page sections (Hero, OrgIntro, Featured, TechDirections, ProjectIndex, Contact)
├── three/             # WebGL constellation scene (ConstellationScene, VoxelNode, NetworkLinks)
├── pages/             # Home, Projects
├── data/              # Static project catalog (13 repositories)
├── store/             # Zustand filter state
└── lib/               # Utilities
```

## Development

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Type-check and build for production
npm run preview  # Preview the production build locally
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflow in `.github/workflows/deploy.yml`, which builds the site and deploys to GitHub Pages. The custom domain is configured via `public/CNAME`.

## License

MIT
