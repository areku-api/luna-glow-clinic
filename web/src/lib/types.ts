export type Service = {
  id: string;
  name: string;
  summary: string;
  durationMin: number;
  price: number;
  active: boolean;
};

export type Booking = {
  id: string;
  serviceId: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  note: string;
  status: "pending" | "confirmed" | "done" | "cancelled";
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  usage: string;
  tone: "amber" | "sun" | "mint" | "rose";
  active: boolean;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  createdAt: string;
};
