import TreeCanvas from '../components/TreeCanvas'
import { useState } from 'react'

export default function Dashboard() {
  const [selectedExercise, setSelectedExercise] = useState(null)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex justify-between items-center bg-green-900 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">🌳 Übungsbaum</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Eingeloggt als: <strong>admin@example.com</strong></span>
          <button className="bg-white text-green-900 px-3 py-1 rounded shadow hover:bg-gray-100 text-sm">
            Bearbeitungsansicht
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">Logout</button>
        </div>
      </header>

      {/* Hauptinhalt */}
      <div className="flex flex-1 overflow-hidden">
        {/* Linke Seite: TreeCanvas */}
        <div className="w-2/3 h-full overflow-auto border-r">
          <TreeCanvas setSelectedExercise={setSelectedExercise} />
        </div>

        {/* Rechte Seite: Übungsbeschreibung */}
        <div className="w-1/3 h-full p-4 overflow-auto">
          {selectedExercise ? (
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-semibold mb-2">{selectedExercise.name}</h2>
              <p className="text-sm text-gray-700 mb-4">{selectedExercise.description}</p>
              {selectedExercise.videoUrl && (
                <iframe
                  src={selectedExercise.videoUrl}
                  title="Video"
                  className="w-full aspect-video rounded border"
                  allowFullScreen
                />
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">Wähle ein Blatt im Baum aus, um Details zu sehen.</p>
          )}
        </div>
      </div>
    </div>
  )
}
