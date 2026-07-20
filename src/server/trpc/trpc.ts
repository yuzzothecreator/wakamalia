import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/server/db"
import type { Role } from "@/types"

export async function createTRPCContext(opts: { headers: Headers }) {
  const session = await auth.api.getSession({ headers: opts.headers })
  return {
    prisma,
    session,
    headers: opts.headers,
  }
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      session: ctx.session,
      user: ctx.session.user,
    },
  })
})

export const protectedProcedure = t.procedure.use(isAuthed)

export function roleProcedure(roles: Role[]) {
  return protectedProcedure.use(({ ctx, next }) => {
    const role = (ctx.user as { role?: Role }).role ?? "SUBSCRIBER"
    if (role !== "ADMIN" && !roles.includes(role)) {
      throw new TRPCError({ code: "FORBIDDEN" })
    }
    return next({ ctx })
  })
}
