import { useState } from 'react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../data/site'

const initialForm = {
  name: '', email: '', phone: '', fulfillment: 'pickup',
  deliveryZone: '', address: '', date: '', note: ''
}

export default function OrderPage({ cart, subtotal, onRemove, onQuantityChange, onClear }) {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const deliveryFee = form.fulfillment === 'delivery'
    ? (siteConfig.deliveryZones.find((zone) => zone.label === form.deliveryZone)?.price ?? 0)
    : 0
  const total = subtotal + deliveryFee

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setResult(null)

    if (!cart.length) {
      setError('Košarica je prazna. Prvo odaberite proizvode.')
      return
    }
    if (form.fulfillment === 'delivery' && !form.address.trim()) {
      setError('Za dostavu je potrebno upisati adresu.')
      return
    }
    if (form.fulfillment === 'delivery' && form.deliveryZone === 'Preko 50 km') {
      setError('Dostava preko 50 km dogovara se pojedinačno. Molimo pošaljite upit.')
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
          subtotal,
          deliveryFee,
          total,
          paymentMethod: 'cash_on_delivery'
        })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Narudžbu nije moguće poslati.')
      setResult(data)
      onClear()
      setForm(initialForm)
    } catch (err) {
      setError(err.message || 'Došlo je do greške. Pokušajte ponovno.')
    }
  }

  if (result) {
    return (
      <section className="section order-success">
        <p className="eyebrow">NARUDŽBA ZAPRIMLJENA</p>
        <h2>Hvala na narudžbi!</h2>
        <p>Vaša narudžba je zaprimljena i čeka ručnu potvrdu.</p>
        <div className="cash"><strong>Broj narudžbe: {result.orderNumber}</strong><br />Ukupno: {Number(result.total ?? total).toFixed(2).replace('.', ',')} €<br />Plaćanje: pouzećem / gotovinom pri preuzimanju</div>
        <Link className="button primary" to="/">Natrag na početnu</Link>
      </section>
    )
  }

  return (
    <section className="order section">
      <div className="section-heading">
        <div><p className="eyebrow">NARUDŽBA</p><h2>Jednostavno do narudžbe</h2></div>
        <p>Plaćanje je pouzećem pri dostavi ili gotovinom pri preuzimanju.</p>
      </div>
      <div className="order-grid">
        <div className="cart-box">
          <h3>Tvoja košarica</h3>
          {!cart.length ? <p className="muted">Košarica je trenutno prazna.</p> : cart.map((item) => (
            <div className="cart-row" key={item.id}>
              <span>{item.name}</span>
              <div>
                <button type="button" onClick={() => onQuantityChange(item.id, item.quantity - 1)}>−</button>
                <strong> {item.quantity} </strong>
                <button type="button" onClick={() => onQuantityChange(item.id, item.quantity + 1)}>+</button>
                <strong> {(item.price * item.quantity).toFixed(2).replace('.', ',')} €</strong>
                <button type="button" onClick={() => onRemove(item.id)}>×</button>
              </div>
            </div>
          ))}
          <div className="cart-total"><span>Proizvodi</span><strong>{subtotal.toFixed(2).replace('.', ',')} €</strong></div>
          <div className="cart-total"><span>Dostava</span><strong>{deliveryFee ? `${deliveryFee.toFixed(2).replace('.', ',')} €` : '0,00 €'}</strong></div>
          <div className="cart-total"><span>Ukupno</span><strong>{total.toFixed(2).replace('.', ',')} €</strong></div>
        </div>

        <form className="order-form" onSubmit={submit}>
          <h3>Podaci za narudžbu</h3>
          <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ime i prezime *" />
          <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="E-mail *" />
          <input required type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Telefon *" />
          <select value={form.fulfillment} onChange={(e) => update('fulfillment', e.target.value)}>
            <option value="pickup">Osobno preuzimanje</option>
            <option value="delivery">Dostava</option>
          </select>
          {form.fulfillment === 'delivery' && <>
            <select required value={form.deliveryZone} onChange={(e) => update('deliveryZone', e.target.value)}>
              <option value="">Odaberi udaljenost dostave *</option>
              {siteConfig.deliveryZones.map((zone) => <option key={zone.label} value={zone.label}>{zone.label}{zone.price != null ? ` (+${zone.price} €)` : ' (dogovor)'}</option>)}
            </select>
            <input required value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="Adresa za dostavu *" />
          </>}
          <input required type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
          <textarea value={form.note} onChange={(e) => update('note', e.target.value)} placeholder="Napomena" />
          {error && <p className="error">{error}</p>}
          <div className="cash">💶 Plaćanje: pouzećem / gotovinom pri preuzimanju</div>
          <button className="button primary" type="submit">Pošalji narudžbu</button>
        </form>
      </div>
    </section>
  )
}
