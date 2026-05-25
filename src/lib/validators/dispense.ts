import { z } from "zod";

export const cartItemSchema = z.object({
  itemId: z.string().min(1),
  itemCode: z.string(),
  itemName: z.string(),
  categoryName: z.string(),
  categoryType: z.enum(["CONSUMABLE", "DURABLE", "FIXED_ASSET", "BOOK"]),
  trackIndividually: z.boolean(),
  issueUnit: z.string(),
  subUnit: z.string(),
  conversionFactor: z.number().int().min(1),
  quantity: z.number().int().min(1),
  quantitySub: z.number().int().min(0).default(0),
  lotId: z.string().optional().nullable(),
  lotNumber: z.string().optional().nullable(),
  subItemId: z.string().optional().nullable(),
  subCode: z.string().optional().nullable(),
  availableQty: z.number().int(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const dispenseRequestSchema = z.object({
  items: z.array(z.object({
    itemId: z.string().min(1),
    subItemId: z.string().optional().nullable(),
    lotId: z.string().optional().nullable(),
    quantity: z.number().int().min(1),
    quantitySub: z.number().int().min(0),
  })).min(1, "At least one item required"),
  subjectId: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export type DispenseRequest = z.infer<typeof dispenseRequestSchema>;
