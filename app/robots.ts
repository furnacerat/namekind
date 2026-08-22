import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules:{ userAgent:"*", allow:"/", disallow:["/api/"] }, sitemap:"https://hellonamekind.com/sitemap.xml", host:"https://hellonamekind.com" };
}
