import { ManagementPage } from "../../management";
import { PublicDetail } from "../../api-pages";

export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (/^\d+$/.test(section)) return <PublicDetail kind="farmer" id={section} />;
  return <ManagementPage role="farmer" section={section} />;
}
