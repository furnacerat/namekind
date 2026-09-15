import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideArticle } from "../guide-article";
import { guideBySlug, namingGuides } from "../guide-data";

export function generateStaticParams() {
  return namingGuides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug.get(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { type: "article", title: guide.title, description: guide.description, url: `/guides/${guide.slug}`, publishedTime: "2026-09-15", modifiedTime: "2026-09-15" },
    twitter: { card: "summary", title: guide.title, description: guide.description },
  };
}

export default async function NamingGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = guideBySlug.get(slug);
  if (!guide) notFound();
  return <GuideArticle guide={guide} />;
}
