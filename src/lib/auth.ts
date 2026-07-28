import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { expo } from "@better-auth/expo"
import { twoFactor, emailOTP } from "better-auth/plugins"
import { prisma } from "@/server/db"
import { APP_NAME } from "@/config/site"

const appUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
const isDev = process.env.NODE_ENV !== "production"

export const auth = betterAuth({
  appName: APP_NAME,
  baseURL: appUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // Allow local signup without a mail provider; enable OTP via emailOTP plugin
    requireEmailVerification: false,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      if (process.env.NODE_ENV !== "production") {
        console.info(`[auth] Password reset for ${user.email}: ${url}`)
      }
      // TODO: send via email provider in production
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      if (process.env.NODE_ENV !== "production") {
        console.info(`[auth] Verify email for ${user.email}: ${url}`)
      }
    },
  },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "SUBSCRIBER",
        required: false,
        input: false,
      },
      banned: {
        type: "boolean",
        defaultValue: false,
        required: false,
        input: false,
      },
      locale: {
        type: "string",
        defaultValue: "en",
        required: false,
      },
      referralCode: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              referralCode: user.referralCode ?? crypto.randomUUID().slice(0, 8),
            },
          }
        },
        after: async (user) => {
          // Provision profile + wallet for every new account
          try {
            const base =
              user.name
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, "")
                .slice(0, 16) || "user"
            const username = `${base}${Math.floor(Math.random() * 900 + 100)}`
            await prisma.profile.create({
              data: {
                userId: user.id,
                username,
              },
            })
            await prisma.wallet.create({
              data: { userId: user.id },
            })
          } catch (error) {
            console.error("[auth] post-signup provisioning failed", error)
          }
        },
      },
    },
  },
  plugins: [
    expo(),
    twoFactor({
      issuer: APP_NAME,
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      async sendVerificationOTP({ email, otp, type }) {
        if (process.env.NODE_ENV !== "production") {
          console.info(`[auth] OTP (${type}) for ${email}: ${otp}`)
        }
      },
    }),
  ],
  trustedOrigins: [
    appUrl,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    // Expo / React Native deep links
    "wakamalia://",
    "wakamalia://*",
    ...(isDev
      ? [
          "exp://",
          "exp://**",
          "exp://192.168.*.*:*/**",
          "exp://10.0.*.*:*/**",
        ]
      : []),
  ],
})

export type Session = typeof auth.$Infer.Session
