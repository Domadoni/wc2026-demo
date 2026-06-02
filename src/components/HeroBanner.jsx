// frontend/src/components/HeroBanner.jsx
// Dark gradient banner used on Groups page, Team view, and Journey page.
// Props:
//   eyebrow  {string}   — small red uppercase label above title
//   title    {string|ReactNode} — large serif headline
//   subtitle {string}   — muted subheading
//   stats    {Array<{num, label}>} — optional gold stat row
//   children {ReactNode} — optional slot above the stat row (e.g. back button)

export default function HeroBanner({ eyebrow, title, subtitle, stats = [], children, emblem }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
      className="py-14 px-0"
    >
      {/* Red radial glow */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 70% 50%, rgba(220,38,38,0.12) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      {/* Optional emblem — top right, watermark style */}
      {emblem && (
        <div
          style={{ position: 'absolute', top: '50%', right: '5%', transform: 'translateY(-50%)', opacity: 0.18, pointerEvents: 'none' }}
          className="hidden sm:block"
        >
          {emblem}
        </div>
      )}
      <div className="max-w-[1100px] mx-auto px-6 relative">
        {children}
        {eyebrow && (
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#fbbf24] mb-3">
            {eyebrow}
          </p>
        )}
        <h1
          className="text-5xl font-bold leading-[1.08] text-white mb-3"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[15px] text-[#94a3b8] mb-8 max-w-[520px] leading-relaxed">
            {subtitle}
          </p>
        )}
        {stats.length > 0 && (
          <div className="flex gap-9 flex-wrap">
            {stats.map(({ num, label }) => (
              <div key={label}>
                <div className="text-[30px] font-extrabold text-[#fbbf24] leading-none mb-1">
                  {num}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#64748b]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
