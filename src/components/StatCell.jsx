export default function StatCell({ label, value, highlight = false }) {
  return (
    <div className="text-center">
      <div className={`text-lg font-semibold ${highlight ? 'text-emerald-400' : 'text-slate-100'}`}>
        {value ?? <span className="text-slate-600">—</span>}
      </div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}
