import { NavLink, useNavigate } from 'react-router-dom'
import { useTeam } from '../context/TeamContext'

const NAV = [
  { to: '/',       label: 'Groups', end: true },
  { to: '/squads', label: 'Squads' },
]

export default function Layout({ children }) {
  const { selectedTeam, clearTeam } = useTeam()
  const navigate = useNavigate()

  function handlePillClick() {
    clearTeam()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1100px] mx-auto px-6 flex items-center h-14 gap-2">
          {/* Logo */}
          <span
            className="font-bold text-[#1e3a8a] text-[17px] tracking-tight mr-3 cursor-pointer"
            style={{ fontFamily: 'Georgia, serif' }}
            onClick={handlePillClick}
          >
            WC<span className="text-[#dc2626]">·</span>26
          </span>

          {/* Nav links */}
          <nav className="flex gap-0.5">
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `text-[13px] font-medium px-2.5 py-1.5 rounded-md border transition-colors ${
                    isActive
                      ? 'bg-[#eff6ff] text-[#1e3a8a] font-semibold border-[#bfdbfe]'
                      : 'text-[#64748b] border-transparent hover:bg-[#f8fafc] hover:text-[#0f172a]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Team pill */}
          <div className="ml-auto">
            <button
              onClick={handlePillClick}
              title={selectedTeam ? 'Back to all groups' : 'Select a team from the groups page'}
              className={`flex items-center gap-2 text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-all ${
                selectedTeam
                  ? 'bg-[#eff6ff] border-[#bfdbfe] text-[#1e3a8a] hover:border-[#1e3a8a]'
                  : 'bg-[#f8fafc] border-[#e2e8f0] text-[#475569] hover:border-[#cbd5e1]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${selectedTeam ? 'bg-green-500' : 'bg-[#94a3b8]'}`}
              />
              {selectedTeam ? `${selectedTeam.flag} ${selectedTeam.name}` : 'Select a team'}
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}
