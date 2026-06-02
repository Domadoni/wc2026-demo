import { useState, useEffect, useCallback } from 'react'
import { api } from '../api'
import ArticleCard from '../components/ArticleCard'
import { CountryFilter } from '../components/Filters'

// ── Player section ────────────────────────────────────────────────────────────

function PlayerNewsSection({ playerNews }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 hover:bg-slate-700 transition-colors text-left"
      >
        <span className="font-medium text-slate-100">{playerNews.player_name}</span>
        <span className="text-xs text-slate-400 flex items-center gap-2">
          {playerNews.articles.length} article{playerNews.articles.length !== 1 ? 's' : ''}
          <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
        </span>
      </button>
      {open && (
        <div className="grid sm:grid-cols-2 gap-3 p-3 bg-slate-900/50">
          {playerNews.articles.map((a, i) => (
            <ArticleCard key={i} article={a} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function News() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(null)  // full country object {id, name, ...}
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.countries().then((list) => {
      setCountries(list)
      if (list.length > 0) {
        const kor = list.find((c) => c.name === 'South Korea') || list[0]
        setCountry(kor)
      }
    })
  }, [])

  const load = useCallback(async (c, refresh = false) => {
    if (!c) return
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const result = await api.news(c.name, refresh)
      setData(result)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(country) }, [country])

  function handleCountryChange(id) {
    const c = countries.find((x) => String(x.id) === String(id))
    if (c) setCountry(c)
  }

  const cacheLabel = data
    ? data.cache_age_s < 10
      ? 'just fetched'
      : `cached ${Math.floor(data.cache_age_s / 60)}m ago`
    : null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {country ? `${country.name} — Team News` : 'Team News'}
          </h1>
          {cacheLabel && !loading && (
            <p className="text-xs text-slate-500 mt-0.5">{cacheLabel} · refreshes every 30 min</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CountryFilter
            countries={countries}
            value={country ? String(country.id) : ''}
            onChange={handleCountryChange}
          />
          <button
            onClick={() => load(country, true)}
            disabled={loading || !country}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-sm text-slate-100 px-3 py-1.5 rounded transition-colors"
          >
            {loading ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                Fetching…
              </>
            ) : (
              '↻ Refresh'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="text-center py-20 text-slate-500">
          <div className="inline-block w-6 h-6 border-2 border-slate-500 border-t-emerald-400 rounded-full animate-spin mb-3" />
          <p>Fetching news for {country?.name} and all squad players…</p>
          <p className="text-xs mt-1">This takes ~15 seconds on first load</p>
        </div>
      )}

      {data && (
        <>
          {/* Team news */}
          <section>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Team News ({data.team_news.length})
            </h2>
            {data.team_news.length === 0 ? (
              <p className="text-slate-500 text-sm">No team news found.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.team_news.map((a, i) => (
                  <ArticleCard key={i} article={a} />
                ))}
              </div>
            )}
          </section>

          {/* Player news */}
          <section>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Player News ({data.player_news.length} players with articles)
            </h2>
            {data.player_news.length === 0 ? (
              <p className="text-slate-500 text-sm">No player news found.</p>
            ) : (
              <div className="space-y-2">
                {data.player_news.map((pn) => (
                  <PlayerNewsSection key={pn.player_name} playerNews={pn} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
