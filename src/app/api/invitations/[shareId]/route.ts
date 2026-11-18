import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(_: Request, context: { params: Promise<{shareId:string}> }) {
  const { shareId } = await context.params;
  const invitation = await prisma.invitation.findUnique({ where:{shareId}, select:{title:true,language:true,designJson:true,createdAt:true} });
  if (!invitation) return NextResponse.json({error:"Invitation not found"},{status:404});
  return NextResponse.json({invitation});
}
