import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
const bcrypt = require('bcryptjs');
import usersData from '../../public/Storage/User/user.json';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        const user = usersData.data.find(user => user.username === credentials?.username);

        if (user) {
          const isValid = await bcrypt.compare(credentials!.password, user.password);
          if (isValid) {
            return {
              id: user.id,
              name: user.name,
              username: user.username,
              role: user.role,
              image: user.image
            };
          }
        }
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 36 * 24 * 60 * 60, // 36 days in seconds
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.username = user.username;
        token.image = user.image;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        username: token.username,
        image: token.image,
        role: token.role,
      };
      return session;
    }
  }
};
