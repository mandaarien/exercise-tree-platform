import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function BranchModal({ branch, allBranches, onClose, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ ...branch })
  const [deleteWarning, setDeleteWarning] = useState(null)

  if (!branch) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ['axisX', 'axisY', 'parentId'].includes(name)
        ? value === '' ? null : Number(value)
        : value,
    }))
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      await api.put(`/branches/${branch.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Ast aktualisiert ✅')
      setIsEditing(false)
      onUpdated()
    } catch (err) {
      console.error('Fehler beim Bearbeiten:', err)
      alert('Fehler beim Speichern des Branches.')
    }
  }

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      await api.delete(`/branches/${branch.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Ast gelöscht ✅')
      onClose()
      onUpdated()
    } catch (err) {
      if (err.response?.status === 400) {
        // Übungen sind verknüpft → Warnung mit Namen
        setDeleteWarning(err.response.data)
      } else {
        alert('Fehler beim Löschen des Branches.')
      }
    }
  }

  const handleForceDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      await api.delete(`/branches/${branch.id}/force-delete`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Ast + alle zugehörigen Übungen gelöscht ❌')
      setDeleteWarning(null)
      onClose()
      onUpdated()
    } catch (err) {
      console.error('Fehler beim Force-Delete:', err)
      alert('Löschen fehlgeschlagen.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full relative z-50">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-lg"
        >
          ×
        </button>

        {isEditing ? (
          <div>
            <h2 className="text-lg font-bold mb-4">Ast bearbeiten</h2>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
              placeholder="Name"
            />

            <label className="block text-sm mb-1">Übergeordneter Ast</label>
            <select
              name="parentId"
              value={formData.parentId ?? ''}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">-- kein übergeordneter Ast --</option>
              {allBranches
                .filter((b) => b.id !== branch.id)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
            </select>

            <label className="block mb-1 text-sm">X-Achse (Koordinativ ↔ Konditionell)</label>
            <input
              type="range"
              name="axisX"
              min={-100}
              max={100}
              value={formData.axisX}
              onChange={handleChange}
              className="w-full mb-4"
            />

            <label className="block mb-1 text-sm">Y-Achse (Allgemein ↔ Speziell)</label>
            <input
              type="range"
              name="axisY"
              min={-100}
              max={100}
              value={formData.axisY}
              onChange={handleChange}
              className="w-full mb-4"
            />

            <div className="flex justify-between">
              <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
                Speichern
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-600 hover:text-black"
              >
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-2">{branch.name}</h2>
            <p className="text-sm text-gray-500 mb-4">
              Achsen: X={branch.axisX}, Y={branch.axisY}
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-400 text-black px-4 py-2 rounded"
              >
                ✏️ Bearbeiten
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                🗑️ Löschen
              </button>
            </div>
          </div>
        )}

        {deleteWarning && (
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded text-sm">
            <p className="text-yellow-800 font-medium mb-2">
              ⚠ Dieser Ast ist mit {deleteWarning.exerciseCount} Übung(en) verknüpft:
            </p>
            <ul className="mb-3 text-yellow-700 list-disc pl-5">
              {deleteWarning.exerciseNames.map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
            <button
              onClick={handleForceDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              ❌ Ast & verknüpfte Übungen trotzdem löschen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
