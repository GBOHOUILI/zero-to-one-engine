// app/[slug]/gallery/page.tsx
import GalleryPageTemplate from "@/templates/template1/pages/gallery/page";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <GalleryPageTemplate slug={slug} />;
}
