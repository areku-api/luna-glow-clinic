"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => CartItem | null;
  restore: (item: CartItem) => void;
  clear: () => void;
  has: (productId: string) => boolean;
  total: number;
  count: number;
};

const STORAGE_KEY = "luna_cart_v1";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      add: (item, qty = 1) => {
        setItems((prev) => {
          const existing = prev.find((p) => p.productId === item.productId);
          if (existing) {
            return prev.map((p) =>
              p.productId === item.productId
                ? { ...p, qty: p.qty + qty }
                : p,
            );
          }
          return [...prev, { ...item, qty }];
        });
      },
      setQty: (productId, qty) => {
        setItems((prev) =>
          qty <= 0
            ? prev.filter((p) => p.productId !== productId)
            : prev.map((p) => (p.productId === productId ? { ...p, qty } : p)),
        );
      },
      remove: (productId) => {
        const removed = items.find((p) => p.productId === productId) ?? null;
        setItems((prev) => prev.filter((p) => p.productId !== productId));
        return removed;
      },
      restore: (item) => {
        setItems((prev) => {
          if (prev.some((p) => p.productId === item.productId)) {
            return prev.map((p) =>
              p.productId === item.productId ? item : p,
            );
          }
          return [...prev, item];
        });
      },
      clear: () => setItems([]),
      has: (productId) => items.some((i) => i.productId === productId),
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      count: items.reduce((sum, i) => sum + i.qty, 0),
    }),
    [items, ready],
  );

  return (
    <CartContext.Provider value={value}>
      <div className="flex min-h-screen flex-col">{children}</div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside provider");
  return ctx;
}
