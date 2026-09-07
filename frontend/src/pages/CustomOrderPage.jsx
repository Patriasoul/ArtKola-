import { useState } from 'react'

export default function CustomOrderPage() {
  const [sent, setSent] = useState(false)

  function submit(event) {
    event.preventDefault()
    setSent(true)
  }

  if (sent) {
    return <section className="section order-success"><p className="eyebrow">UPIT ZAPRIMLJEN</p><h2>Hvala! Pregledat ćemo tvoju ideju.</h2><p>Za tortu po želji konačnu cijenu određujemo nakon pregleda svih detalja.</p></section>
  }

  return (
    <section className="custom section">
      <div>
        <p className="eyebrow">TVOJA IDEJA</p>
        <h2>Torta po želji</h2>
        <p>Pošalji nam detalje torte koju želiš. Upit pregledavamo ručno, a konačnu cijenu potvrđujemo prije izrade.</p>
      </div>
      <form className="order-form" onSubmit={submit}>
        <input required placeholder="Ime i prezime *" />
        <input required type="email" placeholder="E-mail *" />
        <input required type="tel" placeholder="Telefon *" />
        <input required type="number" min="1" placeholder="Broj osoba *" />
        <input required type="text" placeholder="Okus / vrsta kreme *" />
        <input type="text" placeholder="Željeni ukras" />
        <input type="text" placeholder="Tekst na torti" />
        <input required type="date" />
        <input type="url" placeholder="Poveznica na fotografiju / primjer" />
        <textarea required placeholder="Opiši tortu, dekoraciju i ostale želje *" />
        <textarea placeholder="Dodatna napomena" />
        <div className="cash">Napomena: cijenu torte po želji potvrđujemo nakon pregleda upita.</div>
        <button className="button primary" type="submit">Pošalji upit</button>
      </form>
    </section>
  )
}
