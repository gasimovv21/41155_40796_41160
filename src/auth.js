import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { login } from "./services/auth-service";
import { getIsTokenValid } from "./helpers/auth";

const config = {
  trustHost: true,
  trustHostedDomain: true,

  providers: [
    Credentials({
      async authorize(credentials) {
        const res = await login(credentials);
        const data = await res.json();

        // console.log("🔐 Backend response status:", res.status);
        // console.log("🔐 Backend response body:", data);

        if (!res.ok) return null;

        const payload = {
          user: {
            id: data.user_id,
            name: `${data.first_name}`,
          },
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };

        return payload;
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,

  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isSignedIn = !!auth?.user;
      const isTokenValid = getIsTokenValid(auth?.accessToken);

      const isOnSigninPage = nextUrl.pathname.startsWith("/sign-in");
      const isProtectedPage =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/bank");

      if (isSignedIn && isTokenValid) {
        if (isOnSigninPage) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (isProtectedPage) {
        const redirectUrl = new URL("/sign-in", nextUrl);
        redirectUrl.searchParams.set(
          "error",
          "Your session has expired or you are not authorized."
        );
        return Response.redirect(redirectUrl);
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = user.user;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },

    async session({ session, token }) {
      const isTokenValid = getIsTokenValid(token.accessToken);
      if (!isTokenValid) return null;

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = token.user;
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);