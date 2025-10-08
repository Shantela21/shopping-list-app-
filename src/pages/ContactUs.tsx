import { useState } from 'react'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactUs() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [status, setStatus] = useState<string>('')

  const validate = (): boolean => {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.message.trim()) e.message = 'Message is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('')
    if (!validate()) return
    try {
      // Optional: send to backend (json-server)
      // await api.post('/messages', { ...form, createdAt: new Date().toISOString() })
      console.log('Contact message submitted:', form)
      setStatus('Thank you! Your message has been sent.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus('Failed to send message. Please try again later.')
    }
  }

  return (
    <div className="container">
    
      <form onSubmit={onSubmit}  aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="update" style={{ fontSize: 24, marginBottom: 27, marginTop: 24}}>Get in touch with us.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, padding:'20px', backgroundColor:'#f3f4f6', borderRadius:10 }}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className="input-login"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && <div id="name-error" className="error">{errors.name}</div>}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input-login"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <div id="email-error" className="error">{errors.email}</div>}
          </div>
          <div>
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              className="input-login"
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              placeholder="What is this about?"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
            />
            {errors.subject && <div id="subject-error" className="error">{errors.subject}</div>}
          </div>
          <div>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              className="input-login"
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              placeholder="Write your message here..."
              rows={6}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && <div id="message-error" className="error">{errors.message}</div>}
          </div>
          <button className="btn-login" type="submit">Send Message</button>
          {status && <div role="status" style={{ marginTop: 8 }}>{status}</div>}
        </div>
      </form>
    </div>
  )
}
