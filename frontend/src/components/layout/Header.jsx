import { Link, NavLink } from 'react-router-dom'

export default function Header({ itemCount }) {
  return (
    <header className="header">
      <Link className="brand" to="/">Art<span>Kolač</span></Link>
      <nav>
        <NavLink to="/ponuda">Ponuda</NavLink>
        <NavLink to="/torta-po-zelji">Torta po želji</NavLink>
        <NavLink to="/o-nama">O nama & Kontakt</NavLink>
        <NavLink className="cart" to="/narudzba">Košarica ({itemCount})</NavLink>
      </nav>
    </header>
  )
}
