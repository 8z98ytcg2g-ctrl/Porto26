import { useEffect, useState, useRef } from 'react'
import confetti from 'canvas-confetti'
import { useNavigate } from 'react-router-dom'
import BackButton from './BackButton'
import MapView from './MapView'
import { shuffle } from '../utils/shuffle'

export default function CardPage({ title, color, dataUrl, ticker }) {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [descVisible, setDescVisible] = useState(true)
  const scrollRef = useRef(null)
  const activeIndexRef = useRef(0)
  const scrollDebounceRef = useRef(null)
  const fadeTimerRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const dataPromise = fetch(dataUrl).then(r => r.json())
    const legendPromise = Math.random() < 0.4
      ? fetch('/content/legends.json').then(r => r.json())
      : Promise.resolve(null)

    Promise.all([dataPromise, legendPromise])
      .then(([data, legends]) => {
        if (cancelled) return
        const shuffled = shuffle(data)
        if (legends && legends.length > 0) {
          const totalWeight = legends.reduce((sum, l) => sum + (l.weight ?? 1), 0)
          let rand = Math.random() * totalWeight
          const picked = legends.find(l => (rand -= (l.weight ?? 1)) < 0) || legends[0]
          const legend = { ...picked, _isLegend: true }
          const insertIdx = Math.floor(Math.random() * (shuffled.length + 1))
          shuffled.splice(insertIdx, 0, legend)
        }
        setItems(shuffled)
        setLoading(false)
      })
      .catch(err => {
        console.error('CardPage load error:', err)
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [dataUrl])

  useEffect(() => {
    const el = scrollRef.current
    if (!el || loading) return

    const updateActive = () => {
      // step = 75vw slide + 4px gap
      const stepPx = el.clientWidth * 0.75 + 4
      const newIdx = Math.max(0, Math.min(
        Math.round(el.scrollLeft / stepPx),
        items.length - 1
      ))
      if (newIdx !== activeIndexRef.current) {
        clearTimeout(fadeTimerRef.current)
        setDescVisible(false)
        fadeTimerRef.current = setTimeout(() => {
          activeIndexRef.current = newIdx
          setActiveIndex(newIdx)
          setDescVisible(true)
        }, 150)
      }
    }

    const onScroll = () => {
      clearTimeout(scrollDebounceRef.current)
      scrollDebounceRef.current = setTimeout(updateActive, 80)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      clearTimeout(scrollDebounceRef.current)
      clearTimeout(fadeTimerRef.current)
    }
  }, [loading, items.length])

  const activeItem = items[activeIndex]
  const [savedLegends, setSavedLegends] = useState(() =>
    JSON.parse(localStorage.getItem('porto26_legends') || '[]')
  )

  function addToAlbum() {
    if (!activeItem?.card_image) return
    if (savedLegends.includes(activeItem.card_image)) return
    const updated = [...savedLegends, activeItem.card_image]
    localStorage.setItem('porto26_legends', JSON.stringify(updated))
    setSavedLegends(updated)

    confetti({
      particleCount: 160,
      spread: 80,
      origin: { y: 0.3 },
      colors: ['#F5C518', '#ffffff', '#1A3A8F', '#D42B2B', '#2A7A3B'],
      startVelocity: 45,
      gravity: 0.8,
      ticks: 200,
    })
  }

  const alreadySaved = activeItem?._isLegend && savedLegends.includes(activeItem.card_image)
  const pins = (activeItem && activeItem.lat != null)
    ? [{ lat: activeItem.lat, lng: activeItem.lng, name: activeItem.name }]
    : []

  return (
    <div className="page" style={{ '--accent': color, background: '#fff' }}>
      <header className="page-header">
        <h1 className="page-title">{title}</h1>
        <BackButton color={color} />
      </header>

      {ticker && (
        <div className="ticker-wrap">
          <div className="ticker-track">
            <span>{ticker}</span>
            <span aria-hidden="true">{ticker}</span>
          </div>
        </div>
      )}

      <MapView pins={pins} accentColor={color} />

      {loading ? (
        <div className="loading-state">LOADING…</div>
      ) : (
        <>
          <div className="sticker-scroll" ref={scrollRef}>
            {items.map((item, i) => (
              <div key={i} className="sticker-slide">
                {item.card_image && (
                  <img
                    src={`/cards/${item.card_image}`}
                    alt={item.name}
                    className="sticker-img"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="card-desc-panel" style={{ opacity: descVisible ? 1 : 0 }}>
            {activeItem && (
              <>
                <div className={`card-desc-name${activeItem._isLegend ? ' is-legend' : ''}`}>
                  {activeItem._isLegend ? 'YOU HAVE FOUND A LEGEND CARD!!' : activeItem.name}
                </div>
                {activeItem._isLegend && (
                  <div className="legend-album-wrap">
                    <button
                      className={`legend-album-btn${alreadySaved ? ' saved' : ''}`}
                      onClick={alreadySaved ? () => navigate('/legends') : addToAlbum}
                    >
                      {alreadySaved ? 'GO TO LEGEND ALBUM →' : 'ADD TO LEGEND ALBUM'}
                    </button>
                  </div>
                )}
                {activeItem.description && (
                  <div className="card-desc-text">{activeItem.description}</div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
