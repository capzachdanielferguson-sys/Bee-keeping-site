import { Hero } from '@/components/home/Hero'
import {
  BeginnerFaq,
  HiveSenseSection,
  Marquee,
  ProductShowcase,
  StarterQuestSection,
  StorySection,
} from '@/components/home/sections'
import { useDocumentTitle } from '@/lib/hooks'

export default function Home() {
  useDocumentTitle('')
  return (
    <>
      <Hero />
      <Marquee />
      <ProductShowcase />
      <StarterQuestSection />
      <HiveSenseSection />
      <StorySection />
      <BeginnerFaq />
    </>
  )
}
