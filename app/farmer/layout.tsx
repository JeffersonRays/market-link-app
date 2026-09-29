import { DashboardRoute } from "../dashboard/DashboardRoute";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardRoute role="farmer">{children}</DashboardRoute>;
}
