export const siteConfig = {
  name: 'ArtKolač',
  tagline: 'Domaće. Svježe. Po tvojoj želji.',
  payment: 'Pouzećem / gotovinom pri preuzimanju',
  deliveryZones: [
    { label: 'Do 5 km', price: 3 },
    { label: '5–10 km', price: 5 },
    { label: '10–20 km', price: 8 },
    { label: '20–30 km', price: 12 },
    { label: '30–40 km', price: 15 },
    { label: '40–50 km', price: 20 },
    { label: 'Preko 50 km', price: null, note: 'Po dogovoru' }
  ]
}

export const categories = [
  { id: 'torte', name: 'Torte' },
  { id: 'kolaci', name: 'Kolači' },
  { id: 'sitni-kolaci', name: 'Sitni kolači' },
  { id: 'posebne-prigode', name: 'Posebne prigode' }
]
