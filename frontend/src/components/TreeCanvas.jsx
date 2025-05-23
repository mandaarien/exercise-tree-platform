import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function TreeCanvas({ setSelectedExercise }) {
  const [branches, setBranches] = useState([])
  const [exercises, setExercises] = useState([])
  const [hoveredId, setHoveredId] = useState(null)
  const [seasonMode, setSeasonMode] = useState('auto')

  const leafShapes = {
    spring: "M10,0 C15,10 15,30 0,40 C-15,30 -15,10 -10,0 Z",
    summer: "M0,0 C20,10 20,30 0,40 C-20,30 -20,10 0,0 Z",
    fall: "M0,0 C10,20 30,20 10,40 C-10,20 -30,20 -10,0 Z",
    winter: "M0,0 C8,8 8,32 0,40 C-8,32 -8,8 0,0 Z"
  }

  const branchShape = "M-10,0 Q0,-10 10,0 Q0,10 -10,0 Z"
  const rootShape = "M0,0 C-20,30 20,30 0,60"

  const getSeason = () => {
    if (seasonMode === 'on') return 'summer'
    if (seasonMode === 'off') return 'neutral'
    const month = new Date().getMonth()
    if ([2, 3, 4].includes(month)) return 'spring'
    if ([5, 6, 7].includes(month)) return 'summer'
    if ([8, 9, 10].includes(month)) return 'fall'
    return 'winter'
  }

  const activeShape = leafShapes[getSeason()] || leafShapes.summer
  const activeColor = {
    spring: '#7CFC00',
    summer: 'green',
    fall: 'orange',
    winter: '#b0c4de',
    neutral: 'gray'
  }[getSeason()] || 'green'

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      const [brs, exs] = await Promise.all([
        api.get('/branches', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/exercises', { headers: { Authorization: `Bearer ${token}` } }),
      ])
      setBranches(brs.data)
      setExercises(exs.data)
    }
    fetchData()
  }, [])

  const canvasWidth = 1000
  const canvasHeight = 1000
  const origin = { x: canvasWidth / 2, y: canvasHeight - 100 }

  const getBranchPosition = (branch) => {
    return {
      x: origin.x + branch.axisX * 2.5,
      y: origin.y - branch.axisY * 2.5
    }
  }

  const getLeafPosition = (exercise, branchPos) => {
    return {
      x: branchPos.x + exercise.axisX,
      y: branchPos.y - exercise.axisY
    }
  }

  return (
    <div className="relative w-full h-[1000px] overflow-hidden">
      <div className="absolute top-2 left-2 z-10">
        <select
          className="text-sm border rounded p-1 bg-white"
          value={seasonMode}
          onChange={e => setSeasonMode(e.target.value)}
        >
          <option value="on">Jahreszeiten: An</option>
          <option value="off">Jahreszeiten: Aus</option>
          <option value="auto">Jahreszeit: Automatisch</option>
        </select>
      </div>
      <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} className="absolute top-0 left-0 w-full h-full">
                

        {/* Verbindungen zwischen Branches */}
        {branches.map(br => {
          const parent = branches.find(p => p.id === br.parentId)
          if (!parent) return null
          const from = getBranchPosition(parent)
          const to = getBranchPosition(br)
          return <line key={`line-${br.id}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="saddlebrown" strokeWidth={2} />
        })}

        {/* Verbindungen zu Übungen */}
        {exercises.map(ex => {
          const br = branches.find(b => b.id === ex.branchId)
          if (!br) return null
          const from = getBranchPosition(br)
          const to = getLeafPosition(ex, from)
          return <line key={`link-${ex.id}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="lightgreen" strokeDasharray="3 2" strokeWidth={1} />
        })}

        {/* Branch-Knoten */}
        {branches.map((br) => {
          const pos = getBranchPosition(br)
          return (
            <g
              key={`b-${br.id}`}
              transform={`translate(${pos.x}, ${pos.y})`}
              onMouseEnter={() => setHoveredId(br.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ transition: 'transform 0.3s ease' }}
            >
              <title>{br.name}</title>
              <path d={branchShape} fill="brown" stroke="black" strokeWidth={1} />
              <text x="0" y="-12" textAnchor="middle" className="text-[10px] fill-black">{br.name}</text>
            </g>
          )
        })}

        {/* Blatt-Knoten */}
        {exercises.map((ex, i) => {
          const br = branches.find(b => b.id === ex.branchId)
          if (!br) return null
          const branchPos = getBranchPosition(br)
          const pos = getLeafPosition(ex, branchPos)
          return (
            <g
              key={`e-${ex.id}`}
              transform={`translate(${pos.x}, ${pos.y})`}
              onMouseEnter={() => setHoveredId(ex.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedExercise(ex)}
              style={{ transition: 'transform 0.3s ease' }}
            >
              <title>{ex.name}</title>
              <path d={activeShape} fill={activeColor} stroke="darkgreen" strokeWidth={1} />
              {hoveredId === ex.id && (
                <text x="0" y="-10" textAnchor="middle" className="text-[10px] fill-black">{ex.name}</text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
