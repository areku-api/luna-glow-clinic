import type { Booking, Order, Product, Service } from "./types";

type Store = {
  services: Service[];
  bookings: Booking[];
  products: Product[];
  orders: Order[];
};

declare global {
  // eslint-disable-next-line no-var
  var __lunaStore: Store | undefined;
}

const SLOTS = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "18:00",
  "19:00",
];

function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function daysAgo(n: number) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function seed(): Store {
  return {
    services: [
      {
        id: "svc_facial",
        name: "Facial Glow",
        summary: "ล้าง มาสก์ ผิวชุ่มทันที",
        durationMin: 60,
        price: 1290,
        active: true,
      },
      {
        id: "svc_laser",
        name: "Laser Soft",
        summary: "จุดด่างดำ จุดเล็ก",
        durationMin: 45,
        price: 2490,
        active: true,
      },
      {
        id: "svc_booster",
        name: "Skin Booster",
        summary: "ผิวแห้ง อยากอิ่มน้ำ",
        durationMin: 30,
        price: 3900,
        active: true,
      },
    ],
    bookings: [
      {
        id: "bk_seed_1",
        serviceId: "svc_facial",
        customerName: "คุณมิ้นท์",
        phone: "081-111-2222",
        date: today(),
        time: "11:00",
        note: "",
        status: "confirmed",
        createdAt: daysAgo(0),
      },
      {
        id: "bk_seed_2",
        serviceId: "svc_laser",
        customerName: "คุณต้น",
        phone: "089-333-4444",
        date: today(),
        time: "14:00",
        note: "แพ้ยาชา",
        status: "pending",
        createdAt: daysAgo(0),
      },
    ],
    products: [
      {
        id: "p1",
        name: "เซรั่มวิตามินซี",
        category: "สกินแคร์",
        price: 890,
        stock: 24,
        description: "ลดจุดด่างดำ ใช้ต่อหลังเลเซอร์ได้",
        usage: "เช้า หลังล้างหน้า",
        tone: "amber",
        active: true,
      },
      {
        id: "p2",
        name: "ครีมกันแดด SPF50",
        category: "สกินแคร์",
        price: 650,
        stock: 8,
        description: "บางเบา ไม่ตัน เหมาะผิวคนไทย",
        usage: "ทาทับเซรั่มทุกเช้า",
        tone: "sun",
        active: true,
      },
      {
        id: "p3",
        name: "มาร์กส์แผ่นชุ่มชื้น",
        category: "มาสก์",
        price: 290,
        stock: 60,
        description: "ชุด 5 แผ่น ฟื้นฟูหลังทำ Facial",
        usage: "เย็น หลังอาบน้ำ 15 นาที",
        tone: "mint",
        active: true,
      },
      {
        id: "p4",
        name: "คลีนเซอร์อ่อนโยน",
        category: "สกินแคร์",
        price: 420,
        stock: 5,
        description: "ล้างหน้าได้ทุกวัน ไม่แห้งตึง",
        usage: "เช้า–เย็น ก่อนบำรุง",
        tone: "rose",
        active: true,
      },
    ],
    orders: [
      {
        id: "ord_seed_1",
        customerName: "คุณนิด",
        phone: "081-555-6666",
        address: "นนทบุรี",
        items: [
          { productId: "p1", name: "เซรั่มวิตามินซี", price: 890, qty: 1 },
        ],
        total: 890,
        status: "paid",
        createdAt: daysAgo(1),
      },
      {
        id: "ord_seed_2",
        customerName: "คุณโอม",
        phone: "082-777-8888",
        address: "กรุงเทพฯ",
        items: [
          { productId: "p2", name: "ครีมกันแดด SPF50", price: 650, qty: 2 },
        ],
        total: 1300,
        status: "shipped",
        createdAt: daysAgo(3),
      },
    ],
  };
}

export function getStore(): Store {
  if (!globalThis.__lunaStore) {
    globalThis.__lunaStore = seed();
  }
  return globalThis.__lunaStore;
}

export function listSlots() {
  return SLOTS;
}

export const ADMIN_PASSWORD = "admin123";

/* ——— Services ——— */
export function listServices(activeOnly = false) {
  const list = getStore().services;
  return activeOnly ? list.filter((s) => s.active) : list;
}

export function getService(id: string) {
  return getStore().services.find((s) => s.id === id);
}

export function createService(input: Omit<Service, "id">) {
  const item: Service = {
    ...input,
    summary: input.summary ?? "",
    id: `svc_${Date.now()}`,
  };
  getStore().services.push(item);
  return item;
}

export function updateService(id: string, patch: Partial<Service>) {
  const store = getStore();
  const idx = store.services.findIndex((s) => s.id === id);
  if (idx < 0) throw new Error("NOT_FOUND");
  store.services[idx] = { ...store.services[idx], ...patch, id };
  return store.services[idx];
}

