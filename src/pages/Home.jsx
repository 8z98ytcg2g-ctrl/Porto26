import { Link } from 'react-router-dom'

const NAV = [
  { label: 'SPEAK', color: '#1A3A8F', path: '/speak', img: '/nav/speak.png?v=2' },
  { label: 'EAT',   color: '#2A7A3B', path: '/eat',   img: '/nav/eat.png?v=2'   },
  { label: 'DRINK', color: '#F5C518', path: '/drink',  img: '/nav/drink.png?v=2' },
  { label: 'WATCH', color: '#D42B2B', path: '/watch',  img: '/nav/watch.png?v=2' },
  { label: 'DO',   color: '#E87722', path: '/do',   img: '/nav/do.png?v=2'   },
  { label: 'GAFF', color: '#00A896', path: '/gaff', img: '/nav/gaff.png?v=2' },
]

export default function Home() {
  return (
    <div className="home">
      <div className="home-logo-wrap">
        <img
          src="/main_logo.png"
          alt="Porto26"
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <div className="home-logo-placeholder" style={{ display: 'none' }}>
          PORTO26
        </div>
      </div>

      <nav className="nav-grid">
        {NAV.map(item => (
          <Link
            key={item.label}
            to={item.path}
            className="nav-item"
            style={{ '--c': item.color }}
          >
              <img src={item.img} alt={item.label} className="nav-word-img" />
          </Link>
        ))}
      </nav>

      <Link to="/legends" className="legends-nav-link">
        LEGENDS
      </Link>
    </div>
  )
}
