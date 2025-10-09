import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../reduxHooks'
import { incrementPageViews, toggleFeedback } from '../features/AboutSlice'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function About() {
  const dispatch = useAppDispatch()
  const { pageViews, feedbackOpen } = useAppSelector((s) => s.about)

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Feedback submitted', form)
    setStatus('sent')
    setForm({ name: '', email: '', message: '' })
  }

  useEffect(() => {
    dispatch(incrementPageViews())
  }, [dispatch])

  return (
    <div>
      <Navbar/>
    
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h1>About CartLogic</h1>
      <p style={{gap:'10px'}}>
        Plan groceries, avoid duplicates, and save time. Add quantities, notes, categories, and images for quick
        recognition.
      </p>
       <p>
        Our Shopping List App helps you stay organized and efficient — whether you’re 
        planning weekly meals or managing household supplies. Create lists, share them, 
        and track your purchases all in one place.
      </p>

      <section aria-labelledby="stats-heading" style={{ marginTop: 16 }}>
        <h2 id="stats-heading" className="sr-only">Stats</h2>
        <p aria-live="polite">Page views this session: {pageViews}</p>
      </section>

      <section aria-labelledby="feedback-heading" style={{ marginTop: 24 }}>
        <h2 id="feedback-heading">Feedback</h2>
        <button
          className="feedbackBtn"
          onClick={() => dispatch(toggleFeedback())}
          aria-expanded={feedbackOpen}
          aria-controls="feedback-panel"
          
        >
          {feedbackOpen ? 'Hide feedback' : 'Leave feedback'}
        </button>
        {feedbackOpen && (
          <div id="feedback-panel" role="region" aria-label="Feedback form" style={{ marginTop: 12 }}>
            <p>Have ideas to improve duplicate detection, categories, or images? Let us know!</p>
            {status === 'sent' ? (
              <p role="status" style={{ color: 'green' }}>Thanks! Your feedback was recorded.</p>
            ) : null}
            <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
              <label htmlFor="fb-name">Name</label>
              <input
                id="fb-name"
                name="name"
                type="text"
                className="input-login"
                value={form.name}
                onChange={onChange}
                placeholder="Your name"
                required
              />
              <label htmlFor="fb-email">Email</label>
              <input
                id="fb-email"
                name="email"
                type="email"
                className="input-login"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                required
              />
              <label htmlFor="fb-message">Message</label>
              <textarea
                id="fb-message"
                name="message"
                className="input-login"
                value={form.message}
                onChange={onChange}
                placeholder="Your suggestions..."
                rows={4}
                required
              />
              <button type="submit" className="feedbackBtn">Send feedback</button>
            </form>
          </div>
        )}
      </section>
    </main>
    <Footer/>
    </div>
  )
}
