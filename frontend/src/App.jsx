import { useState } from 'react'

const categories = ['Torte', 'Kolači', 'Sitni kolači', 'Posebne prigode']

const products = [
  { id: 1, name: 'Čokoladna torta', category: 'Torte', price: 32, description: 'Bogata domaća čokoladna torta, izrađena svježe po narudžbi.' },
  { id: 2, name: 'Voćna torta', category: 'Torte', price: 30, description: 'Lagani biskvit, krema i sezonsko voće.' },
  { id: 3, name: 'Domaći kremasti kolači', category: 'Kolači', price: 18, description: 'Izbor svježih kremastih kolača za svaku prigodu.' },
  { id: 4, name: 'Sitni kolači', category: 'Sitni kolači', price: 16, description: 'Pažljivo izrađen izbor domaćih sitnih kolača.' },
]

function App() {
  const [category, setCategory] = useState('Sve')
  const [cart, setCart] = useState([])

  const visibleProducts = category === 'Sve' ? products : products.filter((p) => p.category === category)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      return [...current, { ...product, quantity: 1 }]
    })
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">Art<span>Kolač</span></div>
        <nav>
          <a href="#ponuda">Ponuda</a>
          <a href="#posebna">Torta po želji</a>
          <a href="#kontakt">O nama & Kontakt</a>
          <a className="cart" href="#narudzba">Košarica ({cart.reduce((s, i) => s + i.quantity, 0)})</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">DOMAĆE • SVJEŽE • PO NARUDŽBI</p>
            <h1>Torta nije samo desert.<br /><em>To je uspomena.</em></h1>
            <p>Izrađujemo domaće torte i kolače po vašoj želji, svježe i s pažnjom za svaki poseban trenutak.</p>
            <div className="hero-actions">
              <a className="button primary" href="#ponuda">Pogledaj ponudu</a>
              <a className="button secondary" href="#posebna">Naruči tortu po želji</a>
            </div>
          </div>
        </section>

        <section className="promise">
          <div><strong>100%</strong><span>izrađeno po narudžbi</span></div>
          <div><strong>0</strong><span>gotovih zaliha</span></div>
          <div><strong>1</strong><span>cilj – da bude savršeno</span></div>
        </section>

        <section id="ponuda" className="section">
          <div className="section-heading">
            <div><p className="eyebrow">NAŠA PONUDA</p><h2>Odaberi nešto slatko</h2></div>
            <p>Sve pripremamo tek nakon vaše narudžbe.</p>
          </div>
          <div className="filters">
            {['Sve', ...categories].map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <div className="products">
            {visibleProducts.map((product) => (
              <article className="product" key={product.id}>
                <div className="product-image"><span>ArtKolač</span></div>
                <div className="product-body"><small>{product.category}</small><h3>{product.name}</h3><p>{product.description}</p><div className="product-bottom"><strong>{product.price.toFixed(2).replace('.', ',')} €</strong><button onClick={() => addToCart(product)}>Dodaj</button></div></div>
              </article>
            ))}
          </div>
        </section>

        <section id="posebna" className="custom section">
          <div><p className="eyebrow">TVOJA IDEJA</p><h2>Torta po želji</h2><p>Pošalji nam fotografiju, opiši što želiš i reci za koliko osoba treba torta. Mi ćemo pregledati upit i javiti konačnu cijenu.</p></div>
          <div className="custom-list"><span>01</span><p>Fotografija ili primjer</p><span>02</span><p>Broj osoba i okus</p><span>03</span><p>Ukras i tekst na torti</p><span>04</span><p>Datum i napomena</p><button className="button primary">Pošalji upit</button></div>
        </section>

        <section id="narudzba" className="order section">
          <div className="section-heading"><div><p className="eyebrow">NARUDŽBA</p><h2>Jednostavno do narudžbe</h2></div><p>Plaćanje je pouzećem pri dostavi ili gotovinom pri preuzimanju.</p></div>
          <div className="order-grid">
            <div className="cart-box"><h3>Tvoja košarica</h3>{cart.length === 0 ? <p className="muted">Košarica je trenutno prazna.</p> : cart.map((item) => <div className="cart-row" key={item.id}><span>{item.name} × {item.quantity}</span><strong>{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</strong></div>)}<div className="cart-total"><span>Ukupno</span><strong>{total.toFixed(2).replace('.', ',')} €</strong></div></div>
            <form className="order-form" onSubmit={(e) => e.preventDefault()}><h3>Podaci za narudžbu</h3><input required placeholder="Ime i prezime *" /><input required type="email" placeholder="E-mail *" /><input required type="tel" placeholder="Telefon *" /><select><option>Osobno preuzimanje</option><option>Dostava – do 5 km (+3 €)</option><option>Dostava – 5–10 km (+5 €)</option><option>Dostava – 10–20 km (+8 €)</option><option>Dostava – 20–30 km (+12 €)</option><option>Dostava – 30–40 km (+15 €)</option><option>Dostava – 40–50 km (+20 €)</option><option>Dostava – preko 50 km (dogovor)</option></select><input required type="date" /><textarea placeholder="Adresa za dostavu i napomena"></textarea><div className="cash">💶 Plaćanje: pouzećem / gotovinom pri preuzimanju</div><button className="button primary" type="submit">Pošalji narudžbu</button></form>
          </div>
        </section>

        <section id="kontakt" className="contact section"><div><p className="eyebrow">ARTKOLAČ</p><h2>O nama & Kontakt</h2><p>Male domaće slastice izrađujemo po narudžbi, bez nepotrebnih zaliha. Svaka torta i svaki kolač pripremaju se svježe za vas.</p></div><div className="contact-card"><p><strong>E-mail</strong><br />info@artkolac.hr</p><p><strong>Telefon</strong><br />+385 xx xxx xxxx</p><p><strong>Preuzimanje</strong><br />Po dogovoru</p></div></section>
      </main>

      <footer><span>© 2026 ArtKolač</span><span>Domaće. Svježe. Po tvojoj želji.</span></footer>
    </div>
  )
}

export default App