export function deleteService(id: string) {
  const store = getStore();
  const before = store.services.length;
  store.services = store.services.filter((s) => s.id !== id);
  if (store.services.length === before) throw new Error("NOT_FOUND");
}

/* ——— Bookings ——— */
export function listBookings(date?: string) {
  const all = [...getStore().bookings].sort((a, b) =>
    a.date === b.date ? a.time.localeCompare(b.time) : b.date.localeCompare(a.date),
  );
  return date ? all.filter((b) => b.date === date) : all;
}

export function getBooking(id: string) {
  return getStore().bookings.find((b) => b.id === id);
}

export function getBookedTimes(date: string) {
  return getStore()
    .bookings.filter(
      (b) => b.date === date && b.status !== "cancelled",
    )
    .map((b) => b.time);
}

export function createBooking(input: Omit<Booking, "id" | "createdAt">) {
  const store = getStore();
  if (
    store.bookings.some(
      (b) =>
        b.date === input.date &&
        b.time === input.time &&
        b.status !== "cancelled",
    )
  ) {
    throw new Error("SLOT_TAKEN");
  }
  const booking: Booking = {
    ...input,
    id: `bk_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  store.bookings.unshift(booking);
  return booking;
}

export function updateBooking(id: string, patch: Partial<Booking>) {
  const store = getStore();
  const idx = store.bookings.findIndex((b) => b.id === id);
  if (idx < 0) throw new Error("NOT_FOUND");
  const next = { ...store.bookings[idx], ...patch, id };
  if (patch.date || patch.time) {
    const clash = store.bookings.some(
      (b) =>
        b.id !== id &&
        b.date === next.date &&
        b.time === next.time &&
        b.status !== "cancelled",
    );
    if (clash) throw new Error("SLOT_TAKEN");
  }
  store.bookings[idx] = next;
  return next;
}

export function deleteBooking(id: string) {
  const store = getStore();
  const before = store.bookings.length;
  store.bookings = store.bookings.filter((b) => b.id !== id);
  if (store.bookings.length === before) throw new Error("NOT_FOUND");
}

/* ——— Products ——— */
export function listProducts(activeOnly = false) {
  const list = getStore().products;
  return activeOnly ? list.filter((p) => p.active) : list;
}

export function getProduct(id: string) {
  return getStore().products.find((p) => p.id === id);
}

export function createProduct(input: Omit<Product, "id">) {
  const item: Product = {
    ...input,
    usage: input.usage ?? "",
    tone: input.tone ?? "mint",
    id: `p_${Date.now()}`,
  };
  getStore().products.push(item);
  return item;
}

export function updateProduct(id: string, patch: Partial<Product>) {
  const store = getStore();
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx < 0) throw new Error("NOT_FOUND");
  store.products[idx] = { ...store.products[idx], ...patch, id };
  return store.products[idx];
}

export function deleteProduct(id: string) {
  const store = getStore();
  const before = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length === before) throw new Error("NOT_FOUND");
}

/* ——— Orders ——— */
export function listOrders() {
  return [...getStore().orders].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

export function getOrder(id: string) {
  return getStore().orders.find((o) => o.id === id);
}

export function createOrder(input: {
  customerName: string;
  phone: string;
  address: string;
  items: { productId: string; qty: number }[];
}) {
  const store = getStore();
  const items = input.items.map((item) => {
    const product = store.products.find((p) => p.id === item.productId);
    if (!product || !product.active) throw new Error("PRODUCT_NOT_FOUND");
    if (product.stock < item.qty) throw new Error("OUT_OF_STOCK");
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: item.qty,
    };
  });

  for (const item of items) {
    const product = store.products.find((p) => p.id === item.productId)!;
    product.stock -= item.qty;
  }

  const order: Order = {
    id: `ord_${Date.now()}`,
    customerName: input.customerName,
    phone: input.phone,
    address: input.address,
    items,
    total: items.reduce((s, i) => s + i.price * i.qty, 0),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  store.orders.unshift(order);
  return order;
}

export function updateOrder(id: string, patch: Partial<Order>) {
  const store = getStore();
  const idx = store.orders.findIndex((o) => o.id === id);
  if (idx < 0) throw new Error("NOT_FOUND");
  store.orders[idx] = { ...store.orders[idx], ...patch, id };
  return store.orders[idx];
}

export function deleteOrder(id: string) {
  const store = getStore();
  const before = store.orders.length;
  store.orders = store.orders.filter((o) => o.id !== id);
  if (store.orders.length === before) throw new Error("NOT_FOUND");
}

export function dashboardStats() {
  const store = getStore();
  const paidOrders = store.orders.filter(
    (o) => o.status === "paid" || o.status === "shipped",
  );
  return {
    revenue: paidOrders.reduce((s, o) => s + o.total, 0),
    orders: store.orders.length,
    bookingsToday: store.bookings.filter(
      (b) => b.date === today() && b.status !== "cancelled",
    ).length,
    products: store.products.filter((p) => p.active).length,
    lowStock: store.products.filter((p) => p.stock <= 10).length,
  };
}
