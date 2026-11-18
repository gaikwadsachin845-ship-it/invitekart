import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get("language") ?? "en";
  const occasion = searchParams.get("occasion");
  const templates = await prisma.template.findMany({
    where: { status: "PUBLISHED", language, ...(occasion ? { occasion: occasion as never } : {}) },
    select: { id:true, slug:true, title:true, description:true, occasion:true, language:true, previewUrl:true, isFree:true, designJson:true },
    orderBy: { createdAt: "desc" },
  });
  const withCategory = templates.map(template => ({ ...template, category: (template.designJson as { category?: string } | null)?.category || template.occasion }));
  return NextResponse.json({ templates: withCategory }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
