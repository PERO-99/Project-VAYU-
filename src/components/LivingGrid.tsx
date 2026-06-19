import { useEffect, useRef } from 'react'

interface GridItem {
  id: string
  caption: string
  title: string
}

interface Props {
  items: GridItem[]
  onHover: (item: GridItem | null) => void
}

const COLS = 6
const VISIBLE_ROWS = 5
const PX_PER_SEC = 55 // scroll speed in pixels per second

export default function LivingGrid({ items, onHover }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)  // the outer fixed-size container
  const innerRef  = useRef<HTMLDivElement>(null)   // the scrolling grid (2× taller)
  const rafRef    = useRef<number>(0)
  const yRef      = useRef(0)
  const lastTRef  = useRef<number | null>(null)
  const pausedRef = useRef(false)

  // Build 2 × VISIBLE_ROWS worth of tiles (extra set at bottom for seamless loop)
  const totalRows = VISIBLE_ROWS * 2
  const tiles: GridItem[] = []
  for (let i = 0; i < COLS * totalRows; i++) {
    tiles.push(items[i % items.length])
  }

  useEffect(() => {
    const wrapper = wrapperRef.current
    const inner   = innerRef.current
    if (!wrapper || !inner) return

    const tick = (ts: number) => {
      if (lastTRef.current === null) lastTRef.current = ts
      const dt = (ts - lastTRef.current) / 1000
      lastTRef.current = ts

      if (!pausedRef.current) {
        // One "page" = height of VISIBLE_ROWS tiles = wrapper height
        const oneLoop = wrapper.clientHeight
        yRef.current -= PX_PER_SEC * dt

        // When scrolled one full page, jump back — seamless because next set is identical
        if (yRef.current <= -oneLoop) {
          yRef.current += oneLoop
        }

        inner.style.transform = `translateY(${yRef.current}px)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 overflow-hidden"
      style={{ contain: 'strict' }}
    >
      {/* Inner scrolling div — 200% tall = 2 sets of rows */}
      <div
        ref={innerRef}
        className="will-change-transform"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${totalRows}, ${100 / VISIBLE_ROWS}%)`,
          width: '100%',
          height: `${(totalRows / VISIBLE_ROWS) * 100}%`, // 200%
        }}
      >
        {tiles.map((item, i) => (
          <div
            key={`t-${i}`}
            style={{
              backgroundImage: `url(/images/${item.id}.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              cursor: 'crosshair',
            }}
            onMouseEnter={() => { pausedRef.current = true;  onHover(item) }}
            onMouseLeave={() => { pausedRef.current = false; onHover(null) }}
          >
            <span style={{
              position: 'absolute',
              bottom: 6,
              left: 8,
              fontSize: 9,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.65)',
              pointerEvents: 'none',
              textShadow: '0 1px 3px rgba(0,0,0,0.7)',
            }}>
              {item.caption}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
