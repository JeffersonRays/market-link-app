import { PublicDetail } from "../../api-pages";

export default async function MarketDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PublicDetail kind="market" id={slug} />;
}
