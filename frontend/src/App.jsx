import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import OrderPage from './pages/OrderPage'
import CustomOrderPage from './pages/CustomOrderPage'
import AboutContactPage from './pages/AboutContactPage'
import AdminPage from './pages/AdminPage'
import AdminCatalogPage from './pages/AdminCatalogPage'
import AdminCalendarPage from './pages/AdminCalendarPage'
import AdminSettingsPage from './pages/AdminSettingsPage'
import AdminCustomOrdersPage from './pages/AdminCustomOrdersPage'
import { products } from './data/products'
import { useCart } from './hooks/useCart'

function App() {
  const cartState = useCart()
  return <div className="app">
    <Header itemCount={cartState.itemCount} />
    <Routes>
      <Route path="/" element={<HomePage products={products} onAdd={cartState.addToCart} />} />
      <Route path="/ponuda" element={<HomePage products={products} onAdd={cartState.addToCart} />} />
      <Route path="/torta-po-zelji" element={<CustomOrderPage />} />
      <Route path="/narudzba" element={<OrderPage cart={cartState.cart} subtotal={cartState.subtotal} onRemove={cartState.removeFromCart} onQuantityChange={cartState.changeQuantity} onClear={cartState.clearCart} />} />
      <Route path="/o-nama" element={<AboutContactPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/ponuda" element={<AdminCatalogPage />} />
      <Route path="/admin/kalendar" element={<AdminCalendarPage />} />
      <Route path="/admin/postavke" element={<AdminSettingsPage />} />
      <Route path="/admin/torte-po-zelji" element={<AdminCustomOrdersPage />} />
      <Route path="*" element={<HomePage products={products} onAdd={cartState.addToCart} />} />
    </Routes>
    <Footer />
  </div>
}

export default App
