import { useEffect, useMemo, useState } from 'react'
import { getOrders, updateOrderStatus } from '../services/api'
import AdminNav from '../components/layout/AdminNav'
import './admin.css'

const statuses = ['Zaprimljena', 'Potvrđena', 'U izradi', 'Spremna', 'Isporučena', 'Završena', 'Otkazana']
const money = (value) => `${Number(value || 0).toFixed(2).replace('.', ',')} €`

export default function AdminPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() { setLoading(true); setError(''); try { setOrders(await getOrders()) } catch (e) { setError(e.message) } finally { setLoading(false) } }
  useEffect(() => { load() }, [])
  async function changeStatus(id, status) { try { const updated = await updateOrderStatus(id, status); setOrders(current => current.map(order => order._id === id ? updated : order)) } catch (e) { setError(e.message) } }

  const stats = useMemo(() => ({ total: orders.length, new: orders.filter(o => o.status === 'Zaprimljena').length, active: orders.filter(o => ['Potvrđena', 'U izradi', 'Spremna'].includes(o.status)).length, revenue: orders.filter(o => o.status !== 'Otkazana').reduce((sum, o) => sum + Number(o.total || 0), 0) }), [orders])

  return <main className="admin-page section">
    <AdminNav />
    <div className="section-heading"><div><p className="eyebrow">ADMIN</p><h1>Pregled narudžbi</h1></div><button className="button secondary" onClick={load}>Osvježi</button></div>
    <div className="admin-stats"><div><span>Ukupno</span><strong>{stats.total}</strong></div><div><span>Nove</span><strong>{stats.new}</strong></div><div><span>Aktivne</span><strong>{stats.active}</strong></div><div><span>Vrijednost</span><strong>{money(stats.revenue)}</strong></div></div>
    {error && <div className="form-error">{error}</div>}
    {loading ? <p className="muted">Učitavanje narudžbi…</p> : orders.length === 0 ? <p className="muted">Trenutno nema narudžbi.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Broj</th><th>Kupac</th><th>Datum</th><th>Način</th><th>Ukupno</th><th>Status</th></tr></thead><tbody>{orders.map(order => <tr key={order._id}><td><strong>{order.orderNumber}</strong></td><td>{order.customer?.name}<br /><small>{order.customer?.phone}</small></td><td>{order.requestedDate || order.date}</td><td>{order.fulfillment === 'delivery' ? `Dostava – ${order.deliveryZone}` : 'Preuzimanje'}</td><td>{money(order.total)}</td><td><select value={order.status} onChange={e => changeStatus(order._id, e.target.value)}>{statuses.map(status => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>}
  </main>
}
