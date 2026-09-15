"use client";

import Link from "next/link";
import { babyCategories } from "./name-categories-data";
import { popularNameBySlug } from "./popular-names-data";

const featuredNames = ["evelyn", "daniel", "abigail", "ryan", "olivia", "rowan", "liam", "amara"]
  .flatMap((slug) => {
    const item = popularNameBySlug.get(slug);
    return item ? [item] : [];
  });

const explorePaths = [
  { eyebrow:"The official 2025 list", title:"Popular baby names", description:"Browse the Top 100 boy names and Top 100 girl names, with meanings and current U.S. rankings.", href:"/baby-names" },
  ...babyCategories.map((category) => ({ eyebrow:category.eyebrow, title:category.title, description:category.description, href:`/baby-names/categories/${category.slug}` })),
];

const guideCards = [
  { title:"How to choose a baby name without getting overwhelmed", description:"A practical way to narrow names by feeling, sound, family connection, culture, popularity, and everyday use.", href:"/guides/choosing-a-baby-name" },
  { title:"How to choose a baby name when you disagree", description:"Turn two different tastes into a fair shared process without veto wars, pressure, or resentment.", href:"/guides/choosing-a-baby-name-together" },
  { title:"How to choose a middle name that flows", description:"Use rhythm, sound, initials, family meaning, and the complete surname to build the whole name.", href:"/guides/choosing-a-middle-name-that-flows" },
];

export function HomeResourceHub({ onStartFinder }: { onStartFinder: () => void }) {
  return <div className="home-resource-hub">
    <section className="home-editorial home-introduction" aria-labelledby="home-introduction-title">
      <div className="section-heading"><p className="eyebrow">A thoughtful place to begin</p><h2 id="home-introduction-title">More than a list of baby names.</h2></div>
      <div className="editorial-copy"><p>Choosing a baby’s name is personal in a way few other decisions are. It has to sound right in your family, carry the meaning you want, and feel at home on the person your child will become. An enormous alphabetical list can offer plenty of choices while making the decision feel even harder.</p><p>Namekind helps you understand names instead of simply displaying them. You can research meaning and origin, see current and historical popularity, compare styles, test middle-name combinations, consider sibling names, and follow related choices that share a similar feeling. Every profile uses the same structure so you can compare names without wondering whether one page is missing important context.</p><p>When you would rather not begin with a list at all, the personalized finder turns your preferences into a smaller first set. It listens for the qualities, sounds, family connections, and level of familiarity that matter to you—then gives you room to react and refine.</p></div>
    </section>

    <section className="home-editorial explore-section" aria-labelledby="explore-title">
      <div className="home-section-head"><div><p className="eyebrow">Browse with a direction</p><h2 id="explore-title">Explore baby names</h2></div><Link href="/baby-names">Browse all baby names <span>→</span></Link></div>
      <div className="home-category-grid">{explorePaths.map((path) => <Link key={path.href} href={path.href}><span>{path.eyebrow}</span><h3>{path.title}</h3><p>{path.description}</p><b>Explore →</b></Link>)}</div>
    </section>

    <section className="home-editorial featured-section" aria-labelledby="featured-title">
      <div className="home-section-head"><div><p className="eyebrow">A place to get curious</p><h2 id="featured-title">Names worth discovering</h2></div><Link href="/baby-names">Explore all names <span>→</span></Link></div>
      <div className="featured-name-grid">{featuredNames.map((item) => <Link key={item.slug} href={`/baby-names/${item.slug}`}><div><span>{item.origin}</span><b>2025 rank #{item.rank}</b></div><h3>{item.name}</h3><p>“{item.meaning}”</p><small>View meaning, history, and pairings →</small></Link>)}</div>
    </section>

    <section className="home-editorial finder-callout" aria-labelledby="finder-title">
      <div><p className="eyebrow">A shorter way to your shortlist</p><h2 id="finder-title">Not sure where to start?</h2></div>
      <div><p>Instead of scrolling through thousands of names, answer a few gentle questions about the kind of name you want. Tell us whether your taste leans traditional or unusual, which styles and sounds you enjoy, the meanings or qualities you value, any family connection you hope to preserve, and names you already love.</p><button className="primary" onClick={onStartFinder}>Find my names <span>→</span></button></div>
    </section>

    <section className="home-editorial research-section" aria-labelledby="research-title">
      <div className="research-mark" aria-hidden="true">n</div>
      <div><p className="eyebrow">Clear sources, useful judgment</p><h2 id="research-title">Names with context.</h2><p>A definition is only a beginning. Namekind profiles bring together meaning, origin, current rank, ten years of historical popularity, middle-name combinations, sibling ideas, and similar names. Nickname possibilities also shape personalized recommendations and pet-name profiles. Published rankings are kept separate from editorial sound and style suggestions, and we say when a meaning varies by language or tradition.</p><Link href="/methodology">See our methodology <span>→</span></Link></div>
    </section>

    <section className="home-editorial guides-section" aria-labelledby="guides-title">
      <div className="home-section-head"><div><p className="eyebrow">Practical, human guidance</p><h2 id="guides-title">Help choosing the right name</h2></div><Link href="/guides">Explore all guides <span>→</span></Link></div>
      <div className="home-guide-grid">{guideCards.map((guide, index) => <Link key={guide.href} href={guide.href}><span>Guide {String(index + 1).padStart(2, "0")}</span><h3>{guide.title}</h3><p>{guide.description}</p><b>Read the guide →</b></Link>)}</div>
    </section>

    <section className="home-editorial naming-is-hard" aria-labelledby="naming-hard-title">
      <div className="section-heading"><p className="eyebrow">When the list keeps growing</p><h2 id="naming-hard-title">Why choosing a name can feel so hard</h2></div>
      <div className="editorial-copy"><p>Two parents can care equally about the decision and still begin with completely different tastes. One may picture something timeless and familiar while the other wants a name that feels uncommon. A family honor name may matter deeply but feel difficult to use directly. Then popularity, spelling, pronunciation, initials, and the rhythm of the middle and last names all enter the conversation.</p><p>The tension is often reasonable. Parents want something distinctive without choosing a name that constantly needs correction. They may love a name on its own but wonder whether it is too close to a sibling’s, too similar to a friend’s child, or likely to shorten into a nickname they dislike. National popularity can be useful context, yet it cannot predict which names will appear repeatedly in one school or community.</p><p>A manageable decision starts by separating firm needs from flexible preferences. Decide what would truly rule a name out, then identify two or three qualities you hope it carries. Say the full name in ordinary situations, keep a small “maybe” list, and let unfamiliar choices sit for a while. Namekind exists to make the decision feel smaller: enough context to choose thoughtfully, without asking you to hold every possible name in your head at once.</p></div>
    </section>

    <section className="home-editorial starting-points" aria-labelledby="starting-points-title">
      <p className="eyebrow">Continue exploring</p><h2 id="starting-points-title">Popular starting points</h2>
      <nav aria-label="Popular baby-name starting points"><Link href="/baby-names#boy-names"><span>01</span>Top 100 boy names</Link><Link href="/baby-names#girl-names"><span>02</span>Top 100 girl names</Link><Link href="/baby-names/categories/gender-neutral-baby-names"><span>03</span>Gender-neutral names</Link><Link href="/baby-names/categories/unique-baby-names"><span>04</span>Unique baby names</Link><Link href="/baby-names/categories/nature-inspired-baby-names"><span>05</span>Nature-inspired names</Link><Link href="/guides"><span>06</span>Baby-naming guides</Link></nav>
    </section>
  </div>;
}
