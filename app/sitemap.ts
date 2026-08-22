import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://hellonamekind.com";
  const updated = new Date("2026-08-21");
  return [
    { url:base, lastModified:updated, changeFrequency:"weekly", priority:1 },
    { url:`${base}/guides/choosing-a-baby-name`, lastModified:updated, changeFrequency:"monthly", priority:.8 },
    { url:`${base}/about`, lastModified:updated, changeFrequency:"monthly", priority:.6 },
    { url:`${base}/contact`, lastModified:updated, changeFrequency:"yearly", priority:.4 },
    { url:`${base}/privacy`, lastModified:updated, changeFrequency:"yearly", priority:.3 },
    { url:`${base}/terms`, lastModified:updated, changeFrequency:"yearly", priority:.3 },
    { url:`${base}/cookies`, lastModified:updated, changeFrequency:"yearly", priority:.3 },
  ];
}
