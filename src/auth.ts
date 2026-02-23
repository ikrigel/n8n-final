import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

/**
 * NextAuth configuration for use in middleware
 * The actual handler is defined in src/app/api/auth/[...nextauth]/route.ts
 */
export const { auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    // Add user info to JWT token
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    // Add token info to session
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    // Redirect after sign in
    async redirect({ url, baseUrl }: any) {
      // Allow callbacks if they start with / (relative URL)
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allow callbacks if they are the same origin
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        return baseUrl;
      }
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
