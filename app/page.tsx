"use client";

import { useEffect, useMemo, useState } from "react";

type Step = "welcome" | "together" | "questions" | "profile" | "results";
type AnswerMap = Record<string, string[]>;
type NameItem = {
  name: string;
  pronunciation: string;
  origin: string;
  meaning: string;
  nicknames: string[];
  why: string;
  tags: string[];
};

const questions = [
  { id: "direction", eyebrow: "Let’s begin", title: "What kinds of names should we explore?", helper: "Choose the direction that feels right today.", max: 1, options: ["Girl names", "Boy names", "Gender-neutral names", "Show me everything", "We’re not sure yet"] },
  { id: "style", eyebrow: "Your taste", title: "Which naming styles feel most like you?", helper: "Choose up to three. You can always change these later.", max: 3, options: ["Classic", "Traditional", "Modern", "Vintage", "Creative", "Rare", "Nature-inspired", "Literary", "Spiritual", "Strong", "Soft & melodic", "Whimsical"] },
  { id: "familiarity", eyebrow: "A sense of place", title: "How familiar should the name feel?", helper: "There is no wrong answer—this simply shapes the search.", max: 1, options: ["Well-known & timeless", "Familiar, but not everywhere", "Uncommon & distinctive", "Rare & unexpected", "Surprise me"] },
  { id: "culture", eyebrow: "Your story", title: "Should the name carry a cultural connection?", helper: "We’ll explore many origins with care and context.", max: 1, options: ["Yes, this is important", "It would be nice", "No preference", "No cultural influence"] },
  { id: "meaning", eyebrow: "The heart of it", title: "What would you like the name to express?", helper: "Choose up to three qualities that matter to you.", max: 3, options: ["Love", "Joy", "Strength", "Courage", "Wisdom", "Hope", "Peace", "Faith", "Kindness", "Freedom", "New beginnings", "Nature", "No particular meaning"] },
  { id: "sound", eyebrow: "Say it aloud", title: "How should the name sound?", helper: "Imagine calling it softly—and across a playground.", max: 1, options: ["Soft & gentle", "Strong & confident", "Bright & energetic", "Smooth & melodic", "Short & crisp", "No preference"] },
  { id: "length", eyebrow: "Rhythm & flow", title: "What length feels right?", helper: "We’ll consider how the full name moves together.", max: 1, options: ["Short—one or two syllables", "Medium—two or three syllables", "Long & flowing", "No preference"] },
  { id: "popularity", eyebrow: "One last thought", title: "How do you feel about popular names?", helper: "A gentle final filter before we find your names.", max: 1, options: ["We love familiar favorites", "Recognizable, not too common", "Something uncommon", "The rarer, the better", "Popularity doesn’t matter"] },
];

