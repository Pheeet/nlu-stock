import { prisma } from "@/lib/prisma";
import { requireAuth, json, notFound, error, parseBody, forbidden } from "@/lib/api-utils";
import { stockAdjustSchema } from "@/lib/validators";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (auth.denied) return auth.denied;
  if (auth.user.role === "INSTRUCTOR") return forbidden();

  const { id } = await params;
  const { data, error: parseError } = await parseBody(stockAdjustSchema)(request);
  if (parseError) return parseError;
  if (!data) return error("No data");

  const result = await prisma.$transaction(async (tx) => {
    const item = await tx.item.findUnique({ where: { id } });
    if (!item) throw new Error("NOT_FOUND");

    const checkedOut = item.totalQty - item.availableQty;
    const newAvailable = data.shelfCount;
    const newTotal = data.shelfCount + checkedOut;

    if (newAvailable === item.availableQty) throw new Error("SAME_QTY");

    const adjustment = await tx.stockAdjustment.create({
      data: {
        itemId: id,
        previousQty: item.availableQty,
        newQty: newAvailable,
        reason: data.reason,
        notes: data.notes,
        adjustedBy: auth.user.userId,
        imageEvidence: data.imageEvidence,
      },
    });

    await tx.item.update({
      where: { id },
      data: {
        availableQty: newAvailable,
        totalQty: newTotal,
      },
    });

    await tx.itemStatusLog.create({
      data: {
        itemId: id,
        previousStatus: item.status,
        newStatus: item.status,
        reason: `Stock adjusted: ${item.availableQty} → ${newAvailable} on shelf (${newTotal} total, ${checkedOut} checked out) (${data.reason})`,
        changedBy: auth.user.userId,
      },
    });

    return adjustment;
  }).catch((e: Error) => {
    if (e.message === "NOT_FOUND") return null;
    if (e.message === "SAME_QTY") return "SAME_QTY";
    throw e;
  });

  if (result === null) return notFound("Item not found");
  if (result === "SAME_QTY") return error("Shelf count is the same as current available quantity");

  return json(result, 201);
}
