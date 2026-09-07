import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAdminLoggedIn } from '../../services/adminAuth'

export default function ProtectedAdminRoute() {
  const location = useLocation()
  if (!isAdminLoggedIn()) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}
