import { useNavigate } from 'react-router-dom'
import HeroBanner from '../components/HeroBanner'
import StatBox from '../components/StatBox'

const TIMELINE = [
  {
    phase: 'Phase 1 · The Idea',
    heading: 'Starting with one question: can AI build a real data tool from scratch?',
    body: 'The brief was simple — could Claude Code scrape, structure and present live football data for the World Cup, built entirely through AI-assisted development? No traditional sprint planning. No PRD. Just conversation.',
    tags: [{ label: 'Claude Code', type: 'tool' }, { label: 'Concept', type: 'tool' }],
    dot: 'idea',
  },
  {
    phase: 'Phase 2 · First Hurdle',
    heading: 'FBref hides behind Cloudflare — every scrape returned a bot wall',
    body: 'FBref protects its data with Cloudflare Turnstile. Standard HTTP requests hit a challenge page. Claude Code diagnosed the issue, identified FlareSolverr as the solution, and wrote the full integration — Docker setup included.',
    tags: [{ label: 'Anti-bot detection', type: 'challenge' }, { label: 'FlareSolverr', type: 'tool' }, { label: 'Docker', type: 'tool' }, { label: 'Solved', type: 'win' }],
    dot: 'challenge',
  },
  {
    phase: 'Phase 3 · Data Pipeline',
    heading: 'Three sources, one schema — match stats, squad values, official rosters',
    body: 'FBref for match stats, xG and player performance. Transfermarkt for market values and international caps. Wikipedia for official WC 2026 squad lists. Claude Code designed the PostgreSQL schema, wrote the scrapers and upsert logic — all consistent across sources.',
    tags: [{ label: 'PostgreSQL', type: 'tool' }, { label: 'FBref', type: 'tool' }, { label: 'Transfermarkt', type: 'tool' }, { label: '3 sources unified', type: 'win' }],
    dot: 'build',
  },
  {
    phase: 'Phase 4 · Data Quality',
    heading: 'Rate limits, missing fields and mismatched player names across sources',
    body: 'FBref enforces strict rate limits — too fast and you\'re blocked for hours. Player names differ between FBref and Transfermarkt (romanisation, diacritics). Claude Code wrote fuzzy matching and retry logic to handle both without manual intervention.',
    tags: [{ label: 'Rate limiting', type: 'challenge' }, { label: 'Name matching', type: 'challenge' }, { label: 'Automated fixes', type: 'win' }],
    dot: 'challenge',
  },
  {
    phase: 'Phase 5 · The Product',
    heading: 'FastAPI backend + React frontend — feature by feature, conversation by conversation',
    body: 'Every endpoint, every page, every filter built iteratively through dialogue. xG breakdowns, squad profiles, match-level stats, player-level stats, bookmaker odds. The app you\'re looking at right now.',
    tags: [{ label: 'FastAPI', type: 'tool' }, { label: 'React', type: 'tool' }, { label: 'Tailwind', type: 'tool' }, { label: 'Full product shipped', type: 'win' }],
    dot: 'build',
  },
]

const DOT_COLOURS = {
  idea:      'bg-[#1e3a8a]',
  challenge: 'bg-[#dc2626]',
  build:     'bg-[#15803d]',
}

const TAG_COLOURS = {
  tool:      'bg-[#eff6ff] text-[#1e40af]',
  challenge: 'bg-[#fef2f2] text-[#991b1b]',
  win:       'bg-[#f0fdf4] text-[#166534]',
}

export default function Journey() {
  const navigate = useNavigate()

  return (
    <>
      <HeroBanner
        eyebrow="Built with Claude Code · AI-assisted development"
        title={<>How this was built —<br />from idea to World Cup tool</>}
        subtitle="A full analytics platform, scraped from live sources and deployed — built entirely through conversation with Claude Code. Here's the story."
      />

      <div className="max-w-[1100px] mx-auto px-6 py-10 pb-16">
        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[17px] top-0 bottom-0 w-0.5 bg-[#e2e8f0]" />

          <div className="space-y-7">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-5 relative">
                {/* Dot */}
                <div
                  className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] font-bold text-white z-10 ${DOT_COLOURS[item.dot]}`}
                  style={{ boxShadow: '0 0 0 3px white, 0 0 0 5px #e2e8f0', fontFamily: 'Georgia, serif' }}
                >
                  {i + 1}
                </div>

                {/* Card */}
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 flex-1 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#94a3b8] mb-1.5">
                    {item.phase}
                  </p>
                  <h2
                    className="text-[17px] font-bold text-[#0f172a] leading-snug mb-2"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {item.heading}
                  </h2>
                  <p className="text-[13px] text-[#475569] leading-relaxed mb-3">{item.body}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {item.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${TAG_COLOURS[tag.type]}`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#e2e8f0] my-10" />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <StatBox num="5"  label="Days to build" />
          <StatBox num="3"  label="Data sources" />
          <StatBox num="12" label="DB tables" />
          <StatBox num="~0" label="Manual code written" />
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-[14px] font-bold px-8 py-3.5 rounded-lg transition-colors cursor-pointer border-none"
          >
            Explore the data →
          </button>
        </div>
      </div>
    </>
  )
}
