import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getProfileForUser } from "@/server/data/catalog"
import { ROUTES } from "@/config/site"
import { SettingsClient } from "./settings-client"

export default async function SettingsPage() {
  const session = await getSession()
  if (!session?.user) redirect(ROUTES.login)

  const user = await getProfileForUser(session.user.id)
  const username =
    user?.profile?.username ??
    session.user.email?.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "") ??
    "user"

  return (
    <SettingsClient
      defaultValues={{
        username,
        bio: user?.profile?.bio ?? "",
        country: user?.profile?.country ?? "",
        website: user?.profile?.website ?? "",
        twitter: user?.profile?.twitter ?? "",
        instagram: user?.profile?.instagram ?? "",
        telegram: user?.profile?.telegram ?? "",
      }}
    />
  )
}
