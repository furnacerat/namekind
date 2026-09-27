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
    <p className="updated">Last reviewed September 26, 2026</p>
    <section><h2>Editorial ownership</h2><p>Namekind is founded and maintained by Harold Foster. Harold is responsible for the site’s research standards, published explanations, corrections, and product decisions. Pages that require a byline identify him directly rather than referring to an unnamed editorial team.</p><p><Link href="/authors/harold-foster">Read the full authorship statement →</Link></p></section>
    <section><h2>How automation is used</h2><p>Structured code turns Social Security ranking records into charts, comparisons, and consistent fact boxes. It also helps check that required ranking fields are present. The personalized finder uses questionnaire answers to narrow a curated pool before optional AI refinement. Automation is a production tool; it is not evidence that a meaning, cultural history, or recommendation is correct.</p><p>Individual name profiles are being re-researched in batches. A profile returns to the search sitemap only after it receives name-specific etymology sources, an uncertainty review, pronunciation and usage context, and original practical analysis. The first completed batch prioritizes names already earning search impressions; unfinished profiles remain available to directory visitors but stay excluded from indexing.</p></section>
    <section><h2>Popularity rankings</h2><p>Baby-name popularity comes from the U.S. Social Security Administration’s national data based on applications for Social Security cards. SSA counts each spelling and recorded sex separately. Names used fewer than five times in a year are suppressed for privacy. Our charts show annual rank—not an estimate of every child living in the United States.</p><p className="source-line"><a href="https://www.ssa.gov/oact/babynames/" target="_blank" rel="noreferrer">View the original SSA baby-name data ↗</a></p></section>
    <section><h2>Meaning and origin</h2><p>Name histories are not always settled facts. Meanings can change across languages, transliterations, religious traditions, and family histories. Short reference meanings are treated as starting points, not definitive linguistic claims. As profiles are revised, Namekind is adding sources tied to the individual name and making disagreements between sources visible. Families with direct cultural knowledge should treat that lived context as more important than a short online summary.</p></section>
    <section><h2>Pairing recommendations</h2><p>Sibling, middle, and similar-name ideas are editorial recommendations. They are chosen using rhythm, length, familiarity, origin, and contrast. They are not presented as official statistics. The surname tester and personalized finder exist because the best combination depends on the complete family name and the qualities that matter to you.</p></section>
    <section><h2>Pet-name data</h2><p>There is no official U.S. national registry equivalent to the SSA baby-name dataset for pets. Our pet Top 100 is therefore labeled as an editorial popularity guide. It cross-references recent public reports and uses a separate, consistent pet profile template covering meaning, fit, style, nicknames, and similar choices.</p></section>
    <section><h2>Corrections and updates</h2><p>We update the popularity set when new SSA annual data is published and review our source notes when a profile changes. If you spot a possible error or cultural nuance we should consider, please tell us. Clear corrections make the collection more useful for every family.</p><p><Link href="/contact">Contact Namekind about a correction →</Link></p></section>
    <div className="info-cta"><p>Ready to turn the research into a shortlist?</p><Link className="primary" href="/">Find your names <span>→</span></Link></div>
  </InfoLayout>;
}
