import { Suspense } from "react";
import { CheckoutClient } from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="p-10 text-muted">กำลังโหลด...</main>}>
      <CheckoutClient />
    </Suspense>
  );
}
