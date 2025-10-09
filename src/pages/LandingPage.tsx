import { useNavigate } from 'react-router-dom'
import heroImg from '../assets/grocery-list-for-shopping-in-the-store-shopping-list-with-marks-paper-bag-full-of-food-fruit-products-grocery-goods-buying-food-in-supermarket-illustration-vector.jpg'
import { useRef, useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

export default function LandingPage() {
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [cardTransform, setCardTransform] = useState<string>('rotateX(0deg) rotateY(0deg)')

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = (x / rect.width) * 2 - 1 // -1 .. 1
    const py = (y / rect.height) * 2 - 1 // -1 .. 1
    const max = 10 // deg
    const rx = -(py * max)
    const ry = px * max
    setCardTransform(`rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`)
  }

  const onLeave = () => setCardTransform('rotateX(0deg) rotateY(0deg)')

  return (
    <div>
      <Navbar/>
    <main style={{ padding: "24px" }}>
      {/* Hero */}
      <section className="landing-hero" style={{ display: 'grid', gap: 24, alignItems: 'center', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', maxWidth: 1100, margin: '0 auto 40px', perspective: 1000 }}>
        <div>
          <h1 className="update hero-title" style={{ fontSize: 42, lineHeight: 1.1, marginBottom: 12 }}>Your smart shopping list</h1>
          <p className="hero-text" style={{ color: '#555', marginBottom: 20 }}>
            Plan groceries, avoid duplicates, and save time. Add quantities, notes, categories, and even images for quick recognition.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="getStartedBtn-btn-3d"
              onClick={() => navigate('/login')}
              aria-label="Get started and go to login"
              
            >
              GET STARTED
            </button>
            <button
              className="createAccountBtn-btn-3d"
              onClick={() => navigate('/register')}
              aria-label="Create your account"
              
            >
              CREATE ACCOUNT
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <div
            ref={cardRef}
            className="hero-card"
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{ transform: cardTransform, marginTop:40
             }}
          >
            <img src={heroImg} alt="Groceries neatly organized for shopping" className="hero-image" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto' }} aria-labelledby="features-heading">
        <h2 id="features-heading" className="update" style={{ fontSize: 24,marginTop: 50, marginBottom: 40}}>Why use Shopping List?</h2>

        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
          <article className="feature-card" style={{ border: '1px solid #eee', borderRadius: 10, padding: 16 }}>
            <h3 style={{ marginBottom: 8 }}>Fast and simple</h3>
            <p style={{ color: '#555' }}>Add items in seconds, adjust quantities, and keep your list focused.</p>
          </article>
          <article className="feature-card" style={{ border: '1px solid #eee', borderRadius: 10, padding: 16 }}>
            <h3 style={{ marginBottom: 8 }}>Organized by category</h3>
            <p style={{ color: '#555' }}>Group items by aisles or categories to breeze through the store.</p>
          </article>
          <article className="feature-card" style={{ border: '1px solid #eee', borderRadius: 10, padding: 16 }}>
            <h3 style={{ marginBottom: 8 }}>Visual reminders</h3>
            <p style={{ color: '#555' }}>Attach images for products to avoid picking the wrong item.</p>
          </article>
          <article className="feature-card" style={{ border: '1px solid #eee', borderRadius: 10, padding: 16 }}>
            <h3 style={{ marginBottom: 8 }}>Shareable</h3>
            <p style={{ color: '#555' }}>Share lists via URL so anyone can import and start using them.</p>
          </article>
        </div>
      </section>
    </main>
    <Footer/>
    </div>
  )
}
