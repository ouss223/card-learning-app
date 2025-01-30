import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./lib/db";
import { compare } from "bcryptjs";
import jwt from 'jsonwebtoken';

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
            `SELECT id, email,role, password, username,image FROM users WHERE email = ?`, 
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

          const token = jwt.sign(
            { userId: user.id.toString(),
              role : user.role
             },
            process.env.AUTH_SECRET,
            { expiresIn: '200h' }
          );
          console.log("role : " , user.role);
      
          return {
            id: user.id,
            email: user.email,
            name: user.username,
            image: user.image || null,
            accessToken: token,
            role : user.role
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
      console.log("=== JWT Callback ===");
      console.log("user : " , user);
      if (user) {
        let id = user.id;
        let accessToken = user.accessToken;
        let role = user.role;
        if ((typeof id !== 'number' || isNaN(Number(id)) ) && role != "admin") {
          const [idd] = await db.queryAsync(
          `SELECT id FROM users WHERE email = ?`, 
          [user.email]
          );
          console.log("idd : " , idd);
          id = idd.id;
          role = "user";
          accessToken = jwt.sign(
            { userId: id.toString(),
              role : "user"
             },
            process.env.AUTH_SECRET,
            { expiresIn: '200h' }
            );

        }
        
        token.id = id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.accessToken = accessToken;
        token.role = role ;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("=== SESSION Callback ===");
      console.log("user : " , token);
      session.user = {
        ...session.user,
        id: token.id,
        email: token.email,
        name: token.name,
        image : token.image,
        role : token.role,
        accessToken: token.accessToken
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
