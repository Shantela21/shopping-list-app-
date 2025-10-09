import { NavLink, Link } from 'react-router-dom'
import logo from '../assets/images__1_-removebg-preview.png'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../reduxHooks'
import { logout } from '../features/RegisterSlice'

export default function Navbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAppSelector((s) => s.register)

  const onLogout = () => {
    const ok = confirm('Do you really want to logout?')
    if (!ok) return
    dispatch(logout())
    navigate('/login')
  }
  return (
    <div>
      <nav className="navbar" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '8px 12px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'white' }} aria-label="Go to landing page">
          <img src={logo} alt="Shopping List logo" style={{ width: 40, height: 40}} />
          <span style={{ fontWeight: 700 }}>CartLogic </span>
        </Link>
        <NavLink  to="/home" style={{ textDecoration: 'none', color: 'white'}}>Home</NavLink>
      
        {(user || isAuthenticated) && (
          <NavLink to="/profile" style={{ textDecoration: 'none', color: 'white' }}>Profile</NavLink>
        )}
        {(user || isAuthenticated) && (
          <Link
            to="/"
            onClick={(e) => { e.preventDefault(); onLogout() }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'white' }}
            aria-label="Logout"
            role="button"
          >
            Logout
          </Link>
        )}
        
      </nav>
    </div>
  )
}