const names: NameItem[] = [
  { name: "Elodie", pronunciation: "EL-oh-dee", origin: "French", meaning: "Foreign riches", nicknames: ["Elle", "Ellie", "Lodie"], why: "Soft and musical, with a familiar shape that still feels distinctive.", tags: ["Girl names", "Soft & melodic", "Smooth & melodic", "Uncommon & distinctive", "Medium—two or three syllables", "Something uncommon"] },
  { name: "Silas", pronunciation: "SY-lus", origin: "Latin & Greek", meaning: "Of the forest", nicknames: ["Si", "Sly"], why: "A grounded classic with natural warmth and a quietly confident sound.", tags: ["Boy names", "Classic", "Nature-inspired", "Strong", "Strength", "Nature", "Familiar, but not everywhere"] },
  { name: "Maren", pronunciation: "MARE-en", origin: "Scandinavian", meaning: "Of the sea", nicknames: ["Mari", "Ren"], why: "Calm and polished, balancing a gentle sound with uncommon character.", tags: ["Girl names", "Gender-neutral names", "Nature-inspired", "Soft & gentle", "Nature", "Something uncommon"] },
  { name: "August", pronunciation: "AW-gust", origin: "Latin", meaning: "Magnificent, venerable", nicknames: ["Auggie", "Gus"], why: "A vintage name with substance, warmth, and exceptionally charming nicknames.", tags: ["Boy names", "Gender-neutral names", "Vintage", "Classic", "Strong & confident", "Strength", "Well-known & timeless"] },
  { name: "Noa", pronunciation: "NO-ah", origin: "Hebrew", meaning: "Movement", nicknames: ["Noey"], why: "Brief, bright, and cross-cultural—with a modern ease and gentle strength.", tags: ["Girl names", "Gender-neutral names", "Modern", "Short & crisp", "Short—one or two syllables", "Freedom"] },
  { name: "Clara", pronunciation: "KLAIR-ah", origin: "Latin", meaning: "Bright, clear", nicknames: ["Clare", "Clary"], why: "A luminous classic that feels graceful, warm, and enduring.", tags: ["Girl names", "Classic", "Traditional", "Joy", "Well-known & timeless"] },
  { name: "Rowan", pronunciation: "ROH-en", origin: "Irish & Scottish", meaning: "Little red one; rowan tree", nicknames: ["Ro", "Row"], why: "Nature-rooted and contemporary, with an easy sound that suits every age.", tags: ["Boy names", "Gender-neutral names", "Nature-inspired", "Modern", "Nature", "Familiar, but not everywhere"] },
  { name: "Amara", pronunciation: "ah-MAR-ah", origin: "Multiple origins", meaning: "Grace; eternal", nicknames: ["Ami", "Mara"], why: "A flowing multicultural name with an uplifting meaning and elegant rhythm.", tags: ["Girl names", "Smooth & melodic", "Spiritual", "Faith", "Love", "Medium—two or three syllables"] },
  { name: "Felix", pronunciation: "FEE-liks", origin: "Latin", meaning: "Happy, fortunate", nicknames: ["Fee", "Lix"], why: "Cheerful without being childish, familiar without feeling overused.", tags: ["Boy names", "Classic", "Bright & energetic", "Joy", "Recognizable, not too common"] },
  { name: "Ione", pronunciation: "eye-OH-nee", origin: "Greek", meaning: "Violet flower", nicknames: ["Io", "Oni"], why: "Rare, lyrical, and rooted in nature—an artful name with genuine history.", tags: ["Girl names", "Rare", "Nature-inspired", "Rare & unexpected", "The rarer, the better", "Nature"] },
];

