"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { CartItem } from "@/lib/validators/dispense";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string, lotId?: string | null, subItemId?: string | null) => void;
  updateItem: (itemId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      // Same item + same lot/sub = update quantity
      const key = (i: CartItem) => `${i.itemId}-${i.lotId ?? ""}-${i.subItemId ?? ""}`;
      const idx = prev.findIndex((i) => key(i) === key(item));
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + item.quantity, quantitySub: updated[idx].quantitySub + item.quantitySub };
        return updated;
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((itemId: string, lotId?: string | null, subItemId?: string | null) => {
    setItems((prev) =>
      prev.filter((i) => !(i.itemId === itemId && (i.lotId ?? null) === (lotId ?? null) && (i.subItemId ?? null) === (subItemId ?? null)))
    );
  }, []);

  const updateItem = useCallback((itemId: string, updates: Partial<CartItem>, lotId?: string | null, subItemId?: string | null) => {
    setItems((prev) =>
      prev.map((i) =>
        i.itemId === itemId && (i.lotId ?? null) === (lotId ?? null) && (i.subItemId ?? null) === (subItemId ?? null)
          ? { ...i, ...updates }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext value={{ items, addItem, removeItem, updateItem, clearCart, itemCount: items.length }}>
      {children}
    </CartContext>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
