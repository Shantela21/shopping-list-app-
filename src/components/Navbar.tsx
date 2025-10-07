import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div>
      <nav className="navbar" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '8px 12px' }}>
        {/* <Link to="*" style={{ fontWeight: 700 }}>Shopping List</Link> */}
        <NavLink to="/home" style={{ textDecoration: 'none' }}>Home</NavLink>
        <NavLink to="/profile" style={{ textDecoration: 'none' }}>Profile</NavLink>
      </nav>
    </div>
  )
}
