import { Link } from 'react-router-dom'

export default function BackButton({ color }) {
  return (
    <Link to="/" className="back-btn" style={{ '--accent': color }} aria-label="Home">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    </Link>
  )
}
