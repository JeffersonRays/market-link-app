import { PublicDetail } from "../../api-pages";

export default async function FarmerDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PublicDetail kind="farmer" id={slug} />;
}
