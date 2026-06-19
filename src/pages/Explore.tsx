import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'

const REGIONS = [
  { id: 'amazon', label: 'Amazon Basin', lat: -3.5, lon: -60, color: '#4A5D43', img: '/images/home-stories-3.jpg', fact: 'Home to 10% of all species on Earth. The Amazon produces 20% of the world\'s oxygen.' },
  { id: 'arctic', label: 'Arctic Circle', lat: 71, lon: 25, color: '#A69F97', img: '/images/hero-grid-9.jpg', fact: 'The Arctic is warming nearly 4× faster than the global average, accelerating sea ice loss.' },
  { id: 'coral', label: 'Coral Triangle', lat: -2, lon: 128, color: '#C07A5F', img: '/images/hero-grid-6.jpg', fact: 'The Coral Triangle spans 5.7M km² and supports the livelihoods of 120 million people.' },
  { id: 'sahel', label: 'Sahel Region', lat: 14, lon: 18, color: '#A69F97', img: '/images/hero-grid-7.jpg', fact: 'The Great Green Wall initiative aims to restore 100M hectares of degraded land across Africa.' },
  { id: 'patagonia', label: 'Patagonia', lat: -51, lon: -73, color: '#4A5D43', img: '/images/home-stories-1.jpg', fact: 'Patagonian glaciers have lost 20% of their volume since the mid-20th century.' },
  { id: 'mangroves', label: 'Indo-Pacific Mangroves', lat: 4, lon: 103, color: '#C07A5F', img: '/images/hero-grid-4.jpg', fact: 'Mangrove forests store up to 4× more carbon per hectare than tropical rainforests.' },
]

const ECOSYSTEM_STATS = [
  { value: '80%', label: 'of terrestrial biodiversity lives in forests' },
  { value: '50%', label: 'of coral reefs have been lost since 1950' },
  { value: '1M+', label: 'species at risk of extinction' },
  { value: '30%', label: 'of land needs protection by 2030' },
]

