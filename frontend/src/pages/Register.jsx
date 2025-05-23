import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', { email, username, password })
      setMessage('Registrierung erfolgreich. Bitte E-Mail bestätigen.')
      setError('')
    } catch (err) {
      setError('Registrierung fehlgeschlagen.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Registrierung</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Benutzername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-2 py-1 rounded"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-1 rounded">Registrieren</button>
        </form>
        <p className="mt-3 text-sm">Bereits registriert? <span onClick={() => navigate('/login')} className="text-blue-600 cursor-pointer">Einloggen</span></p>
      </div>
    </div>
  )
}

<p className="mt-3 text-sm">
  Bereits registriert? <span onClick={() => navigate('/login')} className="text-blue-600 cursor-pointer">Einloggen</span>
</p>
