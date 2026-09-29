import { DashboardRoute } from "../dashboard/DashboardRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardRoute role="admin">{children}</DashboardRoute>;
}
