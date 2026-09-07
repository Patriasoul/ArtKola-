import { useState } from 'react'
import { createCustomOrder } from '../services/customOrdersApi'

const initial = { name: '', email: '', phone: '', people: '', flavor: '', decoration: '', cakeText: '', desiredDate: '', referenceImageUrl: '', note: '' }

export default function CustomOrderPage() {
  const [form, setForm] = useState(initial)
  const [sent, setSent] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field, value) { setForm(current => ({ ...current, [field]: value })) }

  async function submit(event) {
    event.preventDefault()
    setLoading(true); setError('')
    try {
      const result = await createCustomOrder({ ...form, people: Number(form.people) })
      setSent(result); setForm(initial)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  if (sent) return <section className="section order-success"><p className="eyebrow">UPIT ZAPRIMLJEN</p><h2>Hvala! Tvoja ideja je stigla.</h2><p>Pregledat ćemo sve detalje i odrediti konačnu cijenu prije izrade.</p><p><strong>Status:</strong> {sent.status}</p><button className="button secondary" onClick={() => setSent(null)}>Pošalji još jedan upit</button></section>

  return <section className="custom section">
    <div>
      <p className="eyebrow">TVOJA IDEJA</p>
      <h2>Torta po želji</h2>
      <p>Pošalji nam detalje torte koju želiš. Upit pregledavamo ručno, a konačnu cijenu potvrđujemo prije izrade.</p>
    </div>
    <form className="order-form" onSubmit={submit}>
      <input required value={form.name} placeholder="Ime i prezime *" onChange={e => update('name', e.target.value)} />
      <input required type="email" value={form.email} placeholder="E-mail *" onChange={e => update('email', e.target.value)} />
      <input required type="tel" value={form.phone} placeholder="Telefon *" onChange={e => update('phone', e.target.value)} />
      <input required type="number" min="1" value={form.people} placeholder="Broj osoba *" onChange={e => update('people', e.target.value)} />
      <input required value={form.flavor} placeholder="Okus / vrsta kreme *" onChange={e => update('flavor', e.target.value)} />
      <input value={form.decoration} placeholder="Željeni ukras" onChange={e => update('decoration', e.target.value)} />
      <input value={form.cakeText} placeholder="Tekst na torti" onChange={e => update('cakeText', e.target.value)} />
      <input required type="date" value={form.desiredDate} onChange={e => update('desiredDate', e.target.value)} />
      <input type="url" value={form.referenceImageUrl} placeholder="Poveznica na fotografiju / primjer" onChange={e => update('referenceImageUrl', e.target.value)} />
      <textarea required value={form.note} placeholder="Opiši tortu, dekoraciju i ostale želje *" onChange={e => update('note', e.target.value)} />
      <div className="cash">Napomena: cijenu torte po želji potvrđujemo nakon pregleda upita.</div>
      {error && <div className="form-error">{error}</div>}
      <button className="button primary" type="submit" disabled={loading}>{loading ? 'Šaljem…' : 'Pošalji upit'}</button>
    </form>
  </section>
}
