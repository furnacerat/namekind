import type { Metadata } from "next";
import Link from "next/link";
import { InfoLayout } from "../info-layout";
import { popularBoys, popularGirls } from "../popular-names-data";

export const metadata: Metadata = {
  title: "Top 200 Baby Names of 2025",
  description: "Explore the 100 most popular boy names and 100 most popular girl names from the Social Security Administration's 2025 data.",
  alternates: { canonical: "/baby-names" },
};

function Ranking({ title, names }: { title: string; names: typeof popularBoys }) {
  return <section className="ranking-section"><div className="ranking-heading"><h2>{title}</h2><span>2025 U.S. rank</span></div><ol className="ranking-list">{names.map((item) => <li key={item.slug}><Link href={`/baby-names/${item.slug}`}><span>{item.rank}</span><strong>{item.name}</strong><small>{item.meaning}</small><b>Explore →</b></Link></li>)}</ol></section>;
}

export default function BabyNamesPage() {
  return <InfoLayout eyebrow="The 2025 list" title="America’s 200 most popular baby names" intro="Start with the official popularity picture, then go deeper into meaning, origin, sibling combinations, middle-name rhythm, and style.">
    <div className="data-note"><strong>Source note</strong><p>Rankings reflect U.S. Social Security card applications for births in 2025. SSA tracks spellings separately. Meanings and origins are editorial reference material and may vary among languages, families, and scholars.</p><a href="https://www.ssa.gov/oact/babynames/" target="_blank" rel="noreferrer">View the official SSA resource ↗</a></div>
    <div className="ranking-grid"><Ranking title="Top 100 boy names" names={popularBoys} /><Ranking title="Top 100 girl names" names={popularGirls} /></div>
  </InfoLayout>;
}
