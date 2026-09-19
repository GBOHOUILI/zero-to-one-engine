// app/[slug]/contact/page.tsx
import ContactPageTemplate from "@/templates/template1/pages/contact/page";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ContactPageTemplate slug={slug} />;
}
