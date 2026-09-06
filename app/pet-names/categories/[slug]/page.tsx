import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {InfoLayout} from "../../../info-layout";
import {categoryByKey,petCategories} from "../../../name-categories-data";
import {petNameBySlug} from "../../../pet-names-data";

type Props={params:Promise<{slug:string}>};const toSlug=(name:string)=>name.toLowerCase().replace(/[^a-z0-9]+/g,"-");
export function generateStaticParams(){return petCategories.map(({slug})=>({slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{const{slug}=await params;const item=categoryByKey.get(`pet:${slug}`);return item?{title:item.title,description:item.description,alternates:{canonical:`/pet-names/categories/${slug}`}}:{};}
export default async function PetCategoryPage({params}:Props){const{slug}=await params;const item=categoryByKey.get(`pet:${slug}`);if(!item)notFound();const faqData={"@context":"https://schema.org","@type":"FAQPage",mainEntity:item.faq.map(entry=>({"@type":"Question",name:entry.question,acceptedAnswer:{"@type":"Answer",text:entry.answer}}))};return <InfoLayout eyebrow={item.eyebrow} title={item.title} intro={item.intro}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqData)}}/><section><h2>{item.names.length} pet names to explore</h2><div className="category-name-grid">{item.names.map(name=>{const match=petNameBySlug.get(toSlug(name));return match?<Link href={`/pet-names/${match.slug}`} key={name}><strong>{name}</strong><span>{match.style} · {match.meaning}</span></Link>:<div key={name}><strong>{name}</strong><span>A playful established pet name</span></div>})}</div></section><section><h2>How to find the right fit</h2><ul>{item.guidance.map(tip=><li key={tip}>{tip}</li>)}</ul></section><section className="name-faq"><h2>Common questions</h2>{item.faq.map(entry=><details key={entry.question}><summary>{entry.question}</summary><p>{entry.answer}</p></details>)}</section><div className="profile-actions"><Link href="/pet-names">Browse the pet Top 100</Link><Link className="primary" href="/?mode=pet">Find personalized pet names <span>→</span></Link></div></InfoLayout>;}
