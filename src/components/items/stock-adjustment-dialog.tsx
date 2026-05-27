"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const ADJUSTMENT_REASONS = [
  { value: "LOST", label: "Lost" },
  { value: "DAMAGED_PENDING_REPAIR", label: "Damaged (pending repair)" },
  { value: "COUNT_MISMATCH", label: "Count mismatch" },
  { value: "DISPOSAL", label: "Disposal" },
  { value: "OTHER", label: "Other" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  availableQty: number;
  totalQty: number;
  onSuccess: () => void;
}

export function StockAdjustmentDialog({ open, onOpenChange, itemId, availableQty, totalQty, onSuccess }: Props) {
  const [shelfCount, setShelfCount] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const checkedOut = totalQty - availableQty;
  const parsedShelf = shelfCount !== "" ? parseInt(shelfCount) : null;
  const newAvailable = parsedShelf ?? 0;
  const newTotal = parsedShelf !== null ? parsedShelf + checkedOut : null;

  async function handleSave() {
    if (parsedShelf === null || !reason) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/items/${itemId}/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shelfCount: parsedShelf, reason, notes: notes || null }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to adjust stock");
        return;
      }
      toast.success("Stock adjusted");
      onOpenChange(false);
      setShelfCount("");
      setReason("");
      setNotes("");
      onSuccess();
    } catch {
      toast.error("Failed to adjust stock");
    }
    setSaving(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Total (system)</span>
              <p className="font-medium">{totalQty}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Currently checked out</span>
              <p className="font-medium">{checkedOut}</p>
            </div>
          </div>
          <div>
            <Label>Count on shelf *</Label>
            <Input
              type="number"
              min="0"
              value={shelfCount}
              onChange={(e) => setShelfCount(e.target.value)}
              placeholder="How many items did you count?"
            />
            {parsedShelf !== null && newTotal !== null && (
              <p className={`text-sm mt-1 ${newTotal > totalQty ? "text-green-600" : newTotal < totalQty ? "text-destructive" : "text-muted-foreground"}`}>
                New total: {newTotal} ({newTotal > totalQty ? `+${newTotal - totalQty}` : newTotal < totalQty ? `${newTotal - totalQty}` : "no change"})
                {checkedOut > 0 && ` = ${parsedShelf} on shelf + ${checkedOut} checked out`}
              </p>
            )}
          </div>
          <div>
            <Label>Reason *</Label>
            <Select value={reason} onValueChange={(v) => setReason(v ?? "")}>
              <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
              <SelectContent>
                {ADJUSTMENT_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || parsedShelf === null || !reason}>
            {saving ? "Saving..." : "Adjust"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
