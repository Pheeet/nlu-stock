import { z } from "zod";

const receiveItemSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(1),
  lotNumber: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
  subCodes: z.array(z.string()).optional().nullable(),
});

// lotNumber enforced at API handler level where category type is known from DB
export const receiveRequestSchema = z.object({
  items: z.array(receiveItemSchema).min(1, "At least one item required"),
  notes: z.string().max(500).optional().nullable(),
});
