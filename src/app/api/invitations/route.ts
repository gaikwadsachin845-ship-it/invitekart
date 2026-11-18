import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
const schema = z.object({
  templateId: z.string().optional(),
  title: z.string().trim().min(1).max(120),
  language: z.enum(["en","hi","mr","kn","ta","te"]),
  designJson: z.record(z.string(), z.unknown()),
});
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error:"Invalid invitation data", details:parsed.error.flatten() }, { status:400 });
  const invitation = await prisma.invitation.create({
  data: {
    ...parsed.data,
    designJson: parsed.data.designJson as Prisma.InputJsonValue,
  },
});
  return NextResponse.json({ id:invitation.id, shareId:invitation.shareId }, { status:201 });
}
