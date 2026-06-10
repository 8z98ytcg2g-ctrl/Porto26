import { useEffect, useRef, useState } from 'react'
import BackButton from '../components/BackButton'

const COLOR = '#F5C518'

const ROTATIONS = [-2.1, 1.8, -1.2, 2.4, -0.8, 1.5, -2.6, 0.9, -1.7, 2.2, -1.4, 2.0]

export default function Legends() {
  const [allLegends, setAllLegends] = useState([])
  const [discovered, setDiscovered] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    fetch('/content/legends.json')
      .then(r => r.json())
      .then(setAllLegends)
      .catch(err => console.error('Legends load error:', err))

    const saved = JSON.parse(localStorage.getItem('porto26_legends') || '[]')
    setDiscovered(saved)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const idx = Math.round(el.scrollLeft / el.clientWidth)
        setActiveIndex(Math.max(0, Math.min(idx, allLegends.length - 1)))
      }, 80)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      clearTimeout(debounceRef.current)
    }
  }, [allLegends.length])

  return (
    <div className="page legends-page" style={{ '--accent': COLOR }}>
      <header className="page-header">
        <h1 className="page-title">LEGENDS</h1>
        {allLegends.length > 0 && (
          <span className="legends-counter">{activeIndex + 1} / {allLegends.length}</span>
        )}
        <BackButton color={COLOR} />
      </header>

      <div className="legends-scroll" ref={scrollRef}>
        {allLegends.map((legend, i) => {
          const isFound = discovered.includes(legend.card_image)
          const isMega = legend.mega === true
          return (
            <div key={i} className="legends-slide">
              <div className={`legends-card${isMega && !isFound ? ' mega-locked' : ''}`}>
                <img src="/cards/blank.png" alt="" className="legends-blank" />
                {isMega && !isFound && (
                  <div className="mega-lock-label">MEGA LEGEND<br />LOCKED</div>
                )}
                {isFound && (
                  <img
                    src={`/cards/${legend.card_image}`}
                    alt="Legend"
                    className="legends-sticker"
                    style={{ transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)` }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
