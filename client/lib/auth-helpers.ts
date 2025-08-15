import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";

export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  return session;
}

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return session;
}