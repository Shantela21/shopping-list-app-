 import { useAppDispatch, useAppSelector } from '../../reduxHooks'
import { logout } from '../features/RegisterSlice'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.register.user)

  const onLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="container">
      <h1>Welcome{user ? `, ${user.name}` : ''}!</h1>
      <p>You are now logged in.</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}
