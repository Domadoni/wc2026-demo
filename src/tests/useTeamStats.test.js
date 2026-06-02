import { computeTeamStats } from '../hooks/useTeamStats'

// Match shape from api.matches: { home_team, away_team, home_score, away_score,
//   home_stats: { xg, shots, shots_on_target, possession, yellow_cards },
//   away_stats: { ... } }
const MATCHES = [
  {
    home_team: 'South Korea', away_team: 'Japan',
    home_score: 2, away_score: 1,
    home_stats: { xg: 1.8, shots: 14, shots_on_target: 5, possession: 55, yellow_cards: 1 },
    away_stats: { xg: 0.9, shots: 8,  shots_on_target: 3, possession: 45, yellow_cards: 2 },
  },
  {
    home_team: 'Brazil', away_team: 'South Korea',
    home_score: 1, away_score: 1,
    home_stats: { xg: 2.1, shots: 18, shots_on_target: 6, possession: 60, yellow_cards: 0 },
    away_stats: { xg: 0.7, shots: 7,  shots_on_target: 2, possession: 40, yellow_cards: 1 },
  },
]

test('counts wins, draws, losses correctly', () => {
  const stats = computeTeamStats(MATCHES, 'South Korea')
  expect(stats.wins).toBe(1)
  expect(stats.draws).toBe(1)
  expect(stats.losses).toBe(0)
})

test('computes avg xG for correctly', () => {
  const stats = computeTeamStats(MATCHES, 'South Korea')
  // home game: 1.8, away game: 0.7 → avg = 1.25
  expect(stats.avgXgFor).toBeCloseTo(1.25)
})

test('counts clean sheets', () => {
  // Korea conceded 1 in home game, 1 in away game → 0 clean sheets
  const stats = computeTeamStats(MATCHES, 'South Korea')
  expect(stats.cleanSheets).toBe(0)
})

test('returns zero stats for empty matches', () => {
  const stats = computeTeamStats([], 'South Korea')
  expect(stats.wins).toBe(0)
  expect(stats.avgXgFor).toBe(0)
  expect(stats.played).toBe(0)
})
