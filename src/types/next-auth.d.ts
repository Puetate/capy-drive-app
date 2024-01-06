import "next-auth";

export interface User {
  id: string;
  name: string;
  email: string;
  image: null;
}

declare module "next-auth" {
  interface Session {
    user: User;
    token: string;
  }
}

import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
    token: string;
  }
}
