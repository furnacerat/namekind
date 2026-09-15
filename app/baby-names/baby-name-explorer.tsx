"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PopularName } from "../popular-names-data";

type Filter = "all" | "boy" | "girl";

export function BabyNameExplorer({ names }: { names: PopularName[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const normalizedQuery = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!normalizedQuery) return [];
    return names.filter((item) => {
      if (filter !== "all" && item.sex !== filter) return false;
      return `${item.name} ${item.origin} ${item.meaning}`.toLowerCase().includes(normalizedQuery);
    });
  }, [filter, names, normalizedQuery]);

  return <section className="directory-explorer" aria-labelledby="directory-search-heading">
    <div className="directory-explorer-heading">
      <div><p className="eyebrow">Search the directory</p><h2 id="directory-search-heading">Find a name, meaning, or origin</h2></div>
      <span>200 complete profiles</span>
    </div>
    <div className="directory-search-row">
      <label>
        <span className="sr-only">Search baby names by name, meaning, or origin</span>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “light,” “Irish,” or “Evelyn”" />
      </label>
      <div className="directory-filters" aria-label="Filter names">
        {(["all", "boy", "girl"] as const).map((value) => <button type="button" key={value} className={filter === value ? "active" : ""} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === "all" ? "All names" : `${value === "boy" ? "Boy" : "Girl"} names`}</button>)}
      </div>
    </div>
    {!normalizedQuery && <p className="directory-search-prompt">Search across every profile, including name meanings and origins. The complete 2025 rankings remain below.</p>}
    {normalizedQuery && <div className="directory-results" aria-live="polite">
      <p><strong>{matches.length}</strong> {matches.length === 1 ? "match" : "matches"} for “{query.trim()}”</p>
      {matches.length > 0 ? <div className="directory-result-grid">{matches.slice(0, 18).map((item) => <Link key={item.slug} href={`/baby-names/${item.slug}`}>
        <span>#{item.rank} · {item.sex === "boy" ? "Boy" : "Girl"}</span>
        <strong>{item.name}</strong>
        <small>{item.meaning}</small>
        <b>{item.origin}</b>
      </Link>)}</div> : <div className="directory-empty"><strong>No exact match yet.</strong><span>Try a shorter word, a different spelling, or browse the complete rankings below.</span></div>}
      {matches.length > 18 && <small className="directory-more">Showing the first 18 matches. Add another word to narrow the results.</small>}
    </div>}
  </section>;
}
