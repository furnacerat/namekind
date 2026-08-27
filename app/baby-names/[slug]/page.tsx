import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InfoLayout } from "../../info-layout";
import { middleSuggestions, popularNameBySlug, popularNames, siblingSuggestions } from "../../popular-names-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return popularNames.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = popularNameBySlug.get(slug);
  if (!item) return {};
  return {
    title: `${item.name}: Meaning, Origin & Sibling Names`,
    description: `Explore the meaning and origin of ${item.name}, its 2025 U.S. popularity rank, sibling-name combinations, middle names, and style notes.`,
    alternates: { canonical: `/baby-names/${item.slug}` },
    openGraph: { title: `${item.name} baby name meaning and popularity`, description: `${item.name} ranked #${item.rank} among U.S. ${item.sex} names in 2025. Explore its meaning, origin, and pairing ideas.` },
  };
}

export default async function NameProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const item = popularNameBySlug.get(slug);
  if (!item) notFound();
  const siblings = siblingSuggestions(item);
  const middles = middleSuggestions(item);
  const label = item.sex === "boy" ? "boy names" : "girl names";
  const rhythm = item.name.length <= 5 ? "compact and easy to pair with a longer middle name" : "substantial enough to carry a short, crisp middle name";
  const neighbors = popularNames.filter((candidate) => candidate.sex === item.sex && Math.abs(candidate.rank - item.rank) <= 2 && candidate.slug !== item.slug);
  const structuredData = { "@context":"https://schema.org", "@type":"Article", headline:`${item.name} baby name meaning and popularity`, description:`Meaning, origin, 2025 U.S. popularity, and pairing ideas for ${item.name}.`, author:{"@type":"Organization",name:"Namekind"}, mainEntityOfPage:`https://www.hellonamekind.com/baby-names/${item.slug}` };

  return <InfoLayout eyebrow={`2025 popularity • #${item.rank}`} title={item.name} intro={`${item.name} is a ${item.origin.toLowerCase()} name commonly associated with “${item.meaning.toLowerCase()}.” It ranked #${item.rank} among U.S. ${label} in 2025.`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <div className="name-facts"><div><span>Meaning</span><strong>{item.meaning}</strong></div><div><span>Origin</span><strong>{item.origin}</strong></div><div><span>2025 U.S. rank</span><strong>#{item.rank} for {item.sex === "boy" ? "boys" : "girls"}</strong></div></div>
    <section><h2>What does {item.name} mean?</h2><p>{item.name} is commonly connected with the meaning <strong>“{item.meaning.toLowerCase()}.”</strong> Its roots are described as {item.origin.toLowerCase()}. Name histories often travel across languages and generations, so spelling, pronunciation, and interpretation can differ by family or cultural tradition.</p></section>
    <section><h2>How popular is {item.name}?</h2><p>According to Social Security Administration data for babies born in 2025, {item.name} ranked <strong>#{item.rank}</strong> among U.S. {label}. SSA counts each spelling separately, which means related spellings may hold their own positions rather than being combined into one total.</p><p className="source-line">Popularity source: <a href="https://www.ssa.gov/oact/babynames/" target="_blank" rel="noreferrer">U.S. Social Security Administration ↗</a></p></section>
    <section><h2>The feel of {item.name}</h2><p>{item.name} has a {item.name.length <= 5 ? "clear, concise shape" : "full, flowing shape"} and feels {item.rank <= 20 ? "highly familiar to today’s parents" : item.rank <= 60 ? "recognizable without sitting at the very top of the chart" : "familiar while leaving a little more room for distinction"}. In a full name, it is {rhythm}. Say it with your surname, then test the initials and the version you are most likely to call across the house.</p></section>
    <section><h2>Sibling names that pair with {item.name}</h2><p>These are style-and-rhythm suggestions rather than popularity claims. They aim for a family set that feels connected without sounding matched.</p><div className="pairing-grid"><div><span>If the sibling is a {item.sex}</span>{siblings.same.map((name) => <Link key={name} href={`/baby-names/${name.toLowerCase()}`}>{name}</Link>)}</div><div><span>If the sibling is a {item.sex === "boy" ? "girl" : "boy"}</span>{siblings.other.map((name) => <Link key={name} href={`/baby-names/${name.toLowerCase()}`}>{name}</Link>)}</div></div></section>
    <section><h2>Middle names for {item.name}</h2><div className="name-chips">{middles.map((name) => <span key={name}>{item.name} {name}</span>)}</div><p>Middle-name flow depends on the surname, emphasis, and family meaning. Use these as sound tests, not rules; an honor name with personal history can matter more than perfect syllable balance.</p></section>
    <section><h2>Names near {item.name} in the 2025 rankings</h2><div className="name-chips">{neighbors.map((name) => <Link key={name.slug} href={`/baby-names/${name.slug}`}>#{name.rank} {name.name}</Link>)}</div></section>
    <div className="profile-actions"><Link href="/baby-names">Browse all 200 names</Link><Link className="primary" href="/">Find names for your family <span>→</span></Link></div>
  </InfoLayout>;
}
