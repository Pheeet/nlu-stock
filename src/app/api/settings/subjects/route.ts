import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subjects = await prisma.subject.findMany({
    where: { isActive: true },
    orderBy: { code: "asc" },
  });
  return NextResponse.json(subjects);
}
