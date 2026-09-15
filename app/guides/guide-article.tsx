import Link from "next/link";
import { InfoLayout } from "../info-layout";
import type { NamingGuide } from "./guide-data";

const siteUrl = "https://www.hellonamekind.com";

export function GuideArticle({ guide }: { guide: NamingGuide }) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      datePublished: "2026-09-15",
      dateModified: "2026-09-15",
      mainEntityOfPage: `${siteUrl}/guides/${guide.slug}`,
      author: { "@type": "Organization", name: "Namekind", url: siteUrl },
      publisher: { "@type": "Organization", name: "Namekind", url: siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Baby naming guides", item: `${siteUrl}/guides` },
        { "@type": "ListItem", position: 3, name: guide.title, item: `${siteUrl}/guides/${guide.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return <InfoLayout eyebrow={guide.eyebrow} title={guide.title} intro={guide.intro}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <nav className="guide-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/guides">Guides</Link><span>›</span><span aria-current="page">{guide.category}</span></nav>
    <div className="guide-byline"><span>By Namekind</span><span>Updated September 15, 2026</span><span>{guide.readMinutes} minute read</span></div>

    <aside className="guide-takeaways" aria-labelledby="guide-takeaways-title">
      <div><p className="eyebrow">The short version</p><h2 id="guide-takeaways-title">What matters most</h2></div>
      <ul>{guide.takeaways.map((item) => <li key={item}>{item}</li>)}</ul>
    </aside>

    <nav className="guide-toc" aria-label="On this page">
      <strong>In this guide</strong>
      <ol>{guide.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index + 1}`}>{section.heading}</a></li>)}</ol>
    </nav>

    {guide.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.heading} className="guide-section">
      <span className="guide-section-number">{String(index + 1).padStart(2, "0")}</span>
      <h2>{section.heading}</h2>
      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.list && <ul>{section.list.map((item) => <li key={item}>{item}</li>)}</ul>}
    </section>)}

    <section className="guide-exercise" aria-labelledby="guide-exercise-title">
      <p className="eyebrow">Put it into practice</p>
      <h2 id="guide-exercise-title">{guide.exercise.title}</h2>
      <p>{guide.exercise.intro}</p>
      <ol>{guide.exercise.steps.map((step) => <li key={step}>{step}</li>)}</ol>
    </section>

    {guide.sourceNote && <aside className="guide-source-note"><strong>Source note</strong><p>{guide.sourceNote.text}</p><a href={guide.sourceNote.href} target="_blank" rel="noreferrer">{guide.sourceNote.label} ↗</a></aside>}

    <section className="guide-faq" aria-labelledby="guide-faq-title">
      <p className="eyebrow">Common questions</p><h2 id="guide-faq-title">Questions parents ask</h2>
      <div>{guide.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
    </section>

    <section className="guide-related" aria-labelledby="guide-related-title">
      <p className="eyebrow">Keep exploring</p><h2 id="guide-related-title">Related reading</h2>
      <div>{guide.related.map((item) => <Link key={item.href} href={item.href}><strong>{item.title}</strong><span>{item.description}</span><b>Read next →</b></Link>)}</div>
    </section>

    <div className="info-cta guide-finder-cta"><p>Ready to turn your preferences into a smaller first list?</p><Link className="primary" href="/">Find your names <span>→</span></Link></div>
    <p className="guide-editorial-note">Name meanings and origins can vary across languages, spellings, and sources. Namekind presents context for discovery and encourages families to continue researching names connected to living cultures and traditions.</p>
  </InfoLayout>;
}
