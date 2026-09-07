export default function ProductCard({ product, onAdd }) {
  return (
    <article className="product">
      <div className="product-image"><span>ArtKolač</span></div>
      <div className="product-body">
        <small>{product.category}</small>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-bottom">
          <strong>{product.price.toFixed(2).replace('.', ',')} €</strong>
          <button onClick={() => onAdd(product)}>Dodaj</button>
        </div>
      </div>
    </article>
  )
}
