"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { names, type NameItem } from "./name-data";
import { createCloudJourney, joinCloudJourney, loadCloudRatings, saveCloudJourney, saveCloudRating, subscribeToCloudJourney, type CloudRating } from "../lib/shared-journeys";

type Step = "welcome" | "purpose" | "together" | "questions" | "details" | "profile" | "results";
type JourneyMode = "baby" | "sibling" | "twins";
type AnswerMap = Record<string, string[]>;
type Details = { likedNames:string; dislikedNames:string; familyName:string; honorStyle:string; preferredInitials:string; avoidedLetters:string; siblingNames:string };
type Question = { id:string; eyebrow:string; title:string; helper:string; max:number; options:string[]; when?:(answers:AnswerMap)=>boolean };
type TwinPair = { first:NameItem; second:NameItem };
type JourneySave = { version:2; mode:JourneyMode; answers:AnswerMap; details:Details; surname:string; nickname:string; buckets:Record<string,string>; seen:string[] };
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

const twinQuestions: Question[] = [
  { id:"twinDirection", eyebrow:"Two little people", title:"What kind of twin pairing are you naming?", helper:"This sets the broadest direction for each pair.", max:1, options:["Two girls", "Two boys", "A girl and a boy", "Gender-neutral pair", "Show us every combination"] },
  { id:"twinConnection", eyebrow:"Together, not identical", title:"How should their names connect?", helper:"This choice becomes a firm rule for every pair we show you.", max:1, options:["Same first initial", "Different first initials", "Subtly coordinated", "Clearly connected", "Distinct but balanced", "Surprise us"] },
  { id:"twinAvoid", eyebrow:"Their own identities", title:"What should we avoid in a twin pair?", helper:"These are firm exclusions, not gentle preferences.", max:3, options:["Rhyming endings", "Very different popularity", "Different cultural roots", "Nothing in particular"] },
];

function Mark() { return <span className="mark" aria-hidden="true">n</span>; }

const cultureOrigins: Record<string,string[]> = {
  African:["swahili","african","yoruba","akan"], Arabic:["arabic"], Celtic:["irish","scottish","welsh","breton"],
  "East Asian":["japanese","chinese","korean"], French:["french"], Germanic:["german","germanic"], Greek:["greek"], Hebrew:["hebrew"],
  Italian:["italian"], Latin:["latin","roman"], Nordic:["scandinavian","danish","norse","swedish"], Slavic:["slavic"],
  "South Asian":["sanskrit","indian","hindi"], "Spanish & Portuguese":["spanish","portuguese"], Welsh:["welsh"]
};
const list = (value:string) => value.split(",").map(x => x.trim().toLowerCase()).filter(Boolean).slice(0,6);

