import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function BranchForm() {
  const [formData, setFormData] = useState({
    name: '',
    axisX: 0,
    axisY: 0,
    parentId: null,
  })

  const [branches, setBranches] = useState([])

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
      if (name === 'parentId') {
        return {
          ...prev,
          parentId: value === '' ? null : Number(value),
        }
      }

      if (['axisX', 'axisY'].includes(name)) {
        return {
          ...prev,
          [name]: Number(value),
        }
      }

      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await api.post('/branches', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Ast erfolgreich erstellt!')
      setFormData({ name: '', axisX: 0, axisY: 0, parentId: null })
      fetchBranches() // optional: aktualisiere Liste
    } catch (err) {
      console.error('Fehler beim Erstellen des Astes:', err)
      alert('Fehler beim Speichern des Asts.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow max-w-xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4">Neuen Ast / Thema erstellen</h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name des Asts"
        className="w-full p-2 border rounded mb-3"
        required
      />

      <label className="block mb-1">Übergeordneter Ast (optional)</label>
      <select
        name="parentId"
        value={formData.parentId ?? ''}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="">-- Kein übergeordneter Ast --</option>
        {branches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <label className="block mb-1">Koordinativ ↔ Konditionell (X)</label>
      <input
        type="range"
        name="axisX"
        min={-100}
        max={100}
        value={formData.axisX}
        onChange={handleChange}
        className="w-full mb-4"
      />

      <label className="block mb-1">Allgemein ↔ Speziell (Y)</label>
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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ast speichern
      </button>
    </form>
  )
}
