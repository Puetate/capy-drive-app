import { Career } from "@/app/models/career.model";
import { Role } from "@/app/models/role.model";
import "next-auth";

export interface User {
  id: number;
  names: string;
  surnames: string;
  phone: string;
  dni: string;
  email: string;
  roles: Role[];
  currentRole: Role;
  careers: Career[];
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
