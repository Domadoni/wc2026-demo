// frontend/src/components/StatBox.jsx
// Single metric display. Used in Since '24 and Journey stats bar.
// Props: num {string|number}, label {string}, gold {bool}

export default function StatBox({ num, label, gold = false }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 text-center shadow-sm">
      <div
        className={`text-[26px] font-extrabold leading-none mb-1 tabular-nums ${
          gold ? 'text-[#d97706]' : 'text-[#1e3a8a]'
        }`}
      >
        {num}
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#94a3b8]">
        {label}
      </div>
    </div>
  )
}
