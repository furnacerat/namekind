import type { Metadata } from "next";
import Link from "next/link";
import { InfoLayout } from "../../info-layout";

export const metadata: Metadata = {
  title: "Harold Foster — Founder and Author",
  description: "Meet Harold Foster, the founder and maintainer of Namekind, and learn how Namekind's naming research and recommendations are prepared.",
  alternates: { canonical: "/authors/harold-foster" },
};

export default function HaroldFosterPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Harold Foster",
    url: "https://www.hellonamekind.com/authors/harold-foster",
    founder: { "@type": "Organization", name: "Namekind", url: "https://www.hellonamekind.com" },
  };

  return <InfoLayout eyebrow="Founder • author • site maintainer" title="Harold Foster" intro="Harold founded Namekind to replace overwhelming name lists with a calmer, preference-led way to discover names.">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <p className="updated">Editorial statement updated September 26, 2026</p>
    <section><h2>Role at Namekind</h2><p>Harold designs and maintains the Namekind experience from Ohio, including the questionnaire, recommendation rules, shared journeys, public guides, profile standards, and correction process. Namekind is independently operated rather than produced by an anonymous editorial staff.</p></section>
    <section><h2>Why this project exists</h2><p>The project began with a simple frustration: alphabetical directories give families more options without helping them make a decision. Namekind asks about style, meaning, sound, family connections, popularity, and practical constraints first, then uses those answers to build a smaller and more relevant starting point.</p></section>
    <section><h2>Research boundaries</h2><p>Harold is the product’s author and maintainer, not a linguist or cultural authority. Official U.S. popularity statements are tied to Social Security Administration data. Meanings and origins are treated as reference material because sources and traditions can disagree. Namekind encourages readers to consult language, family, and community sources when a name carries cultural importance.</p></section>
    <section><h2>Automation and AI</h2><p>Code is used to turn ranking records into charts and consistent comparisons. The personalized finder uses structured questionnaire answers and may use AI for a limited final refinement. Automation does not replace source review, and Namekind is actively rebuilding its individual profiles to include more name-specific evidence and original analysis.</p></section>
    <section><h2>Corrections</h2><p>Readers are invited to report data errors, disputed meanings, pronunciation concerns, or missing cultural context. Corrections are reviewed through Namekind’s public contact address.</p><p><Link href="/contact">Send a correction or question →</Link></p></section>
    <div className="info-cta"><p>See the standards used across Namekind.</p><Link className="primary" href="/methodology">Read the editorial method <span>→</span></Link></div>
  </InfoLayout>;
}
