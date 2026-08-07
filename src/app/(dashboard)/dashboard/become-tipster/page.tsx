import { redirect } from "next/navigation"
import { getSession, getDbUserRole } from "@/lib/session"
import { getProfileForUser } from "@/server/data/catalog"
import { ROUTES } from "@/config/site"
import { BecomeTipsterForm } from "./become-tipster-form"

export const metadata = {
  title: "Become a Tipster | Wakamalia",
  description: "Start publishing tips and earning from subscribers.",
}

export default async function BecomeTipsterPage() {
  const session = await getSession()
  if (!session?.user) {
    redirect(
      `${ROUTES.login}?callbackUrl=${encodeURIComponent(ROUTES.dashboard.become)}`
    )
  }

  const role = await getDbUserRole(session.user.id)
  if (role === "TIPSTER" || role === "ADMIN") {
    redirect(ROUTES.dashboard.tipster)
  }

  const user = await getProfileForUser(session.user.id)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Become a tipster</h1>
        <p className="mt-2 text-muted-foreground">
          Activate your creator account to publish tips, grow followers, and get paid.
        </p>
      </div>
      <BecomeTipsterForm
        defaultBio={user?.profile?.bio ?? ""}
        defaultCountry={user?.profile?.country ?? ""}
      />
    </div>
  )
}