function rankedPool(answers: AnswerMap, details: Details, buckets: Record<string,string>, seen: string[], mode:JourneyMode = "baby") {
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
    if (mode === "sibling" && details.siblingNames.trim()) {
      const siblings = list(details.siblingNames);
      const siblingItems = names.filter(n => siblings.includes(n.name.toLowerCase()));
      score += siblingItems.reduce((total, sibling) => total + item.tags.filter(tag => sibling.tags.includes(tag)).length * 1.4, 0);
      if (siblings.some(name => name[0] === item.name[0].toLowerCase())) score += 1.5;
    }
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

function twinPairs(pool:NameItem[], answers:AnswerMap, seen:string[]):TwinPair[] {
  const direction = answers.twinDirection?.[0];
  const connection = answers.twinConnection?.[0];
  const avoid = answers.twinAvoid || [];
  const pairKey = (a:NameItem,b:NameItem) => [a.name,b.name].sort().join(" + ");
  const genderOk = (a:NameItem,b:NameItem) => {
    if (!direction || direction === "Show us every combination") return true;
    if (direction === "Two girls") return a.tags.includes("Girl names") && b.tags.includes("Girl names");
    if (direction === "Two boys") return a.tags.includes("Boy names") && b.tags.includes("Boy names");
    if (direction === "Gender-neutral pair") return a.tags.includes("Gender-neutral names") && b.tags.includes("Gender-neutral names");
    return (a.tags.includes("Girl names") && b.tags.includes("Boy names")) || (a.tags.includes("Boy names") && b.tags.includes("Girl names"));
  };
  const candidates:{pair:TwinPair;score:number}[] = [];
  pool.forEach((first, index) => pool.slice(index + 1).forEach(second => {
    if (!genderOk(first, second) || seen.includes(pairKey(first,second))) return;
    if (connection === "Same first initial" && first.name[0].toLowerCase() !== second.name[0].toLowerCase()) return;
    if (connection === "Different first initials" && first.name[0].toLowerCase() === second.name[0].toLowerCase()) return;
    if (avoid.includes("Rhyming endings") && first.name.slice(-2).toLowerCase() === second.name.slice(-2).toLowerCase()) return;
    if (avoid.includes("Different cultural roots") && first.origin !== second.origin) return;
    const overlap = first.tags.filter(tag => second.tags.includes(tag)).length;
    let score = overlap * (connection === "Clearly connected" ? 3 : connection === "Distinct but balanced" ? .7 : 1.7);
    if (first.origin === second.origin) score += connection === "Distinct but balanced" ? .5 : 2;
    if (first.name[0] !== second.name[0]) score += 2;
    if (first.name.length !== second.name.length) score += 1;
    candidates.push({pair:{first,second},score});
  }));
  return candidates.sort((a,b) => b.score-a.score).slice(0,15).map(item => item.pair);
}

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [mode, setMode] = useState<JourneyMode>("baby");
  const [question, setQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [surname, setSurname] = useState("");
  const [nickname, setNickname] = useState("Nice to have");
  const [current, setCurrent] = useState(0);
  const [buckets, setBuckets] = useState<Record<string, string>>({});
  const [showBuckets, setShowBuckets] = useState(false);
  const [batch, setBatch] = useState<NameItem[]>(names.slice(0,5));
  const [pairs, setPairs] = useState<TwinPair[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  const [finding, setFinding] = useState(false);
  const [aiRefined, setAiRefined] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [cloudJourney, setCloudJourney] = useState<{id:string;code:string;userId:string}|null>(null);
  const [cloudRatings, setCloudRatings] = useState<CloudRating[]>([]);
  const [cloudStatus, setCloudStatus] = useState<"local"|"saving"|"saved"|"error">("local");
  const [showShare, setShowShare] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [cloudError, setCloudError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem("namekind-journey");
      if (saved) {
        try {
          const journey = JSON.parse(saved) as Partial<JourneySave>;
          setMode(journey.mode || "baby");
          setAnswers(journey.answers || {});
          setDetails({...emptyDetails,...(journey.details || {})});
          setSurname(journey.surname || "");
          setNickname(journey.nickname || "Nice to have");
          setBuckets(journey.buckets || {});
          setSeen(journey.seen || []);
        } catch { /* fresh journey */ }
      }
      const cloud = localStorage.getItem("namekind-cloud-journey");
      if (cloud) {
        try { setCloudJourney(JSON.parse(cloud)); } catch { localStorage.removeItem("namekind-cloud-journey"); }
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const journey:JourneySave = { version:2, mode, answers, details, surname, nickname, buckets, seen };
    localStorage.setItem("namekind-journey", JSON.stringify(journey));
  }, [hydrated, mode, answers, details, surname, nickname, buckets, seen]);

  useEffect(() => {
    if (!hydrated || !cloudJourney) return;
    localStorage.setItem("namekind-cloud-journey", JSON.stringify(cloudJourney));
    const timer = window.setTimeout(() => {
      setCloudStatus("saving");
      void saveCloudJourney(cloudJourney.id, { version:2, mode, answers, details, surname, nickname, seen })
        .then(() => setCloudStatus("saved"))
        .catch(() => setCloudStatus("error"));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [hydrated, cloudJourney, mode, answers, details, surname, nickname, seen]);

  useEffect(() => {
    if (!cloudJourney) return;
    const refresh = () => { void loadCloudRatings(cloudJourney.id).then(setCloudRatings).catch(() => setCloudStatus("error")); };
    refresh();
    return subscribeToCloudJourney(cloudJourney.id, refresh);
  }, [cloudJourney]);

  const activeQuestions = [...(mode === "twins" ? twinQuestions : []), ...questions].filter(item => (mode !== "twins" || item.id !== "direction") && (!item.when || item.when(answers)));
  const q = activeQuestions[question];
  const selected = answers[q?.id] || [];
  const toggle = (option: string) => {
    const next = selected.includes(option) ? selected.filter(x => x !== option) : q.max === 1 ? [option] : selected.length < q.max ? [...selected, option] : selected;
    setAnswers({ ...answers, [q.id]: next });
  };
  const nextQuestion = () => question < activeQuestions.length - 1 ? setQuestion(question + 1) : setStep("details");
  const rate = (bucket: string) => {
    const key = mode === "twins" ? [pairs[current].first.name,pairs[current].second.name].sort().join(" + ") : batch[current].name;
    setBuckets({ ...buckets, [key]: bucket });
    if (cloudJourney) void saveCloudRating(cloudJourney.id, key, bucket).then(() => loadCloudRatings(cloudJourney.id)).then(setCloudRatings).catch(() => setCloudStatus("error"));
    const total = mode === "twins" ? pairs.length : batch.length;
    if (current < total - 1) setCurrent(current + 1); else setShowBuckets(true);
  };
  const loadNext = async (first = false) => {
    setFinding(true);
    const alreadySeen = first ? [] : seen;
    const candidates = rankedPool(answers, details, buckets, mode === "twins" ? [] : alreadySeen, mode);
    let next = candidates.slice(0,5);
    let nextPairs = mode === "twins" ? twinPairs(candidates, answers, alreadySeen).slice(0,5) : [];
    let refined = false;
    try {
      const response = await fetch("/api/refine", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode,answers,buckets,nickname,surname,seen:alreadySeen,details,candidates:candidates.map(n => ({name:n.name,origin:n.origin,meaning:n.meaning,tags:n.tags}))})});
      if (response.ok) {
        const data = await response.json() as { items?:NameItem[]; pairs?:TwinPair[] };
        if (mode === "twins" && (data.pairs?.length || 0) >= 5) { nextPairs = data.pairs!.slice(0,5); refined = true; }
        if (mode !== "twins" && (data.items?.length || 0) >= 5) { next = data.items!.slice(0,5); refined = true; }
      }
    } catch { /* the curated local engine remains available */ }
    if (mode === "twins") {
      setPairs(nextPairs);
      setSeen([...alreadySeen, ...nextPairs.map(pair => [pair.first.name,pair.second.name].sort().join(" + "))]);
      setCurrent(0); setAiRefined(refined); setFinding(false); setShowBuckets(false); setStep("results");
      return;
    }
    if (!next.length) next = rankedPool(answers, details, buckets, [], mode).filter(n => !buckets[n.name]).slice(0,5);
    setBatch(next); setSeen([...alreadySeen, ...next.map(n => n.name)]); setCurrent(0); setAiRefined(refined); setFinding(false); setShowBuckets(false); setStep("results");
  };
  const chooseMode = (nextMode:JourneyMode) => { setMode(nextMode); setAnswers({}); setBuckets({}); setSeen([]); setQuestion(0); setCurrent(0); setStep("together"); };
  const sharedSnapshot = () => ({ version:2, mode, answers, details, surname, nickname, seen });
  const beginTogether = async () => {
    setCloudError(""); setCloudStatus("saving");
    try {
      const journey = await createCloudJourney(mode, sharedSnapshot());
      setCloudJourney({id:journey.id,code:journey.code,userId:journey.userId}); setCloudStatus("saved"); setShowShare(true); setStep("questions");
    } catch { setCloudStatus("error"); setCloudError("Shared journeys need the Supabase setup step completed. Your local journey is still safe."); setShowShare(true); }
  };
  const joinTogether = async () => {
    if (joinCode.trim().length !== 6) return;
    setCloudError(""); setCloudStatus("saving");
    try {
      const journey = await joinCloudJourney(joinCode);
      const state = journey.state as Partial<JourneySave>;
      setMode(state.mode || "baby"); setAnswers(state.answers || {}); setDetails({...emptyDetails,...(state.details || {})}); setSurname(state.surname || ""); setNickname(state.nickname || "Nice to have"); setSeen(state.seen || []);
      setCloudJourney({id:journey.id,code:journey.code,userId:journey.userId}); setCloudStatus("saved"); setShowShare(false); setStep("questions");
    } catch { setCloudStatus("error"); setCloudError("We couldn’t find that journey. Check the six-character code and try again."); }
  };
  const restart = () => { setMode("baby"); setAnswers({}); setDetails(emptyDetails); setSurname(""); setNickname("Nice to have"); setBuckets({}); setSeen([]); setPairs([]); setCloudJourney(null); setCloudRatings([]); setCloudStatus("local"); setQuestion(0); setCurrent(0); setStep("welcome"); setShowBuckets(false); localStorage.removeItem("namekind-journey"); localStorage.removeItem("namekind-cloud-journey"); };

  return <main>
    <header className="site-header">
      <button className="brand" onClick={() => setStep("welcome")} aria-label="Namekind home"><Mark /><span>namekind</span></button>
      <nav aria-label="Primary navigation"><button onClick={() => setShowBuckets(true)}>Your shortlist <span className="count">{Object.values(buckets).filter(v => v !== "pass").length}</span></button><button className="save" onClick={() => setShowShare(true)}>{cloudJourney ? cloudStatus === "saving" ? "Saving…" : "Journey saved" : "Save your journey"}</button></nav>
    </header>

    {step === "welcome" && <section className="welcome page-enter">
      <div className="halo halo-one" /><div className="halo halo-two" />
      <p className="eyebrow">A more thoughtful way to choose</p>
      <h1>Find a name that<br /><em>feels like yours.</em></h1>
      <p className="lede">A few gentle questions. A world of meaningful names.<br className="desktop" /> Recommendations shaped around your story.</p>
      <button className="primary" onClick={() => setStep("purpose")}>Find your names <span>→</span></button>
      <div className="trust"><span>✦ No account needed</span><span>✦ Private by design</span><span>✦ Thoughtfully curated</span></div>
      <div className="name-cloud" aria-hidden="true"><span>Elodie</span><span>Silas</span><span>Maren</span><span>August</span><span>Noa</span></div>
    </section>}

    {step === "purpose" && <section className="center-card purpose page-enter">
      <button className="back" onClick={() => setStep("welcome")}>← Back</button>
      <p className="eyebrow">Begin your journey</p><h2>What are you naming today?</h2>
      <p className="sub">Choose a path and we’ll shape every question—and every suggestion—around it.</p>
      <div className="purpose-grid">
        <button className="purpose-card" onClick={() => chooseMode("baby")}><span className="card-symbol">♡</span><strong>A baby</strong><small>Discover a first name that feels like yours</small><b>Begin →</b></button>
        <button className="purpose-card" onClick={() => chooseMode("sibling")}><span className="card-symbol">⌁</span><strong>A sibling</strong><small>Find a name that belongs beautifully with your family</small><b>Find a match →</b></button>
        <button className="purpose-card featured" onClick={() => chooseMode("twins")}><span className="new-pill">New</span><span className="card-symbol">∞</span><strong>Twins</strong><small>Explore balanced pairs with two distinct identities</small><b>Find a pair →</b></button>
        <div className="purpose-card coming"><span className="new-pill">Coming next</span><span className="card-symbol">✦</span><strong>A pet</strong><small>A playful naming journey for every kind of companion</small><b>In development</b></div>
      </div>
    </section>}

    {step === "together" && <section className="center-card page-enter">
      <button className="back" onClick={() => setStep("purpose")}>← Back</button>
      <p className="eyebrow">Your naming journey</p><h2>Are you naming together<br />or exploring on your own?</h2>
      <p className="sub">You can always invite someone later. Your {mode === "twins" ? "twin-name" : mode === "sibling" ? "sibling-name" : "baby-name"} path is ready.</p>
      <div className="journey-grid">
        <button className="journey-card" onClick={() => setStep("questions")}><span className="card-symbol">♡</span><strong>Exploring on my own</strong><small>Start discovering names right away</small><b>Continue →</b></button>
        <button className="journey-card" onClick={() => { setCloudError(""); setJoinCode(""); setShowShare(true); }}><span className="card-symbol">♧</span><strong>Naming together</strong><small>Create a private journey for two</small><b>Choose how →</b></button>
      </div>
      <button className="code-link" onClick={() => {setCloudError("");setShowShare(true)}}>Already have a journey code? <u>Join here</u></button>
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
        {mode !== "twins" && <label className="wide"><span>{mode === "sibling" ? "Your child’s name" : "Sibling names"}</span><small>{mode === "sibling" ? "We’ll look for a complementary style, rhythm, and personality" : "Helps you consider how the names feel together"}</small><input value={details.siblingNames} onChange={e => setDetails({...details,siblingNames:e.target.value})} placeholder={mode === "sibling" ? "Enter the sibling’s name" : "Optional"} /></label>}
      </div>
      <button className="primary" onClick={() => setStep("profile")}>Review my profile <span>→</span></button>
      <button className="quiet" onClick={() => setStep("profile")}>Skip these details</button>
    </section>}

    {step === "profile" && <section className="profile page-enter">
      <p className="eyebrow">Your {mode === "twins" ? "twin" : mode === "sibling" ? "sibling" : "naming"} profile</p><h2>Here’s what we heard.</h2><p className="sub">One last look before we find your {mode === "twins" ? "pairs" : "names"}. Tap any answer to change it.</p>
      <div className="profile-grid">{activeQuestions.map((item, i) => <button key={item.id} onClick={() => {setQuestion(i); setStep("questions")}}><small>{item.title.replace("?", "")}</small><strong>{(answers[item.id] || ["Open to anything"]).join(" · ")}</strong><span>Edit</span></button>)}</div>
      <div className="extras"><label><span>Optional surname</span><input value={surname} onChange={e => setSurname(e.target.value)} placeholder="Helps us hear the full name" /></label><label><span>Nickname potential</span><select value={nickname} onChange={e => setNickname(e.target.value)}><option>Very important</option><option>Nice to have</option><option>Prefer no obvious nickname</option><option>No preference</option></select></label></div>
      <button className="primary" disabled={finding} onClick={() => loadNext(true)}>{finding ? "Finding thoughtful matches…" : mode === "twins" ? "Find our twin pairs" : mode === "sibling" ? "Find sibling matches" : "Find my names"} {!finding && <span>→</span>}</button>
      <p className="fine">We use your answers to do the heavy lifting before any AI refinement.</p>
    </section>}

    {step === "results" && !showBuckets && mode !== "twins" && <section className="results page-enter">
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

    {step === "results" && !showBuckets && mode === "twins" && pairs[current] && <section className="results twin-results page-enter">
      <div className="results-top"><div><p className="eyebrow">A balanced pair for you</p><h2>Meet {pairs[current].first.name} &amp; {pairs[current].second.name}.</h2></div><span>{current + 1} of {pairs.length}</span></div>
      <article className="name-card twin-card">
        <div className="twin-name-grid">{[pairs[current].first,pairs[current].second].map(item => <div className="twin-name" key={item.name}><div className="monogram">{item.name[0]}</div><h3>{item.name}</h3><p>{item.pronunciation} · {item.origin}</p><span>“{item.meaning}”</span><small>{item.why}</small></div>)}</div>
        <div className="pair-note"><span>Why they work together</span><p>They share a thoughtful sense of style while keeping different sounds and distinct identities. Try saying them separately, together, and with your surname.</p></div>
        <div className="rating"><button onClick={() => rate("pass")}><span>↓</span><small>Not for us</small></button><button onClick={() => rate("maybe")}><span>↔</span><small>Maybe</small></button><button className="love" onClick={() => rate("love")}><span>↑</span><small>Love the pair</small></button></div>
      </article>
      <button className="quiet" onClick={() => setShowBuckets(true)}>Review our twin pairs</button>
    </section>}

    {showBuckets && <div className="modal-wrap page-enter"><section className="shortlist"><button className="modal-close" onClick={() => setShowBuckets(false)} aria-label="Close shortlist">×</button><p className="eyebrow">Your shortlist</p><h2>The names taking shape.</h2><p className="sub">{cloudJourney ? `Shared journey ${cloudJourney.code} · Partner ratings update automatically.` : "Saved privately on this device."}</p>
      <div className="bucket-grid">{[["love","Loved","The clear favorites"],["maybe","Maybe","Worth another look"],["pass","Passed","Not quite right"]].map(([key,label,desc]) => <div className="bucket" key={key}><div><span>{label}</span><small>{desc}</small></div>{Object.entries(buckets).filter(([,v]) => v === key).length ? Object.entries(buckets).filter(([,v]) => v === key).map(([name]) => { const partner = cloudRatings.find(r => r.item_key === name && r.user_id !== cloudJourney?.userId); return <button key={name}>{name}{partner ? <span className={`partner-${partner.rating}`}>Partner: {partner.rating}</span> : <span>•••</span>}</button>}) : <p>No names here yet</p>}</div>)}</div>
      <div className="shortlist-actions"><button className="quiet" onClick={restart}>Start over</button><button className="primary small" disabled={finding} onClick={() => loadNext(false)}>{finding ? "Learning your taste…" : "Explore five new names"} {!finding && <span>→</span>}</button></div>
    </section></div>}

    {showShare && <div className="modal-wrap page-enter"><section className="share-card" role="dialog" aria-modal="true" aria-labelledby="share-title"><button className="modal-close" onClick={() => setShowShare(false)} aria-label="Close shared journey">×</button>
      {cloudJourney ? <><p className="eyebrow">Your private journey</p><h2 id="share-title">Invite your naming partner.</h2><p className="sub">Share this code. They can enter it from the “Join here” link on Namekind.</p><div className="journey-code" aria-label={`Journey code ${cloudJourney.code}`}>{cloudJourney.code}</div><button className="primary small" onClick={() => navigator.clipboard?.writeText(cloudJourney.code)}>Copy code</button><p className="fine">No account is required. This browser remains privately connected to the journey.</p></> : <><p className="eyebrow">Name together</p><h2 id="share-title">How would you like to begin?</h2><p className="sub">Start a new shared journey, or connect to one your naming partner already created.</p><div className="share-choice create-choice"><div><span className="choice-number">01</span><strong>Create a code to share</strong><small>Begin a new journey and receive your own private six-character code.</small></div><button className="primary small" disabled={cloudStatus === "saving"} onClick={beginTogether}>{cloudStatus === "saving" ? "Creating…" : "Create my code"}</button></div><div className="choice-divider"><span>or</span></div><div className="share-choice join-choice"><div><span className="choice-number">02</span><strong>Join with a code</strong><small>Enter the six-character code your naming partner shared with you.</small></div><label className="join-field"><span>Journey code</span><input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0,6))} placeholder="ABC234" autoComplete="off" aria-label="Six-character journey code" /></label><button className="secondary small" disabled={joinCode.length !== 6 || cloudStatus === "saving"} onClick={joinTogether}>{cloudStatus === "saving" ? "Connecting…" : "Join this journey"}</button></div></>}
      {cloudError && <p className="cloud-error" role="alert">{cloudError}</p>}
    </section></div>}

    <footer className="home-footer"><div className="brand"><Mark /><span>namekind</span></div><p>Names chosen with meaning, not just momentum.</p><nav aria-label="Legal and information"><Link href="/baby-names">Popular names</Link><Link href="/guides/choosing-a-baby-name">Guide</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link><Link href="/contact">Contact</Link></nav></footer>
  </main>;
}
