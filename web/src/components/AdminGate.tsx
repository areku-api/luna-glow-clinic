"use client";

import { useEffect, useState, type ReactNode } from "react";

export function AdminGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("luna_admin") === "1") {
      setAuthed(true);
    }
    setReady(true);
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      return;
    }
    sessionStorage.setItem("luna_admin", "1");
    setAuthed(true);
  }

  if (!ready) return <p className="text-muted">กำลังโหลด...</p>;

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm pt-10">
        <h1 className="text-2xl font-semibold tracking-tight text-navy">
          เข้าสู่ระบบแอดมิน
        </h1>
        <p className="mt-2 text-sm text-muted">รหัสผ่านเดโม่: admin123</p>
        <form onSubmit={login} className="card mt-6 space-y-3 p-5">
          <input
            type="password"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="รหัสผ่าน"
          />
          {error ? <p className="text-sm text-warn">{error}</p> : null}
          <button type="submit" className="btn w-full">
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
