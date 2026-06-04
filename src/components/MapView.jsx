import { useEffect, useState, useCallback } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const PORTO_CENTER = { lat: 41.1579, lng: -8.6291 }

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f0e6cc' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#5a4a2a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5edd6' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a8cfe8' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3a6a8a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e8d8b0' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#c8a87a' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#d4b878' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#d8e8c0' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#5a7a3a' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#d0c890' }] },
]

const CONTAINER_STYLE = { width: '100%', height: '100%' }

export default function MapView({ pins = [], accentColor, fixedCenter }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const [userPos, setUserPos] = useState(null)
  const [map, setMap] = useState(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
  })

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}
    )
  }, [])

  const onLoad = useCallback(m => setMap(m), [])
  const onUnmount = useCallback(() => setMap(null), [])

  if (!apiKey || apiKey === 'your_api_key_here') {
    return (
      <div className="map-wrap">
        <div className="map-fallback">
          <strong>MAP</strong>
          <span>Add VITE_GOOGLE_MAPS_API_KEY to .env to enable Google Maps</span>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="map-wrap">
        <div className="map-fallback">
          <strong>MAP UNAVAILABLE</strong>
          <span>{loadError.message}</span>
        </div>
      </div>
    )
  }

  const center = fixedCenter || userPos || (pins.length > 0 ? pins[0] : PORTO_CENTER)

  function openNavigation() {
    if (!pins.length) return
    const { lat, lng, name } = pins[0]
    const url = `https://maps.google.com/maps?daddr=${lat},${lng}&travelmode=walking`
    window.open(url, '_blank')
  }

  return (
    <div className="map-wrap" style={{ borderColor: accentColor }}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={CONTAINER_STYLE}
          center={center}
          zoom={14}
          options={{
            styles: MAP_STYLES,
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: 'cooperative',
          }}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {pins.map((pin, i) => (
            <Marker
              key={i}
              position={{ lat: pin.lat, lng: pin.lng }}
              title={pin.name}
              icon={{
                path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                fillColor: accentColor,
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 1.5,
                scale: 1.4,
                anchor: { x: 12, y: 22 },
              }}
            />
          ))}
          {userPos && (
            <Marker
              position={userPos}
              title="You are here"
              icon={{
                path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                fillColor: '#1A3A8F',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
                scale: 1.6,
                anchor: { x: 12, y: 22 },
              }}
            />
          )}
        </GoogleMap>
      ) : (
        <div className="map-fallback">
          <strong>LOADING MAP…</strong>
        </div>
      )}
      {pins.length > 0 && (
        <button className="map-nav-btn" onClick={openNavigation} aria-label="Navigate">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
          </svg>
        </button>
      )}
    </div>
  )
}
