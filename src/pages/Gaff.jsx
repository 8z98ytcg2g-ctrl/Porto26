import { useEffect, useState } from 'react'
import BackButton from '../components/BackButton'
import MapView from '../components/MapView'

const COLOR = '#00A896'

export default function Gaff() {
  const [apt, setApt] = useState(null)

  useEffect(() => {
    fetch('/content/apartment.json')
      .then(r => r.json())
      .then(setApt)
      .catch(err => console.error('Gaff load error:', err))
  }, [])

  const center = apt ? { lat: apt.lat, lng: apt.lng } : null

  return (
    <div className="page gaff-page" style={{ '--accent': COLOR }}>
      <header className="page-header">
        <h1 className="page-title">GAFF</h1>
        <BackButton color={COLOR} />
      </header>

      <div className="gaff-map-wrap">
        <div className="gaff-info-bar">
          <span className="gaff-address">Rua da Restauracao, 477, Oporto, Grande Porto 4050-023</span>
          <a
            className="gaff-link"
            href="https://www.airbnb.com/l/ffdG25gA"
            target="_blank"
            rel="noopener noreferrer"
          >
            airbnb.com/l/ffdG25gA ↗
          </a>
        </div>

        <div className="gaff-map">
          <MapView
            pins={apt ? [{ lat: apt.lat, lng: apt.lng, name: apt.name }] : []}
            accentColor={COLOR}
            fixedCenter={center}
          />
        </div>
      </div>
    </div>
  )
}
