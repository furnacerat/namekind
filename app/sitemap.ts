import type { MetadataRoute } from "next";
import { popularNames } from "./popular-names-data";
import { petNames } from "./pet-names-data";
import { nameCategories } from "./name-categories-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.hellonamekind.com";
  const updated = new Date("2026-09-08");
  const core: MetadataRoute.Sitemap = [
    { url:base, lastModified:updated, changeFrequency:"weekly", priority:1 },
    { url:`${base}/baby-names`, lastModified:updated, changeFrequency:"yearly", priority:.9 },
    { url:`${base}/pet-names`, lastModified:updated, changeFrequency:"monthly", priority:.9 },
    { url:`${base}/guides/choosing-a-baby-name`, lastModified:updated, changeFrequency:"monthly", priority:.8 },
    { url:`${base}/methodology`, lastModified:updated, changeFrequency:"monthly", priority:.6 },
    { url:`${base}/about`, lastModified:updated, changeFrequency:"monthly", priority:.6 },
    { url:`${base}/contact`, lastModified:updated, changeFrequency:"yearly", priority:.4 },
    { url:`${base}/privacy`, lastModified:updated, changeFrequency:"yearly", priority:.3 },
    { url:`${base}/terms`, lastModified:updated, changeFrequency:"yearly", priority:.3 },
    { url:`${base}/cookies`, lastModified:updated, changeFrequency:"yearly", priority:.3 },
  ];
  return [...core, ...nameCategories.map(item=>({url:`${base}/${item.audience === "baby" ? "baby-names" : "pet-names"}/categories/${item.slug}`,lastModified:updated,changeFrequency:"monthly" as const,priority:.8})), ...popularNames.map(({ slug }) => ({ url:`${base}/baby-names/${slug}`, lastModified:updated, changeFrequency:"yearly" as const, priority:.7 })), ...petNames.map(({slug}) => ({url:`${base}/pet-names/${slug}`,lastModified:updated,changeFrequency:"yearly" as const,priority:.7}))];
}
