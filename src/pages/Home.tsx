import Hero from '@/sections/Hero'
import OrgIntro from '@/sections/OrgIntro'
import FeaturedProjects from '@/sections/FeaturedProjects'
import TechDirections from '@/sections/TechDirections'
import ProjectIndex from '@/sections/ProjectIndex'
import Contact from '@/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <OrgIntro />
      <FeaturedProjects />
      <TechDirections />
      <ProjectIndex />
      <Contact />
    </>
  )
}
