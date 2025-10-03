import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1rem', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px' , height: "83vh"}}>
      <h1 style={{ fontSize: '10rem', marginBottom: '0.5rem', marginTop:"5rem" }}>404</h1>
      <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: '1.5rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '4rem' , fontSize: '1.25rem', fontWeight: 'bold'}}>
        <Link to="/home" className="btn btn-primary">Go to Home</Link>
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn">Register</Link>
      </div>
    </main>
  )
}
