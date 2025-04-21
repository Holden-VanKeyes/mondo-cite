import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'
import type { NextAuthConfig } from 'next-auth'
import db from './db'
import { Pool } from 'pg'
import PostgresAdapter from '@auth/pg-adapter'

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export const config = {
  adapter: PostgresAdapter(pool),
  providers: [
    Auth0Provider({
      id: 'auth0-login',
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER,
      // Default login configuration
    }),
    Auth0Provider({
      id: 'auth0-signup',
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER,
      authorization: {
        params: {
          screen_hint: 'signup',
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, profile }) {
      try {
        // Check if we need to add custom data
        // const dbUser = await db('users').where('email', user.email).first()

        // if (!dbUser) {
        // Add our custom fields
        await db('users')
          .where('email', user.email)
          .update({
            plan: 'free',
            citation_count: 0,
            name: profile?.nickname || user.email,
          })
        // }
        return true
      } catch (error) {
        console.error('Error syncing user:', error)
        return true // still allow sign in even if custom data fails
      }
    },
    async jwt({ token, account, profile }) {
      console.log('JWT Callback:', { token, account, profile })
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, user }) {
      // Instead of user.id, we'll use token
      console.log('hit session', session, 'user', user)
      return session
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
