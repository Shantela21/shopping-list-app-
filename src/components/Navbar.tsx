import { NavLink, Link } from 'react-router-dom'
import logo from '../assets/download (2).png'

export default function Navbar() {
  return (
    <div>
      <nav className="navbar" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '8px 12px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'black' }} aria-label="Go to landing page">
          <img src={logo} alt="Shopping List logo" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
          <span style={{ fontWeight: 700 }}>Shopping List</span>
        </Link>
        <NavLink  to="/home" style={{ textDecoration: 'none', color: 'black'}}>Home</NavLink>
        <NavLink to="/profile" style={{ textDecoration: 'none', color: 'black' }}>Profile</NavLink>
      </nav>
    </div>
  )
}
