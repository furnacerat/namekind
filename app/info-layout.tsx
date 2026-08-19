import Link from "next/link";

export function InfoLayout({ eyebrow, title, intro, children }: { eyebrow:string; title:string; intro:string; children:React.ReactNode }) {
  return <main className="info-page">
    <header className="site-header">
      <Link className="brand" href="/"><span className="mark" aria-hidden="true">n</span><span>namekind</span></Link>
      <nav aria-label="Information navigation"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link className="save" href="/">Find your names</Link></nav>
    </header>
    <article className="info-article">
      <div className="info-hero"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div>
      <div className="info-body">{children}</div>
    </article>
    <InfoFooter />
  </main>;
}

export function InfoFooter() {
  return <footer className="info-footer">
    <Link className="brand" href="/"><span className="mark" aria-hidden="true">n</span><span>namekind</span></Link>
    <nav aria-label="Legal and information"><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link><Link href="/contact">Contact</Link></nav>
    <span>© 2026 Harold Foster</span>
  </footer>;
}
