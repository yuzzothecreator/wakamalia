"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getInitials } from "@/lib/utils"
import { cn } from "@/lib/utils"

const threads = [
  {
    id: "t1",
    name: "Daniel K.",
    preview: "Thanks for the premium slip!",
    unread: 1,
    messages: [
      { id: "m1", from: "them", text: "Hey, loved your Arsenal pick yesterday.", time: "10:30" },
      { id: "m2", from: "me", text: "Glad it helped — more PL picks coming this weekend.", time: "10:45" },
      { id: "m3", from: "them", text: "Thanks for the premium slip!", time: "11:02" },
    ],
  },
  {
    id: "t2",
    name: "Grace M.",
    preview: "When is the next subscription drop?",
    unread: 0,
    messages: [
      { id: "m4", from: "them", text: "When is the next subscription drop?", time: "Yesterday" },
    ],
  },
]

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(threads[0].id)
  const [draft, setDraft] = useState("")
  const active = threads.find((t) => t.id === activeId) ?? threads[0]

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-5xl overflow-hidden rounded-2xl border border-border bg-card">
      <aside className="hidden w-72 shrink-0 border-r border-border md:block">
        <div className="border-b border-border px-4 py-4">
          <h1 className="font-semibold">Messages</h1>
        </div>
        <div className="divide-y divide-border">
          {threads.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(t.id)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/50",
                activeId === t.id && "bg-secondary/60"
              )}
            >
              <Avatar className="size-9">
                <AvatarFallback>{getInitials(t.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.name}</p>
                <p className="truncate text-xs text-muted-foreground">{t.preview}</p>
              </div>
              {t.unread > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {t.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-border px-4 py-3">
          <p className="font-medium">{active.name}</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {active.messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                m.from === "me"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-secondary"
              )}
            >
              {m.text}
              <p className="mt-1 text-xs opacity-70">{m.time}</p>
            </div>
          ))}
        </div>
        <form
          className="flex gap-2 border-t border-border p-4"
          onSubmit={(e) => {
            e.preventDefault()
            setDraft("")
          }}
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
          />
          <Button type="submit" size="icon">
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
