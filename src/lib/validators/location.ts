import { z } from "zod";

export const locationCreateSchema = z.object({
  room: z.string().min(1, "Room is required").max(100),
  cabinet: z.string().max(100).optional().nullable(),
  shelf: z.string().max(100).optional().nullable(),
});

export const locationUpdateSchema = locationCreateSchema.partial();

export type LocationCreateInput = z.infer<typeof locationCreateSchema>;
export type LocationUpdateInput = z.infer<typeof locationUpdateSchema>;
