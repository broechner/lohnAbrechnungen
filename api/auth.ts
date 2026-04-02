import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const allowedDomain = process.env.GOOGLE_ALLOWED_DOMAIN;
const allowedEmails = (process.env.GOOGLE_ALLOWED_EMAILS ?? "")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

export const authOptions: NextAuthOptions = {
  providers:
    googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret
          })
        ]
      : [],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/signin",
    error: "/signin"
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) {
        return false;
      }

      const email = profile.email.toLowerCase();

      if (allowedEmails.length > 0) {
        return allowedEmails.includes(email);
      }

      if (allowedDomain) {
        const emailDomain = email.split("@").at(1)?.toLowerCase();
        return emailDomain === allowedDomain.toLowerCase();
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
      }
      return session;
    }
  }
};