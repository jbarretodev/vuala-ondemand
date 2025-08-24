import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // TODO: Replace with your actual authentication logic
        // This is a demo implementation - connect to your database/API
        if (credentials.email === "admin@vuala.com" && credentials.password === "password") {
          return {
            id: "1",
            email: credentials.email,
            name: "Admin User",
            role: "admin"
          }
        }

        if (credentials.email === "user@vuala.com" && credentials.password === "password") {
          return {
            id: "2",
            email: credentials.email,
            name: "Regular User",
            role: "user"
          }
        }

        return null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    })
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub ?? ""
        session.user.role = token.role
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? "your-secret-key-here",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
