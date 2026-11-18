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
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

const occasionMap: Record<string, Occasion> = {
  Wedding: Occasion.WEDDING,
  Birthday: Occasion.BIRTHDAY,
  Engagement: Occasion.ENGAGEMENT,
  "Baby shower": Occasion.BABY_SHOWER,
  Housewarming: Occasion.HOUSEWARMING,
  Festival: Occasion.OTHER,
};

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const templates = await prisma.template.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ templates });
}

export async function DELETE() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await prisma.template.deleteMany({});
  return NextResponse.json({ ok: true, deleted: result.count });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check all template fields and image size." }, { status: 400 });
  const value = parsed.data;
  try {
    const template = await prisma.template.create({
      data: {
        title: value.title,
        slug: value.slug,
        description: value.description,
        occasion: occasionMap[value.category],
        language: value.language,
        previewUrl: value.previewUrl,
        status: value.status as TemplateStatus,
        designJson: { heading: value.heading, tag: value.tag, background: value.background, foreground: value.foreground } as Prisma.InputJsonValue,
        isFree: true,
      },
    });
    return NextResponse.json({ template }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Could not save this template. Check that its URL/slug is unique." }, { status: 400 });
  }
}
