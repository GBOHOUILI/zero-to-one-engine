// app/[slug]/menu/[id]/page.tsx
import MenuDetailPageTemplate from "@/templates/template1/pages/menu/[id]/page";

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  return <MenuDetailPageTemplate slug={slug} itemId={id} />;
}
