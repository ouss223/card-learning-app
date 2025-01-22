import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import db from "./lib/db"; 
import { hash, compare } from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const client = await db.connect();
        try {
          // 1. Check if user exists
          const { rows } = await client.query(
            `SELECT * FROM users WHERE email = $1`,
            [credentials.email]
          );

          if (rows.length === 0) return null;

          const user = rows[0];
          
          // 2. Verify password for email/password users
          if (user.password_hash) {
            const isValid = await compare(credentials.password, user.password_hash);
            if (!isValid) return null;
          }

          // 3. Return user object
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image
          };
        } finally {
          client.release();
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        const client = await db.connect();
        try {
          const { rows } = await client.query(
            `SELECT email, name, image FROM users WHERE id = $1`,
            [token.id]
          );
          session.user = { ...session.user, ...rows[0] };
        } finally {
          client.release();
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error"
  }
});