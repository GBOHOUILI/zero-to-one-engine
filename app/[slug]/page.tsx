// app/[slug]/page.tsx
import HomePageTemplate from "@/templates/template1/pages/page";

export default async function HomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <HomePageTemplate slug={slug} />;
}
