import Link from "next/link"
import { StatCard } from "@/components/shared/stat-card"
import {
  Users,
  Target,
  DollarSign,
  ArrowDownToLine,
  BadgeCheck,
  Flag,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { ROUTES } from "@/config/site"
import { Button } from "@/components/ui/button"

const overview = {
  totalUsers: 1284,
  totalTipsters: 86,
  totalPredictions: 4210,
  totalRevenue: 98420,
  pendingWithdrawals: 7,
  pendingVerifications: 3,
  openReports: 2,
}

export default function AdminOverviewPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin overview</h1>
        <p className="text-muted-foreground">Platform health and moderation queue.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total users" value={overview.totalUsers.toLocaleString()} icon={Users} />
        <StatCard title="Tipsters" value={String(overview.totalTipsters)} icon={Users} />
        <StatCard title="Predictions" value={overview.totalPredictions.toLocaleString()} icon={Target} />
        <StatCard title="Revenue" value={formatCurrency(overview.totalRevenue)} icon={DollarSign} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Pending withdrawals"
          value={String(overview.pendingWithdrawals)}
          icon={ArrowDownToLine}
        />
        <StatCard
          title="Verification requests"
          value={String(overview.pendingVerifications)}
          icon={BadgeCheck}
        />
        <StatCard title="Open reports" value={String(overview.openReports)} icon={Flag} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline">
          <Link href={ROUTES.admin.withdrawals}>Review withdrawals</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.admin.verifications}>Review verifications</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.admin.reports}>View reports</Link>
        </Button>
      </div>
    </div>
  )
}
