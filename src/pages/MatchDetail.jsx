import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { VenueBadge, PositionBadge } from '../components/Badge'
import StatCell from '../components/StatCell'

function TeamStatsPanel({ stats, label }) {
  if (!stats) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-slate-100">{label}</span>
        {stats.formation && (
          <span className="text-sm font-mono text-emerald-400">{stats.formation}</span>
        )}
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        <StatCell label="xG" value={stats.xg?.toFixed(2)} highlight />
        <StatCell label="Shots" value={stats.shots} />
        <StatCell label="SoT" value={stats.shots_on_target} />
        <StatCell label="Passes" value={stats.passes_attempted} />
        <StatCell label="Corners" value={stats.corners} />
        <StatCell label="Fouls" value={stats.fouls_committed} />
        <StatCell label="Yellows" value={stats.yellow_cards} highlight={stats.yellow_cards > 0} />
        <StatCell label="Reds" value={stats.red_cards} highlight={stats.red_cards > 0} />
        <StatCell label="Pens Awd" value={stats.penalties_awarded} />
        <StatCell label="Pens Scr" value={stats.penalties_scored} />
        <StatCell label="Assists" value={stats.assists} />
        {stats.possession != null && (
          <StatCell label="Poss %" value={`${stats.possession}%`} />
        )}
      </div>
    </div>
  )
}

const PLAYER_COLS = [
  { key: 'position', label: 'Pos' },
  { key: 'minutes_played', label: 'Mins' },
  { key: 'xg', label: 'xG', fmt: (v) => v?.toFixed(2) },
  { key: 'shots', label: 'Shots' },
  { key: 'shots_on_target', label: 'SoT' },
  { key: 'passes_attempted', label: 'Pass' },
  { key: 'assists', label: 'Ast' },
  { key: 'fouls_committed', label: 'FC' },
  { key: 'fouls_won', label: 'FW' },
  { key: 'yellow_cards', label: 'YC' },
  { key: 'red_cards', label: 'RC' },
  { key: 'penalties_awarded', label: 'PA' },
  { key: 'penalties_scored', label: 'PS' },
  { key: 'saves', label: 'Svs' },
]

function PlayerRows({ players }) {
  return players.map((p) => (
    <tr key={p.player_id} className="border-b border-slate-800 hover:bg-slate-800/50">
      <td className="px-3 py-2 font-medium text-slate-100 whitespace-nowrap">
        <Link to={`/players/${p.player_id}`} className="hover:text-emerald-400">
          {p.player_name}
        </Link>
      </td>
      {PLAYER_COLS.map((col) => (
        <td key={col.key} className="text-center px-2 py-2">
          {col.key === 'position' ? (
            <PositionBadge position={p[col.key]} />
          ) : (
            <span className={
              (col.key === 'yellow_cards' && p[col.key] > 0) ? 'text-yellow-400 font-semibold' :
              (col.key === 'red_cards' && p[col.key] > 0) ? 'text-red-400 font-semibold' :
              'text-slate-300'
            }>
              {col.fmt ? col.fmt(p[col.key]) : (p[col.key] ?? '—')}
            </span>
          )}
        </td>
      ))}
    </tr>
  ))
}

function PlayerTable({ players, teamName }) {
  if (!players?.length) return null
  const teamPlayers = players.filter((p) => p.team_name === teamName)
  if (!teamPlayers.length) return null

  const starters = teamPlayers.filter((p) => !p.is_substitute)
  const subs = teamPlayers.filter((p) => p.is_substitute)

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">{teamName}</h3>
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-xs text-slate-300">
          <thead>
            <tr className="bg-slate-800 border-b border-slate-700">
              <th className="text-left px-3 py-2 font-medium text-slate-400 min-w-32">Player</th>
              {PLAYER_COLS.map((col) => (
                <th key={col.key} className="text-center px-2 py-2 font-medium text-slate-400 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {starters.length > 0 && (
              <tr className="bg-slate-900/60">
                <td colSpan={PLAYER_COLS.length + 1} className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Starting XI
                </td>
              </tr>
            )}
            <PlayerRows players={starters} />
            {subs.length > 0 && (
              <tr className="bg-slate-900/60 border-t border-slate-700">
                <td colSpan={PLAYER_COLS.length + 1} className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Substitutes
                </td>
              </tr>
            )}
            <PlayerRows players={subs} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function MatchDetail() {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.match(id).then(setMatch).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-slate-500 py-16 text-center">Loading…</div>
  if (!match) return <div className="text-slate-500 py-16 text-center">Match not found.</div>

  return (
    <div className="space-y-6">
      <div>
        <Link to="/matches" className="text-sm text-slate-500 hover:text-slate-300">← Matches</Link>
      </div>

      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xs text-slate-500">{match.match_date}</span>
          <span className="text-xs text-slate-600">·</span>
          <span className="text-xs text-slate-400">{match.competition}</span>
          {match.venue_type && <VenueBadge type={match.venue_type} />}
        </div>
        <div className="flex items-center justify-center gap-8 mt-4">
          <span className="text-2xl font-bold text-slate-100">{match.home_team}</span>
          <div className="text-center">
            <div className="text-4xl font-black tabular-nums text-emerald-400">
              {match.home_score ?? '?'} – {match.away_score ?? '?'}
            </div>
          </div>
          <span className="text-2xl font-bold text-slate-100">{match.away_team}</span>
        </div>
        {match.venue_note && (
          <div className="text-xs text-amber-500 mt-3">{match.venue_note}</div>
        )}
        {(match.home_win_odds || match.draw_odds || match.away_win_odds) && (
          <div className="flex justify-center gap-6 mt-4 text-xs text-slate-500">
            {match.home_win_odds && <span>Home <span className="text-slate-300 font-mono">{match.home_win_odds}</span></span>}
            {match.draw_odds && <span>Draw <span className="text-slate-300 font-mono">{match.draw_odds}</span></span>}
            {match.away_win_odds && <span>Away <span className="text-slate-300 font-mono">{match.away_win_odds}</span></span>}
            {match.over_2_5_odds && <span>O2.5 <span className="text-slate-300 font-mono">{match.over_2_5_odds}</span></span>}
            {match.under_2_5_odds && <span>U2.5 <span className="text-slate-300 font-mono">{match.under_2_5_odds}</span></span>}
          </div>
        )}
      </div>

      {/* Team stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <TeamStatsPanel stats={match.home_stats} label={match.home_team} />
        <TeamStatsPanel stats={match.away_stats} label={match.away_team} />
      </div>

      {/* Player tables */}
      {match.players?.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Player Stats</h2>
          <PlayerTable players={match.players} teamName={match.home_team} />
          <PlayerTable players={match.players} teamName={match.away_team} />
        </div>
      )}
    </div>
  )
}
