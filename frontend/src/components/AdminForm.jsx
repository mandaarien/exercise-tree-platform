import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function AdminForm() {
  const [branches, setBranches] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    videoUrl: '',
    axisX: 0,
    axisY: 0,
    branchId: '',
  })

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await api.get('/branches', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBranches(res.data)
    } catch (err) {
      console.error('Fehler beim Laden der Branches:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => {
      if (name === 'branchId') {
        return { ...prev, branchId: value === '' ? '' : Number(value) }
      }

      if (['axisX', 'axisY'].includes(name)) {
        return { ...prev, [name]: Number(value) }
      }

      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.branchId === '') {
      alert('Bitte einen Ast (Branch) auswählen.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await api.post('/exercises', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert('Übung erfolgreich erstellt!')
      setFormData({
        name: '',
        description: '',
        videoUrl: '',
        axisX: 0,
        axisY: 0,
        branchId: '',
      })
    } catch (err) {
      console.error('Fehler beim Erstellen der Übung:', err)
      alert('Fehler beim Speichern der Übung.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow max-w-xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4">Neue Übung erstellen</h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name der Übung"
        className="w-full p-2 border rounded mb-3"
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Beschreibung"
        className="w-full p-2 border rounded mb-3"
        rows={3}
        required
      />

      <input
        name="videoUrl"
        value={formData.videoUrl}
        onChange={handleChange}
        placeholder="Video-URL (optional)"
        className="w-full p-2 border rounded mb-3"
      />

      <label className="block mb-1">Übergeordneter Ast</label>
      <select
        name="branchId"
        value={formData.branchId}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
        required
      >
        <option value="">-- Bitte wählen --</option>
        {branches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <label className="block mb-1">Koordinativ ↔ Konditionell (X-Achse)</label>
      <input
        type="range"
        name="axisX"
        min={-100}
        max={100}
        value={formData.axisX}
        onChange={handleChange}
        className="w-full mb-4"
      />

      <label className="block mb-1">Allgemein ↔ Speziell (Y-Achse)</label>
      <input
        type="range"
        name="axisY"
        min={-100}
        max={100}
        value={formData.axisY}
        onChange={handleChange}
        className="w-full mb-4"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Übung speichern
      </button>
    </form>
  )
}
