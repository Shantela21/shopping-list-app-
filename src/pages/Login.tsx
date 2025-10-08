import { useState, type FormEvent } from 'react'
import { useAppDispatch } from '../../reduxHooks'
import { loginSuccess } from '../features/RegisterSlice'
import { useNavigate, Link } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import { getUserByEmail } from '../api/users'
import { setUser } from '../features/RegisterSlice'


export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const user = await getUserByEmail(email)
    if (!user) {
      setError('No registered user found. Please register first.')
      return
    }
    const SECRET = (import.meta as any).env?.VITE_AUTH_SECRET ?? 'dev-secret'
    const bytes = CryptoJS.AES.decrypt(user.passwordCipher, SECRET)
    const plain = bytes.toString(CryptoJS.enc.Utf8)
    if (plain !== password) {
      setError('Invalid credentials')
      return
    }
    dispatch(setUser(user))
    dispatch(loginSuccess())
    navigate('/home')
  }

  return (<>
  
    <div className="container">
      
      <form className='login' onSubmit={onSubmit}>
        <h1>Login</h1>
        <label htmlFor="email"><b>Email</b></label>
        <input className='input-login'
          id="email"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password"><b>Password</b></label>
        <input className='input-login'
          id="password"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>

        <p style={{ marginTop: 12 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
       
    </div>
    </>
  )
}
