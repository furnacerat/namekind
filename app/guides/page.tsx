import type { Metadata } from "next";
import Link from "next/link";
import { InfoLayout } from "../info-layout";
import { guideCategories, namingGuides } from "./guide-data";

export const metadata: Metadata = {
  title: "Baby Naming Guides for Thoughtful Parents",
  description: "Practical, carefully written guides for choosing baby names, middle names, sibling and twin names, honor names, and names with cultural context.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return <InfoLayout eyebrow="The Namekind library" title="Baby naming guides for the decisions behind the name" intro="Useful, calm guidance for the parts of naming that a list cannot answer—from two different tastes to family expectations, full-name flow, popularity, and cultural context.">
    <section className="guides-introduction"><h2>Start with the question you are actually facing</h2><p>A good name rarely appears because someone scrolled farther. It becomes clearer when parents understand the tradeoffs they are willing to make and the story they want the name to carry. These guides are written to help with one real decision at a time. Each includes a concise set of takeaways, a practical exercise, common questions, and useful paths into Namekind’s existing name research.</p><p>You do not need to read the library in order. Begin with the question creating the most friction, use the exercise together, and bring what you learn into the personalized finder or baby-name directory.</p></section>
    {guideCategories.map((category) => {
      const guides = namingGuides.filter((guide) => guide.category === category);
      return <section className="guide-category" key={category}><div className="guide-category-heading"><p className="eyebrow">{String(guides.length).padStart(2, "0")} guides</p><h2>{category}</h2></div><div className="guide-index-grid">{guides.map((guide) => <Link key={guide.slug} href={`/guides/${guide.slug}`}><div><span>{guide.readMinutes} min read</span><span>{guide.eyebrow}</span></div><h3>{guide.title}</h3><p>{guide.description}</p><b>Read the guide →</b></Link>)}</div></section>;
    })}
    <div className="info-cta"><p>Prefer a recommendation shaped around your own answers?</p><Link className="primary" href="/">Build your naming profile <span>→</span></Link></div>
  </InfoLayout>;
}
