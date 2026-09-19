// app/[slug]/legal/page.tsx
import LegalPageTemplate from "@/templates/template1/pages/legal/page";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <LegalPageTemplate slug={slug} />;
}
