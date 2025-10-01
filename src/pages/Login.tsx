import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../reduxHooks'
import { loginSuccess } from '../features/RegisterSlice'
import { useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js'

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const registered = useAppSelector((s) => s.register.user)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    if (!registered) {
      setError('No registered user found. Please register first.')
      return
    }
    if (registered.email !== email) {
      setError('Invalid credentials')
      return
    }
    const SECRET = (import.meta as any).env?.VITE_AUTH_SECRET ?? 'dev-secret'
    const bytes = CryptoJS.AES.decrypt(registered.passwordCipher, SECRET)
    const plain = bytes.toString(CryptoJS.enc.Utf8)
    if (plain !== password) {
      setError('Invalid credentials')
      return
    }
    dispatch(loginSuccess())
    navigate('/')
  }

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="email"><b>Email</b></label>
        <input
          id="email"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password"><b>Password</b></label>
        <input
          id="password"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  )
}
