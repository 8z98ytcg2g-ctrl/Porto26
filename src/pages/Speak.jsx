import { useEffect, useRef, useState } from 'react'
import BackButton from '../components/BackButton'
import { fetchCSV } from '../utils/csv'

const COLOR = '#1A3A8F'

export default function Speak() {
  const [phrases, setPhrases] = useState([])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(null)
  const audioRef = useRef(null)

  useEffect(() => {
    fetchCSV('/content/speak/phrases.csv')
      .then(rows => setPhrases(rows.filter(r => r.filename)))
      .catch(err => console.error('Speak load error:', err))
      .finally(() => setLoading(false))
  }, [])

  function handlePlay(filename) {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.onended = null
      audioRef.current = null
    }
    if (playing === filename) {
      setPlaying(null)
      return
    }
    const audio = new Audio(`/content/speak/audio/${filename}`)
    audio.onended = () => setPlaying(null)
    audio.onerror = () => setPlaying(null)
    audio.play().catch(() => setPlaying(null))
    audioRef.current = audio
    setPlaying(filename)
  }

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return (
    <div className="page" style={{ '--accent': COLOR }}>
      <header className="page-header">
        <h1 className="page-title">SPEAK</h1>
        <BackButton color={COLOR} />
      </header>

      <div className="speak-content">
        {loading ? (
          <div className="loading-state">LOADING…</div>
        ) : (
          phrases.map((phrase, i) => (
            <div key={i} className="phrase-row">
              <div className="phrase-texts">
                <div className="phrase-en">{phrase.english}</div>
                <div className="phrase-pt">{phrase.portuguese}</div>
                <div className="phrase-pronunciation">{phrase.pronunciation}</div>
              </div>
              <button
                className={`play-btn${playing === phrase.filename ? ' playing' : ''}`}
                onClick={() => handlePlay(phrase.filename)}
                aria-label={playing === phrase.filename ? 'Stop' : 'Play'}
              >
                {playing === phrase.filename ? '■' : '▶'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
