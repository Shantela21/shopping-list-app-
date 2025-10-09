import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../reduxHooks'
import { register } from '../features/RegisterSlice'
import CryptoJS from 'crypto-js'
import { createUser, getUserByEmail, type UserDTO } from '../api/users'

export default function Register() {
  const dispatch = useAppDispatch()
  const isRegistered = useAppSelector((s) => s.register.isRegistered)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [cell, setCell] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    if (!name || !surname || !cell || !email || !password) return
    try {
      // prevent duplicate emails
      const existing = await getUserByEmail(email)
      if (existing) {
        setError('Email is already registered. Please log in.')
        return
      }
      const SECRET = (import.meta as any).env?.VITE_AUTH_SECRET ?? 'dev-secret'
      const passwordCipher = CryptoJS.AES.encrypt(password, SECRET).toString()
      const payload: UserDTO = { name, surname, cell, email, passwordCipher }
      const saved = await createUser(payload)
      dispatch(register(saved))
      setPassword('')
    } catch (err: any) {
      const msg = err?.response?.data || err?.message || 'Unknown error'
      setError(`Failed to register. ${String(msg)}`)
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="container">
        <div className="container-register">
          <h1>Register</h1>
          <p>Please fill in this form to create an account.</p>
          <hr />

          <label  htmlFor="name"><b>Name</b></label>
          <input className='input-register'
            type="text"
            placeholder="Enter Name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="surname"><b>Surname</b></label>
          <input className='input-register'
            type="text"
            placeholder="Enter Surname"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />

          <label htmlFor="cell"><b>Cell number</b></label>
          <input className='input-register'
            type="tel"
            placeholder="Enter Cell Number"
            id="cell"
            value={cell}
            onChange={(e) => setCell(e.target.value)}
            required
          />

          <label htmlFor="email"><b>Email</b></label>
          <input className='input-register'
            type="email"
            placeholder="Enter Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="psw"><b>Password</b></label>
          <input className='input-register'
            type="password"
            placeholder="Enter Password"
            id="psw"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <hr />
          <p>
            By creating an account you agree to our <a href="/Terms">Terms & Privacy</a>.
          </p>

          <button type="submit" className="registerbtn">Register</button>

          {isRegistered && (
            <p role="status">Registration successful!</p>
          )}
          {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
          <p className='signin'>
            Already have an account? <a href="/login">Sign in</a>.
          </p>
        </div>

        
          
       
      </form>
    </div>
  )
}
