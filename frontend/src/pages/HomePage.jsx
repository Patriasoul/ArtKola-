import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/products/ProductGrid'
import { getProducts } from '../services/catalogApi'

export default function HomePage({ products: fallbackProducts, onAdd }) {
  const [products, setProducts] = useState(fallbackProducts || [])

  useEffect(() => {
    let active = true
    getProducts()
      .then((data) => { if (active && Array.isArray(data) && data.length) setProducts(data) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">DOMAĆE • SVJEŽE • PO NARUDŽBI</p>
          <h1>Torta nije samo desert.<br /><em>To je uspomena.</em></h1>
          <p>Izrađujemo domaće torte i kolače po vašoj želji, svježe i s pažnjom za svaki poseban trenutak.</p>
          <div className="hero-actions">
            <Link className="button primary" to="/ponuda">Pogledaj ponudu</Link>
            <Link className="button secondary" to="/torta-po-zelji">Naruči tortu po želji</Link>
          </div>
        </div>
      </section>

      <section className="promise">
        <div><strong>100%</strong><span>izrađeno po narudžbi</span></div>
        <div><strong>0</strong><span>gotovih zaliha</span></div>
        <div><strong>1</strong><span>cilj – da bude savršeno</span></div>
      </section>

      <section className="section" id="ponuda">
        <div className="section-heading">
          <div><p className="eyebrow">NAŠA PONUDA</p><h2>Odaberi nešto slatko</h2></div>
          <p>Sve pripremamo tek nakon vaše narudžbe.</p>
        </div>
        <ProductGrid products={products} onAdd={onAdd} />
      </section>

      <section className="custom section">
        <div>
          <p className="eyebrow">TVOJA IDEJA</p>
          <h2>Torta po želji</h2>
          <p>Pošalji nam fotografiju, opiši što želiš i reci za koliko osoba treba torta. Pregledat ćemo upit i javiti konačnu cijenu.</p>
        </div>
        <div className="custom-list">
          <span>01</span><p>Fotografija ili primjer</p>
          <span>02</span><p>Broj osoba i okus</p>
          <span>03</span><p>Ukras i tekst na torti</p>
          <span>04</span><p>Datum i napomena</p>
          <Link className="button primary" to="/torta-po-zelji">Pošalji upit</Link>
        </div>
      </section>
    </main>
  )
}
