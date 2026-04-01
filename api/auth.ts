import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const allowedDomain = process.env.GOOGLE_ALLOWED_DOMAIN;

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
    signIn: "/signin"
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) {
        return false;
      }

      if (allowedDomain) {
        const emailDomain = profile.email.split("@").at(1)?.toLowerCase();
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