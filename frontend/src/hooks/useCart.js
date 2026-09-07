import { useMemo, useState } from 'react'

export function useCart() {
  const [cart, setCart] = useState([])

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...current, { ...product, quantity: 1 }]
    })
  }

  function removeFromCart(productId) {
    setCart((current) => current.filter((item) => item.id !== productId))
  }

  function changeQuantity(productId, quantity) {
    if (quantity < 1) return removeFromCart(productId)
    setCart((current) => current.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    ))
  }

  function clearCart() {
    setCart([])
  }

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  )

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  )

  return { cart, addToCart, removeFromCart, changeQuantity, clearCart, itemCount, subtotal }
}
