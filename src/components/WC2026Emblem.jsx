// WC2026Emblem — stylised FIFA World Cup 2026 emblem SVG
// Based on the official brand: trophy silhouette, three stars (USA/CAN/MEX), "2026"

export default function WC2026Emblem({ size = 120, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="FIFA World Cup 2026"
    >
      {/* Outer circle */}
      <circle cx="60" cy="60" r="58" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

      {/* Trophy cup body */}
      <path
        d="M42 28 H78 V52 C78 66 70 76 60 80 C50 76 42 66 42 52 Z"
        fill="white"
        opacity="0.95"
      />
      {/* Trophy handles */}
      <path d="M42 32 C34 32 30 38 30 44 C30 52 36 56 42 54" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.95"/>
      <path d="M78 32 C86 32 90 38 90 44 C90 52 84 56 78 54" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.95"/>
      {/* Trophy stem */}
      <rect x="55" y="80" width="10" height="12" rx="1" fill="white" opacity="0.95"/>
      {/* Trophy base */}
      <rect x="46" y="92" width="28" height="5" rx="2.5" fill="white" opacity="0.95"/>
      {/* Trophy base bottom */}
      <rect x="44" y="97" width="32" height="3" rx="1.5" fill="white" opacity="0.8"/>

      {/* Shine on cup */}
      <path d="M50 34 C50 40 52 48 54 52" stroke="rgba(30,58,138,0.25)" strokeWidth="2.5" strokeLinecap="round"/>

      {/* 3 stars for host nations (USA · CAN · MEX) */}
      {[44, 60, 76].map((cx, i) => (
        <polygon
          key={i}
          points={`${cx},16 ${cx+2.2},22 ${cx+6},22 ${cx+3},25.5 ${cx+4.2},31.5 ${cx},28 ${cx-4.2},31.5 ${cx-3},25.5 ${cx-6},22 ${cx-2.2},22`}
          fill="#fbbf24"
          opacity="0.9"
        />
      ))}

      {/* "2026" text */}
      <text
        x="60"
        y="113"
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fontFamily="Georgia, serif"
        letterSpacing="2"
        fill="white"
        opacity="0.9"
      >
        2026
      </text>
    </svg>
  )
}
