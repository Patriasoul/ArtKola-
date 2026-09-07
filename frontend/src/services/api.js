export async function createOrder(order) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Narudžbu nije moguće poslati.')
  return data
}
