import { encriptar } from "@/lib/utils/aes";
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
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session };
      }
      if (user) {
        try {
          const url = `${process.env.NEXT_PUBLIC_API_URL}/users/login`;
          const credentials = {
            email: user.email,
            password: encriptar(user.email!)
          };
          const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
              "Content-Type": "application/json"
            }
          });
          console.log(res);
          
          if (res.status !== 200) throw new Error("/login");
          const data = await res.json();
          console.log(data);
          const currentRole = data.data.roles[0];
          return { ...token, user: { ...data.data, currentRole } };
        } catch (error) {
          console.log({ error });
          throw new Error("/login");
        }
      }
      return token;
    },
    async session({ token, session }) {
      session.user = token.user;
      session.token = token.token;
      return session;
    }
  }
};
