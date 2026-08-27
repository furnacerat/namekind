import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: { default:"Namekind — Personalized Baby Name Ideas", template:"%s | Namekind" },
  description: "Discover meaningful baby names through a thoughtful questionnaire shaped around your style, story, sound, and preferences.",
  alternates: { canonical:"/" },
  openGraph: { type:"website", url:siteUrl, siteName:"Namekind", title:"Namekind — Personalized Baby Name Ideas", description:"A thoughtful, personalized way to discover meaningful baby names." },
  twitter: { card:"summary", title:"Namekind — Personalized Baby Name Ideas", description:"A thoughtful, personalized way to discover meaningful baby names." },
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
    { "@context":"https://schema.org", "@type":"WebSite", name:"Namekind", url:siteUrl, description:"Personalized baby name discovery shaped by meaning, sound, style, and story." },
  ];
  return (
    <html lang="en">
      <head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData)}} /></head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script id="namekind-adsense" async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`} />
      </body>
    </html>
  );
}
