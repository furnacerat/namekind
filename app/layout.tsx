import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const siteUrl = "https://www.hellonamekind.com";
const defaultAdsenseClient = "ca-pub-2430691199031112";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default:"Baby Names, Meanings & Personalized Name Ideas | Namekind", template:"%s | Namekind" },
  description: "Explore baby names, meanings, origins, popularity trends, sibling pairings, and personalized ideas shaped around your family's style, values, and story.",
  alternates: { canonical:"/" },
  openGraph: { type:"website", url:siteUrl, siteName:"Namekind", title:"Baby Names, Meanings & Personalized Name Ideas | Namekind", description:"Explore name meanings, origins, popularity, sibling pairings, and personalized ideas shaped around your family." },
  twitter: { card:"summary", title:"Baby Names, Meanings & Personalized Name Ideas | Namekind", description:"Explore name meanings, origins, popularity, sibling pairings, and personalized ideas shaped around your family." },
  robots: { index:true, follow:true, googleBot:{ index:true, follow:true, "max-image-preview":"large", "max-snippet":-1, "max-video-preview":-1 } },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || defaultAdsenseClient;
  const structuredData = [
    { "@context":"https://schema.org", "@type":"Organization", name:"Namekind", url:siteUrl, email:"hello@hellonamekind.com", founder:{"@type":"Person",name:"Harold Foster"} },
    { "@context":"https://schema.org", "@type":"WebSite", name:"Namekind", url:siteUrl, description:"Baby and pet name research with meanings, origins, popularity context, pairing ideas, and personalized discovery." },
  ];
  return (
    <html lang="en">
      <head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}} /></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
        <Script id="namekind-adsense" async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`} />
      </body>
    </html>
  );
}
