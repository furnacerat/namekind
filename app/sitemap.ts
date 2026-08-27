import type { MetadataRoute } from "next";
import { popularNames } from "./popular-names-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.hellonamekind.com";
  const updated = new Date("2026-08-26");
  const core: MetadataRoute.Sitemap = [
    { url:base, lastModified:updated, changeFrequency:"weekly", priority:1 },
    { url:`${base}/baby-names`, lastModified:updated, changeFrequency:"yearly", priority:.9 },
    { url:`${base}/guides/choosing-a-baby-name`, lastModified:updated, changeFrequency:"monthly", priority:.8 },
    { url:`${base}/about`, lastModified:updated, changeFrequency:"monthly", priority:.6 },
    { url:`${base}/contact`, lastModified:updated, changeFrequency:"yearly", priority:.4 },
    { url:`${base}/privacy`, lastModified:updated, changeFrequency:"yearly", priority:.3 },
    { url:`${base}/terms`, lastModified:updated, changeFrequency:"yearly", priority:.3 },
    { url:`${base}/cookies`, lastModified:updated, changeFrequency:"yearly", priority:.3 },
  ];
  return [...core, ...popularNames.map(({ slug }) => ({ url:`${base}/baby-names/${slug}`, lastModified:updated, changeFrequency:"yearly" as const, priority:.7 }))];
}
