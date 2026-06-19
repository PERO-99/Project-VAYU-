import { Link } from 'react-router'

export default function Footer() {
  return (
    <footer className="w-full border-t border-[rgba(14,14,14,0.12)] bg-[#F2EDE8] py-12 px-[clamp(20px,4vw,64px)]">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/vayu-logo-full.svg" alt="VAYU" className="h-14 w-auto object-contain" />
          <span className="text-caption opacity-40">&copy; 2026</span>
        </div>

        <div className="flex items-center gap-8 flex-wrap justify-center">
          <Link to="/stories" className="text-caption no-underline text-[#0E0E0E] hover:opacity-60 transition-opacity">Stories</Link>
          <Link to="/explore" className="text-caption no-underline text-[#0E0E0E] hover:opacity-60 transition-opacity">Explore</Link>
          <Link to="/community" className="text-caption no-underline text-[#0E0E0E] hover:opacity-60 transition-opacity">Community</Link>
          <Link to="/about" className="text-caption no-underline text-[#0E0E0E] hover:opacity-60 transition-opacity">About</Link>
          <Link to="/contact" className="text-caption no-underline text-[#0E0E0E] hover:opacity-60 transition-opacity">Contact</Link>
          <Link to="/gemini" className="text-caption no-underline text-[#4A5D43] hover:opacity-60 transition-opacity flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C07A5F]" />
            Vayu AI
          </Link>
        </div>

        <div className="text-center md:text-right">
          <p className="text-caption text-[#0E0E0E] opacity-40">Balance Your Breath.</p>
          <p className="text-caption text-[#0E0E0E] opacity-40">Balance the Atmosphere.</p>
        </div>
      </div>
    </footer>
  )
}
