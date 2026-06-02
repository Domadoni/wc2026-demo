import { useState, useEffect } from 'react'
// Export is now in the global header (Layout.jsx)
import { Link } from 'react-router-dom'
import { api } from '../api'
import { CountryFilter } from '../components/Filters'
import { VenueBadge, ResultBadge } from '../components/Badge'
import StatCell from '../components/StatCell'

export default function Matches() {
  const [countries, setCountries] = useState([])
  const [countryId, setCountryId] = useState('')
  const [data, setData] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.countries().then(setCountries)
  }, [])

  useEffect(() => {
    setLoading(true)
    api
      .matches({ country_id: countryId || undefined, page, page_size: 20 })
      .then(setData)
      .finally(() => setLoading(false))
  }, [countryId, page])

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 1

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-[24px] font-bold text-[#0f172a]" style={{ fontFamily: 'Georgia, serif' }}>Matches</h1>
        <CountryFilter countries={countries} value={countryId} onChange={(v) => { setCountryId(v); setPage(1) }} />
      </div>

      {loading && <div className="text-[#94a3b8] text-sm mb-4">Loading…</div>}

      {data?.total === 0 && (
        <div className="text-[#94a3b8] text-center py-16">
          No matches found. Run a scrape first.
        </div>
      )}

      <div className="space-y-3">
        {data?.items?.map((m) => (
          <Link
            key={m.id}
            to={`/matches/${m.id}`}
            className="block bg-white border border-[#e2e8f0] rounded-lg p-4 hover:border-[#1e3a8a] transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-[#94a3b8]">{m.match_date}</span>
                  <span className="text-xs text-[#94a3b8]">·</span>
                  <span className="text-xs text-[#94a3b8]">{m.competition}</span>
                  {m.venue_type && <VenueBadge type={m.venue_type} />}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#0f172a]">{m.home_team}</span>
                  <ResultBadge home={m.home_score} away={m.away_score} />
                  <span className="font-semibold text-[#0f172a]">{m.away_team}</span>
                </div>
                {m.venue_note && (
                  <div className="text-xs text-amber-500 mt-1">{m.venue_note}</div>
                )}
              </div>

              {/* Team stats summary */}
              <div className="hidden md:flex gap-6 text-right shrink-0">
                {m.home_stats && (
                  <div className="text-right">
                    <div className="text-xs text-[#94a3b8] mb-1">{m.home_team}</div>
                    <div className="flex gap-4">
                      <StatCell label="xG" value={m.home_stats.xg?.toFixed(2)} />
                      <StatCell label="Shots" value={m.home_stats.shots} />
                      <StatCell label="SoT" value={m.home_stats.shots_on_target} />
                      <StatCell label="Corners" value={m.home_stats.corners} />
                      <StatCell label="Passes" value={m.home_stats.passes_attempted} />
                      <StatCell label="Yel" value={m.home_stats.yellow_cards} highlight={m.home_stats.yellow_cards > 0} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Odds row */}
            {(m.home_win_odds || m.draw_odds || m.away_win_odds) && (
              <div className="mt-3 pt-3 border-t border-[#e2e8f0] flex gap-4 text-xs text-[#94a3b8]">
                {m.home_win_odds && <span>1 <span className="text-[#475569] font-mono">{m.home_win_odds}</span></span>}
                {m.draw_odds && <span>X <span className="text-[#475569] font-mono">{m.draw_odds}</span></span>}
                {m.away_win_odds && <span>2 <span className="text-[#475569] font-mono">{m.away_win_odds}</span></span>}
                {m.over_2_5_odds && <span>O2.5 <span className="text-[#475569] font-mono">{m.over_2_5_odds}</span></span>}
                {m.under_2_5_odds && <span>U2.5 <span className="text-[#475569] font-mono">{m.under_2_5_odds}</span></span>}
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-white text-[#94a3b8] disabled:opacity-40 hover:bg-[#f8fafc] text-sm"
          >
            ← Prev
          </button>
          <span className="px-3 py-1 text-sm text-[#94a3b8]">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-white text-[#94a3b8] disabled:opacity-40 hover:bg-[#f8fafc] text-sm"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
