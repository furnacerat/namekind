import type { Metadata } from "next";
import Link from "next/link";
import { InfoLayout } from "../info-layout";
import { petNames } from "../pet-names-data";

export const metadata:Metadata = {
  title:"100 Popular Pet Names for Dogs and Cats",
  description:"Explore 100 popular pet names with meanings, personality, nicknames, calling tips, and ideas for dogs and cats.",
  alternates:{canonical:"/pet-names"},
};

export default function PetNamesPage() {
  return <InfoLayout eyebrow="The Namekind Top 100" title="100 pet names with real personality" intro="Browse familiar favorites, nature names, food names, mythic choices, and warm human-style names—then let our pet questionnaire find the right fit for your companion.">
    <div className="data-note"><strong>How this list was made</strong><p>This is a Namekind editorial popularity guide, not an official national ranking. We cross-referenced recent reports from the American Kennel Club, Rover, and Trupanion, then organized 100 established names to be useful for both dog and cat families.</p><p className="source-line"><a href="https://www.akc.org/expert-advice/news/most-popular-dog-names/" target="_blank" rel="noreferrer">AKC popularity report ↗</a> · <a href="https://www.rover.com/blog/trending-pet-names/" target="_blank" rel="noreferrer">Rover trends ↗</a> · <a href="https://www.trupanion.com/about/media-resources/studies-and-media-releases/article/most-popular-pet-names-2026" target="_blank" rel="noreferrer">Trupanion report ↗</a></p></div>
    <div className="pet-directory-intro"><div><span>Need a more personal match?</span><h2>Tell us about your pet.</h2><p>A few thoughtful questions about species, personality, style, and sound give our naming engine a firm foundation.</p></div><Link className="primary small" href="/?mode=pet">Find a pet name <span>→</span></Link></div>
    <section className="ranking-section"><div className="ranking-heading"><h2>100 popular pet names</h2><span>Namekind editorial order</span></div><ol className="ranking-list pet-ranking-list">{petNames.map((item) => <li key={item.slug}><Link href={`/pet-names/${item.slug}`}><span>{item.rank}</span><strong>{item.name}</strong><small>{item.meaning} · {item.fit}</small><b>Explore →</b></Link></li>)}</ol></section>
  </InfoLayout>;
}
