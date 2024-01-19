import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { defaultRoutes, routes } from "./app/models/route.model";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const session = req.nextauth.token;
    if (session && req.nextUrl.pathname === "/login") {
      const currentRole = session.user.currentRole;
      return NextResponse.redirect(new URL(defaultRoutes[currentRole?.name], req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname === "/login") return true;
        if (!token) return false;
        const currentRole = token.user.currentRole.name;
        const acceptedPaths = routes[currentRole];
        const isRolMatch = acceptedPaths.includes(req.nextUrl.pathname);
        return isRolMatch;
      }
    }
  }
);

export const config = {
  matcher: ["/login", "/admin/:path*"]
};
