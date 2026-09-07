import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../services/adminAuth'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await loginAdmin(password)
      navigate('/admin', { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return <main className="section admin-login-page">
    <div className="card admin-login-card">
      <p className="eyebrow">ARTKOLAČ ADMIN</p>
      <h1>Administracija</h1>
      <p className="muted">Prijavi se za pristup narudžbama, ponudi, kalendaru i postavkama.</p>
      <form className="order-form" onSubmit={submit}>
        <label>Administratorska lozinka<input autoFocus required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Lozinka" /></label>
        {error && <div className="form-error">{error}</div>}
        <button className="button primary" type="submit" disabled={loading}>{loading ? 'Prijava…' : 'Prijavi se'}</button>
      </form>
    </div>
  </main>
}
