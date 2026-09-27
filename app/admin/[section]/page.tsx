import { ManagementPage } from "../../management";

export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return <ManagementPage role="admin" section={section} />;
}
