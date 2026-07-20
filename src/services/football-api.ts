export interface LiveMatch {
  id: string
  homeTeam: string
  awayTeam: string
  league: string
  kickoff: string
  status: "SCHEDULED" | "LIVE" | "FINISHED"
  score?: { home: number; away: number }
}

export interface SettlementResult {
  predictionId: string
  status: "WON" | "LOST" | "VOID"
  finalScore?: { home: number; away: number }
  settledAt: string
}

export async function fetchLiveScores(
  league?: string
): Promise<LiveMatch[]> {
  console.info("[football-api] fetchLiveScores stub", { league })

  return [
    {
      id: "m1",
      homeTeam: "Arsenal",
      awayTeam: "Brighton",
      league: "Premier League",
      kickoff: new Date(Date.now() + 3600000).toISOString(),
      status: "SCHEDULED",
    },
    {
      id: "m2",
      homeTeam: "Real Madrid",
      awayTeam: "Sevilla",
      league: "La Liga",
      kickoff: new Date().toISOString(),
      status: "LIVE",
      score: { home: 1, away: 0 },
    },
  ]
}

export async function fetchMatchById(matchId: string): Promise<LiveMatch | null> {
  const matches = await fetchLiveScores()
  return matches.find((m) => m.id === matchId) ?? null
}

export async function settlePrediction(
  predictionId: string,
  _pick: string
): Promise<SettlementResult> {
  console.info("[football-api] settlePrediction stub", { predictionId })

  return {
    predictionId,
    status: "WON",
    finalScore: { home: 2, away: 1 },
    settledAt: new Date().toISOString(),
  }
}

export async function searchFixtures(query: string): Promise<LiveMatch[]> {
  const all = await fetchLiveScores()
  const q = query.toLowerCase()
  return all.filter(
    (m) =>
      m.homeTeam.toLowerCase().includes(q) ||
      m.awayTeam.toLowerCase().includes(q) ||
      m.league.toLowerCase().includes(q)
  )
}
