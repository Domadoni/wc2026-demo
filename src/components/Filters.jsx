const POSITIONS = [
  'GK',
  'RD', 'RCD', 'CD', 'LCD', 'LD',
  'RM', 'RCM', 'CM', 'LCM', 'LM',
  'RF', 'RCF', 'CF', 'LCF', 'LF',
]

export function CountryFilter({ countries, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
    >
      <option value="">All countries</option>
      {countries.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name} {c.fifa_code ? `(${c.fifa_code})` : ''}
        </option>
      ))}
    </select>
  )
}

export function PositionFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
    >
      <option value="">All positions</option>
      {POSITIONS.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  )
}
