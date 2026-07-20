export interface TipsterInsight {
  tipsterId: string
  summary: string
  strengths: string[]
  risks: string[]
  confidence: number
}

export interface FraudSignal {
  userId: string
  score: number
  reasons: string[]
  severity: "LOW" | "MEDIUM" | "HIGH"
}

export interface Recommendation {
  predictionId: string
  score: number
  reason: string
}

export async function generateTipsterInsights(
  tipsterId: string
): Promise<TipsterInsight> {
  console.info("[ai] generateTipsterInsights stub", { tipsterId })

  return {
    tipsterId,
    summary:
      "Consistent ROI with disciplined unit staking. Strong in football handicaps.",
    strengths: ["High win rate on home favorites", "Transparent track record"],
    risks: ["Limited sample on basketball", "Odds clustering around 1.7–2.0"],
    confidence: 0.82,
  }
}

export async function detectFraud(userId: string): Promise<FraudSignal> {
  console.info("[ai] detectFraud stub", { userId })

  return {
    userId,
    score: 0.12,
    reasons: [],
    severity: "LOW",
  }
}

export async function recommendPredictions(
  userId: string,
  limit = 5
): Promise<Recommendation[]> {
  console.info("[ai] recommendPredictions stub", { userId, limit })

  return Array.from({ length: limit }, (_, i) => ({
    predictionId: `p${i + 1}`,
    score: 0.9 - i * 0.08,
    reason: "Matches your followed sports and tipster preferences",
  }))
}

export async function summarizeAnalysis(text: string): Promise<string> {
  if (text.length <= 200) return text
  return `${text.slice(0, 197)}…`
}
