import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { Occasion, Prisma, TemplateStatus } from "@prisma/client";

const schema = z.object({
  title: z.string().trim().min(2).max(100),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(300).optional().default(""),
  category: z.enum(["Wedding", "Birthday", "Engagement", "Baby shower", "Housewarming", "Festival"]),
  language: z.enum(["en", "hi", "mr", "kn", "ta", "te"]).default("en"),
  previewUrl: z.string().min(1).max(3_000_000),
  heading: z.string().trim().min(1).max(120),
  tag: z.string().trim().max(120).default(""),
  background: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  foreground: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});
const occasionMap: Record<string, Occasion> = {
  Wedding: Occasion.WEDDING, Birthday: Occasion.BIRTHDAY, Engagement: Occasion.ENGAGEMENT,
  "Baby shower": Occasion.BABY_SHOWER, Housewarming: Occasion.HOUSEWARMING, Festival: Occasion.OTHER,
};

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check all template fields and image size." }, { status: 400 });
  const value = parsed.data;
  try {
    const template = await prisma.template.update({
      where: { id },
      data: {
        title: value.title, slug: value.slug, description: value.description,
        occasion: occasionMap[value.category], language: value.language,
        previewUrl: value.previewUrl, status: value.status as TemplateStatus,
        designJson: { heading: value.heading, tag: value.tag, background: value.background, foreground: value.foreground } as Prisma.InputJsonValue,
      },
    });
    return NextResponse.json({ template });
  } catch {
    return NextResponse.json({ error: "Could not update this template. Check that its URL/slug is unique." }, { status: 400 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  try {
    await prisma.template.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete this template." }, { status: 404 });
  }
}
