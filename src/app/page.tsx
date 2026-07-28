import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { LandingPage } from "@/components/landing/landing-page"
import { listPredictions, listTipsters } from "@/server/data/catalog"

export default async function HomePage() {
  const [predictions, tipsters] = await Promise.all([
    listPredictions({ page: 1, limit: 6 }),
    listTipsters({ sort: "roi", limit: 3 }),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LandingPage
          predictions={predictions.items}
          tipsters={tipsters as never}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
