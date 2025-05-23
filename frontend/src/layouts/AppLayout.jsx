import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}
