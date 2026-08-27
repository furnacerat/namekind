"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { names, type NameItem } from "./name-data";

type Step = "welcome" | "together" | "questions" | "details" | "profile" | "results";
type AnswerMap = Record<string, string[]>;
type Details = { likedNames:string; dislikedNames:string; familyName:string; honorStyle:string; preferredInitials:string; avoidedLetters:string; siblingNames:string };
type Question = { id:string; eyebrow:string; title:string; helper:string; max:number; options:string[]; when?:(answers:AnswerMap)=>boolean };
const emptyDetails: Details = { likedNames:"", dislikedNames:"", familyName:"", honorStyle:"Inspiration only", preferredInitials:"", avoidedLetters:"", siblingNames:"" };

const questions: Question[] = [
  { id: "direction", eyebrow: "Let’s begin", title: "What kinds of names should we explore?", helper: "Choose the direction that feels right today.", max: 1, options: ["Girl names", "Boy names", "Gender-neutral names", "Show me everything", "We’re not sure yet"] },
  { id: "style", eyebrow: "Your taste", title: "Which naming styles feel most like you?", helper: "Choose up to three. You can always change these later.", max: 3, options: ["Classic", "Traditional", "Modern", "Vintage", "Creative", "Rare", "Nature-inspired", "Literary", "Spiritual", "Strong", "Soft & melodic", "Whimsical"] },
  { id: "familiarity", eyebrow: "A sense of place", title: "How familiar should the name feel?", helper: "There is no wrong answer—this simply shapes the search.", max: 1, options: ["Well-known & timeless", "Familiar, but not everywhere", "Uncommon & distinctive", "Rare & unexpected", "Surprise me"] },
  { id: "culture", eyebrow: "Your story", title: "Should the name carry a cultural connection?", helper: "We’ll explore many origins with care and context.", max: 1, options: ["Yes, this is important", "It would be nice", "No preference", "No cultural influence"] },
  { id: "cultureDetails", eyebrow: "Your story", title: "Which cultural influences feel meaningful?", helper: "Choose up to three. This guides the search without limiting it to one tradition.", max: 3, options: ["African", "Arabic", "Celtic", "East Asian", "French", "Germanic", "Greek", "Hebrew", "Italian", "Latin", "Nordic", "Slavic", "South Asian", "Spanish & Portuguese", "Welsh"], when: answers => ["Yes, this is important","It would be nice"].includes(answers.culture?.[0]) },
  { id: "meaning", eyebrow: "The heart of it", title: "What would you like the name to express?", helper: "Choose up to three qualities that matter to you.", max: 3, options: ["Love", "Joy", "Strength", "Courage", "Wisdom", "Hope", "Peace", "Faith", "Kindness", "Freedom", "New beginnings", "Nature", "No particular meaning"] },
  { id: "sound", eyebrow: "Say it aloud", title: "How should the name sound?", helper: "Imagine calling it softly—and across a playground.", max: 1, options: ["Soft & gentle", "Strong & confident", "Bright & energetic", "Smooth & melodic", "Short & crisp", "No preference"] },
  { id: "length", eyebrow: "Rhythm & flow", title: "What length feels right?", helper: "We’ll consider how the full name moves together.", max: 1, options: ["Short—one or two syllables", "Medium—two or three syllables", "Long & flowing", "No preference"] },
  { id: "popularity", eyebrow: "One last thought", title: "How do you feel about popular names?", helper: "A gentle final filter before we find your names.", max: 1, options: ["We love familiar favorites", "Recognizable, not too common", "Something uncommon", "The rarer, the better", "Popularity doesn’t matter"] },
  { id: "spelling", eyebrow: "The finishing touch", title: "How should the spelling feel?", helper: "This helps us balance ease, familiarity, and originality.", max: 1, options: ["Conventional", "Flexible", "Distinctive", "No preference"] },
];

function Mark() { return <span className="mark" aria-hidden="true">n</span>; }

