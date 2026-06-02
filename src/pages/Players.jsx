import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api'
import { CountryFilter, PositionFilter } from '../components/Filters'
import { PositionBadge } from '../components/Badge'

function fmtValue(v) {
  if (v == null) return '—'
  return `€${v}M`
}

export default function Players() {
  const [searchParams] = useSearchParams()
  const [countries, setCountries] = useState([])
  const [countryId, setCountryId] = useState('')
  const [position, setPosition] = useState('')
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState(1)

  useEffect(() => {
    api.countries().then((list) => {
      setCountries(list)
      // Pre-select country if passed as ?country=Name from Home page
      const nameParam = searchParams.get('country')
      if (nameParam) {
        const match = list.find((c) => c.name === nameParam)
        if (match) setCountryId(String(match.id))
      }
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    api
      .players({ country_id: countryId || undefined, position: position || undefined })
      .then(setPlayers)
      .finally(() => setLoading(false))
  }, [countryId, position])

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => -d)
    else { setSortKey(key); setSortDir(1) }
  }

  const sorted = [...players].sort((a, b) => {
    const av = a[sortKey] ?? ''
    const bv = b[sortKey] ?? ''
    if (av < bv) return -sortDir
    if (av > bv) return sortDir
    return 0
  })

  const SortHeader = ({ col, label }) => (
    <th
      onClick={() => handleSort(col)}
      className="text-left px-3 py-2 font-medium text-[#94a3b8] cursor-pointer hover:text-[#0f172a] whitespace-nowrap select-none"
    >
      {label} {sortKey === col ? (sortDir === 1 ? '↑' : '↓') : ''}
    </th>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-[24px] font-bold text-[#0f172a]" style={{ fontFamily: 'Georgia, serif' }}>Players</h1>
        <div className="flex gap-3 flex-wrap">
          <CountryFilter countries={countries} value={countryId} onChange={setCountryId} />
          <PositionFilter value={position} onChange={setPosition} />
        </div>
      </div>

      {loading && <div className="text-[#94a3b8] text-sm mb-4">Loading…</div>}

      {!loading && sorted.length === 0 && (
        <div className="text-[#94a3b8] text-center py-16">
          No players found. Run a scrape to populate data.
        </div>
      )}

      {sorted.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
          <table className="w-full text-sm text-[#475569]">
            <thead>
              <tr className="bg-white border-b border-[#e2e8f0]">
                <SortHeader col="name" label="Player" />
                <SortHeader col="age" label="Age" />
                <SortHeader col="country_name" label="Country" />
                <th className="text-center px-3 py-2 font-medium text-[#94a3b8]">Position</th>
                <SortHeader col="country_caps" label="Caps" />
                <SortHeader col="country_goals" label="Goals" />
                <SortHeader col="market_value_m" label="Value" />
                <SortHeader col="current_club" label="Club" />
                <th className="text-left px-3 py-2 font-medium text-[#94a3b8]">League</th>
                <th className="text-left px-3 py-2 font-medium text-[#94a3b8]">Other Pos.</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id} className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]/50">
                  <td className="px-3 py-2 font-medium text-[#0f172a]">
                    <Link to={`/players/${p.id}`} className="hover:text-[#1e3a8a]">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-[#94a3b8]">{p.age ?? '—'}</td>
                  <td className="px-3 py-2 text-[#94a3b8]">{p.country_name}</td>
                  <td className="px-3 py-2 text-center">
                    <PositionBadge position={p.country_main_position} />
                  </td>
                  <td className="px-3 py-2 text-center tabular-nums">{p.country_caps ?? '—'}</td>
                  <td className="px-3 py-2 text-center tabular-nums">{p.country_goals ?? '—'}</td>
                  <td className="px-3 py-2 text-center font-mono text-[#1e3a8a]">
                    {fmtValue(p.market_value_m)}
                  </td>
                  <td className="px-3 py-2 text-[#94a3b8] whitespace-nowrap">{p.current_club ?? '—'}</td>
                  <td className="px-3 py-2 text-[#94a3b8] whitespace-nowrap">{p.current_club_league ?? '—'}</td>
                  <td className="px-3 py-2 text-[#94a3b8] text-xs">
                    {p.country_other_positions?.split(',').map((pos) => (
                      <PositionBadge key={pos} position={pos.trim()} />
                    )) ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
