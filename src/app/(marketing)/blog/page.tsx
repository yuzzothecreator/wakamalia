import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { APP_NAME } from "@/config/site"

export const metadata = {
  title: "Blog | Wakamalia",
  description: "Tips, platform updates, and creator stories.",
}

const posts = [
  {
    slug: "how-to-verify-roi",
    title: "How Wakamalia verifies tipster ROI",
    excerpt:
      "A transparent look at how we calculate performance, settle predictions, and protect subscribers.",
    category: "Product",
    date: "Jul 12, 2026",
    readTime: "6 min",
  },
  {
    slug: "mpesa-payouts-guide",
    title: "Getting paid via M-Pesa as a tipster",
    excerpt:
      "Step-by-step guide to linking M-Pesa, requesting withdrawals, and understanding platform fees.",
    category: "Creators",
    date: "Jul 8, 2026",
    readTime: "4 min",
  },
  {
    slug: "building-trust",
    title: "5 ways to build subscriber trust without hype",
    excerpt:
      "Verified stats, consistent staking, and honest loss reporting beat flashy win screenshots every time.",
    category: "Strategy",
    date: "Jun 28, 2026",
    readTime: "5 min",
  },
  {
    slug: "swahili-launch",
    title: `${APP_NAME} now supports Kiswahili`,
    excerpt:
      "Switch your locale in settings for a fully localized experience across marketing and dashboard flows.",
    category: "Updates",
    date: "Jun 15, 2026",
    readTime: "2 min",
  },
]

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Creator guides, product updates, and responsible betting insights.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="secondary">{post.category}</Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                {post.date}
              </span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary">
              {post.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{post.readTime} read</span>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Read more
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
