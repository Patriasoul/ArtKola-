import { useEffect, useMemo, useState } from 'react'
import { getCalendar, getSettings, updateSettings } from '../services/calendarApi'

const monthNames = ['Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj', 'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac']
const weekDays = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned']

function money(value) {
  return `${Number(value || 0).toFixed(2).replace('.', ',')} €`
}

function shiftMonth(value, amount) {
  const [year, month] = value.split('-').map(Number)
  const date = new Date(year, month - 1 + amount, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export default function AdminCalendarPage() {
  const now = new Date()
  const [month, setMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
  const [calendar, setCalendar] = useState({ days: [], maxOrdersPerDay: 10 })
  const [selectedDate, setSelectedDate] = useState('')
  const [capacity, setCapacity] = useState(10)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [calendarData, settings] = await Promise.all([getCalendar(month), getSettings()])
      setCalendar(calendarData)
      setCapacity(settings.maxOrdersPerDay || 10)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [month])

  const dayMap = useMemo(() => Object.fromEntries(calendar.days.map((day) => [day.date, day])), [calendar.days])
  const [year, monthNumber] = month.split('-').map(Number)
  const firstDay = new Date(year, monthNumber - 1, 1)
  const daysInMonth = new Date(year, monthNumber, 0).getDate()
  const mondayOffset = (firstDay.getDay() + 6) % 7
  const cells = [...Array(mondayOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const selected = selectedDate ? dayMap[selectedDate] : null

  async function saveCapacity() {
    const value = Math.max(1, Number(capacity) || 1)
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const settings = await getSettings()
      await updateSettings({ ...settings, maxOrdersPerDay: value })
      setCapacity(value)
      setMessage('Dnevni kapacitet je spremljen.')
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="admin-page section">
      <div className="section-heading">
        <div><p className="eyebrow">ADMIN</p><h1>Kalendar i kapacitet</h1></div>
        <button className="button secondary" onClick={load}>Osvježi</button>
      </div>

      <div className="admin-settings-card">
        <div>
          <strong>Maksimalan broj narudžbi dnevno</strong>
          <p className="muted">Kad se kapacitet popuni, dan se označava kao pun.</p>
        </div>
        <div className="admin-inline-form">
          <input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          <button className="button" onClick={saveCapacity} disabled={saving}>{saving ? 'Spremam…' : 'Spremi'}</button>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}
      {message && <div className="form-success">{message}</div>}

      <div className="calendar-toolbar">
        <button className="button secondary" onClick={() => setMonth(shiftMonth(month, -1))}>←</button>
        <h2>{monthNames[monthNumber - 1]} {year}</h2>
        <button className="button secondary" onClick={() => setMonth(shiftMonth(month, 1))}>→</button>
      </div>

      {loading ? <p className="muted">Učitavanje kalendara…</p> : (
        <div className="calendar-layout">
          <div className="calendar-grid">
            {weekDays.map((day) => <div className="calendar-weekday" key={day}>{day}</div>)}
            {cells.map((day, index) => {
              if (!day) return <div className="calendar-empty" key={`empty-${index}`} />
              const date = `${month}-${String(day).padStart(2, '0')}`
              const data = dayMap[date]
              const count = data?.count || 0
              const full = count >= calendar.maxOrdersPerDay
              return (
                <button key={date} className={`calendar-day ${full ? 'is-full' : ''} ${selectedDate === date ? 'is-selected' : ''}`} onClick={() => setSelectedDate(date)}>
                  <strong>{day}</strong>
                  <span>{count} / {calendar.maxOrdersPerDay}</span>
                  <small>{full ? 'Puno' : `${Math.max(calendar.maxOrdersPerDay - count, 0)} slobodno`}</small>
                </button>
              )
            })}
          </div>

          <aside className="calendar-details">
            <h3>{selectedDate ? `Narudžbe – ${selectedDate}` : 'Odaberi dan'}</h3>
            {!selected ? <p className="muted">Klikni na dan u kalendaru za pregled narudžbi.</p> : selected.orders.length === 0 ? <p className="muted">Nema narudžbi za ovaj dan.</p> : (
              <div className="calendar-order-list">
                {selected.orders.map((order) => (
                  <div className="calendar-order" key={order.id}>
                    <strong>{order.orderNumber}</strong>
                    <span>{order.customerName} · {money(order.total)}</span>
                    <small>{order.fulfillment === 'delivery' ? 'Dostava' : 'Preuzimanje'} · {order.status}</small>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  )
}
