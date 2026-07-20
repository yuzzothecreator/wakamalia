import { createAuthClient } from "better-auth/react"
import {
  twoFactorClient,
  emailOTPClient,
} from "better-auth/client/plugins"

export const authClient = createAuthClient({
  // Use same-origin relative requests so auth works on any port
  // (e.g. when 3000 is busy and Next falls back to 3002).
  plugins: [twoFactorClient(), emailOTPClient()],
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
} = authClient
