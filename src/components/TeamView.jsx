import { useState, useEffect } from 'react'
import { useTeam } from '../context/TeamContext'
import { api } from '../api'
import { computeTeamStats } from '../hooks/useTeamStats'
import StatBox from './StatBox'
import NewsCard from './NewsCard'

const TABS = ['Recent Results', 'Squad', "Since '24"]

// Competition badge colours
function CompBadge({ comp }) {
  if (!comp) return null
  const lower = comp.toLowerCase()
  const cls = lower.includes('qualifier') || lower.includes('qualifying')
    ? 'bg-[#eff6ff] text-[#1e40af]'
    : lower.includes('friendly')
      ? 'bg-[#f0fdf4] text-[#166534]'
      : 'bg-[#fef3c7] text-[#92400e]'
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${cls}`}>
      {comp}
    </span>
  )
}

function XgBar({ value }) {
  const width = Math.min(Math.round((value / 4) * 80), 80)
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-20 h-1 bg-[#e2e8f0] rounded-full overflow-hidden">
        <div className="h-full bg-[#1e3a8a] rounded-full" style={{ width: `${width}px` }} />
      </div>
      <span className="text-[12px] tabular-nums text-[#475569]">{value?.toFixed(2) ?? '—'}</span>
    </div>
  )
}

function ResultBadge({ score, isWin, isDraw }) {
  const cls = isWin ? 'text-[#15803d]' : isDraw ? 'text-[#d97706]' : 'text-[#dc2626]'
  return <span className={`font-bold text-[14px] ${cls}`} style={{ fontFamily: 'Georgia, serif' }}>{score}</span>
}

function ResultsTab({ matches, teamName, loading }) {
  if (loading) return <p className="text-[#94a3b8] text-sm p-6">Loading matches…</p>

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-[#f1f5f9]">
        <h2 className="text-[16px] font-bold" style={{ fontFamily: 'Georgia, serif' }}>Recent Results</h2>
        <p className="text-[12px] text-[#94a3b8] mt-0.5">Last 20 competitive fixtures · xG, shots, possession per match</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#fafafa] text-[10px] font-bold uppercase tracking-[0.08em] text-[#94a3b8]">
              <th className="text-left px-4 py-2.5 border-b border-[#f1f5f9]">Date</th>
              <th className="text-left px-4 py-2.5 border-b border-[#f1f5f9]">Opponent</th>
              <th className="text-left px-4 py-2.5 border-b border-[#f1f5f9]">Competition</th>
              <th className="text-left px-4 py-2.5 border-b border-[#f1f5f9]">Result</th>
              <th className="text-left px-4 py-2.5 border-b border-[#f1f5f9]">xG For</th>
              <th className="text-left px-4 py-2.5 border-b border-[#f1f5f9]">xG Ag</th>
              <th className="text-right px-4 py-2.5 border-b border-[#f1f5f9]">Shots</th>
              <th className="text-right px-4 py-2.5 border-b border-[#f1f5f9]">Poss</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => {
              const isHome   = m.home_team === teamName
              const myScore  = isHome ? m.home_score  : m.away_score
              const oppScore = isHome ? m.away_score  : m.home_score
              const myStats  = isHome ? m.home_stats  : m.away_stats
              const opponent = isHome ? m.away_team   : m.home_team
              const isWin = myScore > oppScore
              const isDraw = myScore === oppScore
              return (
                <tr key={m.id} className="border-b border-[#f8fafc] hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-3 text-[13px] text-[#475569] whitespace-nowrap">{m.match_date}</td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[#0f172a]">{opponent}</td>
                  <td className="px-4 py-3"><CompBadge comp={m.competition} /></td>
                  <td className="px-4 py-3">
                    <ResultBadge
                      score={`${isWin ? 'W' : isDraw ? 'D' : 'L'} ${myScore}–${oppScore}`}
                      isWin={isWin} isDraw={isDraw}
                    />
                  </td>
                  <td className="px-4 py-3"><XgBar value={myStats?.xg} /></td>
                  <td className="px-4 py-3 text-[12px] tabular-nums text-[#475569]">
                    {(isHome ? m.away_stats?.xg : m.home_stats?.xg)?.toFixed(2) ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-[13px] tabular-nums text-[#475569]">
                    {myStats?.shots ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-[13px] tabular-nums text-[#475569]">
                    {myStats?.possession != null ? `${myStats.possession}%` : '—'}
                  </td>
                </tr>
              )
            })}
            {matches.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-[#94a3b8] text-sm">
                  No match data available for this team yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SquadTab({ players, teamName, loading }) {
  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(false)

  useEffect(() => {
    if (!teamName) return
    setNewsLoading(true)
    api.news(teamName)
      .then(setNews)
      .catch(() => setNews([]))
      .finally(() => setNewsLoading(false))
  }, [teamName])

  const posOrder = { GK: 0, RD: 1, RCD: 1, CD: 1, LCD: 1, LD: 1, RWB: 2, LWB: 2, RDM: 2, CDM: 2, LDM: 2, RM: 3, RCM: 3, CM: 3, LCM: 3, LM: 3, RAM: 4, CAM: 4, LAM: 4, RW: 5, SS: 5, CF: 5, LW: 5, ST: 5 }
  const posClass = (pos) => {
    if (!pos) return 'bg-[#f1f5f9] text-[#475569]'
    if (pos === 'GK') return 'bg-[#fef9c3] text-[#854d0e]'
    const order = posOrder[pos] ?? 3
    if (order <= 1) return 'bg-[#dcfce7] text-[#166534]'
    if (order <= 3) return 'bg-[#dbeafe] text-[#1e40af]'
    return 'bg-[#fee2e2] text-[#991b1b]'
  }

  const sorted = [...players].sort((a, b) => {
    const pa = posOrder[a.country_main_position] ?? 99
    const pb = posOrder[b.country_main_position] ?? 99
    return pa - pb
  })

  if (loading) return <p className="text-[#94a3b8] text-sm p-6">Loading squad…</p>

  return (
    <div className="space-y-4">
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-[#f1f5f9]">
        <h2 className="text-[16px] font-bold" style={{ fontFamily: 'Georgia, serif' }}>Squad</h2>
        <p className="text-[12px] text-[#94a3b8] mt-0.5">International caps, goals and market valuations · Transfermarkt</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 p-5">
        {sorted.map((p) => (
          <div
            key={p.id}
            className={`border rounded-xl p-3.5 text-center hover:shadow-md transition-all cursor-pointer relative ${
              p.in_wc_squad
                ? 'border-[#fbbf24] bg-[#fffbeb] hover:border-[#d97706]'
                : 'border-[#f1f5f9] hover:border-[#93c5fd]'
            }`}
          >
            {p.in_wc_squad && (
              <div className="absolute top-2 right-2" title="In 2026 World Cup squad">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L8 6H4L6 10L4 14H8L12 22L16 14H20L18 10L20 6H16L12 2Z" fill="#d97706" opacity="0.2"/>
                  <path d="M7 4H17V8C17 12.4 14.5 16.2 12 18C9.5 16.2 7 12.4 7 8V4Z" fill="#d97706"/>
                  <rect x="9" y="18" width="6" height="1.5" rx="0.75" fill="#d97706"/>
                  <rect x="8" y="19.5" width="8" height="1.5" rx="0.75" fill="#d97706"/>
                </svg>
              </div>
            )}
            <span
              className={`text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded inline-block mb-2 ${posClass(p.country_main_position)}`}
            >
              {p.country_main_position || '—'}
            </span>
            <div className="text-[13px] font-bold text-[#0f172a] mb-1 leading-tight">{p.name}</div>
            <div className="text-[11px] text-[#94a3b8]">
              {p.age ? `Age ${p.age}` : ''}
              {p.country_caps ? ` · ${p.country_caps} caps` : ''}
            </div>
            {p.market_value_m && (
              <div className="text-[12px] font-bold text-[#d97706] mt-1">
                €{p.market_value_m}m
              </div>
            )}
          </div>
        ))}
        {sorted.length === 0 && (
          <div className="col-span-4 py-8 text-center text-[#94a3b8] text-sm">
            No squad data available for this team yet.
          </div>
        )}
      </div>
    </div>

    {/* Team news */}
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-[#f1f5f9]">
        <h2 className="text-[16px] font-bold" style={{ fontFamily: 'Georgia, serif' }}>Team News</h2>
        <p className="text-[12px] text-[#94a3b8] mt-0.5">Latest articles · Google News</p>
      </div>
      {newsLoading ? (
        <p className="text-[#94a3b8] text-sm p-6">Loading news…</p>
      ) : news.length === 0 ? (
        <p className="text-[#94a3b8] text-sm p-6">No news articles found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5">
          {news.map((article, i) => (
            <NewsCard
              key={i}
              source={article.source}
              title={article.title}
              summary={article.summary}
              url={article.url}
              publishedAt={article.published_iso ? new Date(article.published_iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : null}
            />
          ))}
        </div>
      )}
    </div>
  </div>
  )
}

function Since24Tab({ matches, teamName, loading }) {
  if (loading) return <p className="text-[#94a3b8] text-sm p-6">Loading stats…</p>

  const stats = computeTeamStats(matches, teamName)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[#f1f5f9]">
          <h2 className="text-[16px] font-bold" style={{ fontFamily: 'Georgia, serif' }}>Attacking</h2>
        </div>
        <div className="grid grid-cols-3 divide-x divide-y divide-[#f1f5f9]">
          <StatBox num={stats.avgXgFor}    label="Avg xG For"     gold />
          <StatBox num={stats.avgShots}    label="Avg Shots" />
          <StatBox num={stats.avgShotsOnTarget} label="Avg SoT" />
          <StatBox num={(stats.played ? (stats.goalsFor / stats.played).toFixed(2) : 0)} label="Goals / Game" gold />
          <StatBox num={`${stats.avgPossession}%`} label="Avg Possession" />
          <StatBox num={stats.played}      label="Matches" />
        </div>
      </div>
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[#f1f5f9]">
          <h2 className="text-[16px] font-bold" style={{ fontFamily: 'Georgia, serif' }}>Defensive</h2>
        </div>
        <div className="grid grid-cols-3 divide-x divide-y divide-[#f1f5f9]">
          <StatBox num={stats.avgXgAgainst}  label="Avg xG Ag"   gold />
          <StatBox num={stats.cleanSheets}   label="Clean Sheets" />
          <StatBox num={(stats.played ? (stats.goalsAgainst / stats.played).toFixed(2) : 0)} label="Goals Conceded" />
          <StatBox num={`${stats.wins}W · ${stats.draws}D · ${stats.losses}L`} label="Form" />
          <StatBox num={stats.totalYellows}  label="Yellow Cards" />
          <StatBox num={stats.losses}        label="Losses" />
        </div>
      </div>
    </div>
  )
}

export default function TeamView() {
  const { selectedTeam, clearTeam } = useTeam()
  const [activeTab, setActiveTab] = useState(0)
  const [matches,  setMatches]  = useState([])
  const [players,  setPlayers]  = useState([])
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    if (!selectedTeam?.countryId) return
    setLoading(true)
    Promise.all([
      api.matches({ country_id: selectedTeam.countryId, page_size: 20 }),
      api.players({ country_id: selectedTeam.countryId }),
    ])
      .then(([matchData, playerData]) => {
        setMatches(matchData?.items ?? [])
        setPlayers(playerData?.players ?? playerData ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [selectedTeam?.countryId])

  if (!selectedTeam) return null

  const form = (() => {
    const s = computeTeamStats(matches, selectedTeam.name)
    return s.played ? `${s.wins}W · ${s.draws}D · ${s.losses}L` : '—'
  })()

  const avgXg = (() => {
    const s = computeTeamStats(matches, selectedTeam.name)
    return s.played ? s.avgXgFor : null
  })()

  return (
    <>
      {/* Team hero banner */}
      <div
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}
        className="py-9"
      >
        <div className="max-w-[1100px] mx-auto px-6 flex items-start gap-5">
          <span className="text-[56px] leading-none mt-1">{selectedTeam.flag}</span>
          <div>
            <button
              onClick={clearTeam}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-[#64748b] hover:text-[#fbbf24] transition-colors mb-2.5 bg-transparent border-none cursor-pointer p-0"
            >
              ← Back to Groups
            </button>
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#fbbf24] mb-1.5">
              FIFA World Cup 2026 · Group {selectedTeam.group}
            </p>
            <h1 className="text-[34px] font-bold text-white leading-tight mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              {selectedTeam.name}
            </h1>
            <p className="text-[13px] text-[#64748b] mb-4">
              Last 20 competitive fixtures · Data via FBref &amp; Transfermarkt
            </p>
            <div className="flex gap-7 flex-wrap">
              <div>
                <div className="text-[24px] font-extrabold text-[#fbbf24] leading-none mb-1">{form}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#475569]">Recent form</div>
              </div>
              {avgXg != null && (
                <div>
                  <div className="text-[24px] font-extrabold text-[#fbbf24] leading-none mb-1">{avgXg}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#475569]">Avg xG for</div>
                </div>
              )}
              <div>
                <div className="text-[24px] font-extrabold text-[#fbbf24] leading-none mb-1">{players.length}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#475569]">Players tracked</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky tab bar */}
      <div className="bg-white border-b border-[#e2e8f0] sticky top-14 z-40">
        <div className="max-w-[1100px] mx-auto px-6 flex">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`text-[13px] font-semibold px-4 py-3.5 border-b-2 transition-all bg-transparent cursor-pointer ${
                activeTab === i
                  ? 'border-[#1e3a8a] text-[#1e3a8a]'
                  : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panels */}
      <div className="max-w-[1100px] mx-auto px-6 py-7 pb-16">
        {activeTab === 0 && <ResultsTab matches={matches} teamName={selectedTeam.name} loading={loading} />}
        {activeTab === 1 && <SquadTab players={players} teamName={selectedTeam.name} loading={loading} />}
        {activeTab === 2 && <Since24Tab matches={matches} teamName={selectedTeam.name} loading={loading} />}
      </div>
    </>
  )
}
