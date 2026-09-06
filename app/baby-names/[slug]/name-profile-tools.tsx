"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";

type ViewedName = { name: string; slug: string };

const SAVED_KEY = "namekind-saved-names";
const VIEWED_KEY = "namekind-recent-names";

function readNames(key: string): ViewedName[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.filter((item) => item?.name && item?.slug).slice(0, 12) : [];
  } catch {
    return [];
  }
}

export function NameProfileTools({ name, slug }: { name: string; slug: string }) {
  const [surname, setSurname] = useState("");
  const [saved, setSaved] = useState(false);
  const [recent, setRecent] = useState<ViewedName[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedNames = readNames(SAVED_KEY);
      setSaved(savedNames.some((item) => item.slug === slug));
      const viewed = readNames(VIEWED_KEY).filter((item) => item.slug !== slug);
      setRecent(viewed.slice(0, 4));
      localStorage.setItem(VIEWED_KEY, JSON.stringify([{ name, slug }, ...viewed].slice(0, 8)));
      track("name_profile_view", { name });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [name, slug]);

  const toggleSaved = () => {
    const savedNames = readNames(SAVED_KEY);
    const nextSaved = !saved;
    const next = nextSaved
      ? [{ name, slug }, ...savedNames.filter((item) => item.slug !== slug)]
      : savedNames.filter((item) => item.slug !== slug);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    setSaved(nextSaved);
    track(nextSaved ? "name_saved" : "name_unsaved", { name });
  };

  return <>
    <section className="profile-toolbox" aria-labelledby="try-name-heading">
      <div className="toolbox-heading">
        <div><p className="eyebrow">Make it personal</p><h2 id="try-name-heading">Could {name} be the one?</h2></div>
        <button className={saved ? "save-name saved" : "save-name"} onClick={toggleSaved} aria-pressed={saved}>
          <span aria-hidden="true">{saved ? "♥" : "♡"}</span> {saved ? "Saved" : `Save ${name}`}
        </button>
      </div>
      <label className="surname-tester">
        <span>Try it with your last name</span>
        <small>Nothing you type here leaves this page.</small>
        <input value={surname} onChange={(event) => setSurname(event.target.value.slice(0, 40))} onBlur={() => surname.trim() && track("surname_tested", { name })} placeholder="Enter a surname" autoComplete="family-name" />
      </label>
      <div className="full-name-preview" aria-live="polite">{name}{surname.trim() ? ` ${surname.trim()}` : " Your-Surname"}</div>
      <Link className="primary find-similar" href={`/?inspired=${encodeURIComponent(name)}`} onClick={() => track("find_similar_started", { name })}>Find names like {name} <span>→</span></Link>
    </section>
    {recent.length > 0 && <section className="recent-names"><h2>Recently viewed names</h2><div className="name-chips">{recent.map((item) => <Link key={item.slug} href={`/baby-names/${item.slug}`}>{item.name}</Link>)}</div></section>}
  </>;
}
