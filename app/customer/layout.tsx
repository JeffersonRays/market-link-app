import { DashboardRoute } from "../dashboard/DashboardRoute";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardRoute role="customer">{children}</DashboardRoute>;
}
