import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { PositionBadge } from '../components/Badge'
import StatCell from '../components/StatCell'
import ArticleCard from '../components/ArticleCard'

export default function PlayerDetail() {
  const { id } = useParams()
  const [player, setPlayer] = useState(null)
  const [matchStats, setMatchStats] = useState([])
  const [news, setNews] = useState(null)

  useEffect(() => {
    api.player(id).then(setPlayer)
    api.playerMatches(id).then(setMatchStats)
    api.playerNews(id).then(setNews).catch(() => {})
  }, [id])

  if (!player) return <div className="text-slate-500 py-16 text-center">Loading…</div>

  return (
    <div className="space-y-6">
      <div>
        <Link to="/players" className="text-sm text-slate-500 hover:text-slate-300">← Players</Link>
      </div>

      {/* Profile card */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 mb-1">{player.name}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-slate-400">{player.country_name}</span>
              <PositionBadge position={player.country_main_position} />
              {player.age && <span className="text-slate-500 text-sm">Age {player.age}</span>}
            </div>
          </div>
          {player.market_value_m && (
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-400">€{player.market_value_m}M</div>
              <div className="text-xs text-slate-500 mt-1">Market Value</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <StatCell label="Caps" value={player.country_caps} highlight />
          <StatCell label="Int'l Goals" value={player.country_goals} />
          <StatCell label="Club" value={player.current_club} />
          <StatCell label="League" value={player.current_club_league} />
        </div>

        {player.country_other_positions && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-slate-500">Other positions:</span>
            {player.country_other_positions.split(',').map((p) => (
              <PositionBadge key={p} position={p.trim()} />
            ))}
          </div>
        )}
      </div>

      {/* Player news */}
      {news && news.articles.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Latest News</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {news.articles.map((a, i) => (
              <ArticleCard key={i} article={a} />
            ))}
          </div>
        </div>
      )}

      {/* Match history */}
      {matchStats.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-100 mb-3">Match Stats</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-700">
            <table className="w-full text-xs text-slate-300">
              <thead>
                <tr className="bg-slate-800 border-b border-slate-700">
                  <th className="text-left px-3 py-2 text-slate-400">Pos</th>
                  <th className="text-center px-2 py-2 text-slate-400">Mins</th>
                  <th className="text-center px-2 py-2 text-slate-400">xG</th>
                  <th className="text-center px-2 py-2 text-slate-400">Shots</th>
                  <th className="text-center px-2 py-2 text-slate-400">SoT</th>
                  <th className="text-center px-2 py-2 text-slate-400">Pass</th>
                  <th className="text-center px-2 py-2 text-slate-400">Ast</th>
                  <th className="text-center px-2 py-2 text-slate-400">FC</th>
                  <th className="text-center px-2 py-2 text-slate-400">FW</th>
                  <th className="text-center px-2 py-2 text-slate-400">YC</th>
                  <th className="text-center px-2 py-2 text-slate-400">RC</th>
                  <th className="text-center px-2 py-2 text-slate-400">PA</th>
                  <th className="text-center px-2 py-2 text-slate-400">PS</th>
                  <th className="text-center px-2 py-2 text-slate-400">Svs</th>
                </tr>
              </thead>
              <tbody>
                {matchStats.map((s, i) => (
                  <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="px-3 py-2"><PositionBadge position={s.position} /></td>
                    <td className="text-center px-2 py-2">{s.minutes_played ?? '—'}</td>
                    <td className="text-center px-2 py-2">{s.xg?.toFixed(2) ?? '—'}</td>
                    <td className="text-center px-2 py-2">{s.shots ?? '—'}</td>
                    <td className="text-center px-2 py-2">{s.shots_on_target ?? '—'}</td>
                    <td className="text-center px-2 py-2">{s.passes_attempted ?? '—'}</td>
                    <td className="text-center px-2 py-2">{s.assists ?? '—'}</td>
                    <td className="text-center px-2 py-2">{s.fouls_committed ?? '—'}</td>
                    <td className="text-center px-2 py-2">{s.fouls_won ?? '—'}</td>
                    <td className={`text-center px-2 py-2 ${s.yellow_cards > 0 ? 'text-yellow-400 font-bold' : ''}`}>
                      {s.yellow_cards ?? '—'}
                    </td>
                    <td className={`text-center px-2 py-2 ${s.red_cards > 0 ? 'text-red-400 font-bold' : ''}`}>
                      {s.red_cards ?? '—'}
                    </td>
                    <td className="text-center px-2 py-2">{s.penalties_awarded ?? '—'}</td>
                    <td className="text-center px-2 py-2">{s.penalties_scored ?? '—'}</td>
                    <td className="text-center px-2 py-2">{s.saves ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
