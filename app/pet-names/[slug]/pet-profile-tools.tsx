"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";

type Viewed = {name:string;slug:string};
const SAVED="namekind-saved-pet-names";
const VIEWED="namekind-recent-pet-names";
function read(key:string):Viewed[]{ try { const value=JSON.parse(localStorage.getItem(key)||"[]"); return Array.isArray(value)?value.filter(item=>item?.name&&item?.slug).slice(0,12):[]; } catch{return [];} }

export function PetProfileTools({name,slug}:{name:string;slug:string}) {
  const [saved,setSaved]=useState(false); const [call,setCall]=useState("Come here"); const [recent,setRecent]=useState<Viewed[]>([]);
  useEffect(() => { const timer=window.setTimeout(()=>{ const savedNames=read(SAVED); setSaved(savedNames.some(item=>item.slug===slug)); const viewed=read(VIEWED).filter(item=>item.slug!==slug); localStorage.setItem(VIEWED,JSON.stringify([{name,slug},...viewed].slice(0,6))); setRecent(viewed.slice(0,5)); track("pet_name_profile_viewed",{name}); },0); return()=>window.clearTimeout(timer); },[name,slug]);
  const toggle=()=>{ const current=read(SAVED); const next=saved?current.filter(item=>item.slug!==slug):[{name,slug},...current.filter(item=>item.slug!==slug)].slice(0,20); localStorage.setItem(SAVED,JSON.stringify(next)); setSaved(!saved); track(saved?"pet_name_unsaved":"pet_name_saved",{name}); };
  return <><div className="profile-toolbox"><div className="toolbox-heading"><div><p className="eyebrow">Try it in real life</p><h2>How does {name} sound out loud?</h2></div><button className={`save-name ${saved?"saved":""}`} onClick={toggle}><span>{saved?"✓":"♡"}</span> {saved?"Saved":"Save this name"}</button></div><label className="surname-tester"><span>Choose a phrase</span><small>Try the everyday words you will actually say.</small><select value={call} onChange={event=>setCall(event.target.value)}><option>Come here</option><option>Dinner time</option><option>Good morning</option><option>Let’s go</option><option>Good job</option></select></label><div className="full-name-preview">“{call}, {name}!”</div><Link className="primary small find-similar" href={`/?mode=pet&inspired=${encodeURIComponent(name)}`}>Find pet names like {name} <span>→</span></Link></div>{recent.length>0&&<section className="recent-names"><h2>Pet names you recently viewed</h2><div className="name-chips">{recent.map(item=><Link key={item.slug} href={`/pet-names/${item.slug}`}>{item.name}</Link>)}</div></section>}</>;
}
