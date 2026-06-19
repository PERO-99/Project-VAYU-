import { useState, useEffect, useRef } from 'react'

const COMMUNITY_ITEMS = [
  { img: '/images/home-community-1.jpg', name: 'Erik Lindqvist', location: 'Tromsø, Norway' },
  { img: '/images/home-community-2.jpg', name: 'Sarah Chen', location: 'Maldives' },
  { img: '/images/home-community-3.jpg', name: 'Jean-Pierre R.', location: 'Madagascar' },
  { img: '/images/home-community-4.jpg', name: 'Mia Torres', location: 'California, USA' },
  { img: '/images/home-community-5.jpg', name: 'Isabella Rossi', location: 'Tuscany, Italy' },
  { img: '/images/home-community-6.jpg', name: 'Aisha Johnson', location: 'Kenya' },
  { img: '/images/hero-grid-1.jpg', name: "Liam O'Brien", location: 'Amazon, Brazil' },
  { img: '/images/hero-grid-3.jpg', name: 'Yuki Tanaka', location: 'Iceland' },
  { img: '/images/hero-grid-8.jpg', name: 'Ana Martinez', location: 'Olympic Peninsula, USA' },
  { img: '/images/hero-grid-9.jpg', name: 'Klaus Weber', location: 'Svalbard, Norway' },
  { img: '/images/hero-grid-10.jpg', name: 'Priya Sharma', location: 'Mumbai, India' },
  { img: '/images/hero-grid-12.jpg', name: 'Tom Bradley', location: 'Azores, Portugal' },
]

export default function Community() {
  const [detailItem, setDetailItem] = useState<typeof COMMUNITY_ITEMS[0] | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll('.community-item')
        gsap.fromTo(items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
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
      <section className="w-full flex flex-col items-center justify-center bg-[#0E0E0E] pt-32" style={{ minHeight: '70vh' }}>
        <div className="text-center px-6">
          <h1 className="text-display font-display text-white mb-4">Community</h1>
          <p className="text-body-large text-white opacity-70 max-w-[600px] mx-auto mb-10">
            Work from photographers, researchers, and storytellers in the field.
          </p>
          <button className="btn-pill bg-[#C07A5F] text-white hover:bg-[#a86a4f]">
            Share Your Work
          </button>
        </div>
      </section>

      <section className="w-full py-24 bg-[#F2EDE8]">
        <div className="content-max">
          <div ref={gridRef} className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {COMMUNITY_ITEMS.map((item, i) => (
              <div
                key={i}
                className="community-item break-inside-avoid mb-4 relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setDetailItem(item)}
              >
                <img src={item.img} alt={item.name} className="w-full object-cover" />
                <div className="absolute inset-0 bg-[rgba(14,14,14,0.5)] opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <span className="text-caption text-white">{item.name}</span>
                    <p className="text-white text-sm opacity-60">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-24 bg-[#F2EDE8]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-h2 font-display text-[#0E0E0E] mb-8">Submission Guidelines</h2>
          <ul className="text-left space-y-4">
            {[
              'Original work only. All submissions must be your own.',
              'Environmental or nature-related subject matter.',
              'Minimum 2000px on the longest side.',
              'Include location, date, and a brief description.',
              'We review submissions monthly.',
            ].map((guideline, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="text-caption text-[#C07A5F] mt-1">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[16px] font-light leading-[1.65] text-[#0E0E0E]">{guideline}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {detailItem && (
        <div className="detail-view active" onClick={() => setDetailItem(null)}>
          <div className="detail-card" onClick={(e) => e.stopPropagation()}>
            <div className="detail-image" style={{ backgroundImage: `url(${detailItem.img})` }} />
            <div className="detail-content">
              <span className="detail-caption">{detailItem.location}</span>
              <h2 className="detail-title">{detailItem.name}</h2>
              <button onClick={() => setDetailItem(null)} className="btn-pill btn-pill-outline mt-8 self-start">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
