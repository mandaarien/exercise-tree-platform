import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function ExerciseBranchAdmin() {
  const [branches, setBranches] = useState([])
  const [exercises, setExercises] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [modalItem, setModalItem] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', axisX: 0, axisY: 0, parentId: null, branchId: null })

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    const [brs, exs] = await Promise.all([
      api.get('/branches', { headers: { Authorization: `Bearer ${token}` } }),
      api.get('/exercises', { headers: { Authorization: `Bearer ${token}` } })
    ])
    setBranches(brs.data)
    setExercises(exs.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openModal = (type, item = null) => {
    setModalType(type)
    setModalItem(item)
    setFormData(item || { name: '', description: '', axisX: 0, axisY: 0, parentId: null, branchId: null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const headers = { headers: { Authorization: `Bearer ${token}` } }

    if (modalItem) {
      await api.put(`/${modalType === 'Ast' ? 'branches' : 'exercises'}/${modalItem.id}`, formData, headers)
    } else {
      await api.post(`/${modalType === 'Ast' ? 'branches' : 'exercises'}`, formData, headers)
    }
    setModalItem(null)
    setModalType(null)
    fetchData()
  }

  const handleDelete = async () => {
    const token = localStorage.getItem('token')
    const headers = { headers: { Authorization: `Bearer ${token}` } }
    await api.delete(`/${confirmDelete.type === 'Ast' ? 'branches' : 'exercises'}/${confirmDelete.id}`, headers)
    setConfirmDelete(null)
    fetchData()
  }

  const filteredBranches = branches
    .filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]))

  const filteredExercises = exercises
    .filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]))

  const getBranchName = (id) => branches.find(b => b.id === id)?.name || '-'

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Suche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-2 py-1 w-1/3"
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-2 py-1">
          <option value="name">Sortieren nach: Name</option>
          <option value="id">Sortieren nach: ID</option>
        </select>
        <div className="space-x-2">
          <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={() => openModal('Ast')}>+ Ast</button>
          <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={() => openModal('Übung')}>+ Übung</button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Äste</h2>
        <ul className="space-y-1">
          {filteredBranches.map(branch => (
            <li key={branch.id} className="border rounded px-2 py-1 flex justify-between items-center">
              <span>{branch.name} {branch.parentId ? `(Teil von ${getBranchName(branch.parentId)})` : ''}</span>
              <div className="space-x-2">
                <button className="text-blue-600" onClick={() => openModal('Ast', branch)}>Bearbeiten</button>
                <button className="text-red-600" onClick={() => setConfirmDelete({ type: 'Ast', id: branch.id })}>Löschen</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Übungen</h2>
        <ul className="space-y-1">
          {filteredExercises.map(ex => (
            <li key={ex.id} className="border rounded px-2 py-1 flex justify-between items-center">
              <span>{ex.name} (Ast: {getBranchName(ex.branchId)})</span>
              <div className="space-x-2">
                <button className="text-blue-600" onClick={() => openModal('Übung', ex)}>Bearbeiten</button>
                <button className="text-red-600" onClick={() => setConfirmDelete({ type: 'Übung', id: ex.id })}>Löschen</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {modalType && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white border p-4 rounded shadow w-[320px] z-50">
          <h3 className="font-bold mb-2">{modalItem ? 'Bearbeiten' : 'Neu'} {modalType}</h3>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input type="text" className="w-full border p-1 rounded" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            <textarea className="w-full border p-1 rounded" placeholder="Beschreibung" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            {modalType === 'Ast' && (
              <select className="w-full border p-1 rounded" value={formData.parentId || ''} onChange={e => setFormData({ ...formData, parentId: e.target.value || null })}>
                <option value="">Kein übergeordneter Ast</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            )}
            {modalType === 'Übung' && (
              <>
                <select className="w-full border p-1 rounded" value={formData.branchId || ''} onChange={e => setFormData({ ...formData, branchId: parseInt(e.target.value) })}>
                  <option value="">Wähle Ast</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <div className="flex gap-2">
                  <input type="number" placeholder="Achse X" className="w-1/2 border p-1 rounded" value={formData.axisX} onChange={e => setFormData({ ...formData, axisX: parseInt(e.target.value) })} />
                  <input type="number" placeholder="Achse Y" className="w-1/2 border p-1 rounded" value={formData.axisY} onChange={e => setFormData({ ...formData, axisY: parseInt(e.target.value) })} />
                </div>
              </>
            )}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setModalItem(null); setModalType(null) }} className="px-2 py-1 border rounded">Abbrechen</button>
              <button type="submit" className="px-2 py-1 bg-green-600 text-white rounded">Speichern</button>
            </div>
          </form>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 bg-white border p-4 rounded shadow w-[300px] z-50">
          <p className="mb-3">Möchtest du dieses Element wirklich löschen?</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 border rounded">Abbrechen</button>
            <button onClick={handleDelete} className="px-2 py-1 bg-red-600 text-white rounded">Löschen</button>
          </div>
        </div>
      )}
    </div>
  )
}
