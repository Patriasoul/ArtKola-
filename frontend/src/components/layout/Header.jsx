import { Link } from 'react-router-dom'

export default function Header({ itemCount }) {
  return (
    <header className="header">
      <Link className="brand" to="/">Art<span>Kolač</span></Link>
      <nav>
        <Link to="/ponuda">Ponuda</Link>
        <Link to="/torta-po-zelji">Torta po želji</Link>
        <Link to="/o-nama">O nama & Kontakt</Link>
        <Link className="cart" to="/narudzba">Košarica ({itemCount})</Link>
      </nav>
    </header>
  )
}
