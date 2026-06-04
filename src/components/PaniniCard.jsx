import { useState } from 'react'

export default function PaniniCard({ item, accentColor, sectionLabel }) {
  const [imgFailed, setImgFailed] = useState(false)
  const isPerson = item._isPerson

  return (
    <div
      className={`panini-card${isPerson ? ' person-card' : ''}`}
      style={{ '--card-accent': accentColor }}
    >
      <div className="card-strip">
        {isPerson ? (item.subtitle || 'LOCAL GUIDE') : sectionLabel}
      </div>

      {item.card_image && !imgFailed && (
        <div className="card-img-wrap">
          <img
            src={`/cards/${item.card_image}`}
            alt={item.name}
            onError={() => setImgFailed(true)}
          />
        </div>
      )}

      <div className="card-body">
        <div className="card-name">{item.name}</div>
      </div>
    </div>
  )
}

