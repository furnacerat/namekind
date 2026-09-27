import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { babyNameTrends } from "../../baby-name-trends";
import { InfoLayout } from "../../info-layout";
import { babyCategories } from "../../name-categories-data";
import { middleSuggestionGroups, popularNameBySlug, popularNames, relatedNameSuggestions, siblingSuggestions } from "../../popular-names-data";
import { BabyNamePopularity } from "./baby-name-popularity";
import { NameProfileTools } from "./name-profile-tools";
import { buildNameProfileContent } from "../name-profile-content";
import { namingGuides } from "../../guides/guide-data";
import { researchedBabyNameBySlug } from "../researched-name-profiles";

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
  const research = researchedBabyNameBySlug.get(slug);
  const description = research
    ? `A researched guide to ${item.name}: pronunciation, meaning, history, #${item.rank} U.S. rank, variants, sibling names, and sources.`
    : `${item.name} means “${item.meaning}.” Explore its ${item.origin} roots, #${item.rank} U.S. rank, 10-year popularity trend, sibling names, and middle-name ideas.`;
  return {
    title: `${item.name} Name Meaning, Origin & 2025 Popularity`,
    description,
    alternates: { canonical: `/baby-names/${item.slug}` },
    openGraph: { title: `${item.name} Name Meaning, Origin & Popularity`, description, images: [] },
    twitter: { title: `${item.name} Name Meaning, Origin & Popularity`, description, images: [] },
    robots: research ? { index:true, follow:true } : { index:false, follow:true },
  };
}

