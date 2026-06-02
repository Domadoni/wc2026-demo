import { useState, useEffect } from 'react'
import { api } from '../api'

export default function ScrapeLogs() {
  const [logs, setLogs] = useState([])
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [scraping, setScraping] = useState(false)
  const [msg, setMsg] = useState('')

  function refresh() {
    api.scrapeLogs().then(setLogs)
  }

  useEffect(() => {
    refresh()
    api.countries().then((list) => {
      setCountries(list)
      if (list.length > 0) {
        const kor = list.find((c) => c.name === 'South Korea') || list[0]
        setSelectedCountry(kor.name)
      }
    })
    const t = setInterval(refresh, 10000)
    return () => clearInterval(t)
  }, [])

  async function triggerScrape() {
    if (!selectedCountry) return
    setScraping(true)
    setMsg('')
    try {
      const res = await api.triggerScrape(selectedCountry)
      setMsg(`Scrape started for ${res.country}. Check back in a few minutes.`)
    } catch (e) {
      setMsg(`Error: ${e.message}`)
    } finally {
      setScraping(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-[24px] font-bold text-[#0f172a]" style={{ fontFamily: 'Georgia, serif' }}>Scrape Logs</h1>
        <div className="flex gap-3 items-center flex-wrap">
          {msg && <span className="text-sm text-[#1e3a8a]">{msg}</span>}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-white border border-[#e2e8f0] rounded px-3 py-1.5 text-sm text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
          >
            {countries.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} {c.fifa_code ? `(${c.fifa_code})` : ''}
              </option>
            ))}
          </select>
          <button
            onClick={triggerScrape}
            disabled={scraping || !selectedCountry}
            className="bg-[#1e3a8a] hover:bg-[#1e3a8a] disabled:opacity-50 text-white text-sm px-4 py-1.5 rounded font-medium transition-colors whitespace-nowrap"
          >
            {scraping ? 'Starting…' : `Scrape ${selectedCountry || '…'}`}
          </button>
        </div>
      </div>

      {logs.length === 0 && (
        <div className="text-[#94a3b8] text-center py-16">No scrape logs yet.</div>
      )}

      <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
        <table className="w-full text-sm text-[#475569]">
          <thead>
            <tr className="bg-white border-b border-[#e2e8f0]">
              <th className="text-left px-3 py-2 font-medium text-[#94a3b8]">Country</th>
              <th className="text-left px-3 py-2 font-medium text-[#94a3b8]">Type</th>
              <th className="text-center px-3 py-2 font-medium text-[#94a3b8]">Status</th>
              <th className="text-center px-3 py-2 font-medium text-[#94a3b8]">Matches</th>
              <th className="text-center px-3 py-2 font-medium text-[#94a3b8]">Players</th>
              <th className="text-left px-3 py-2 font-medium text-[#94a3b8]">Time</th>
              <th className="text-left px-3 py-2 font-medium text-[#94a3b8]">Error</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-[#e2e8f0]">
                <td className="px-3 py-2">{l.country}</td>
                <td className="px-3 py-2 text-[#94a3b8]">{l.scrape_type}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    l.status === 'success' ? 'bg-emerald-900 text-emerald-300' :
                    l.status === 'error' ? 'bg-red-900 text-red-300' :
                    'bg-[#f8fafc] text-[#475569]'
                  }`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-center tabular-nums">{l.matches_scraped}</td>
                <td className="px-3 py-2 text-center tabular-nums">{l.players_scraped}</td>
                <td className="px-3 py-2 text-[#94a3b8] text-xs whitespace-nowrap">
                  {new Date(l.created_at).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-red-400 text-xs max-w-xs truncate">
                  {l.error_message ?? ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
