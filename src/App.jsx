import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TeamProvider } from './context/TeamContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import WCSquads from './pages/WCSquads'
import './index.css'

export default function App() {
  return (
    <BrowserRouter basename="/wc2026-demo">
      <TeamProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/squads" element={<WCSquads />} />
          </Routes>
        </Layout>
      </TeamProvider>
    </BrowserRouter>
  )
}
