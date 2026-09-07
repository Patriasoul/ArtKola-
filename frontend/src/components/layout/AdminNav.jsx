import { NavLink, useNavigate } from 'react-router-dom'
import { logoutAdmin } from '../../services/adminAuth'

const links = [
  ['/admin', 'Dashboard'],
  ['/admin/narudzbe', 'Narudžbe'],
  ['/admin/ponuda', 'Ponuda'],
  ['/admin/torte-po-zelji', 'Torte po želji'],
  ['/admin/kalendar', 'Kalendar'],
  ['/admin/postavke', 'Postavke']
]

export default function AdminNav() {
  const navigate = useNavigate()

  function logout() {
    logoutAdmin()
    navigate('/admin/login', { replace: true })
  }

  return <nav className="admin-nav" aria-label="Administracija">
    <div className="admin-nav-links">
      {links.map(([to, label]) => <NavLink key={to} end={to === '/admin'} to={to}>{label}</NavLink>)}
    </div>
    <button className="admin-logout" type="button" onClick={logout}>Odjava</button>
  </nav>
}
