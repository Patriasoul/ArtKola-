import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <span>© 2026 ArtKolač</span>
      <span>Domaće. Svježe. Po tvojoj želji.</span>
      <Link to="/admin">Admin</Link>
    </footer>
  )
}
