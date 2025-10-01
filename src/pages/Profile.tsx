import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../reduxHooks'
import { updateProfile, updateCredentials } from '../features/RegisterSlice'
import CryptoJS from 'crypto-js'

export default function Profile() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.register.user)

  const [name, setName] = useState(user?.name ?? '')
  const [surname, setSurname] = useState(user?.surname ?? '')
  const [cell, setCell] = useState(user?.cell ?? '')
  const [email, setEmail] = useState(user?.email ?? '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [credError, setCredError] = useState<string | null>(null)
  const [profSaved, setProfSaved] = useState(false)
  const [credSaved, setCredSaved] = useState(false)

  const saveProfile = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setProfSaved(false)
    if (!name || !surname || !cell || !email) return
    dispatch(updateProfile({ name, surname, cell, email }))
    setProfSaved(true)
  }

  const saveCredentials = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCredError(null)
    setCredSaved(false)
    if (!user) return
    const SECRET = (import.meta as any).env?.VITE_AUTH_SECRET ?? 'dev-secret'
    // verify current password
    const bytes = CryptoJS.AES.decrypt(user.passwordCipher, SECRET)
    const plain = bytes.toString(CryptoJS.enc.Utf8)
    if (plain !== currentPassword) {
      setCredError('Current password is incorrect')
      return
    }
    if (newPassword.length < 6) {
      setCredError('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setCredError('New passwords do not match')
      return
    }
    const passwordCipher = CryptoJS.AES.encrypt(newPassword, SECRET).toString()
    dispatch(updateCredentials({ passwordCipher }))
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setCredSaved(true)
  }

  return (
    <div className="container">
      <h1>Profile</h1>

      <form onSubmit={saveProfile} style={{ marginBottom: 24 }}>
        <h2>Profile Details</h2>
        <label htmlFor="name"><b>Name</b></label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="surname"><b>Surname</b></label>
        <input id="surname" type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required />

        <label htmlFor="cell"><b>Cell number</b></label>
        <input id="cell" type="tel" value={cell} onChange={(e) => setCell(e.target.value)} required />

        <label htmlFor="email"><b>Email</b></label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <button type="submit">Save profile</button>
        {profSaved && <p role="status">Profile updated</p>}
      </form>

      <form onSubmit={saveCredentials}>
        <h2>Update Password</h2>
        <label htmlFor="current"><b>Current password</b></label>
        <input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />

        <label htmlFor="new"><b>New password</b></label>
        <input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />

        <label htmlFor="confirm"><b>Confirm new password</b></label>
        <input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

        {credError && <p role="alert" style={{ color: 'red' }}>{credError}</p>}
        <button type="submit">Update password</button>
        {credSaved && <p role="status">Password updated</p>}
      </form>
    </div>
  )
}
