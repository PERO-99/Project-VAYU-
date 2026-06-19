import { Routes, Route } from 'react-router'
import { useEffect } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Stories from './pages/Stories'
import StoryDetail from './pages/StoryDetail'
import Community from './pages/Community'
import Contact from './pages/Contact'
import GeminiChat from './pages/GeminiChat'
import Explore from './pages/Explore'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  useEffect(() => {
    let lenis: any = null
    let rafId: number

    const initLenis = async () => {
      const Lenis = (await import('lenis')).default
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
      })

      lenis.on('scroll', () => {
        ScrollTrigger.update()
      })

      const scrollFn = (time: number) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(scrollFn)
      }

      rafId = requestAnimationFrame(scrollFn)
    }

    initLenis()

    return () => {
      if (lenis) lenis.destroy()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <ScrollToTop />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories/:slug" element={<StoryDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gemini" element={<GeminiChat />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
      <Footer />
    </>
  )
}
