import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Header() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      try {
        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(res.data)
      } catch (err) {
        localStorage.removeItem('token')
      }
    }
    fetchUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <header className="w-full bg-green-700 text-white px-4 py-2 flex justify-between items-center shadow">
      <div className="font-bold text-lg cursor-pointer" onClick={() => navigate('/')}>Lernbaum</div>

      <div className="flex items-center space-x-4">
        {user && (user.role === 'admin' || user.role === 'moderator') && (
          <button onClick={() => navigate('/admin')} className="bg-white text-green-700 px-3 py-1 rounded shadow">
            Verwaltung
          </button>
        )}
        {user && <span className="text-sm">Eingeloggt als: <strong>{user.username}</strong></span>}
        {user ? (
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Abmelden</button>
        ) : (
          <button onClick={() => navigate('/login')} className="bg-white text-green-700 px-3 py-1 rounded">Anmelden</button>
        )}
      </div>
    </header>
  )
}