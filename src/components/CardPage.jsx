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
  const [zoomedImg, setZoomedImg] = useState(null)
  const [megaUnlocked, setMegaUnlocked] = useState(false)
  const scrollRef = useRef(null)
  const activeIndexRef = useRef(0)
  const lastTapRef = useRef(0)
  const scrollDebounceRef = useRef(null)
  const fadeTimerRef = useRef(null)
  const regularLegendCountRef = useRef(10)

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
          const regularLegends = legends.filter(l => !l.mega)
          regularLegendCountRef.current = regularLegends.length
          const totalWeight = regularLegends.reduce((sum, l) => sum + (l.weight ?? 1), 0)
          let rand = Math.random() * totalWeight
          const picked = regularLegends.find(l => (rand -= (l.weight ?? 1)) < 0) || regularLegends[0]
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
    const regularCount = regularLegendCountRef.current
    const isComplete = updated.length >= regularCount

    if (isComplete) {
      // Unlock mega legends
      const withMega = [...new Set([...updated, 'manu.png', 'phil.png'])]
      localStorage.setItem('porto26_legends', JSON.stringify(withMega))
      setSavedLegends(withMega)
      setMegaUnlocked(true)
      // Gold ticker-tape confetti
      const goldColors = ['#FFD700', '#FFA500', '#FFE566', '#ffffff', '#FFEC8B']
      confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.4 }, colors: goldColors, startVelocity: 55, gravity: 0.7, ticks: 250 })
      confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.4 }, colors: goldColors, startVelocity: 55, gravity: 0.7, ticks: 250 })
      setTimeout(() => confetti({ particleCount: 120, spread: 90, origin: { y: 0.2 }, colors: goldColors, startVelocity: 60, gravity: 0.6, ticks: 300 }), 300)
    } else {
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
          {zoomedImg && (
            <div className="sticker-zoom-overlay" onClick={() => setZoomedImg(null)}>
              <img src={zoomedImg} alt="Zoomed sticker" className="sticker-zoom-img" />
              <button className="sticker-zoom-close">✕</button>
            </div>
          )}

          <div className="sticker-scroll" ref={scrollRef}>
            {items.map((item, i) => {
              const handleTap = () => {
                const now = Date.now()
                if (now - lastTapRef.current < 300 && item.card_image) {
                  setZoomedImg(`/cards/${item.card_image}`)
                }
                lastTapRef.current = now
              }
              return (
              <div key={i} className="sticker-slide" onClick={handleTap}>
                {item.card_image && (
                  <img
                    src={`/cards/${item.card_image}`}
                    alt={item.name}
                    className="sticker-img"
                  />
                )}
              </div>
            )})}
          </div>

          <div className="card-desc-panel" style={{ opacity: descVisible ? 1 : 0 }}>
            {activeItem && (
              <>
                <div className={`card-desc-name${activeItem._isLegend ? ' is-legend' : ''}`}>
                  {activeItem._isLegend ? 'YOU HAVE FOUND A LEGEND STICKER!!' : activeItem.name}
                  {activeItem.link && !activeItem._isLegend && (
                    <a
                      href={activeItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-menu-link"
                    >
                      {activeItem.linkLabel || 'MENU ↗'}
                    </a>
                  )}
                </div>
                {activeItem._isLegend && (
                  <div className="legend-album-wrap">
                    {megaUnlocked && (
                      <div className="mega-unlock-msg">
                        10/10 CONGRATULATIONS<br />NEW MEGA LEGENDS UNLOCKED
                      </div>
                    )}
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
