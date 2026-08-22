import type { Metadata } from "next";
import { InfoLayout } from "../info-layout";

export const metadata: Metadata = { title:"Cookie Policy — namekind", description:"How namekind uses browser storage, cookies, and similar technologies.", alternates:{ canonical:"/cookies" } };

export default function CookiesPage() { return <InfoLayout eyebrow="Browser choices" title="Cookie Policy" intro="A plain-language guide to the browser storage and similar technologies namekind uses or plans to use.">
  <p className="updated">Last updated: August 21, 2026</p>
  <section><h2>What these technologies are</h2><p>Cookies are small files placed on a device. Local storage is a browser feature that stores information on a device without sending it automatically with every request. Pixels, web beacons, and similar technologies can help deliver content, remember choices, measure activity, and prevent fraud.</p></section>
  <section><h2>What namekind currently uses</h2><p>Namekind currently uses local storage to remember questionnaire answers, optional surname display, reactions, previously shown names, and your temporary shortlist on that device. This supports the no-account experience. Clearing browser data or choosing “Start over” can remove this information.</p><p>Our server also uses limited, privacy-preserving technical signals to enforce AI request limits. These controls do not require an advertising cookie.</p></section>
  <section><h2>Advertising technologies</h2><p>After Google AdSense is activated, Google and approved vendors may use cookies and similar technologies for ad delivery, fraud prevention, frequency capping, reporting, and—where allowed and consented—personalization. Even non-personalized ads may use limited storage for security, frequency, and aggregated reporting.</p></section>
  <section><h2>Your choices</h2><p>You can control or delete cookies and local storage through your browser. Blocking essential storage may affect shortlist continuity. Before advertising is activated, namekind will configure Google’s certified consent-management process for visitors in the EEA, United Kingdom, and Switzerland. Google advertising preferences can be managed through <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">Google Ads Settings</a>.</p></section>
  <section><h2>Updates</h2><p>We will update this policy when advertising, analytics, accounts, or additional storage technologies are introduced.</p></section>
</InfoLayout> }