export default async function NameProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const item = popularNameBySlug.get(slug);
  if (!item) notFound();
  const research = researchedBabyNameBySlug.get(slug);
  const trend = babyNameTrends[item.slug];
  const editorial = buildNameProfileContent(item, trend);
  const siblings = siblingSuggestions(item);
  const middleGroups = middleSuggestionGroups(item);
  const related = relatedNameSuggestions(item);
  const label = item.sex === "boy" ? "boy names" : "girl names";
  const rhythm = item.name.length <= 5 ? "compact and easy to pair with a longer middle name" : "substantial enough to carry a short, crisp middle name";
  const neighbors = popularNames.filter((candidate) => candidate.sex === item.sex && Math.abs(candidate.rank - item.rank) <= 2 && candidate.slug !== item.slug);
  const directGuides = babyCategories.filter((guide) => guide.names.some((name) => name.toLowerCase() === item.name.toLowerCase()));
  const fallbackSlugs = [item.rank <= 50 ? "classic-baby-names" : "unique-baby-names", "twin-names-same-first-letter"];
  const guides = [...directGuides, ...babyCategories.filter((guide) => fallbackSlugs.includes(guide.slug) && !directGuides.includes(guide))].slice(0, 3);
  const guideSlugs = [
    item.rank <= 25 ? "how-popular-is-too-popular" : "uncommon-but-wearable-baby-names",
    "choosing-a-middle-name-that-flows",
    "sibling-names-that-go-together",
  ];
  const decisionGuides = guideSlugs.map((guideSlug) => namingGuides.find((guide) => guide.slug === guideSlug)).filter((guide) => guide !== undefined);
  const faq = [
    { question:`What does the name ${item.name} mean?`, answer:research?.meaningContext ?? `${item.name} is commonly associated with “${item.meaning.toLowerCase()}.”` },
    { question:`What is the origin of ${item.name}?`, answer:`${item.name} is generally described as a name with ${item.origin.toLowerCase()} roots.` },
    ...(research ? [{ question:`How do you pronounce ${item.name}?`, answer:`${item.name} is commonly pronounced ${research.pronunciation}. ${research.pronunciationNote}` }] : []),
    { question:`How popular is ${item.name}?`, answer:`${item.name} ranked #${item.rank} among U.S. ${label} for babies born in 2025, according to Social Security Administration data.` },
    { question:`Is ${item.name} a popular baby name?`, answer:`Yes. ${item.name} ranked #${item.rank} among U.S. ${label} in 2025, placing it in the national ${editorial.band}. Local use can still feel different from the national ranking.` },
    { question:`What middle names go with ${item.name}?`, answer:`Short, classic, and distinctive styles can all work with ${item.name}. The strongest choice depends on surname rhythm, initials, and family meaning.` },
  ];
  const url = `https://www.hellonamekind.com/baby-names/${item.slug}`;
  const profileSummary = research ? `${research.everydayFit} ${editorial.trendInfo.text}` : editorial.summary;
  const structuredData = [
    { "@context":"https://schema.org", "@type":"Article", headline:`${item.name} name meaning, origin, and popularity`, description:`A sourced guide to the meaning, history, pronunciation, and U.S. popularity of ${item.name}.`, articleSection:"Baby names", author:{"@type":"Person",name:"Harold Foster",url:"https://www.hellonamekind.com/authors/harold-foster"}, publisher:{"@type":"Organization",name:"Namekind",url:"https://www.hellonamekind.com"}, datePublished:"2026-08-26", dateModified:"2026-09-26", mainEntityOfPage:url, isPartOf:{"@type":"CollectionPage",name:"Baby names",url:"https://www.hellonamekind.com/baby-names"}, ...(research ? { citation:["https://www.ssa.gov/oact/babynames/", ...research.sources.map((source) => source.url)] } : {}) },
    { "@context":"https://schema.org", "@type":"BreadcrumbList", itemListElement:[
      { "@type":"ListItem", position:1, name:"Home", item:"https://www.hellonamekind.com" },
      { "@type":"ListItem", position:2, name:"Baby names", item:"https://www.hellonamekind.com/baby-names" },
      { "@type":"ListItem", position:3, name:item.name, item:url },
    ] },
  ];

  const intro = research
    ? `${research.pronunciation}. A sourced look at ${item.name}’s meaning, history, everyday use, and #${item.rank} rank among U.S. ${label} in 2025.`
    : `${item.name} means “${item.meaning.toLowerCase()}.” It has ${item.origin.toLowerCase()} roots and ranked #${item.rank} among U.S. ${label} in 2025.`;

  return <InfoLayout eyebrow={`${item.name} name meaning • 2025 rank #${item.rank}`} title={item.name} intro={intro}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <nav className="guide-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/baby-names">Baby names</Link><span>›</span><span aria-current="page">{item.name}</span></nav>
    <div className="profile-byline"><span>{research ? "Researched name profile" : "Name reference"}</span><span>Maintained by <Link href="/authors/harold-foster">Harold Foster</Link></span><time dateTime="2026-09-26">Updated September 26, 2026</time></div>
    <div className="name-facts"><div><span>Meaning</span><strong>{item.meaning}</strong></div><div><span>Origin</span><strong>{item.origin}</strong></div><div><span>2025 U.S. rank</span><strong>#{item.rank} for {item.sex === "boy" ? "boys" : "girls"}</strong></div><div><span>10-year direction</span><strong>{editorial.trendInfo.label}</strong></div></div>
    <nav className="profile-toc" aria-label={`Sections in the ${item.name} name profile`}><span>On this page</span><a href="#overview">Overview</a><a href="#meaning">Meaning</a>{research ? <a href="#history">History & usage</a> : null}<a href="#popularity">Popularity</a><a href="#siblings">Sibling names</a><a href="#middle-names">Middle names</a>{research ? <a href="#sources">Sources</a> : <a href="#decision">Decision guide</a>}</nav>
    <NameProfileTools name={item.name} slug={item.slug} />
    <section id="overview" className="profile-overview"><p className="eyebrow">The short version</p><h2>Why parents consider {item.name}</h2><p className="profile-summary">{profileSummary}</p><div className="profile-insight-grid">{editorial.cards.map((card) => <article key={card.label}><span>{card.label}</span><h3>{card.title}</h3><p>{card.text}</p></article>)}</div></section>
    {research ? <>
      <section id="meaning" className="profile-research-section"><p className="eyebrow">Meaning, without the shortcut</p><h2>What does {item.name} mean?</h2><p>{research.meaningContext}</p></section>
      <section id="history" className="profile-research-section"><p className="eyebrow">How the name traveled</p><h2>The history behind {item.name}</h2><p>{research.history}</p></section>
      <section className="profile-language-card"><div><span>Pronunciation</span><strong>{research.pronunciation}</strong><p>{research.pronunciationNote}</p></div><div><span>Short forms</span><div className="name-chips">{research.shortForms.map((name) => <span key={name}>{name}</span>)}</div></div><div><span>Related forms</span><div className="name-chips">{research.variants.map((name) => <span key={name}>{name}</span>)}</div></div></section>
    </> : <section id="meaning"><h2>What does {item.name} mean?</h2><p>{item.name} is commonly connected with the meaning <strong>“{item.meaning.toLowerCase()}.”</strong> Its roots are described as {item.origin.toLowerCase()}. Name histories often travel across languages and generations, so spelling, pronunciation, and interpretation can differ by family or cultural tradition.</p></section>}
    <BabyNamePopularity name={item.name} trend={trend} />
    <section><h2>How {item.name} looks and lives in a full name</h2><p>{editorial.shape}</p><p>On the 2025 list, {editorial.popularityContext ?? `${item.name} sits within the national ${editorial.band}.`} It is {rhythm}. Say it with your surname, then test the initials and the version you are most likely to call across the house.</p></section>
    {research ? <section className="profile-research-section"><p className="eyebrow">Namekind’s practical read</p><h2>What to weigh before choosing {item.name}</h2><div className="profile-tradeoff"><strong>The tradeoff</strong><p>{research.tradeoff}</p></div></section> : null}
    <section className="profile-guides"><p className="eyebrow">Browse by style</p><h2>Collections connected to {item.name}</h2><div className="guide-link-grid">{guides.map((guide) => <Link key={guide.slug} href={`/baby-names/categories/${guide.slug}`}><span>{guide.eyebrow}</span><strong>{guide.title}</strong><small>{guide.description}</small><b>Open collection →</b></Link>)}</div></section>
    <section id="siblings"><h2>Sibling names that pair with {item.name}</h2><p>These are style-and-rhythm suggestions rather than popularity claims. They aim for a family set that feels connected without sounding matched.</p><div className="pairing-grid"><div><span>If the sibling is a {item.sex}</span>{siblings.same.map((name) => <Link key={name} href={`/baby-names/${name.toLowerCase()}`}>{name}</Link>)}</div><div><span>If the sibling is a {item.sex === "boy" ? "girl" : "boy"}</span>{siblings.other.map((name) => <Link key={name} href={`/baby-names/${name.toLowerCase()}`}>{name}</Link>)}</div></div></section>
    <section id="middle-names"><h2>Middle names for {item.name}</h2><p>Each group tests a different kind of rhythm. Try the complete name aloud with your surname before narrowing the list.</p><div className="middle-groups">{middleGroups.map((group) => <div key={group.label}><span>{group.label}</span><p>{group.note}</p><div className="name-chips">{group.names.map((name) => <span key={name}>{item.name} {name}</span>)}</div></div>)}</div><p>These are editorial sound pairings, not rules. An honor name with personal history can matter more than perfect syllable balance.</p></section>
    <section id="similar-names"><h2>Names like {item.name}</h2><p>These names share parts of {item.name}’s origin, familiarity, length, or rhythm while keeping their own identity.</p><div className="related-name-grid">{related.map((name) => <Link key={name.slug} href={`/baby-names/${name.slug}`}><strong>{name.name}</strong><span>{name.meaning}</span></Link>)}</div></section>
    <section><h2>Names near {item.name} in the 2025 rankings</h2><p>These names were chosen at a similar national frequency. Comparing them can help you decide whether {item.name} feels comfortably familiar or more distinctive than its neighbors.</p><div className="name-chips">{neighbors.map((name) => <Link key={name.slug} href={`/baby-names/${name.slug}`}>#{name.rank} {name.name}</Link>)}</div></section>
    <section id="decision" className="profile-decision"><p className="eyebrow">A practical final check</p><h2>Before deciding on {item.name}</h2><p>A ranking and a meaning can start the conversation, but the right name also has to work in your family’s everyday life.</p><ol>{editorial.checks.map((check) => <li key={check.title}><strong>{check.title}</strong><span>{check.text}</span></li>)}</ol></section>
    <section className="profile-guides"><p className="eyebrow">Thoughtful next steps</p><h2>Guides to use with this profile</h2><div className="guide-link-grid">{decisionGuides.map((guide) => <Link key={guide.slug} href={`/guides/${guide.slug}`}><span>{guide.category}</span><strong>{guide.title}</strong><small>{guide.description}</small><b>Read the guide →</b></Link>)}</div></section>
    {research ? <section id="sources" className="profile-sources"><p className="eyebrow">Evidence and boundaries</p><h2>Sources for {item.name}</h2><p>Popularity uses the Social Security Administration’s national baby-name records. Etymology and history are checked against the name-specific references below. Editorial sound and pairing advice is labeled separately from those facts.</p><div className="profile-source-list"><a href="https://www.ssa.gov/oact/babynames/" target="_blank" rel="noreferrer"><span>Popularity data</span><strong>U.S. Social Security Administration</strong><small>Official national rankings based on Social Security card applications.</small></a>{research.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{source.publisher}</span><strong>{source.label}</strong><small>{source.note}</small></a>)}</div></section> : null}
    <section className="name-faq"><h2>Frequently asked questions about {item.name}</h2>{faq.map((entry) => <details key={entry.question}><summary>{entry.question}</summary><p>{entry.answer}</p></details>)}</section>
    <aside className="profile-method"><strong>How this reference was prepared</strong><p>{research ? "This profile completed Namekind’s source-and-analysis review. Official ranking data, name-specific etymology references, and Harold Foster’s practical naming analysis are kept visibly separate." : "The popularity chart comes from annual Social Security rankings. Meaning and origin are concise reference summaries; pairing and rhythm suggestions are editorial guidance. Namekind is adding individual etymology sources and original analysis before returning this profile to the search sitemap."}</p><Link href="/methodology">Read our data, automation, and editorial method →</Link></aside>
    <div className="profile-actions"><Link href="/baby-names">Browse all 200 names</Link><Link className="primary" href="/">Find names for your family <span>→</span></Link></div>
  </InfoLayout>;
}
