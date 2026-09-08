import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { babyNameTrends } from "../../baby-name-trends";
import { InfoLayout } from "../../info-layout";
import { babyCategories } from "../../name-categories-data";
import { middleSuggestionGroups, popularNameBySlug, popularNames, relatedNameSuggestions, siblingSuggestions } from "../../popular-names-data";
import { BabyNamePopularity } from "./baby-name-popularity";
import { NameProfileTools } from "./name-profile-tools";

type PageProps = { params: Promise<{ slug: string }> };

function verifyProfileCompleteness() {
  for (const item of popularNames) {
    const trend = babyNameTrends[item.slug];
    if (!item.meaning || !item.origin || trend?.length !== 10 || trend.at(-1)?.rank !== item.rank) {
      throw new Error(`Baby-name profile data is incomplete for ${item.name}.`);
    }
  }
}

verifyProfileCompleteness();

export function generateStaticParams() {
  return popularNames.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = popularNameBySlug.get(slug);
  if (!item) return {};
  return {
    title: `${item.name} Name Meaning, Origin & 2025 Popularity`,
    description: `${item.name} means “${item.meaning}.” Explore its ${item.origin} roots, #${item.rank} U.S. rank, 10-year popularity trend, sibling names, and middle-name ideas.`,
    alternates: { canonical: `/baby-names/${item.slug}` },
    openGraph: { title: `${item.name} Name Meaning, Origin & Popularity`, description: `${item.name} means “${item.meaning}.” See its 10-year U.S. popularity trend, sibling names, and pairing ideas.`, images: [] },
    twitter: { title: `${item.name} Name Meaning, Origin & Popularity`, description: `${item.name} means “${item.meaning}.” Explore its rank, origin, and pairing ideas.`, images: [] },
  };
}

