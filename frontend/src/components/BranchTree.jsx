import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function BranchTree() {
  const [branches, setBranches] = useState([])

  useEffect(() => {
    const fetchBranches = async () => {
      const token = localStorage.getItem('token')
      const res = await api.get('/branches', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBranches(res.data)
    }

    fetchBranches()
  }, [])

  const buildTree = (branches, parentId = null) => {
    return branches
      .filter((b) => b.parentId === parentId)
      .map((b) => ({
        ...b,
        children: buildTree(branches, b.id),
      }))
  }

  const renderTree = (nodes, level = 0) => {
    return (
      <ul className={`pl-${level * 4}`}>
        {nodes.map((node) => (
          <li key={node.id} className="mb-1">
            <span className="font-medium text-blue-800 hover:underline cursor-pointer">
              {node.name}
            </span>
            {node.children.length > 0 && renderTree(node.children, level + 1)}
          </li>
        ))}
      </ul>
    )
  }

  const tree = buildTree(branches)

  return (
    <div className="p-4 bg-white shadow rounded max-w-xl mx-auto my-6">
      <h2 className="text-xl font-bold mb-4">Branch-Struktur (Themenbaum)</h2>
      {tree.length === 0 ? <p>Keine Branches gefunden.</p> : renderTree(tree)}
    </div>
  )
}
