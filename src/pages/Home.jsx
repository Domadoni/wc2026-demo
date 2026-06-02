import { useEffect, useState } from 'react'
import { api } from '../api'
import { useTeam } from '../context/TeamContext'
import HeroBanner from '../components/HeroBanner'
import TeamView from '../components/TeamView'
import WC2026Emblem from '../components/WC2026Emblem'

const GROUPS = [
  { group: 'A', teams: [
    { name: 'Mexico',      flag: '🇲🇽', isHost: true },
    { name: 'South Korea', flag: '🇰🇷' },
    { name: 'South Africa',flag: '🇿🇦' },
    { name: 'Czechia',     flag: '🇨🇿' },
  ]},
  { group: 'B', teams: [
    { name: 'Canada',                  flag: '🇨🇦', isHost: true },
    { name: 'Bosnia and Herzegovina',  flag: '🇧🇦' },
    { name: 'Qatar',                   flag: '🇶🇦' },
    { name: 'Switzerland',             flag: '🇨🇭' },
  ]},
  { group: 'C', teams: [
    { name: 'Brazil',    flag: '🇧🇷' },
    { name: 'Morocco',   flag: '🇲🇦' },
    { name: 'Haiti',     flag: '🇭🇹' },
    { name: 'Scotland',  flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  ]},
  { group: 'D', teams: [
    { name: 'United States', flag: '🇺🇸', isHost: true },
    { name: 'Paraguay',      flag: '🇵🇾' },
    { name: 'Australia',     flag: '🇦🇺' },
    { name: 'Turkey',        flag: '🇹🇷' },
  ]},
  { group: 'E', teams: [
    { name: 'Germany',       flag: '🇩🇪' },
    { name: 'Curaçao',       flag: '🇨🇼' },
    { name: "Côte d'Ivoire", flag: '🇨🇮' },
    { name: 'Ecuador',       flag: '🇪🇨' },
  ]},
  { group: 'F', teams: [
    { name: 'Netherlands', flag: '🇳🇱' },
    { name: 'Japan',       flag: '🇯🇵' },
    { name: 'Sweden',      flag: '🇸🇪' },
    { name: 'Tunisia',     flag: '🇹🇳' },
  ]},
  { group: 'G', teams: [
    { name: 'Belgium',     flag: '🇧🇪' },
    { name: 'Egypt',       flag: '🇪🇬' },
    { name: 'Iran',        flag: '🇮🇷' },
    { name: 'New Zealand', flag: '🇳🇿' },
  ]},
  { group: 'H', teams: [
    { name: 'Spain',        flag: '🇪🇸' },
    { name: 'Cape Verde',   flag: '🇨🇻' },
    { name: 'Saudi Arabia', flag: '🇸🇦' },
    { name: 'Uruguay',      flag: '🇺🇾' },
  ]},
  { group: 'I', teams: [
    { name: 'France',   flag: '🇫🇷' },
    { name: 'Senegal',  flag: '🇸🇳' },
    { name: 'Iraq',     flag: '🇮🇶' },
    { name: 'Norway',   flag: '🇳🇴' },
  ]},
  { group: 'J', teams: [
    { name: 'Argentina', flag: '🇦🇷' },
    { name: 'Algeria',   flag: '🇩🇿' },
    { name: 'Austria',   flag: '🇦🇹' },
    { name: 'Jordan',    flag: '🇯🇴' },
  ]},
  { group: 'K', teams: [
    { name: 'Portugal', flag: '🇵🇹' },
    { name: 'DR Congo', flag: '🇨🇩' },
    { name: 'Uzbekistan',flag: '🇺🇿' },
    { name: 'Colombia', flag: '🇨🇴' },
  ]},
  { group: 'L', teams: [
    { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { name: 'Croatia', flag: '🇭🇷' },
    { name: 'Ghana',   flag: '🇬🇭' },
    { name: 'Panama',  flag: '🇵🇦' },
  ]},
]

export default function Home() {
  const { selectedTeam, selectTeam } = useTeam()
  const [countryMap, setCountryMap] = useState({}) // name → { id, name }

  useEffect(() => {
    api.countries().then((list) => {
      const map = {}
      list.forEach((c) => { map[c.name] = c })
      setCountryMap(map)
    }).catch(() => {})
  }, [])

  // If a team is selected, show TeamView instead of the groups grid
  if (selectedTeam) {
    return <TeamView />
  }

  return (
    <>
      <HeroBanner
        eyebrow="FIFA World Cup 2026 · USA · Canada · Mexico · June–July 2026"
        title={<>48 Teams.<br />104 Matches.<br />One Trophy.</>}
        subtitle="Complete squad data, match statistics and xG analysis for every World Cup nation — built with Claude Code."
        stats={[
          { num: '48',    label: 'Nations' },
          { num: '12',    label: 'Groups' },
          { num: '1,000+',label: 'Matches scraped' },
          { num: '800+',  label: 'Players tracked' },
        ]}
        emblem={<WC2026Emblem size={150} />}
      />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Section header */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#dc2626]">
            Group Stage Draw
          </span>
          <span
            className="text-[20px] font-bold text-[#0f172a]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Click any team to explore their data
          </span>
        </div>

        {/* Groups grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-12">
          {GROUPS.map(({ group, teams }) => (
            <div
              key={group}
              className="bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-[#dc2626] mb-2.5">
                Group {group}
              </p>
              <ul className="space-y-0.5">
                {teams.map((team) => {
                  const country = countryMap[team.name]
                  const hasData = Boolean(country)
                  return (
                    <li key={team.name}>
                      <button
                        onClick={() => hasData
                          ? selectTeam({ ...team, group, countryId: country.id })
                          : undefined
                        }
                        disabled={!hasData}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all text-[13px] ${
                          hasData
                            ? 'hover:bg-[#eff6ff] hover:border-[#bfdbfe] cursor-pointer group'
                            : 'cursor-default opacity-60'
                        }`}
                      >
                        <span className="text-[15px] leading-none">{team.flag}</span>
                        <span className={`font-medium flex-1 ${hasData ? 'text-[#0f172a] group-hover:text-[#1e3a8a]' : 'text-[#94a3b8]'}`}>
                          {team.name}
                        </span>
                        {team.isHost && (
                          <span className="text-[9px] font-bold bg-[#fef3c7] text-[#92400e] px-1.5 py-0.5 rounded uppercase tracking-wide">
                            Host
                          </span>
                        )}
                        {hasData && (
                          <span className="text-[9px] font-bold bg-[#eff6ff] text-[#1e3a8a] px-1.5 py-0.5 rounded uppercase tracking-wide">
                            Data
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-[#94a3b8] text-xs text-center">
          Source: FIFA official draw, December 2025 · Teams with "Data" badge have full squad data available
        </p>
      </div>
    </>
  )
}