function Mark() { return <span className="mark" aria-hidden="true">n</span>; }

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [question, setQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [surname, setSurname] = useState("");
  const [nickname, setNickname] = useState("Nice to have");
  const [current, setCurrent] = useState(0);
  const [buckets, setBuckets] = useState<Record<string, string>>({});
  const [showBuckets, setShowBuckets] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("namekind-journey");
    if (saved) {
      try { setBuckets(JSON.parse(saved).buckets || {}); } catch { /* fresh journey */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("namekind-journey", JSON.stringify({ answers, surname, nickname, buckets }));
  }, [answers, surname, nickname, buckets]);

  const recommendations = useMemo(() => {
    const selected = Object.values(answers).flat();
    return [...names].sort((a, b) => b.tags.filter(t => selected.includes(t)).length - a.tags.filter(t => selected.includes(t)).length);
  }, [answers]);

  const q = questions[question];
  const selected = answers[q?.id] || [];
  const toggle = (option: string) => {
    const next = selected.includes(option) ? selected.filter(x => x !== option) : q.max === 1 ? [option] : selected.length < q.max ? [...selected, option] : selected;
    setAnswers({ ...answers, [q.id]: next });
  };
  const nextQuestion = () => question < questions.length - 1 ? setQuestion(question + 1) : setStep("profile");
  const rate = (bucket: string) => {
    setBuckets({ ...buckets, [recommendations[current].name]: bucket });
    if (current < 4) setCurrent(current + 1); else setShowBuckets(true);
  };
  const restart = () => { setAnswers({}); setBuckets({}); setQuestion(0); setCurrent(0); setStep("welcome"); setShowBuckets(false); localStorage.removeItem("namekind-journey"); };

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
      <div className="progress-row"><button className="back" onClick={() => question ? setQuestion(question - 1) : setStep("together")}>← Back</button><div className="progress"><i style={{width: `${((question + 1) / questions.length) * 100}%`}} /></div><span>A few questions to go</span></div>
      <div className="question-content"><p className="eyebrow">{q.eyebrow}</p><h2>{q.title}</h2><p className="sub">{q.helper}</p>
        <div className="options">{q.options.map(option => <button key={option} className={selected.includes(option) ? "option selected" : "option"} onClick={() => toggle(option)}><span>{option}</span><i>{selected.includes(option) ? "✓" : ""}</i></button>)}</div>
        <div className="question-footer"><span>{q.max > 1 ? `${selected.length} of ${q.max} selected` : "Choose one"}</span><button className="primary small" disabled={!selected.length} onClick={nextQuestion}>{question === questions.length - 1 ? "Review my profile" : "Continue"} <span>→</span></button></div>
      </div>
    </section>}

    {step === "profile" && <section className="profile page-enter">
      <p className="eyebrow">Your naming profile</p><h2>Here’s what we heard.</h2><p className="sub">One last look before we find your names. Tap any answer to change it.</p>
      <div className="profile-grid">{questions.map((item, i) => <button key={item.id} onClick={() => {setQuestion(i); setStep("questions")}}><small>{item.title.replace("?", "")}</small><strong>{(answers[item.id] || ["Open to anything"]).join(" · ")}</strong><span>Edit</span></button>)}</div>
      <div className="extras"><label><span>Optional surname</span><input value={surname} onChange={e => setSurname(e.target.value)} placeholder="Helps us hear the full name" /></label><label><span>Nickname potential</span><select value={nickname} onChange={e => setNickname(e.target.value)}><option>Very important</option><option>Nice to have</option><option>Prefer no obvious nickname</option><option>No preference</option></select></label></div>
      <button className="primary" onClick={() => {setCurrent(0); setStep("results")}}>Find my names <span>→</span></button>
      <p className="fine">We use your answers to do the heavy lifting before any AI refinement.</p>
    </section>}

    {step === "results" && !showBuckets && <section className="results page-enter">
      <div className="results-top"><div><p className="eyebrow">Your first five</p><h2>Meet {recommendations[current].name}.</h2></div><span>{current + 1} of 5</span></div>
      <article className="name-card">
        <div className="name-main"><div className="monogram">{recommendations[current].name[0]}</div><div><h3>{recommendations[current].name}{surname && <small> {surname}</small>}</h3><p>{recommendations[current].pronunciation} <i /> {recommendations[current].origin}</p></div></div>
        <div className="meaning"><span>Meaning</span><strong>“{recommendations[current].meaning}”</strong></div>
        <p className="why">{recommendations[current].why}</p>
        <div className="nickname-row"><span>Nickname possibilities</span>{recommendations[current].nicknames.map(n => <b key={n}>{n}</b>)}</div>
        <div className="rating"><button onClick={() => rate("pass")}><span>↓</span><small>Not for us</small></button><button onClick={() => rate("maybe")}><span>↔</span><small>Maybe</small></button><button className="love" onClick={() => rate("love")}><span>↑</span><small>Love it</small></button></div>
      </article>
      <button className="quiet" onClick={() => setShowBuckets(true)}>Review my shortlist</button>
    </section>}

    {showBuckets && <div className="modal-wrap page-enter"><section className="shortlist"><button className="modal-close" onClick={() => setShowBuckets(false)}>×</button><p className="eyebrow">Your shortlist</p><h2>The names taking shape.</h2><p className="sub">Everything stays on this device unless you choose to save.</p>
      <div className="bucket-grid">{[["love","Loved","The clear favorites"],["maybe","Maybe","Worth another look"],["pass","Passed","Not quite right"]].map(([key,label,desc]) => <div className="bucket" key={key}><div><span>{label}</span><small>{desc}</small></div>{Object.entries(buckets).filter(([,v]) => v === key).length ? Object.entries(buckets).filter(([,v]) => v === key).map(([name]) => <button key={name}>{name}<span>•••</span></button>) : <p>No names here yet</p>}</div>)}</div>
      <div className="shortlist-actions"><button className="quiet" onClick={restart}>Start over</button><button className="primary small" onClick={() => {setShowBuckets(false); setCurrent(0); setStep("results")}}>Explore five more <span>→</span></button></div>
    </section></div>}

    <footer><div className="brand"><Mark /><span>namekind</span></div><p>Names chosen with meaning, not just momentum.</p><span>Baby names today. More ways to name, soon.</span></footer>
  </main>;
}
