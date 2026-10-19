import { AdminNav } from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:flex">
      <AdminNav />
      <div className="flex-1 px-5 py-6 md:px-8">{children}</div>
    </div>
  );
}
