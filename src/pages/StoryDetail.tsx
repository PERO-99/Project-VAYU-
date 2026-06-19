import { useParams, Link } from 'react-router'

const STORIES = [
  {
    slug: 'last-glaciers',
    img: '/images/home-stories-1.jpg',
    category: 'Photo Essay',
    title: 'The Last Glaciers',
    author: 'Marina Kowalski',
    date: 'December 2024',
    readTime: '12 min read',
    content: `
      <p>The first time I saw a glacier calve, I mistook it for thunder. Standing on the shores of Lago Argentino in Patagonia, I watched a wall of ice the height of a ten-story building crack along a stress line and plunge into the milky turquoise water below. The sound arrived seconds later — a low, reverberating boom that seemed to come from everywhere and nowhere at once.</p>

      <blockquote>"These are not static monuments. They are rivers of ice in slow motion, and that motion is accelerating."</blockquote>

      <p>Glaciologists have been documenting the retreat of Patagonian ice fields for decades. The data tells a stark story: since the mid-20th century, the region's glaciers have lost an estimated 20% of their volume. What satellite imagery and measurement data cannot convey, however, is the sensory experience of standing at the terminus of a glacier that has been advancing and retreating for thousands of years.</p>

      <p>The Perito Moreno glacier is an anomaly — one of the few glaciers in the world that is still advancing. But even here, the signs of change are visible. Meltwater rivers carve channels through the ice. Crevasses widen. The glacier's face, once a sheer vertical wall, now shows the complex stratigraphy of a body under stress.</p>

      <p>I spent three weeks in Patagonia, working with a team of glaciologists from the University of Buenos Aires. Each morning, we hiked to observation points, set up time-lapse cameras, and documented the daily rhythm of ice movement. The work was slow, methodical, and deeply humbling.</p>
    `,
  },
  {
    slug: 'urban-rewilding',
    img: '/images/home-stories-2.jpg',
    category: 'Field Report',
    title: 'Urban Rewilding',
    author: 'James Okonkwo',
    date: 'November 2024',
    readTime: '8 min read',
    content: `<p>Cities are often framed as the antithesis of nature. Concrete jungles, we call them — as if steel and glass were inherently opposed to life. But a growing movement of urban planners, ecologists, and architects is challenging that binary.</p><blockquote>"The question is not whether cities can be wild, but how wild we are willing to let them become."</blockquote><p>In Singapore, the government's "City in a Garden" vision has transformed the urban landscape. The Supertree Grove at Gardens by the Bay is the most visible symbol of this transformation — 50-meter tall vertical gardens that collect rainwater, generate solar power, and provide habitat for epiphytic plants.</p>`,
  },
  {
    slug: 'soil-beneath',
    img: '/images/home-stories-3.jpg',
    category: 'Documentary',
    title: 'The Soil Beneath',
    author: 'Dr. Aisha Patel',
    date: 'October 2024',
    readTime: '15 min read',
    content: `<p>There is a universe beneath our feet that most of us will never see. A single teaspoon of healthy soil contains more living organisms than there are humans on Earth — bacteria, fungi, nematodes, mites, springtails, earthworms, and countless forms of life we have yet to discover.</p><blockquote>"Soil is not dirt. It is a living, breathing ecosystem that sustains all terrestrial life."</blockquote><p>For the past year, I have been working with soil scientists across three continents to document the invisible foundation of our food systems. What we have found is both wondrous and alarming.</p>`,
  },
]

const RELATED_STORIES = [
  { slug: 'arctic-tundra', img: '/images/hero-grid-9.jpg', category: 'Photo Essay', title: 'Arctic Tundra' },
  { slug: 'coral-reefs', img: '/images/hero-grid-6.jpg', category: 'Field Report', title: 'Underwater Cities' },
  { slug: 'mangrove-guardians', img: '/images/hero-grid-4.jpg', category: 'Documentary', title: 'Coastal Guardians' },
]

export default function StoryDetail() {
  const { slug } = useParams<{ slug: string }>()
  const story = STORIES.find(s => s.slug === slug) || STORIES[0]

  return (
    <main>
      <section className="w-full relative flex items-end" style={{ height: '80vh' }}>
        <img
          src={story.img}
          alt={story.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(transparent 30%, rgba(14,14,14,0.85))' }}
        />
        <div className="relative z-10 w-full px-[clamp(20px,4vw,64px)] pb-16 max-w-[1400px] mx-auto">
          <span className="text-caption text-[#C07A5F] block mb-4">{story.category}</span>
          <h1 className="text-display font-display text-white mb-4">{story.title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-caption text-white opacity-70">{story.author}</span>
            <span className="text-caption text-white opacity-30">&middot;</span>
            <span className="text-caption text-white opacity-70">{story.date}</span>
            <span className="text-caption text-white opacity-30">&middot;</span>
            <span className="text-caption text-white opacity-70">{story.readTime}</span>
          </div>
        </div>
      </section>

      <section className="w-full py-24 bg-[#F2EDE8]">
        <div className="max-w-[720px] mx-auto px-6">
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: story.content }}
            style={{ fontSize: '16px', fontWeight: 300, lineHeight: 1.75, color: '#0E0E0E' }}
          />

          <style>{`
            .prose-custom p {
              margin-bottom: 1.5em;
              font-size: 16px;
              font-weight: 300;
              line-height: 1.75;
            }
            .prose-custom blockquote {
              border-left: 2px solid #C07A5F;
              padding-left: 24px;
              margin: 2em 0;
              font-family: 'Cormorant Garamond', Georgia, serif;
              font-style: italic;
              font-size: clamp(24px, 2.5vw, 36px);
              font-weight: 400;
              line-height: 1.3;
              color: #0E0E0E;
            }
          `}</style>
        </div>
      </section>

      <section className="w-full py-24 bg-[#F2EDE8]">
        <div className="content-max">
          <h3 className="text-h3 font-display text-[#0E0E0E] mb-8">Related Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RELATED_STORIES.map((s) => (
              <Link key={s.slug} to={`/stories/${s.slug}`} className="group no-underline">
                <div className="overflow-hidden rounded-lg mb-4">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.03]"
                    style={{ aspectRatio: '4/3' }}
                  />
                </div>
                <span className="text-caption text-[#C07A5F]">{s.category}</span>
                <h4 className="text-h3 font-display text-[#0E0E0E] mt-1">{s.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
