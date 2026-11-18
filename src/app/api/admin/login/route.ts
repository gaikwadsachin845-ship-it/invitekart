import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { email, password } = await request.json().catch(() => ({}));
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Admin login is not configured yet." }, { status: 503 });
  }
  if (typeof email !== "string" || typeof password !== "string" || email.toLowerCase() !== adminEmail.toLowerCase()) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }
  const supplied = Buffer.from(password);
  const expected = Buffer.from(adminPassword);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }
  await createAdminSession(adminEmail);
  return NextResponse.json({ ok: true });
}
