import { useEffect, useState } from 'react'
import AdminNav from '../components/layout/AdminNav'
import { getCustomOrders, updateCustomOrder } from '../services/customOrdersApi'
import './admin.css'

const statuses = ['Zaprimljen', 'U obradi', 'Ponuda poslana', 'Potvrđen', 'Odbijen', 'Završen']
const money = value => value === null || value === '' || value === undefined ? 'Nije određena' : `${Number(value).toFixed(2).replace('.', ',')} €`

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState([])
  const [selected, setSelected] = useState(null)
  const [price, setPrice] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  async function load() { try { setError(''); setOrders(await getCustomOrders()) } catch (e) { setError(e.message) } }
  useEffect(() => { load() }, [])

  function selectOrder(order) { setSelected(order); setPrice(order.proposedPrice ?? ''); setNote(order.adminNote || ''); setStatus(order.status) }

  async function save() {
    try {
      const updated = await updateCustomOrder(selected._id, { status, proposedPrice: price === '' ? null : Number(price), adminNote: note })
      setOrders(current => current.map(item => item._id === updated._id ? updated : item))
      setSelected(updated)
    } catch (e) { setError(e.message) }
  }

  return <main className="admin-page section">
    <AdminNav />
    <div className="section-heading"><div><p className="eyebrow">ADMIN</p><h1>Torte po želji</h1><p className="muted">Pregledaj upite, odredi konačnu cijenu i potvrdi status.</p></div><button className="button secondary" onClick={load}>Osvježi</button></div>
    {error && <div className="form-error">{error}</div>}
    <div className="custom-admin-layout">
      <div className="custom-order-list">{orders.length === 0 ? <p className="muted">Nema zaprimljenih upita.</p> : orders.map(order => <button className={`custom-order-card ${selected?._id === order._id ? 'active' : ''}`} key={order._id} onClick={() => selectOrder(order)}><strong>{order.customer?.name}</strong><span>{order.desiredDate} · {order.people} osoba</span><small>{order.flavor} · {order.status}</small></button>)}</div>
      {selected && <div className="card custom-order-detail"><p className="eyebrow">UPIT</p><h2>{selected.customer.name}</h2><p><strong>E-mail:</strong> {selected.customer.email}<br /><strong>Telefon:</strong> {selected.customer.phone}</p><hr /><p><strong>Broj osoba:</strong> {selected.people}</p><p><strong>Okus:</strong> {selected.flavor}</p><p><strong>Ukras:</strong> {selected.decoration || 'Nije navedeno'}</p><p><strong>Tekst na torti:</strong> {selected.cakeText || 'Nije navedeno'}</p><p><strong>Željeni datum:</strong> {selected.desiredDate}</p><p><strong>Želje:</strong> {selected.note || 'Nije navedeno'}</p>{selected.referenceImageUrl && <p><a href={selected.referenceImageUrl} target="_blank" rel="noreferrer">Otvori fotografiju / primjer ↗</a></p>}<hr /><label>Status<select value={status} onChange={e => setStatus(e.target.value)}>{statuses.map(item => <option key={item}>{item}</option>)}</select></label><label>Konačna cijena (€)<input type="number" min="0" step="0.01" value={price} placeholder="npr. 45" onChange={e => setPrice(e.target.value)} /></label><label>Interna napomena<textarea value={note} onChange={e => setNote(e.target.value)} /></label><button className="button primary" onClick={save}>Spremi promjene</button><p className="muted">Trenutna ponuđena cijena: {money(selected.proposedPrice)}</p></div>}
    </div>
  </main>
}
