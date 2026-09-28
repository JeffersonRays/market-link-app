"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { roleHome, type User } from "../../lib/api";
import { useSession } from "../auth/useSession";

export function ProtectedPage({ role, children }: { role?: User["role"]; children: (user: User) => React.ReactNode }) {
  const router = useRouter();
  const { ready, user } = useSession();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/sign-in");
      return;
    }
    if (role && user.role !== role) router.replace(roleHome(user.role));
  }, [ready, role, router, user]);

  if (!ready || !user || (role && user.role !== role)) {
    return <main className="page-content"><div className="container">Loading your workspace…</div></main>;
  }
  return <>{children(user)}</>;
}
