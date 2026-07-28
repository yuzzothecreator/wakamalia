import { NextResponse } from "next/server"
import { getLeaderboard } from "@/server/data/catalog"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const metric = (searchParams.get("metric") ?? "roi") as
    | "roi"
    | "winRate"
    | "followers"
    | "earnings"
    | "accuracy"

  const items = await getLeaderboard(metric)
  return NextResponse.json({ items })
}
