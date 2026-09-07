import { useEffect, useState } from 'react'
import { createCategory, createProduct, deleteCategory, deleteProduct, getCategories, getProducts, updateCategory, updateProduct } from '../services/catalogApi'

const emptyProduct = { name: '', slug: '', category: 'Torte', description: '', price: '', people: '', imageUrl: '', options: '', active: true }
const emptyCategory = { name: '', slug: '', description: '', active: true }

const slugify = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const money = (value) => `${Number(value || 0).toFixed(2).replace('.', ',')} €`

export default function AdminCatalogPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [product, setProduct] = useState(emptyProduct)
  const [category, setCategory] = useState(emptyCategory)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [tab, setTab] = useState('products')
  const [error, setError] = useState('')

  async function load() {
    try { setError(''); setProducts(await getProducts(true)); setCategories(await getCategories(true)) }
    catch (e) { setError(e.message) }
  }
  useEffect(() => { load() }, [])

  async function saveProduct(e) {
    e.preventDefault()
    try {
      const payload = { ...product, price: Number(product.price), slug: product.slug || slugify(product.name), options: product.options ? product.options.split(',').map(x => x.trim()).filter(Boolean) : [] }
      if (editingProduct) await updateProduct(editingProduct._id, payload)
      else await createProduct(payload)
      setProduct(emptyProduct); setEditingProduct(null); await load()
    } catch (e) { setError(e.message) }
  }

  async function saveCategory(e) {
    e.preventDefault()
    try {
      const payload = { ...category, slug: category.slug || slugify(category.name) }
      if (editingCategory) await updateCategory(editingCategory._id, payload)
      else await createCategory(payload)
      setCategory(emptyCategory); setEditingCategory(null); await load()
    } catch (e) { setError(e.message) }
  }

  async function removeProduct(id) { if (window.confirm('Sakriti ovaj proizvod iz ponude?')) { await deleteProduct(id); await load() } }
  async function removeCategory(id) { if (window.confirm('Sakriti ovu kategoriju?')) { await deleteCategory(id); await load() } }

  return <main className="admin-page section">
    <div className="section-heading"><div><p className="eyebrow">ADMIN</p><h1>Proizvodi i kategorije</h1><p className="muted">Ovdje upravljaš ponudom koja se prikazuje kupcima.</p></div><button className="button secondary" onClick={load}>Osvježi</button></div>
    {error && <div className="form-error">{error}</div>}
    <div className="admin-tabs"><button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Proizvodi ({products.length})</button><button className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')}>Kategorije ({categories.length})</button></div>

    {tab === 'products' ? <div className="catalog-admin-grid">
      <form className="admin-form card" onSubmit={saveProduct}><h2>{editingProduct ? 'Uredi proizvod' : 'Novi proizvod'}</h2>
        <label>Naziv<input value={product.name} required onChange={e => setProduct({ ...product, name: e.target.value })} /></label>
        <label>Kategorija<select value={product.category} onChange={e => setProduct({ ...product, category: e.target.value })}>{categories.filter(c => c.active).map(c => <option key={c._id} value={c.name}>{c.name}</option>)}</select></label>
        <label>Cijena (€)<input type="number" min="0" step="0.01" required value={product.price} onChange={e => setProduct({ ...product, price: e.target.value })} /></label>
        <label>Za koliko osoba<input value={product.people} placeholder="npr. 10–12 osoba" onChange={e => setProduct({ ...product, people: e.target.value })} /></label>
        <label>Opis<textarea value={product.description} onChange={e => setProduct({ ...product, description: e.target.value })} /></label>
        <label>URL slike<input value={product.imageUrl} placeholder="https://..." onChange={e => setProduct({ ...product, imageUrl: e.target.value })} /></label>
        <label>Opcije, odvojene zarezom<input value={product.options} placeholder="okus, veličina, dekoracija" onChange={e => setProduct({ ...product, options: e.target.value })} /></label>
        <label className="checkbox"><input type="checkbox" checked={product.active} onChange={e => setProduct({ ...product, active: e.target.checked })} /> Prikazuj u ponudi</label>
        <div className="form-actions"><button className="button" type="submit">{editingProduct ? 'Spremi izmjene' : 'Dodaj proizvod'}</button>{editingProduct && <button type="button" className="button secondary" onClick={() => { setEditingProduct(null); setProduct(emptyProduct) }}>Odustani</button>}</div>
      </form>
      <div className="catalog-list">{products.map(p => <article className={`catalog-row ${!p.active ? 'inactive' : ''}`} key={p._id}><div className="catalog-image" style={p.imageUrl ? { backgroundImage: `url(${p.imageUrl})` } : {}}></div><div className="catalog-info"><strong>{p.name}</strong><span>{p.category} · {money(p.price)}</span><small>{p.people || 'Veličina po dogovoru'}</small></div><div className="row-actions"><button onClick={() => { setEditingProduct(p); setProduct({ ...p, options: (p.options || []).join(', ') }) }}>Uredi</button>{p.active && <button onClick={() => removeProduct(p._id)}>Sakrij</button>}</div></article>)}</div>
    </div> : <div className="catalog-admin-grid">
      <form className="admin-form card" onSubmit={saveCategory}><h2>{editingCategory ? 'Uredi kategoriju' : 'Nova kategorija'}</h2><label>Naziv<input required value={category.name} onChange={e => setCategory({ ...category, name: e.target.value })} /></label><label>Opis<textarea value={category.description} onChange={e => setCategory({ ...category, description: e.target.value })} /></label><label className="checkbox"><input type="checkbox" checked={category.active} onChange={e => setCategory({ ...category, active: e.target.checked })} /> Aktivna kategorija</label><div className="form-actions"><button className="button">{editingCategory ? 'Spremi izmjene' : 'Dodaj kategoriju'}</button>{editingCategory && <button type="button" className="button secondary" onClick={() => { setEditingCategory(null); setCategory(emptyCategory) }}>Odustani</button>}</div></form>
      <div className="catalog-list">{categories.map(c => <article className={`catalog-row category-row ${!c.active ? 'inactive' : ''}`} key={c._id}><div className="category-icon">✦</div><div className="catalog-info"><strong>{c.name}</strong><span>{c.slug}</span><small>{c.description || 'Bez opisa'}</small></div><div className="row-actions"><button onClick={() => { setEditingCategory(c); setCategory(c) }}>Uredi</button>{c.active && <button onClick={() => removeCategory(c._id)}>Sakrij</button>}</div></article>)}</div>
    </div>}
  </main>
}
