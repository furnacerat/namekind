import type { Metadata } from "next";
import Link from "next/link";
import { InfoLayout } from "../info-layout";

export const metadata: Metadata = { title:"About namekind", description:"Why namekind is building a more thoughtful way to choose a name.", alternates:{ canonical:"/about" } };

export default function AboutPage() { return <InfoLayout eyebrow="Our reason for being" title="A name is more than a list." intro="Namekind helps parents move beyond endless alphabetical directories and discover names through meaning, sound, story, and instinct.">
  <section><h2>Why namekind exists</h2><p>Most baby-name sites begin with thousands of names and leave the hardest work to the parent. Namekind begins with you. A short, adaptive conversation creates a preference profile, a curated engine narrows the possibilities, and optional AI performs a small final refinement.</p></section>
  <section><h2>Thoughtful by design</h2><p>The experience is intentionally calm, private, and focused. You can explore without creating an account. Your reactions help later groups become more relevant, and names you have already seen are not recycled back into the journey.</p></section>
  <section><h2>Built with cultural care</h2><p>Names travel across languages, histories, families, and communities. We aim to present origins and meanings with respect while recognizing that sources can differ. Namekind is a starting point for discovery, not a substitute for learning from the cultures and people connected to a name.</p></section>
  <section><h2>What comes next</h2><p>Baby names are the beginning. The same thoughtful approach may eventually help people name pets, characters, games, businesses, and creative projects.</p></section>
  <div className="info-cta"><p>Ready to discover what feels like yours?</p><Link className="primary" href="/">Find your names <span>→</span></Link></div>
</InfoLayout> }
