import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import GalleryPage from './pages/GalleryPage'

function App() {
  const location = useLocation()
  const isDetailPage = location.pathname.startsWith('/meal/')

  return (
    <div className="app">
      {!isDetailPage && <Header />}

      <Routes>
        <Route path="/" element={<Navigate to="/list" replace />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/meal/:id" element={<DetailPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </div>
  )
}

export default App