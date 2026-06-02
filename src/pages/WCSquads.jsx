import { useState, useEffect } from 'react'
import { api } from '../api'

const POSITION_ORDER = { GK: 0, DF: 1, MF: 2, FW: 3 }
const POSITION_COLORS = {
  GK: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  DF: 'bg-blue-900/50 text-blue-300 border-blue-700',
  MF: 'bg-green-900/50 text-green-300 border-green-700',
  FW: 'bg-red-900/50 text-red-300 border-red-700',
}

function posKey(pos) {
  if (!pos) return ''
  const p = pos.toUpperCase()
  if (p.includes('GK') || p === 'G') return 'GK'
  if (p.includes('DF') || p === 'D' || p === 'CB' || p === 'LB' || p === 'RB') return 'DF'
  if (p.includes('MF') || p === 'M' || p === 'CM' || p === 'DM' || p === 'AM') return 'MF'
  if (p.includes('FW') || p === 'F' || p === 'ST' || p === 'LW' || p === 'RW') return 'FW'
  return pos.slice(0, 2).toUpperCase()
}

function PlayerRow({ p }) {
  const pk = posKey(p.position)
  const posClass = POSITION_COLORS[pk] || 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0]'

  return (
    <tr className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]/40 transition-colors">
      <td className="px-2 py-1.5 text-center text-[#94a3b8] tabular-nums text-sm w-8">
        {p.shirt_number ?? '—'}
      </td>
      <td className="px-2 py-1.5 w-10">
        <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${posClass}`}>
          {pk || p.position || '—'}
        </span>
      </td>
      <td className="px-2 py-1.5 text-[#0f172a] font-medium text-sm">{p.player_name}</td>
      <td className="px-2 py-1.5 text-[#94a3b8] text-sm hidden md:table-cell">
        {p.date_of_birth
          ? new Date(p.date_of_birth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—'}
      </td>
      <td className="px-2 py-1.5 text-[#94a3b8] text-sm hidden lg:table-cell max-w-[160px] truncate">
        {p.club || '—'}
      </td>
      <td className="px-2 py-1.5 text-center tabular-nums text-[#475569] text-sm">{p.caps ?? '—'}</td>
      <td className="px-2 py-1.5 text-center tabular-nums text-[#475569] text-sm">{p.goals ?? '—'}</td>
    </tr>
  )
}

function CountrySquad({ country, players, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const sorted = [...players].sort((a, b) => {
    const pa = POSITION_ORDER[posKey(a.position)] ?? 9
    const pb = POSITION_ORDER[posKey(b.position)] ?? 9
    if (pa !== pb) return pa - pb
    return (a.shirt_number ?? 99) - (b.shirt_number ?? 99)
  })

  return (
    <div className="border border-[#e2e8f0] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-[#f8fafc] transition-colors text-left"
      >
        <span className="font-semibold text-[#0f172a]">{country}</span>
        <span className="text-xs text-[#94a3b8] flex items-center gap-2">
          {players.length} players
          <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
        </span>
      </button>
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/50 text-[#94a3b8] text-xs uppercase tracking-wider">
                <th className="px-2 py-1.5 text-center w-8">#</th>
                <th className="px-2 py-1.5 w-10">Pos</th>
                <th className="px-2 py-1.5 text-left">Player</th>
                <th className="px-2 py-1.5 text-left hidden md:table-cell">DOB</th>
                <th className="px-2 py-1.5 text-left hidden lg:table-cell">Club</th>
                <th className="px-2 py-1.5 text-center">Caps</th>
                <th className="px-2 py-1.5 text-center">Goals</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => <PlayerRow key={i} p={p} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function WCSquads() {
  const [squadCountries, setSquadCountries] = useState([])
  const [players, setPlayers] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([api.squadCountries(), api.squads()]).then(([countries, all]) => {
      setSquadCountries(countries)
      setPlayers(all)
      if (countries.length > 0) setLastUpdated(countries[0].last_updated)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Filter players
  const filtered = players.filter((p) => {
    if (selectedCountry !== 'all' && p.country_name !== selectedCountry) return false
    if (search) {
      const q = search.toLowerCase()
      return p.player_name.toLowerCase().includes(q) || (p.club || '').toLowerCase().includes(q)
    }
    return true
  })

  // Group by country
  const byCountry = {}
  for (const p of filtered) {
    if (!byCountry[p.country_name]) byCountry[p.country_name] = []
    byCountry[p.country_name].push(p)
  }
  const countries = Object.keys(byCountry).sort()

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-bold text-[#0f172a]" style={{ fontFamily: 'Georgia, serif' }}>World Cup 2026 Squads</h1>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Official confirmed squads · {squadCountries.length} of 48 teams announced
            {lastUpdated && ` · last updated ${new Date(lastUpdated).toLocaleDateString()}`}
          </p>
          <p className="text-xs text-amber-500 mt-1">
            Sense-check view — data sourced from Wikipedia, cross-reference with official sources before use
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search player or club…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-[#e2e8f0] rounded px-3 py-1.5 text-sm text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a] w-48"
          />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-white border border-[#e2e8f0] rounded px-3 py-1.5 text-sm text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
          >
            <option value="all">All countries</option>
            {squadCountries.map((c) => (
              <option key={c.country_name} value={c.country_name}>
                {c.country_name} ({c.player_count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats bar */}
      {!loading && (
        <div className="flex gap-4 text-sm text-[#94a3b8]">
          <span>{countries.length} {countries.length === 1 ? 'country' : 'countries'}</span>
          <span>·</span>
          <span>{filtered.length} players</span>
          {squadCountries.length < 48 && (
            <>
              <span>·</span>
              <span className="text-amber-500">{48 - squadCountries.length} squads not yet confirmed</span>
            </>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-16 text-[#94a3b8]">
          <div className="inline-block w-5 h-5 border-2 border-[#94a3b8] border-t-[#1e3a8a] rounded-full animate-spin mb-2" />
          <p>Loading squads…</p>
        </div>
      )}

      {!loading && countries.length === 0 && (
        <div className="text-[#94a3b8] text-center py-16">
          No squads match your filter.
        </div>
      )}

      {/* Squad tables */}
      <div className="space-y-2">
        {countries.map((country, i) => (
          <CountrySquad
            key={country}
            country={country}
            players={byCountry[country]}
            defaultOpen={countries.length === 1 || i < 2}
          />
        ))}
      </div>
    </div>
  )
}
