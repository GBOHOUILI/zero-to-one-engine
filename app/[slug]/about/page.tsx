// app/[slug]/about/page.tsx
import AboutPageTemplate from "@/templates/template1/pages/about/page";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AboutPageTemplate slug={slug} />;
}