export default function Explore() {
  const earthRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [activeRegion, setActiveRegion] = useState<typeof REGIONS[0] | null>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (earthRef.current && heroRef.current) {
        gsap.to(earthRef.current, {
          rotation: 360,
          duration: 40,
          ease: 'none',
          repeat: -1,
        })

        gsap.to(earthRef.current, {
          rotationX: 30,
          y: -80,
          scale: 1.15,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }

      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll('.stat-item')
        gsap.fromTo(items,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      if (timelineRef.current) {
        const lines = timelineRef.current.querySelectorAll('.timeline-line')
        gsap.fromTo(lines,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            stagger: 0.2,
            duration: 1,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        const cards = timelineRef.current.querySelectorAll('.timeline-card')
        gsap.fromTo(cards,
          { opacity: 0, x: (_i: number) => _i % 2 === 0 ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.15,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }

    init()
  }, [])

  return (
    <main>
      <section ref={heroRef} className="relative w-full overflow-hidden flex flex-col items-center justify-center" style={{ height: '100vh', background: '#0E0E0E' }}>
        <div className="explore-starfield" />

        <div
          ref={earthRef}
          className="explore-earth"
          style={{
            backgroundImage: 'url(/images/home-briefing-bg.jpg)',
          }}
        />

        <div className="relative z-10 text-center px-6">
          <span className="text-caption text-[#C07A5F] block mb-4">GLOBAL ECOSYSTEMS</span>
          <h1 className="text-display font-display text-white mb-6">
            Explore the Living Planet
          </h1>
          <p className="text-body-large text-white opacity-60 max-w-[520px] mx-auto mb-10">
            Navigate Earth's most critical biomes. Understand the forces shaping our world.
          </p>
          <a href="#regions" className="btn-pill bg-[#C07A5F] text-white hover:bg-[#a86a4f]">
            Discover Regions
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-caption text-white opacity-30">Scroll to explore</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-[rgba(255,255,255,0.3)]" />
        </div>
      </section>

      <section id="regions" className="w-full section-padding bg-[#F2EDE8]">
        <div className="content-max">
          <span className="text-caption text-[#C07A5F] block mb-4">KEY REGIONS</span>
          <h2 className="text-h2 font-display text-[#0E0E0E] mb-12">Critical Biomes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REGIONS.map((region) => (
              <div
                key={region.id}
                className="explore-region-card group cursor-pointer"
                onClick={() => setActiveRegion(region)}
              >
                <div className="overflow-hidden rounded-lg mb-4" style={{ aspectRatio: '16/10' }}>
                  <img
                    src={region.img}
                    alt={region.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-caption text-[#C07A5F] block mb-1">Biome</span>
                    <h3 className="text-h3 font-display text-[#0E0E0E]">{region.label}</h3>
                  </div>
                  <span className="text-2xl opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                </div>
                <p className="text-[15px] font-light text-[#0E0E0E] opacity-60 mt-2 line-clamp-2">{region.fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full section-padding bg-[#0E0E0E]">
        <div ref={statsRef} className="content-max">
          <span className="text-caption text-[#C07A5F] block mb-4">BY THE NUMBERS</span>
          <h2 className="text-h2 font-display text-white mb-16">The State of Earth</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(242,237,232,0.1)]">
            {ECOSYSTEM_STATS.map((stat, i) => (
              <div key={i} className="stat-item bg-[#0E0E0E] p-10">
                <span className="text-display-xl font-display text-white block mb-3" style={{ fontSize: 'clamp(48px,6vw,96px)' }}>
                  {stat.value}
                </span>
                <p className="text-[15px] font-light text-white opacity-50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full section-padding bg-[#4A5D43]">
        <div ref={timelineRef} className="content-max">
          <span className="text-caption text-white opacity-60 block mb-4">CONSERVATION MILESTONES</span>
          <h2 className="text-h2 font-display text-white mb-16">The Road So Far</h2>

          <div className="relative">
            <div className="timeline-line absolute left-[50%] top-0 bottom-0 w-[1px] bg-[rgba(255,255,255,0.2)] origin-top" />

            {[
              { year: '1972', event: 'Stockholm Conference', desc: 'First major UN conference on the human environment, establishing UNEP.' },
              { year: '1987', event: 'Brundtland Report', desc: '"Our Common Future" coins the term sustainable development.' },
              { year: '1997', event: 'Kyoto Protocol', desc: 'First legally binding international treaty on greenhouse gas emissions.' },
              { year: '2010', event: 'Nagoya Protocol', desc: 'Framework for protecting biodiversity and ensuring fair benefit sharing.' },
              { year: '2015', event: 'Paris Agreement', desc: 'Historic accord to limit global warming to 1.5°C above pre-industrial levels.' },
              { year: '2022', event: 'Kunming-Montreal GBF', desc: '30×30 goal: protect 30% of land and oceans by 2030.' },
            ].map((item, i) => (
              <div
                key={i}
                className={`timeline-card relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-[45%] ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <span className="text-h2 font-display text-white opacity-20 block">{item.year}</span>
                  <h3 className="text-h3 font-display text-white mt-1 mb-2">{item.event}</h3>
                  <p className="text-[15px] font-light text-white opacity-60">{item.desc}</p>
                </div>
                <div className="absolute left-[50%] -translate-x-1/2 w-3 h-3 rounded-full bg-[#C07A5F] border-2 border-[#4A5D43] mt-3" />
                <div className="w-[45%]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full section-padding bg-[#F2EDE8]">
        <div className="content-max text-center">
          <h2 className="text-h2 font-display text-[#0E0E0E] mb-6">Ready to Go Deeper?</h2>
          <p className="text-body-large text-[#0E0E0E] opacity-70 max-w-[480px] mx-auto mb-10">
            Ask our Gemini AI assistant anything about the ecosystems you've just explored.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/gemini" className="btn-pill bg-[#4A5D43] text-white hover:bg-[#3a4a35] no-underline">
              Ask Gemini AI
            </Link>
            <Link to="/stories" className="btn-pill btn-pill-outline no-underline">
              Read Stories
            </Link>
          </div>
        </div>
      </section>

      {activeRegion && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-[rgba(14,14,14,0.8)] backdrop-blur-[12px]"
          onClick={() => setActiveRegion(null)}
        >
          <div
            className="bg-[#F2EDE8] rounded-2xl overflow-hidden max-w-[640px] w-[90vw] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative" style={{ aspectRatio: '16/9' }}>
              <img src={activeRegion.img} alt={activeRegion.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(14,14,14,0.7)] to-transparent" />
              <h2 className="absolute bottom-6 left-6 text-h2 font-display text-white">{activeRegion.label}</h2>
            </div>
            <div className="p-8">
              <p className="text-[16px] font-light text-[#0E0E0E] leading-[1.7]">{activeRegion.fact}</p>
              <div className="flex items-center gap-4 mt-8">
                <Link
                  to="/gemini"
                  className="btn-pill bg-[#4A5D43] text-white hover:bg-[#3a4a35] no-underline"
                  onClick={() => setActiveRegion(null)}
                >
                  Ask Gemini about this
                </Link>
                <button
                  onClick={() => setActiveRegion(null)}
                  className="btn-pill btn-pill-outline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
