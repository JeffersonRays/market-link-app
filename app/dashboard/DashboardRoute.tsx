"use client";

import { DashboardShell } from "./components";
import { ProtectedPage } from "./ProtectedPage";

type Role = "customer" | "farmer" | "admin";

export function DashboardRoute({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  return (
    <ProtectedPage role={role}>
      {(user) => (
        <DashboardShell
          role={role}
          name={`${user.first_name} ${user.last_name}`}
          initials={`${user.first_name[0] || ""}${user.last_name[0] || ""}`}
        >
          {children}
        </DashboardShell>
      )}
    </ProtectedPage>
  );
}
