import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(req) {
  const { cookies } = req;
  const jwtToken = cookies.get("auth_token");

  if (!jwtToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = verify(jwtToken, process.env.JWT_SECRET);
    const requiredRoleMiddleware = (requiredRole) => (req, res, next) => {
    if (decoded.user.role.name === requiredRole || decoded.user.role.permissions.includes('edit')) {
      return NextResponse.next();}
    }
  } catch (error) {
    console.error(error);
  }

  return NextResponse.redirect(new URL("/unauthorized", req.url));
}

export const config = {
  matcher: ["/protected-route*"], // Apply middleware to specific routes
};
