import { NavLink } from 'react-router-dom'

const links = [
  ['/admin', 'Dashboard'],
  ['/admin/narudzbe', 'Narudžbe'],
  ['/admin/ponuda', 'Ponuda'],
  ['/admin/torte-po-zelji', 'Torte po želji'],
  ['/admin/kalendar', 'Kalendar'],
  ['/admin/postavke', 'Postavke']
]

export default function AdminNav() {
  return <nav className="admin-nav" aria-label="Administracija">
    {links.map(([to, label]) => <NavLink key={to} end={to === '/admin'} to={to}>{label}</NavLink>)}
  </nav>
}
