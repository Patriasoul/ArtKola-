import { useState } from 'react'
import { categories } from '../../data/site'
import ProductCard from './ProductCard'

export default function ProductGrid({ products, onAdd }) {
  const [category, setCategory] = useState('Sve')
  const visibleProducts = category === 'Sve'
    ? products
    : products.filter((product) => product.category === category)

  return (
    <>
      <div className="filters">
        {['Sve', ...categories.map((item) => item.name)].map((item) => (
          <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="products">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={onAdd} />
        ))}
      </div>
    </>
  )
}
