import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('NextAuth - Attempting login for:', credentials.email);
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password
          });

          console.log('NextAuth - Login response:', response.data);

          if (response.data.token) {
            const userData = {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.name,
              role: response.data.user.role,
              company: response.data.user.company,
              token: response.data.token
            };
            console.log('NextAuth - Returning user data:', userData);
            return userData;
          }
          return null;
        } catch (error) {
          console.error('NextAuth - Auth error:', error.response?.data?.message || error.message);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('NextAuth JWT callback - User data:', user);
        token.role = user.role;
        token.company = user.company;
        token.accessToken = user.token;
        token.userId = user.id; // Store the user ID from backend
      }
      console.log('NextAuth JWT callback - Token:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('NextAuth Session callback - Token:', token);
      session.user.id = token.userId || token.sub; // Use stored userId or fallback to sub
      session.user.role = token.role;
      session.user.company = token.company;
      session.accessToken = token.accessToken;
      console.log('NextAuth Session callback - Session:', session);
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST };

