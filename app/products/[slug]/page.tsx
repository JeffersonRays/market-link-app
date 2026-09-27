import { PublicDetail } from "../../api-pages";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PublicDetail kind="product" id={slug} />;
}
