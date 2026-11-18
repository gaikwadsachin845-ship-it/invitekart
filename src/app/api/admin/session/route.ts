import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/admin-auth";

export async function GET() {
  const email = await getAdminEmail();
  return NextResponse.json({ authenticated: Boolean(email) });
}
