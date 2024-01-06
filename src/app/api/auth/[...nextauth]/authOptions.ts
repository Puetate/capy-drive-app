import { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

const env = process.env;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 14 * 24 * 60 * 60 // 14 days in seconds
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    AzureADProvider({
      clientId: `${env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID}`,
      clientSecret: `${env.NEXT_PUBLIC_AZURE_AD_CLIENT_SECRET}`,
      tenantId: `${env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}`,

      authorization: {
        params: { scope: "openid email profile User.Read offline_access" }
      },
      httpOptions: { timeout: 10000 }
    })
  ],
  callbacks: {
    signIn({ user, account, email }) {
      console.log({ user, account, email });
      return true;
    },
    jwt({ token, user, account }) {
      console.log({ token });

      return token;
    },
    session({ token, session }) {
      return session;
    }
  }
};
