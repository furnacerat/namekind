import type { Metadata } from "next";
import Link from "next/link";
import { InfoLayout } from "../info-layout";

export const metadata: Metadata = {
  title: "Name Data & Editorial Method",
  description: "How Namekind researches meanings, uses Social Security baby-name rankings, and keeps every name profile consistent.",
  alternates: { canonical:"/methodology" },
};

export default function MethodologyPage() {
  return <InfoLayout eyebrow="Sources • standards • consistency" title="How we build each name profile." intro="A useful name page should make clear what comes from published data, what comes from name history, and what is editorial guidance. Here is the standard every Namekind profile follows.">
    <p className="updated">Last reviewed September 8, 2026</p>
    <section><h2>One shared profile standard</h2><p>Every baby name in our current collection is published through the same template. Each page includes meaning, origin, the current U.S. rank, a ten-year ranking history, style context, sibling ideas, three categories of middle-name pairings, similar names, nearby rankings, frequently asked questions, and source notes. A completeness check runs when the site is built so a profile cannot silently publish without its required ranking history.</p></section>
    <section><h2>Popularity rankings</h2><p>Baby-name popularity comes from the U.S. Social Security Administration’s national data based on applications for Social Security cards. SSA counts each spelling and recorded sex separately. Names used fewer than five times in a year are suppressed for privacy. Our charts show annual rank—not an estimate of every child living in the United States.</p><p className="source-line"><a href="https://www.ssa.gov/oact/babynames/" target="_blank" rel="noreferrer">View the original SSA baby-name data ↗</a></p></section>
    <section><h2>Meaning and origin</h2><p>Name histories are not always settled facts. Meanings can change across languages, transliterations, religious traditions, and family histories. We use concise, commonly documented interpretations and explicitly say when a meaning or origin is debated or varies by tradition. Families with direct cultural knowledge should treat that lived context as more important than a short online summary.</p></section>
    <section><h2>Pairing recommendations</h2><p>Sibling, middle, and similar-name ideas are editorial recommendations. They are chosen using rhythm, length, familiarity, origin, and contrast. They are not presented as official statistics. The surname tester and personalized finder exist because the best combination depends on the complete family name and the qualities that matter to you.</p></section>
    <section><h2>Pet-name data</h2><p>There is no official U.S. national registry equivalent to the SSA baby-name dataset for pets. Our pet Top 100 is therefore labeled as an editorial popularity guide. It cross-references recent public reports and uses a separate, consistent pet profile template covering meaning, fit, style, nicknames, and similar choices.</p></section>
    <section><h2>Corrections and updates</h2><p>We update the popularity set when new SSA annual data is published and review our source notes when a profile changes. If you spot a possible error or cultural nuance we should consider, please tell us. Clear corrections make the collection more useful for every family.</p><p><Link href="/contact">Contact Namekind about a correction →</Link></p></section>
    <div className="info-cta"><p>Ready to turn the research into a shortlist?</p><Link className="primary" href="/">Find your names <span>→</span></Link></div>
  </InfoLayout>;
}
