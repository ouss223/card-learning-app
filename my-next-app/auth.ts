import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./lib/db";
import { compare } from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("=== Authorization Attempt ===");
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Missing credentials");
            return null;
          }
      
          const email = credentials.email.trim().toLowerCase();
          const password = credentials.password.trim();
      
          console.log("🔍 Querying user:", email);
          const [user] = await db.queryAsync(
            `SELECT id, email, password, username,image FROM users WHERE email = ?`, 
            [email]
          );
      
          if (!user) {
            console.log("❌ User not found");
            return null;
          }
      
          console.log("✅ User found - ID:", user.id);
      
          console.log("🔒 Comparing passwords...");
          const isValid = await compare(password, user.password.toString());
          console.log(isValid ? "✅ Password valid" : "❌ Invalid password");
      
          if (!isValid) return null;
          console.log("user image : " , user.image);
      
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.username,
            image: user.image || null
          };
      
        } catch (error) {
          console.error("🔥 Authorization error:", error);
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
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        email: token.email,
        name: token.name,
        image : token.image
      };
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
