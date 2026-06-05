import { useEffect, useRef, useState } from 'react'
import BackButton from '../components/BackButton'

const COLOR = '#F5C518'

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
        <BackButton color={COLOR} />
      </header>

      {allLegends.length > 0 && (
        <div className="legends-counter">
          {activeIndex + 1} / {allLegends.length}
        </div>
      )}

      <div className="legends-scroll" ref={scrollRef}>
        {allLegends.map((legend, i) => {
          const isFound = discovered.includes(legend.card_image)
          return (
            <div key={i} className="legends-slide">
              <img
                src={isFound ? `/cards/${legend.card_image}` : '/cards/blank.png'}
                alt={isFound ? 'Legend' : 'Undiscovered'}
                className="legends-img"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
