import { NavLink, Link } from 'react-router-dom'
import logo from '../assets/download (2).png'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../reduxHooks'
import { logout } from '../features/RegisterSlice'

export default function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onLogout = () => {
    const ok = confirm('Do you really want to logout?')
    if (!ok) return
    dispatch(logout())
    navigate('/login')
  }
  return (
    <div>
      <nav className="navbar" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '8px 12px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'black' }} aria-label="Go to landing page">
          <img src={logo} alt="Shopping List logo" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
          <span style={{ fontWeight: 700 }}>Shopping List</span>
        </Link>
        <NavLink  to="/home" style={{ textDecoration: 'none', color: 'black'}}>Home</NavLink>
        <NavLink to="/profile" style={{ textDecoration: 'none', color: 'black' }}>Profile</NavLink>
        <Link
          to="/"
          onClick={(e) => { e.preventDefault(); onLogout() }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'black' }}
          aria-label="Logout"
          role="button"
        >
          Logout
        </Link>
        
      </nav>
    </div>
  )
}
