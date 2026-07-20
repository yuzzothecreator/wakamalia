import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils"

const users = [
  { id: "u1", name: "Amina Okello", email: "amina@example.com", role: "TIPSTER", banned: false },
  { id: "u2", name: "Daniel K.", email: "daniel@example.com", role: "SUBSCRIBER", banned: false },
  { id: "u3", name: "Spam Bot", email: "spam@bad.com", role: "SUBSCRIBER", banned: true },
]

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage accounts, roles, and bans.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="divide-y divide-border">
          {users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <Avatar>
                <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-muted-foreground">{u.email}</p>
              </div>
              <Badge variant="secondary">{u.role}</Badge>
              {u.banned && <Badge variant="danger">Banned</Badge>}
              <Button variant="outline" size="sm">
                {u.banned ? "Unban" : "Ban"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
