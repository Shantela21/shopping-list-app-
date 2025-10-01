import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../reduxHooks'
import { register } from '../features/RegisterSlice'
import CryptoJS from 'crypto-js'

export default function Register() {
  const dispatch = useAppDispatch()
  const isRegistered = useAppSelector((s) => s.register.isRegistered)
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [cell, setCell] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Basic check
    if (!name || !surname || !cell || !email || !password) return
    const SECRET = (import.meta as any).env?.VITE_AUTH_SECRET ?? 'dev-secret'
    const passwordCipher = CryptoJS.AES.encrypt(password, SECRET).toString()
    dispatch(register({ name, surname, cell, email, passwordCipher }))
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="container">
          <h1>Register</h1>
          <p>Please fill in this form to create an account.</p>
          <hr />

          <label htmlFor="name"><b>Name</b></label>
          <input
            type="text"
            placeholder="Enter Name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="surname"><b>Surname</b></label>
          <input
            type="text"
            placeholder="Enter Surname"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />

          <label htmlFor="cell"><b>Cell number</b></label>
          <input
            type="tel"
            placeholder="Enter Cell Number"
            id="cell"
            value={cell}
            onChange={(e) => setCell(e.target.value)}
            required
          />

          <label htmlFor="email"><b>Email</b></label>
          <input
            type="email"
            placeholder="Enter Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="psw"><b>Password</b></label>
          <input
            type="password"
            placeholder="Enter Password"
            id="psw"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <hr />
          <p>
            By creating an account you agree to our <a href="#">Terms & Privacy</a>.
          </p>

          <button type="submit" className="registerbtn">Register</button>

          {isRegistered && (
            <p role="status">Registration successful!</p>
          )}
          <p>
            Already have an account? <a href="/login">Sign in</a>.
          </p>
        </div>

        
          
       
      </form>
    </div>
  )
}
