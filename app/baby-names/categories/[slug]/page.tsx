import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { namingGuides } from "../../../guides/guide-data";
import { InfoLayout } from "../../../info-layout";
import { names as supplementaryNames } from "../../../name-data";
import { babyCategories, categoryByKey } from "../../../name-categories-data";
import { popularNameBySlug } from "../../../popular-names-data";

type Props = { params: Promise<{ slug: string }> };

const toSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const supplementaryByName = new Map(supplementaryNames.map((item) => [item.name.toLowerCase(), item]));
const additionalFacts: Record<string, { origin: string; meaning: string }> = {
  sage: { origin:"English botanical name", meaning:"Sage herb; wise person" },
  river: { origin:"English nature name", meaning:"Flowing body of water" },
  jordan: { origin:"Hebrew and place name", meaning:"To flow down" },
  parker: { origin:"English occupational name", meaning:"Park keeper" },
  finley: { origin:"Irish and Scottish", meaning:"Fair-haired hero" },
  morgan: { origin:"Welsh", meaning:"Meaning is debated; often associated with the sea" },
  finn: { origin:"Irish", meaning:"Fair; white" },
};

const categoryGuideMap: Record<string, string[]> = {
  "unique-baby-names": ["uncommon-but-wearable-baby-names", "baby-name-spelling-and-pronunciation", "choosing-a-baby-name"],
  "nature-inspired-baby-names": ["choosing-a-baby-name", "choosing-a-middle-name-that-flows", "sibling-names-that-go-together"],
  "gender-neutral-baby-names": ["choosing-a-gender-neutral-baby-name", "how-popular-is-too-popular", "choosing-a-middle-name-that-flows"],
  "classic-baby-names": ["how-popular-is-too-popular", "honoring-family-with-a-baby-name", "choosing-a-middle-name-that-flows"],
  "biblical-baby-names": ["choosing-a-cultural-baby-name-respectfully", "honoring-family-with-a-baby-name", "sibling-names-that-go-together"],
  "celtic-irish-welsh-baby-names": ["choosing-a-cultural-baby-name-respectfully", "baby-name-spelling-and-pronunciation", "honoring-family-with-a-baby-name"],
  "twin-names-same-first-letter": ["choosing-twin-baby-names", "sibling-names-that-go-together", "choosing-a-middle-name-that-flows"],
};

export function generateStaticParams() {
  return babyCategories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = categoryByKey.get(`baby:${slug}`);
  if (!item) return {};
  const canonical = `/baby-names/categories/${slug}`;
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical },
    openGraph: { title:item.title, description:item.description, url:canonical, images:[] },
    twitter: { title:item.title, description:item.description, images:[] },
  };
}

