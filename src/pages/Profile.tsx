import { Link } from 'react-router-dom'
import { useAppSelector } from '../../reduxHooks'
import Footer from '../components/Footer'

export default function Profile() {
  const user = useAppSelector((s) => s.register.user)

  // If there is no logged-in/registered user, show a helpful message
  if (!user) {
    return (
      <div className="container">
        <h1>Profile</h1>
        <p>No user profile found.</p>
        <p>
          Please <a href="/login">log in</a> or <a href="/register">create an account</a> to view and
          update your profile.
        </p>
      </div>
    )
  }

  return (
    <div className="containers">
    <div className="container-profile">
      <h1 className='profile-title'>Profile</h1>
      <section className="profile-summary" style={{ marginBottom: 24 }}>
        <ul>
          <li><b>Name:</b> {user.name}</li>
          <li><b>Surname:</b> {user.surname}</li>
          <li><b>Cell:</b> {user.cell}</li>
          <li><b>Email:</b> {user.email}</li>
        </ul>
        <br></br>
        <br></br>
        <Link className="edit-profile-btn" to="/profile/edit">Edit Profile</Link>
      </section>
      
      
    </div>
    </div>
  )
}

