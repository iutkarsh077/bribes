import { NextRequest } from "next/server";

export function getAdminEmail(): string {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error("ADMIN_EMAIL is missing");
    return "";
  }

  return adminEmail;
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD is missing");
    return false;
  }

  const adminCookie = request.cookies.get("admin_session");
  const authHeader = request.headers.get("authorization");

  if (adminCookie?.value === "authenticated") return true;
  if (authHeader === `Bearer ${adminPassword}`) return true;
  return false;
}
