import { redirect } from "next/navigation"
import { getSession, getDbUserRole } from "@/lib/session"
import { ROUTES } from "@/config/site"
import { NewPredictionForm } from "./new-prediction-form"

export const metadata = {
  title: "New Prediction | Wakamalia",
}

export default async function NewPredictionPage() {
  const session = await getSession()
  if (!session?.user) {
    redirect(
      `${ROUTES.login}?callbackUrl=${encodeURIComponent(ROUTES.dashboard.create)}`
    )
  }

  const role = await getDbUserRole(session.user.id)
  if (role !== "TIPSTER" && role !== "ADMIN") {
    redirect(ROUTES.dashboard.become)
  }

  return <NewPredictionForm />
}
