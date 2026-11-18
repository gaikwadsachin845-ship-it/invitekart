import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body || !["PRIVATE", "PUBLIC"].includes(body.visibility)) {
    return NextResponse.json({ error: "Choose Public or Private." }, { status: 400 });
  }
  const template = await prisma.template.update({
    where: { id },
    data: { status: body.visibility === "PUBLIC" ? "PUBLISHED" : "DRAFT" },
    select: { id: true, status: true },
  });
  return NextResponse.json({ template });
}
