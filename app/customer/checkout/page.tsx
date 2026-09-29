import { Suspense } from "react";
import { CheckoutPage } from "../features";

export default function Page() {
  return (
    <Suspense
      fallback={<main className="page-content">Loading checkout…</main>}
    >
      <CheckoutPage />
    </Suspense>
  );
}
