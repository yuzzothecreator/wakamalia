import { NextResponse } from "next/server"
import { listPredictions, listTipsters } from "@/server/data/catalog"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.trim() ?? ""

  if (!q) {
    return NextResponse.json({ predictions: [], tipsters: [] })
  }

  const [predictions, tipsters] = await Promise.all([
    listPredictions({ q, page: 1, limit: 20 }),
    listTipsters({ q, limit: 20 }),
  ])

  return NextResponse.json({
    predictions: predictions.items,
    tipsters,
  })
}
