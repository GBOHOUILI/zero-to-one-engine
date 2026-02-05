// app/[slug]/menu/page.tsx
import MenuPageTemplate from "@/templates/template1/pages/menu/page";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <MenuPageTemplate slug={slug} />;
}