const cultureOrigins: Record<string,string[]> = {
  African:["swahili","african","yoruba","akan"], Arabic:["arabic"], Celtic:["irish","scottish","welsh","breton"],
  "East Asian":["japanese","chinese","korean"], French:["french"], Germanic:["german","germanic"], Greek:["greek"], Hebrew:["hebrew"],
  Italian:["italian"], Latin:["latin","roman"], Nordic:["scandinavian","danish","norse","swedish"], Slavic:["slavic"],
  "South Asian":["sanskrit","indian","hindi"], "Spanish & Portuguese":["spanish","portuguese"], Welsh:["welsh"]
};
const list = (value:string) => value.split(",").map(x => x.trim().toLowerCase()).filter(Boolean).slice(0,6);

function rankedPool(answers: AnswerMap, details: Details, buckets: Record<string,string>, seen: string[]) {
  const selected = Object.values(answers).flat();
  const direction = answers.direction?.[0];
  const liked = list(details.likedNames);
  const disliked = list(details.dislikedNames);
  const tasteNames = names.filter(n => liked.includes(n.name.toLowerCase()));
  const positiveTags = [...names.filter(n => buckets[n.name] === "love" || buckets[n.name] === "maybe"), ...tasteNames].flatMap(n => n.tags);
  const negativeTags = names.filter(n => buckets[n.name] === "pass").flatMap(n => n.tags);
  const preferredInitials = details.preferredInitials.toLowerCase().replace(/[^a-z]/g, "");
  const familyInitial = details.familyName.trim().charAt(0).toLowerCase();
  const avoidedLetters = details.avoidedLetters.toLowerCase().replace(/[^a-z]/g, "");
  const eligible = names.filter(n => {
    if (seen.includes(n.name) || disliked.includes(n.name.toLowerCase())) return false;
    if (!direction || direction === "Show me everything" || direction === "We’re not sure yet") return true;
    return n.tags.includes(direction);
  });
  const scored = eligible.map(item => {
    let score = item.tags.reduce((total, tag) => total + (selected.includes(tag) ? 4 : 0), 0);
    score += item.tags.reduce((total, tag) => total + positiveTags.filter(t => t === tag).length * 1.6, 0);
    score -= item.tags.reduce((total, tag) => total + negativeTags.filter(t => t === tag).length * .45, 0);
    const origin = item.origin.toLowerCase();
    if ((answers.cultureDetails || []).some(choice => cultureOrigins[choice]?.some(value => origin.includes(value)))) score += 7;
    if (preferredInitials.includes(item.name[0].toLowerCase())) score += 5;
    if (details.honorStyle === "Same initial" && familyInitial === item.name[0].toLowerCase()) score += 7;
    if (details.honorStyle === "Use it directly" && item.name.toLowerCase() === details.familyName.trim().toLowerCase()) score += 12;
    if (avoidedLetters.split("").some(letter => item.name.toLowerCase().includes(letter))) score -= 8;
    if (answers.spelling?.[0] === "Conventional" && item.tags.some(tag => ["Classic","Traditional","Well-known & timeless"].includes(tag))) score += 3;
    if (answers.spelling?.[0] === "Distinctive" && item.tags.some(tag => ["Creative","Rare","Rare & unexpected"].includes(tag))) score += 3;
    score += item.name.split("").reduce((n, c) => n + c.charCodeAt(0), 0) % 17 / 20;
    return { item, score };
  }).sort((a,b) => b.score - a.score);
  const diverse: NameItem[] = [];
  while (scored.length && diverse.length < 15) {
    scored.sort((a,b) => {
      const penalty = (x: NameItem) => diverse.some(d => d.origin === x.origin) ? 2.2 : 0;
      return (b.score - penalty(b.item)) - (a.score - penalty(a.item));
    });
    diverse.push(scored.shift()!.item);
  }
  return diverse;
}

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [question, setQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [surname, setSurname] = useState("");
  const [nickname, setNickname] = useState("Nice to have");
  const [current, setCurrent] = useState(0);
  const [buckets, setBuckets] = useState<Record<string, string>>({});
  const [showBuckets, setShowBuckets] = useState(false);
  const [batch, setBatch] = useState<NameItem[]>(names.slice(0,5));
  const [seen, setSeen] = useState<string[]>([]);
  const [finding, setFinding] = useState(false);
  const [aiRefined, setAiRefined] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("namekind-journey");
    if (saved) {
      try { const journey = JSON.parse(saved); setAnswers(journey.answers || {}); setDetails({...emptyDetails,...(journey.details || {})}); setSurname(journey.surname || ""); setNickname(journey.nickname || "Nice to have"); setBuckets(journey.buckets || {}); setSeen(journey.seen || []); } catch { /* fresh journey */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("namekind-journey", JSON.stringify({ answers, details, surname, nickname, buckets, seen }));
  }, [answers, details, surname, nickname, buckets, seen]);

  const activeQuestions = questions.filter(item => !item.when || item.when(answers));
  const q = activeQuestions[question];
  const selected = answers[q?.id] || [];
  const toggle = (option: string) => {
    const next = selected.includes(option) ? selected.filter(x => x !== option) : q.max === 1 ? [option] : selected.length < q.max ? [...selected, option] : selected;
    setAnswers({ ...answers, [q.id]: next });
  };
  const nextQuestion = () => question < activeQuestions.length - 1 ? setQuestion(question + 1) : setStep("details");
  const rate = (bucket: string) => {
    setBuckets({ ...buckets, [batch[current].name]: bucket });
    if (current < batch.length - 1) setCurrent(current + 1); else setShowBuckets(true);
  };
  const loadNext = async (first = false) => {
    setFinding(true);
    const alreadySeen = first ? [] : seen;
    const candidates = rankedPool(answers, details, buckets, alreadySeen);
    let next = candidates.slice(0,5);
    let refined = false;
    if (candidates.length) {
      try {
        const response = await fetch("/api/refine", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({answers,buckets,nickname,surname,details:{likedNames:details.likedNames,dislikedNames:details.dislikedNames,honorStyle:details.honorStyle,preferredInitials:details.preferredInitials,avoidedLetters:details.avoidedLetters,familyInitial:details.familyName.trim().charAt(0),siblingNameProvided:Boolean(details.siblingNames.trim())},candidates:candidates.map(n => ({name:n.name,origin:n.origin,meaning:n.meaning,tags:n.tags}))})});
        if (response.ok) {
          const data = await response.json() as { names?: string[] };
          const ordered = (data.names || []).map(name => candidates.find(n => n.name === name)).filter(Boolean) as NameItem[];
          if (ordered.length >= 5) { next = ordered.slice(0,5); refined = true; }
        }
      } catch { /* the local ranking is always ready */ }
    }
    if (!next.length) next = rankedPool(answers, details, buckets, []).filter(n => !buckets[n.name]).slice(0,5);
    setBatch(next); setSeen([...alreadySeen, ...next.map(n => n.name)]); setCurrent(0); setAiRefined(refined); setFinding(false); setShowBuckets(false); setStep("results");
  };
  const restart = () => { setAnswers({}); setDetails(emptyDetails); setSurname(""); setNickname("Nice to have"); setBuckets({}); setSeen([]); setQuestion(0); setCurrent(0); setStep("welcome"); setShowBuckets(false); localStorage.removeItem("namekind-journey"); };

  return <main>
    <header className="site-header">
      <button className="brand" onClick={() => setStep("welcome")} aria-label="Namekind home"><Mark /><span>namekind</span></button>
      <nav aria-label="Primary navigation"><button onClick={() => setShowBuckets(true)}>Your shortlist <span className="count">{Object.values(buckets).filter(v => v !== "pass").length}</span></button><button className="save">Save your journey</button></nav>
    </header>

    {step === "welcome" && <section className="welcome page-enter">
      <div className="halo halo-one" /><div className="halo halo-two" />
      <p className="eyebrow">A more thoughtful way to choose</p>
      <h1>Find a name that<br /><em>feels like yours.</em></h1>
      <p className="lede">A few gentle questions. A world of meaningful names.<br className="desktop" /> Recommendations shaped around your story.</p>
      <button className="primary" onClick={() => setStep("together")}>Find your names <span>→</span></button>
      <div className="trust"><span>✦ No account needed</span><span>✦ Private by design</span><span>✦ Thoughtfully curated</span></div>
      <div className="name-cloud" aria-hidden="true"><span>Elodie</span><span>Silas</span><span>Maren</span><span>August</span><span>Noa</span></div>
    </section>}

    {step === "together" && <section className="center-card page-enter">
      <button className="back" onClick={() => setStep("welcome")}>← Back</button>
      <p className="eyebrow">Your naming journey</p><h2>Are you naming together<br />or exploring on your own?</h2>
      <p className="sub">You can always invite someone later.</p>
      <div className="journey-grid">
        <button className="journey-card" onClick={() => setStep("questions")}><span className="card-symbol">♡</span><strong>Exploring on my own</strong><small>Start discovering names right away</small><b>Continue →</b></button>
        <button className="journey-card" onClick={() => setStep("questions")}><span className="card-symbol">♧</span><strong>Naming together</strong><small>Create a private journey for two</small><b>Start together →</b></button>
      </div>
      <button className="code-link" onClick={() => setStep("questions")}>Already have a journey code? <u>Join here</u></button>
    </section>}

    {step === "questions" && <section className="question-shell page-enter">
      <div className="progress-row"><button className="back" onClick={() => question ? setQuestion(question - 1) : setStep("together")}>← Back</button><div className="progress"><i style={{width: `${((question + 1) / activeQuestions.length) * 100}%`}} /></div><span>A few questions to go</span></div>
      <div className="question-content"><p className="eyebrow">{q.eyebrow}</p><h2>{q.title}</h2><p className="sub">{q.helper}</p>
        <div className="options">{q.options.map(option => <button key={option} className={selected.includes(option) ? "option selected" : "option"} onClick={() => toggle(option)}><span>{option}</span><i>{selected.includes(option) ? "✓" : ""}</i></button>)}</div>
        <div className="question-footer"><span>{q.max > 1 ? `${selected.length} of ${q.max} selected` : "Choose one"}</span><button className="primary small" disabled={!selected.length} onClick={nextQuestion}>{question === activeQuestions.length - 1 ? "Add personal touches" : "Continue"} <span>→</span></button></div>
      </div>
    </section>}

    {step === "details" && <section className="details profile page-enter">
      <button className="back" onClick={() => {setQuestion(activeQuestions.length - 1); setStep("questions")}}>← Back</button>
      <p className="eyebrow">Optional personal touches</p><h2>Make the search feel even more yours.</h2><p className="sub">Skip anything you’d rather not share. These details narrow our own database before AI refinement.</p>
      <div className="detail-grid">
        <label><span>Names you already like</span><small>Up to six, separated by commas</small><input value={details.likedNames} onChange={e => setDetails({...details,likedNames:e.target.value})} placeholder="Clara, Rowan, Mateo" /></label>
        <label><span>Names you know aren’t right</span><small>We’ll keep them out of your results</small><input value={details.dislikedNames} onChange={e => setDetails({...details,dislikedNames:e.target.value})} placeholder="Names to avoid" /></label>
        <label><span>A family name to honor</span><small>Optional and kept with this journey</small><input value={details.familyName} onChange={e => setDetails({...details,familyName:e.target.value})} placeholder="First name or family name" /></label>
        <label><span>How should we honor it?</span><small>Choose the kind of connection</small><select value={details.honorStyle} onChange={e => setDetails({...details,honorStyle:e.target.value})}><option>Inspiration only</option><option>Same initial</option><option>Use it directly</option><option>Preserve the meaning</option><option>Find variations</option></select></label>
        <label><span>Initials you’d enjoy</span><small>Letters only, such as A, M, or S</small><input value={details.preferredInitials} onChange={e => setDetails({...details,preferredInitials:e.target.value})} placeholder="A, M" /></label>
        <label><span>Letters you’d rather avoid</span><small>We’ll gently filter names containing them</small><input value={details.avoidedLetters} onChange={e => setDetails({...details,avoidedLetters:e.target.value})} placeholder="X, Z" /></label>
        <label className="wide"><span>Sibling names</span><small>Helps you consider how the names feel together</small><input value={details.siblingNames} onChange={e => setDetails({...details,siblingNames:e.target.value})} placeholder="Optional" /></label>
      </div>
      <button className="primary" onClick={() => setStep("profile")}>Review my profile <span>→</span></button>
      <button className="quiet" onClick={() => setStep("profile")}>Skip these details</button>
    </section>}

    {step === "profile" && <section className="profile page-enter">
      <p className="eyebrow">Your naming profile</p><h2>Here’s what we heard.</h2><p className="sub">One last look before we find your names. Tap any answer to change it.</p>
      <div className="profile-grid">{activeQuestions.map((item, i) => <button key={item.id} onClick={() => {setQuestion(i); setStep("questions")}}><small>{item.title.replace("?", "")}</small><strong>{(answers[item.id] || ["Open to anything"]).join(" · ")}</strong><span>Edit</span></button>)}</div>
      <div className="extras"><label><span>Optional surname</span><input value={surname} onChange={e => setSurname(e.target.value)} placeholder="Helps us hear the full name" /></label><label><span>Nickname potential</span><select value={nickname} onChange={e => setNickname(e.target.value)}><option>Very important</option><option>Nice to have</option><option>Prefer no obvious nickname</option><option>No preference</option></select></label></div>
      <button className="primary" disabled={finding} onClick={() => loadNext(true)}>{finding ? "Finding thoughtful matches…" : "Find my names"} {!finding && <span>→</span>}</button>
      <p className="fine">We use your answers to do the heavy lifting before any AI refinement.</p>
    </section>}

    {step === "results" && !showBuckets && <section className="results page-enter">
      <div className="results-top"><div><p className="eyebrow">{aiRefined ? "AI-refined for you" : seen.length > 5 ? "Learning your taste" : "Your first five"}</p><h2>Meet {batch[current].name}.</h2></div><span>{current + 1} of {batch.length}</span></div>
      <article className="name-card">
        <div className="name-main"><div className="monogram">{batch[current].name[0]}</div><div><h3>{batch[current].name}{surname && <small> {surname}</small>}</h3><p>{batch[current].pronunciation} <i /> {batch[current].origin}</p></div></div>
        <div className="meaning"><span>Meaning</span><strong>“{batch[current].meaning}”</strong></div>
        <p className="why">{batch[current].why}</p>
        <div className="nickname-row"><span>Nickname possibilities</span>{batch[current].nicknames.map(n => <b key={n}>{n}</b>)}</div>
        <div className="rating"><button onClick={() => rate("pass")}><span>↓</span><small>Not for us</small></button><button onClick={() => rate("maybe")}><span>↔</span><small>Maybe</small></button><button className="love" onClick={() => rate("love")}><span>↑</span><small>Love it</small></button></div>
      </article>
      <button className="quiet" onClick={() => setShowBuckets(true)}>Review my shortlist</button>
    </section>}

    {showBuckets && <div className="modal-wrap page-enter"><section className="shortlist"><button className="modal-close" onClick={() => setShowBuckets(false)}>×</button><p className="eyebrow">Your shortlist</p><h2>The names taking shape.</h2><p className="sub">Everything stays on this device unless you choose to save.</p>
      <div className="bucket-grid">{[["love","Loved","The clear favorites"],["maybe","Maybe","Worth another look"],["pass","Passed","Not quite right"]].map(([key,label,desc]) => <div className="bucket" key={key}><div><span>{label}</span><small>{desc}</small></div>{Object.entries(buckets).filter(([,v]) => v === key).length ? Object.entries(buckets).filter(([,v]) => v === key).map(([name]) => <button key={name}>{name}<span>•••</span></button>) : <p>No names here yet</p>}</div>)}</div>
      <div className="shortlist-actions"><button className="quiet" onClick={restart}>Start over</button><button className="primary small" disabled={finding} onClick={() => loadNext(false)}>{finding ? "Learning your taste…" : "Explore five new names"} {!finding && <span>→</span>}</button></div>
    </section></div>}

    <footer className="home-footer"><div className="brand"><Mark /><span>namekind</span></div><p>Names chosen with meaning, not just momentum.</p><nav aria-label="Legal and information"><Link href="/baby-names">Popular names</Link><Link href="/guides/choosing-a-baby-name">Guide</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link><Link href="/contact">Contact</Link></nav></footer>
  </main>;
}
