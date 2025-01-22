import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import db from "./lib/db";
import { compare } from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const [rows] = await db.query(
            `SELECT * FROM users WHERE email = ?`,  // Changed to MySQL placeholder
            [credentials.email]
          );

          if (rows.length === 0) return null;
          const user = rows[0];

          if (user.password_hash) {
            const isValid = await compare(credentials.password, user.password_hash);
            if (!isValid) return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.username,  // Changed from user.name
            image: user.image
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
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
        try {
          const [rows] = await db.query(
            `SELECT email, username, image FROM users WHERE id = ?`,  // Changed to MySQL placeholder
            [token.id]
          );
          
          if (rows.length > 0) {
            session.user = {
              ...session.user,
              ...rows[0],
              id: token.id,
              name: rows[0].username  // Map username to name
            };
          }
        } catch (error) {
          console.error("Session error:", error);
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth/error"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET
});