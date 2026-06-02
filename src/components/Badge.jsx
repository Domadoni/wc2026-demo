const VENUE_COLORS = {
  Home: 'bg-emerald-900 text-emerald-300',
  Away: 'bg-orange-900 text-orange-300',
  Neutral: 'bg-slate-700 text-slate-300',
}

export function VenueBadge({ type }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${VENUE_COLORS[type] || VENUE_COLORS.Neutral}`}>
      {type}
    </span>
  )
}

export function PositionBadge({ position }) {
  if (!position) return <span className="text-slate-600">—</span>
  return (
    <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-700 text-slate-300">
      {position}
    </span>
  )
}

export function ResultBadge({ home, away }) {
  if (home == null || away == null) return null
  const color =
    home > away ? 'text-emerald-400' : home < away ? 'text-red-400' : 'text-slate-400'
  return (
    <span className={`font-bold text-base tabular-nums ${color}`}>
      {home} – {away}
    </span>
  )
}