export default async function BabyCategoryPage({ params }: Props) {
  const { slug } = await params;
  const item = categoryByKey.get(`baby:${slug}`);
  if (!item) notFound();

  const related = babyCategories
    .filter((guide) => guide.slug !== item.slug)
    .sort((a, b) => b.names.filter((name) => item.names.includes(name)).length - a.names.filter((name) => item.names.includes(name)).length)
    .slice(0, 3);
  const editorialGuides = (categoryGuideMap[item.slug] ?? ["choosing-a-baby-name", "choosing-a-middle-name-that-flows", "sibling-names-that-go-together"])
    .map((guideSlug) => namingGuides.find((guide) => guide.slug === guideSlug))
    .filter((guide) => guide !== undefined);
  const profiles = item.names.map((name) => {
    const profile = popularNameBySlug.get(toSlug(name));
    const supplementary = supplementaryByName.get(name.toLowerCase());
    const additional = additionalFacts[toSlug(name)];
    return {
      name,
      slug: profile?.slug,
      rank: profile?.rank,
      sex: profile?.sex,
      meaning: profile?.meaning ?? supplementary?.meaning ?? additional?.meaning ?? "Meaning varies by family and source",
      origin: profile?.origin ?? supplementary?.origin ?? additional?.origin ?? "Origin varies by source",
    };
  });
  const url = `https://www.hellonamekind.com/baby-names/categories/${item.slug}`;
  const structuredData = [
    { "@context":"https://schema.org", "@type":"CollectionPage", name:item.title, description:item.description, url, dateModified:"2026-09-15", isPartOf:{"@type":"CollectionPage",name:"Baby names",url:"https://www.hellonamekind.com/baby-names"} },
    { "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[
      { "@type":"ListItem", position:1, name:"Home", item:"https://www.hellonamekind.com" },
      { "@type":"ListItem", position:2, name:"Baby names", item:"https://www.hellonamekind.com/baby-names" },
      { "@type":"ListItem", position:3, name:item.title, item:url },
    ] },
    { "@context":"https://schema.org", "@type":"ItemList", name:item.title, numberOfItems:profiles.length, itemListElement:profiles.map((profile, index) => ({ "@type":"ListItem", position:index + 1, name:profile.name, ...(profile.slug ? { url:`https://www.hellonamekind.com/baby-names/${profile.slug}` } : {}) })) },
    { "@context":"https://schema.org", "@type":"FAQPage", mainEntity:item.faq.map((entry) => ({ "@type":"Question", name:entry.question, acceptedAnswer:{ "@type":"Answer", text:entry.answer } })) },
  ];

  return <InfoLayout eyebrow={item.eyebrow} title={item.title} intro={item.intro}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}} />
    <nav className="guide-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/baby-names">Baby names</Link><span>›</span><span aria-current="page">{item.title}</span></nav>
    <div className="profile-byline"><span>Curated collection</span><span>{profiles.length} names with context</span><time dateTime="2026-09-15">Updated September 15, 2026</time></div>
    <section className="category-editorial-intro">
      <div><p className="eyebrow">How to use this collection</p><h2>A starting point, not a rulebook</h2></div>
      <p>{item.description} Use the list to notice patterns in sound, meaning, and familiarity, then open any complete profile to compare its official U.S. rank, ten-year history, sibling ideas, and middle-name rhythm.</p>
    </section>
    {item.pairs && <section><h2>Thoughtful same-initial pairs</h2><p>Each pair shares a visible connection while keeping a different rhythm and ending, helping both names retain a separate identity.</p><div className="category-pairs">{item.pairs.map(([first, second]) => <div key={first}><strong>{first} &amp; {second}</strong><span>Connected by an initial, separated by rhythm and ending.</span></div>)}</div></section>}
    <section><div className="ranking-heading"><h2>{profiles.length} ideas to explore</h2><span>Meaning, origin &amp; rank</span></div><div className="category-name-grid category-name-grid-rich">{profiles.map((profile) => {
      const contents = <><span>{profile.rank ? `2025 rank #${profile.rank} · ${profile.sex === "boy" ? "Boy" : "Girl"}` : "Established name"}</span><strong>{profile.name}</strong><small>{profile.meaning}</small><b>{profile.origin}</b>{profile.slug && <em>Read complete profile →</em>}</>;
      return profile.slug ? <Link href={`/baby-names/${profile.slug}`} key={profile.name}>{contents}</Link> : <div key={profile.name}>{contents}</div>;
    })}</div></section>
    <section className="category-narrowing"><p className="eyebrow">From collection to shortlist</p><h2>How to narrow this list</h2><ol>{item.guidance.map((tip, index) => <li key={tip}><span>{index + 1}</span><p>{tip}</p></li>)}</ol></section>
    <section className="profile-guides"><p className="eyebrow">Go deeper</p><h2>Guides for making the decision</h2><div className="guide-link-grid">{editorialGuides.map((guide) => <Link key={guide.slug} href={`/guides/${guide.slug}`}><span>{guide.category}</span><strong>{guide.title}</strong><small>{guide.description}</small><b>Read guide →</b></Link>)}</div></section>
    <section className="profile-guides"><p className="eyebrow">Continue browsing</p><h2>Related baby-name collections</h2><div className="guide-link-grid">{related.map((guide) => <Link key={guide.slug} href={`/baby-names/categories/${guide.slug}`}><span>{guide.eyebrow}</span><strong>{guide.title}</strong><small>{guide.description}</small><b>Open collection →</b></Link>)}</div></section>
    <section className="name-faq"><h2>Common questions</h2>{item.faq.map((entry) => <details key={entry.question}><summary>{entry.question}</summary><p>{entry.answer}</p></details>)}</section>
    <aside className="profile-method"><strong>How this collection was built</strong><p>Namekind separates sourced popularity facts from editorial style advice. Meanings and origins can vary by language and tradition, so each complete profile explains uncertainty rather than presenting every name history as settled.</p><Link href="/methodology">Read our naming data and editorial method →</Link></aside>
    <div className="profile-actions"><Link href="/baby-names">Browse the Top 200</Link><Link className="primary" href="/?mode=baby">Find personalized baby names <span>→</span></Link></div>
  </InfoLayout>;
}
