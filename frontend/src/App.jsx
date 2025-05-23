import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import ExerciseBranchAdmin from './pages/ExerciseBranchAdmin'
import Login from './pages/Login'
import Register from './pages/Register'
import { useEffect, useState } from 'react'
import api from './api/axios'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return setLoading(false)
      try {
        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(res.data)
      } catch (err) {
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  if (loading) return <div className="p-6 text-center">Lade...</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route element={<AppLayout />}>
          <Route path='/' element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route
            path='/admin'
            element={user && (user.role === 'admin' || user.role === 'moderator')
              ? <ExerciseBranchAdmin />
              : <Navigate to="/" />}
          />
        </Route>

        <Route path='*' element={<Navigate to={user ? '/' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  )
}