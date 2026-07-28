import Link from "next/link"
import { format } from "date-fns"
import { ArrowRight, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/server/db"
import { APP_NAME } from "@/config/site"

export const metadata = {
  title: "Blog | Wakamalia",
  description: "Tips, platform updates, and creator stories.",
}

export default async function BlogPage() {
  let posts: {
    slug: string
    title: string
    excerpt: string | null
    authorName: string | null
    publishedAt: Date | null
  }[] = []

  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        authorName: true,
        publishedAt: true,
      },
    })
  } catch {
    posts = []
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Creator guides, product updates, and responsible betting insights from{" "}
          {APP_NAME}.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No published posts yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="secondary">{post.authorName ?? "Wakamalia"}</Badge>
                {post.publishedAt && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    {format(post.publishedAt, "MMM d, yyyy")}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary">
                {post.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Article</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
