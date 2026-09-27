import type { MetadataRoute } from "next";
import { nameCategories } from "./name-categories-data";
import { namingGuides } from "./guides/guide-data";
import { researchedBabyNameSlugs } from "./baby-names/researched-name-profiles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.hellonamekind.com";
  const updated = new Date("2026-09-26");
  const core: MetadataRoute.Sitemap = [
    { url:base, lastModified:updated, changeFrequency:"weekly", priority:1 },
    { url:`${base}/baby-names`, lastModified:updated, changeFrequency:"yearly", priority:.9 },
    { url:`${base}/pet-names`, lastModified:updated, changeFrequency:"monthly", priority:.9 },
    { url:`${base}/guides`, lastModified:updated, changeFrequency:"monthly", priority:.85 },
    { url:`${base}/methodology`, lastModified:updated, changeFrequency:"monthly", priority:.6 },
    { url:`${base}/about`, lastModified:updated, changeFrequency:"monthly", priority:.6 },
    { url:`${base}/authors/harold-foster`, lastModified:updated, changeFrequency:"monthly", priority:.55 },
    { url:`${base}/contact`, lastModified:updated, changeFrequency:"yearly", priority:.4 },
    { url:`${base}/privacy`, lastModified:updated, changeFrequency:"yearly", priority:.3 },
    { url:`${base}/terms`, lastModified:updated, changeFrequency:"yearly", priority:.3 },
    { url:`${base}/cookies`, lastModified:updated, changeFrequency:"yearly", priority:.3 },
  ];
  // Only profiles that completed the source-and-original-analysis review
  // return to search. The remaining directory profiles stay noindex.
  return [...core, ...namingGuides.map(({slug})=>({url:`${base}/guides/${slug}`,lastModified:updated,changeFrequency:"monthly" as const,priority:.8})), ...nameCategories.map(item=>({url:`${base}/${item.audience === "baby" ? "baby-names" : "pet-names"}/categories/${item.slug}`,lastModified:updated,changeFrequency:"monthly" as const,priority:.8})), ...researchedBabyNameSlugs.map((slug) => ({url:`${base}/baby-names/${slug}`,lastModified:updated,changeFrequency:"monthly" as const,priority:.82}))];
}
