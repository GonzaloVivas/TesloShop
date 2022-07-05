import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

export default NextAuth({
  providers: [

    Credentials({
      name: 'Custom login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'correo@correo.com' },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'contraseña' }
      },
      async authorize(credentials) {

        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );

      }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

  ],

  // Custom pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  session: {
    maxAge: 2592000, // 30 days
    strategy: 'jwt',
    updateAge: 86400 // 24 hours
  },

  // Callbacks
  callbacks: {

    async jwt({ token, account, user }) {

      if ( account ) {
        token.accessToken = account.access_token;

        switch ( account.type ) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '');
            break;
          case 'credentials':
            token.user = user;
            break;
        }

      }

      return token;
    },

    async session({ session, token, user }) {

      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    }

  }
})