import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isHome = location.pathname === '/'
  const isHero = isHome && !scrolled
  // On hero: transparent bg with white text (links have text-shadow for grid side readability)
  // After scroll / other pages: solid beige bg with dark text
  const navBg = isHero
    ? 'bg-[rgba(0,0,0,0.18)]'
    : 'bg-[rgba(242,237,232,0.95)] backdrop-blur-[8px] shadow-[0_1px_0_rgba(14,14,14,0.06)]'
  const linkColor = isHero ? 'text-white' : 'text-[#0E0E0E]'
  const barColor = isHero ? 'bg-white' : 'bg-[#0E0E0E]'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${navBg}`}>
        <div className="flex items-center justify-between h-16 px-[clamp(20px,4vw,64px)] max-w-[1400px] mx-auto">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <img src="/vayu-logo-icon.svg" alt="VAYU Logo" className="h-10 w-auto object-contain" style={isHero ? { filter: 'brightness(0) invert(1)' } : {}} />
            <span className={`text-nav font-bold tracking-[0.2em] transition-colors duration-300 ${linkColor}`}>VAYU</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {['Stories', 'Explore', 'Community', 'About', 'Contact'].map((label) => (
              <Link
                key={label}
                to={`/${label.toLowerCase()}`}
                className={`text-nav no-underline hover:opacity-60 transition-all duration-300 ${linkColor}`}
                style={isHero ? { textShadow: '0 1px 4px rgba(0,0,0,0.5)' } : {}}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/gemini"
              className="text-nav no-underline px-4 py-2 rounded-full bg-[#4A5D43] text-white hover:bg-[#3a4a35] transition-colors flex items-center gap-2"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#C07A5F] animate-pulse" />
              Vayu AI
            </Link>
          </div>

          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-[2px] transition-all duration-300 ${barColor} ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-6 h-[2px] transition-all duration-300 ${barColor} ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[2px] transition-all duration-300 ${barColor} ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[2000] bg-[#F2EDE8] flex flex-col items-center justify-center gap-8 md:hidden">
          <button className="absolute top-4 right-4 p-2" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <span className="block w-6 h-[2px] bg-[#0E0E0E] rotate-45 absolute" />
            <span className="block w-6 h-[2px] bg-[#0E0E0E] -rotate-45 absolute" />
          </button>
          <img src="/vayu-logo-icon.svg" alt="VAYU" className="h-16 w-auto mb-2" />
          <span className="text-h2 font-bold tracking-[0.1em] text-[#0E4C53] mb-4">VAYU</span>
          <Link to="/stories" className="text-h2 no-underline text-[#0E0E0E]" onClick={() => setMobileOpen(false)}>Stories</Link>
          <Link to="/explore" className="text-h2 no-underline text-[#0E0E0E]" onClick={() => setMobileOpen(false)}>Explore</Link>
          <Link to="/community" className="text-h2 no-underline text-[#0E0E0E]" onClick={() => setMobileOpen(false)}>Community</Link>
          <Link to="/about" className="text-h2 no-underline text-[#0E0E0E]" onClick={() => setMobileOpen(false)}>About</Link>
          <Link to="/contact" className="text-h2 no-underline text-[#0E0E0E]" onClick={() => setMobileOpen(false)}>Contact</Link>
          <Link to="/gemini" className="text-h2 no-underline text-[#4A5D43]" onClick={() => setMobileOpen(false)}>Vayu AI</Link>
        </div>
      )}
    </>
  )
}