export default async function NameProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const item = popularNameBySlug.get(slug);
  if (!item) notFound();
  const trend = babyNameTrends[item.slug];
  const siblings = siblingSuggestions(item);
  const middleGroups = middleSuggestionGroups(item);
  const related = relatedNameSuggestions(item);
  const label = item.sex === "boy" ? "boy names" : "girl names";
  const rhythm = item.name.length <= 5 ? "compact and easy to pair with a longer middle name" : "substantial enough to carry a short, crisp middle name";
  const neighbors = popularNames.filter((candidate) => candidate.sex === item.sex && Math.abs(candidate.rank - item.rank) <= 2 && candidate.slug !== item.slug);
  const directGuides = babyCategories.filter((guide) => guide.names.some((name) => name.toLowerCase() === item.name.toLowerCase()));
  const fallbackSlugs = [item.rank <= 50 ? "classic-baby-names" : "unique-baby-names", "twin-names-same-first-letter"];
  const guides = [...directGuides, ...babyCategories.filter((guide) => fallbackSlugs.includes(guide.slug) && !directGuides.includes(guide))].slice(0, 3);
  const faq = [
    { question:`What does the name ${item.name} mean?`, answer:`${item.name} is commonly associated with “${item.meaning.toLowerCase()}.”` },
    { question:`What is the origin of ${item.name}?`, answer:`${item.name} is generally described as a name with ${item.origin.toLowerCase()} roots.` },
    { question:`How popular is ${item.name}?`, answer:`${item.name} ranked #${item.rank} among U.S. ${label} for babies born in 2025, according to Social Security Administration data.` },
    { question:`What middle names go with ${item.name}?`, answer:`Short, classic, and distinctive styles can all work with ${item.name}. The strongest choice depends on surname rhythm, initials, and family meaning.` },
  ];
  const url = `https://www.hellonamekind.com/baby-names/${item.slug}`;
  const structuredData = [
    { "@context":"https://schema.org", "@type":"Article", headline:`${item.name} name meaning, origin, and popularity`, description:`${item.name} means “${item.meaning}.” Explore its origin, 10-year U.S. popularity, and pairing ideas.`, author:{"@type":"Organization",name:"Namekind",url:"https://www.hellonamekind.com/about"}, publisher:{"@type":"Organization",name:"Namekind",url:"https://www.hellonamekind.com"}, dateModified:"2026-09-08", mainEntityOfPage:url },
    { "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[
      { "@type":"ListItem", position:1, name:"Home", item:"https://www.hellonamekind.com" },
      { "@type":"ListItem", position:2, name:"Baby names", item:"https://www.hellonamekind.com/baby-names" },
      { "@type":"ListItem", position:3, name:item.name, item:url },
    ] },
    { "@context":"https://schema.org", "@type":"FAQPage", mainEntity:faq.map((entry) => ({ "@type":"Question", name:entry.question, acceptedAnswer:{ "@type":"Answer", text:entry.answer } })) },
  ];

  return <InfoLayout eyebrow={`${item.name} name meaning • 2025 rank #${item.rank}`} title={item.name} intro={`${item.name} means “${item.meaning.toLowerCase()}.” It has ${item.origin.toLowerCase()} roots and ranked #${item.rank} among U.S. ${label} in 2025.`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <p className="profile-reviewed">Complete profile • Reviewed September 8, 2026</p>
    <div className="name-facts"><div><span>Meaning</span><strong>{item.meaning}</strong></div><div><span>Origin</span><strong>{item.origin}</strong></div><div><span>2025 U.S. rank</span><strong>#{item.rank} for {item.sex === "boy" ? "boys" : "girls"}</strong></div></div>
    <nav className="profile-toc" aria-label={`Sections in the ${item.name} name profile`}><span>On this page</span><a href="#meaning">Meaning</a><a href="#popularity">Popularity</a><a href="#siblings">Sibling names</a><a href="#middle-names">Middle names</a><a href="#similar-names">Similar names</a></nav>
    <NameProfileTools name={item.name} slug={item.slug} />
    <section id="meaning"><h2>What does {item.name} mean?</h2><p>{item.name} is commonly connected with the meaning <strong>“{item.meaning.toLowerCase()}.”</strong> Its roots are described as {item.origin.toLowerCase()}. Name histories often travel across languages and generations, so spelling, pronunciation, and interpretation can differ by family or cultural tradition.</p></section>
    <BabyNamePopularity name={item.name} trend={trend} />
    <section><h2>The feel of {item.name}</h2><p>{item.name} has a {item.name.length <= 5 ? "clear, concise shape" : "full, flowing shape"} and feels {item.rank <= 20 ? "highly familiar to today’s parents" : item.rank <= 60 ? "recognizable without sitting at the very top of the chart" : "familiar while leaving a little more room for distinction"}. In a full name, it is {rhythm}. Say it with your surname, then test the initials and the version you are most likely to call across the house.</p></section>
    <section className="profile-guides"><p className="eyebrow">Keep exploring</p><h2>Guides connected to {item.name}</h2><div className="guide-link-grid">{guides.map((guide) => <Link key={guide.slug} href={`/baby-names/categories/${guide.slug}`}><span>{guide.eyebrow}</span><strong>{guide.title}</strong><small>{guide.description}</small><b>Open guide →</b></Link>)}</div></section>
    <section id="siblings"><h2>Sibling names that pair with {item.name}</h2><p>These are style-and-rhythm suggestions rather than popularity claims. They aim for a family set that feels connected without sounding matched.</p><div className="pairing-grid"><div><span>If the sibling is a {item.sex}</span>{siblings.same.map((name) => <Link key={name} href={`/baby-names/${name.toLowerCase()}`}>{name}</Link>)}</div><div><span>If the sibling is a {item.sex === "boy" ? "girl" : "boy"}</span>{siblings.other.map((name) => <Link key={name} href={`/baby-names/${name.toLowerCase()}`}>{name}</Link>)}</div></div></section>
    <section id="middle-names"><h2>Middle names for {item.name}</h2><p>Each group tests a different kind of rhythm. Try the complete name aloud with your surname before narrowing the list.</p><div className="middle-groups">{middleGroups.map((group) => <div key={group.label}><span>{group.label}</span><p>{group.note}</p><div className="name-chips">{group.names.map((name) => <span key={name}>{item.name} {name}</span>)}</div></div>)}</div><p>These are editorial sound pairings, not rules. An honor name with personal history can matter more than perfect syllable balance.</p></section>
    <section id="similar-names"><h2>Names like {item.name}</h2><p>These names share parts of {item.name}’s origin, familiarity, length, or rhythm while keeping their own identity.</p><div className="related-name-grid">{related.map((name) => <Link key={name.slug} href={`/baby-names/${name.slug}`}><strong>{name.name}</strong><span>{name.meaning}</span></Link>)}</div></section>
    <section><h2>Names near {item.name} in the 2025 rankings</h2><div className="name-chips">{neighbors.map((name) => <Link key={name.slug} href={`/baby-names/${name.slug}`}>#{name.rank} {name.name}</Link>)}</div></section>
    <section className="name-faq"><h2>Frequently asked questions about {item.name}</h2>{faq.map((entry) => <details key={entry.question}><summary>{entry.question}</summary><p>{entry.answer}</p></details>)}</section>
    <aside className="profile-method"><strong>How Namekind builds every profile</strong><p>All 200 baby-name pages follow this same editorial template and data standard. We separate verified ranking facts from interpretive pairing advice, cite the original source, and flag meanings that vary by tradition.</p><Link href="/methodology">Read our naming data and editorial method →</Link></aside>
    <div className="profile-actions"><Link href="/baby-names">Browse all 200 names</Link><Link className="primary" href="/">Find names for your family <span>→</span></Link></div>
  </InfoLayout>;
}
