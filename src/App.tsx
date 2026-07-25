import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home'
import Projects from '@/pages/Projects'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function App() {
  return (
    <HashRouter>
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  )
}
