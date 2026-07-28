import { redirect } from "next/navigation"
import { format } from "date-fns"
import { getSession } from "@/lib/session"
import { getWalletData } from "@/server/data/catalog"
import { ROUTES } from "@/config/site"
import { WalletClient } from "./wallet-client"

export default async function WalletPage() {
  const session = await getSession()
  if (!session?.user) redirect(ROUTES.login)

  const wallet = await getWalletData(session.user.id)

  return (
    <WalletClient
      balance={wallet.balance}
      pendingWithdrawals={wallet.pendingWithdrawals}
      activity={wallet.transactions.map((t) => ({
        id: t.id,
        label: t.label,
        amount: t.amount,
        date: format(t.date, "MMM d"),
      }))}
    />
  )
}
