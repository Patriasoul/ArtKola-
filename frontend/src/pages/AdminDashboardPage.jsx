import { useEffect, useMemo, useState } from 'react'
import AdminNav from '../components/layout/AdminNav'
import { getOrders } from '../services/api'
import { getCustomOrders } from '../services/customOrdersApi'
import { getCalendar, getSettings } from '../services/calendarApi'
import './admin.css'

const money = value => `${Number(value || 0).toFixed(2).replace('.', ',')} €`
const today = () => new Date().toISOString().slice(0, 10)

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([])
  const [customOrders, setCustomOrders] = useState([])
  const [calendar, setCalendar] = useState(null)
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true); setError('')
    try {
      const month = today().slice(0, 7)
      const [orderData, customData, calendarData, settingsData] = await Promise.all([getOrders(), getCustomOrders(), getCalendar(month), getSettings()])
      setOrders(orderData); setCustomOrders(customData); setCalendar(calendarData); setSettings(settingsData)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const stats = useMemo(() => {
    const current = orders.filter(o => (o.requestedDate || o.date) === today() && o.status !== 'Otkazana')
    const newOrders = orders.filter(o => o.status === 'Zaprimljena')
    const customWaiting = customOrders.filter(o => ['Zaprimljen', 'U obradi'].includes(o.status))
    const revenue = orders.filter(o => o.status !== 'Otkazana').reduce((sum, o) => sum + Number(o.total || 0), 0)
    const capacity = calendar?.maxOrdersPerDay || settings?.maxOrdersPerDay || 10
    return { today: current, newOrders, customWaiting, revenue, capacity }
  }, [orders, customOrders, calendar, settings])

  const todayCalendar = calendar?.days?.find(day => day.date === today())

  return <main className="admin-page section">
    <AdminNav />
    <div className="section-heading">
      <div><p className="eyebrow">ADMIN DASHBOARD</p><h1>Dobro došao u ArtKolač</h1><p className="muted">Brzi pregled svega što danas trebaš napraviti.</p></div>
      <button className="button secondary" onClick={load}>Osvježi</button>
    </div>

    {error && <div className="form-error">{error}</div>}
    {loading ? <p className="muted">Učitavanje dashboarda…</p> : <>
      <div className="admin-stats dashboard-stats">
        <div><span>Danas</span><strong>{stats.today.length}</strong><small>narudžbi</small></div>
        <div><span>Nove narudžbe</span><strong>{stats.newOrders.length}</strong><small>čekaju obradu</small></div>
        <div><span>Torte po želji</span><strong>{stats.customWaiting.length}</strong><small>čekaju odgovor</small></div>
        <div><span>Ukupna vrijednost</span><strong>{money(stats.revenue)}</strong><small>nezavršene/odrađene narudžbe</small></div>
      </div>

      <div className="dashboard-grid">
        <section className="card dashboard-card">
          <div className="dashboard-card-heading"><div><p className="eyebrow">DANAS</p><h2>Opterećenje dana</h2></div><strong>{todayCalendar?.count || 0} / {stats.capacity}</strong></div>
          <div className="capacity-bar"><span style={{ width: `${Math.min(((todayCalendar?.count || 0) / stats.capacity) * 100, 100)}%` }} /></div>
          <p className="muted">{Math.max(stats.capacity - (todayCalendar?.count || 0), 0)} slobodnih mjesta za narudžbe.</p>
        </section>

        <section className="card dashboard-card">
          <div className="dashboard-card-heading"><div><p className="eyebrow">PRIORITET</p><h2>Što čeka tebe?</h2></div></div>
          <div className="dashboard-actions">
            <a href="/admin" className="dashboard-action"><strong>{stats.newOrders.length}</strong><span>Nove narudžbe →</span></a>
            <a href="/admin/torte-po-zelji" className="dashboard-action"><strong>{stats.customWaiting.length}</strong><span>Torte po želji →</span></a>
            <a href="/admin/kalendar" className="dashboard-action"><strong>{todayCalendar?.count || 0}</strong><span>Danas u kalendaru →</span></a>
          </div>
        </section>
      </div>

      <section className="card dashboard-card">
        <div className="dashboard-card-heading"><div><p className="eyebrow">DANAŠNJE NARUDŽBE</p><h2>Pregled za danas</h2></div><a className="button secondary" href="/admin">Sve narudžbe</a></div>
        {stats.today.length === 0 ? <p className="muted">Danas još nema potvrđenih narudžbi.</p> : <div className="dashboard-order-list">{stats.today.slice(0, 6).map(order => <div className="dashboard-order" key={order._id}><strong>{order.orderNumber}</strong><span>{order.customer?.name}</span><span>{money(order.total)}</span><span>{order.status}</span></div>)}</div>}
      </section>
    </>}
  </main>
}
