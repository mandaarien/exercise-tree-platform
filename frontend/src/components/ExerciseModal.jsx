import { useState } from 'react'
import api from '../api/axios'

export default function ExerciseModal({ exercise, onClose, onUpdated }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ ...exercise })

  if (!exercise) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ['axisX', 'axisY'].includes(name) ? Number(value) : value,
    }))
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      await api.put(`/exercises/${exercise.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Übung gespeichert ✅')
      setIsEditing(false)
      onUpdated() // aktualisiert Baum
    } catch (err) {
      console.error('Fehler beim Speichern:', err)
      alert('Fehler beim Speichern.')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Diese Übung wirklich löschen?')) return
    try {
      const token = localStorage.getItem('token')
      await api.delete(`/exercises/${exercise.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Übung gelöscht ❌')
      onClose()
      onUpdated()
    } catch (err) {
      console.error('Fehler beim Löschen:', err)
      alert('Fehler beim Löschen.')
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
            <h2 className="text-lg font-bold mb-2">Übung bearbeiten</h2>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-2"
              placeholder="Name"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-2"
              rows={3}
              placeholder="Beschreibung"
            />

            <input
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
              placeholder="Video-URL"
            />

            <label className="block text-sm mb-1">Koordinativ ↔ Konditionell (X)</label>
            <input
              type="range"
              name="axisX"
              min={-100}
              max={100}
              value={formData.axisX}
              onChange={handleChange}
              className="w-full mb-4"
            />

            <label className="block text-sm mb-1">Allgemein ↔ Speziell (Y)</label>
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
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
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
            <h2 className="text-xl font-bold mb-2">{exercise.name}</h2>
            <p className="mb-4 text-sm text-gray-700">{exercise.description}</p>

            {exercise.videoUrl && (
              <iframe
                src={exercise.videoUrl}
                title={exercise.name}
                allowFullScreen
                className="w-full h-64 rounded border mb-4"
              />
            )}

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
      </div>
    </div>
  )
}
