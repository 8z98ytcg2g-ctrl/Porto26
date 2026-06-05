import { useEffect, useState } from 'react'
import BackButton from '../components/BackButton'

const COLOR = '#F5C518'

export default function Legends() {
  const [allLegends, setAllLegends] = useState([])
  const [discovered, setDiscovered] = useState([])

  useEffect(() => {
    fetch('/content/legends.json')
      .then(r => r.json())
      .then(setAllLegends)
      .catch(err => console.error('Legends load error:', err))

    const saved = JSON.parse(localStorage.getItem('porto26_legends') || '[]')
    setDiscovered(saved)
  }, [])

  return (
    <div className="page legends-page" style={{ '--accent': COLOR }}>
      <header className="page-header">
        <h1 className="page-title">LEGENDS</h1>
        <BackButton color={COLOR} />
      </header>

      <div className="legends-scroll">
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
