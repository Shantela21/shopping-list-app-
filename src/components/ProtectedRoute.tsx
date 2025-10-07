import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../reduxHooks'

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector((s) => s.register.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

// For pages like login/register: if already authed, redirect away
export function PublicOnlyRoute() {
  const isAuthenticated = useAppSelector((s) => s.register.isAuthenticated)
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />
}
