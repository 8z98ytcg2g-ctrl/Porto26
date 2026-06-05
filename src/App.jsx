import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Speak from './pages/Speak'
import Eat from './pages/Eat'
import Drink from './pages/Drink'
import Watch from './pages/Watch'
import Do from './pages/Do'
import Gaff from './pages/Gaff'
import Legends from './pages/Legends'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/speak" element={<Speak />} />
        <Route path="/eat" element={<Eat />} />
        <Route path="/drink" element={<Drink />} />
        <Route path="/watch" element={<Watch />} />
        <Route path="/do" element={<Do />} />
        <Route path="/gaff" element={<Gaff />} />
        <Route path="/legends" element={<Legends />} />
      </Routes>
    </Router>
  )
}
