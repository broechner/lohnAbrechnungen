import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const allowedDomain = process.env.GOOGLE_ALLOWED_DOMAIN;
const allowAnyGoogleUser = process.env.AUTH_ALLOW_ANY_GOOGLE_USER === "true";
const explicitlyAllowedDomain = "abbi.ch";
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
      const emailDomain = email.split("@").at(1)?.toLowerCase();

      // Explicitly allow any user in the company domain.
      if (emailDomain === explicitlyAllowedDomain) {
        return true;
      }

      if (allowedEmails.length > 0) {
        return allowedEmails.includes(email);
      }

      if (allowedDomain) {
        return emailDomain === allowedDomain.toLowerCase();
      }

      // Fail closed by default. Explicitly set AUTH_ALLOW_ANY_GOOGLE_USER=true to allow all Google accounts.
      return allowAnyGoogleUser;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
      }
      return session;
    }
  }
};