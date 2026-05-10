

import { Routes, Route, Navigate } from 'react-router-dom'
import { Requester } from './pages/Requester'
import { Validator } from './pages/Validator'
import { AppNavigation } from './components/AppNavigation'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<AppNavigation />}>
        <Route path="/requester" element={<Requester />} />
        <Route path="/validator" element={<Validator />} />
        <Route path="/" element={<Navigate to="/requester" />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
