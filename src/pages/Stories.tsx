import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router'

const STORIES = [
  {
    slug: 'last-glaciers',
    img: '/images/home-stories-1.jpg',
    category: 'Photo Essay',
    title: 'The Last Glaciers',
    excerpt: 'In Patagonia, ice that formed over millennia retreats by meters each year.',
    author: 'Marina Kowalski',
    date: 'Dec 2024',
  },
  {
    slug: 'urban-rewilding',
    img: '/images/home-stories-2.jpg',
    category: 'Field Report',
    title: 'Urban Rewilding',
    excerpt: 'Cities from Singapore to Berlin are reintroducing wild corridors.',
    author: 'James Okonkwo',
    date: 'Nov 2024',
  },
  {
    slug: 'soil-beneath',
    img: '/images/home-stories-3.jpg',
    category: 'Documentary',
    title: 'The Soil Beneath',
    excerpt: 'A single teaspoon of healthy soil contains more organisms than humans on Earth.',
    author: 'Dr. Aisha Patel',
    date: 'Oct 2024',
  },
  {
    slug: 'arctic-tundra',
    img: '/images/hero-grid-9.jpg',
    category: 'Photo Essay',
    title: 'Arctic Tundra',
    excerpt: 'A solitary reindeer against the vast, frozen horizon at twilight.',
    author: 'Erik Lindqvist',
    date: 'Sep 2024',
  },
  {
    slug: 'coral-reefs',
    img: '/images/hero-grid-6.jpg',
    category: 'Field Report',
    title: 'Underwater Cities',
    excerpt: 'Vibrant coral reef ecosystems thriving beneath the surface.',
    author: 'Sarah Chen',
    date: 'Aug 2024',
  },
  {
    slug: 'mangrove-guardians',
    img: '/images/hero-grid-4.jpg',
    category: 'Documentary',
    title: 'Coastal Guardians',
    excerpt: 'Mangrove roots creating intricate patterns at low tide.',
    author: 'Jean-Pierre R.',
    date: 'Jul 2024',
  },
]

const FILTERS = ['All', 'Photo Essay', 'Field Report', 'Documentary']

export default function Stories() {
  const [activeFilter, setActiveFilter] = useState('All')
  const gridRef = useRef<HTMLDivElement>(null)
  const heroBgRef = useRef<HTMLImageElement>(null)

  const filteredStories = activeFilter === 'All'
    ? STORIES
    : STORIES.filter(s => s.category === activeFilter)

  useEffect(() => {
    const init = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (heroBgRef.current) {
        gsap.to(heroBgRef.current, {
          y: '-20%',
          ease: 'none',
          scrollTrigger: {
            trigger: heroBgRef.current.parentElement,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.story-card')
        gsap.fromTo(cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }

    init()
  }, [activeFilter])

  return (
    <main>
      <section className="w-full relative flex flex-col items-center justify-center overflow-hidden pt-32 pb-16" style={{ minHeight: '55vh' }}>
        <img
          ref={heroBgRef}
          src="/images/home-stories-2.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          style={{ transformOrigin: 'center center' }}
        />
        <div className="absolute inset-0 bg-[#F2EDE8] opacity-70" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-display font-display text-[#0E0E0E] mb-4">Stories</h1>
          <p className="text-body-large text-[#0E0E0E] opacity-70 max-w-[600px] mx-auto mb-10">
            Photo essays, field reports, and documentary features from around the world.
          </p>

          <div className="flex items-center gap-3 justify-center flex-wrap">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`btn-pill transition-all ${activeFilter === filter ? 'btn-pill-primary' : 'btn-pill-outline'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full pb-24 bg-[#F2EDE8]">
        <div ref={gridRef} className="content-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <Link key={story.slug} to={`/stories/${story.slug}`} className="story-card group no-underline">
                <div className="overflow-hidden rounded-lg mb-4">
                  <img
                    src={story.img}
                    alt={story.title}
                    className="w-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
                    style={{ aspectRatio: '4/3' }}
                  />
                </div>
                <span className="text-caption text-[#C07A5F]">{story.category}</span>
                <h3 className="text-h3 font-display text-[#0E0E0E] mt-1 mb-2">{story.title}</h3>
                <p className="text-[16px] font-light leading-[1.65] text-[#0E0E0E] opacity-60 line-clamp-2 mb-3">{story.excerpt}</p>
                <div className="flex items-center gap-3">
                  <span className="text-caption text-[#0E0E0E] opacity-60">{story.author}</span>
                  <span className="text-caption text-[#0E0E0E] opacity-30">&middot;</span>
                  <span className="text-caption text-[#0E0E0E] opacity-60">{story.date}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="btn-pill btn-pill-outline">Load More Stories</button>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#0E0E0E]">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2">
            <img
              src="/images/stories-featured.jpg"
              alt="Photographer on salt flats"
              className="w-full h-full object-cover"
              style={{ aspectRatio: '16/10' }}
            />
          </div>
          <div className="lg:w-1/2 flex items-center justify-center p-12 lg:p-16">
            <div className="max-w-[400px]">
              <span className="text-caption text-[#C07A5F] block mb-4">SUBMISSIONS OPEN</span>
              <h3 className="text-h3 font-display text-white mb-4">Have a Story to Tell?</h3>
              <p className="text-body-large text-white opacity-70 mb-8">
                We commission new work year-round. Pitch us your photo essay or field report.
              </p>
              <Link to="/contact" className="btn-pill bg-[#C07A5F] text-white hover:bg-[#a86a4f] no-underline">
                Submit a Pitch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
