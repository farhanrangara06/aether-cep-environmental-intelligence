import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import { AppLayout } from './components/Layout'
import { Landing } from './pages/Landing'
import { Overview } from './pages/Overview'
import { MapView } from './pages/MapView'
import { Analytics } from './pages/Analytics'
import { Sensors } from './pages/Sensors'
import { Alerts } from './pages/Alerts'
import { Reports } from './pages/Reports'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/app"
          element={
            <DataProvider>
              <AppLayout />
            </DataProvider>
          }
        >
          <Route index element={<Overview />} />
          <Route path="map" element={<MapView />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="sensors" element={<Sensors />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
