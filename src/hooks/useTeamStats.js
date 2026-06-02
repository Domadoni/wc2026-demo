/**
 * computeTeamStats — aggregates match data for a given team name.
 * @param {Array} matches - array of match objects from api.matches
 * @param {string} teamName - exact team name as stored in the DB
 * @returns {object} aggregated stats
 */
export function computeTeamStats(matches, teamName) {
  if (!matches.length) {
    return { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0,
             cleanSheets: 0, avgXgFor: 0, avgXgAgainst: 0, avgShots: 0,
             avgShotsOnTarget: 0, avgPossession: 0, totalYellows: 0 }
  }

  let wins = 0, draws = 0, losses = 0, cleanSheets = 0
  let xgFor = 0, xgAgainst = 0, shots = 0, shotsOnTarget = 0
  let possession = 0, yellows = 0, goalsFor = 0, goalsAgainst = 0
  let statCount = 0

  for (const m of matches) {
    const isHome = m.home_team === teamName
    const myScore    = isHome ? m.home_score    : m.away_score
    const theirScore = isHome ? m.away_score     : m.home_score
    const myStats    = isHome ? m.home_stats     : m.away_stats

    if (myScore > theirScore) wins++
    else if (myScore === theirScore) draws++
    else losses++

    if (theirScore === 0) cleanSheets++
    goalsFor     += myScore    ?? 0
    goalsAgainst += theirScore ?? 0

    if (myStats) {
      xgFor        += myStats.xg               ?? 0
      xgAgainst    += (isHome ? m.away_stats?.xg : m.home_stats?.xg) ?? 0
      shots        += myStats.shots            ?? 0
      shotsOnTarget+= myStats.shots_on_target  ?? 0
      possession   += myStats.possession       ?? 0
      yellows      += myStats.yellow_cards     ?? 0
      statCount++
    }
  }

  const n = matches.length
  const s = statCount || 1

  return {
    played:          n,
    wins, draws, losses,
    goalsFor, goalsAgainst, cleanSheets,
    avgXgFor:        Math.round((xgFor / s) * 100) / 100,
    avgXgAgainst:    Math.round((xgAgainst / s) * 100) / 100,
    avgShots:        Math.round((shots / s) * 10) / 10,
    avgShotsOnTarget:Math.round((shotsOnTarget / s) * 10) / 10,
    avgPossession:   Math.round(possession / s),
    totalYellows:    yellows,
  }
}
