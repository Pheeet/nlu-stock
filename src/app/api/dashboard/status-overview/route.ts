import { prisma } from "@/lib/prisma";
import { requireAuth, json } from "@/lib/api-utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.denied) return auth.denied;

  const groups = await prisma.item.groupBy({
    by: ["status"],
    where: { isActive: true },
    _count: { status: true },
  });

  const data = groups.map((g) => ({
    status: g.status,
    count: g._count.status,
  }));

  return json(data);
}
