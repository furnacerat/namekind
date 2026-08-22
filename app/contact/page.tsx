import type { Metadata } from "next";
import { InfoLayout } from "../info-layout";

export const metadata: Metadata = { title:"Contact namekind", description:"Contact and operator information for namekind.", alternates:{ canonical:"/contact" } };

export default function ContactPage() { return <InfoLayout eyebrow="Get in touch" title="Contact namekind" intro="Questions, corrections, cultural context, privacy requests, and thoughtful feedback are welcome.">
  <section><h2>Site operator</h2><p><strong>Harold Foster</strong><br />Ohio, United States</p></section>
  <section><h2>Email</h2><p><a href="mailto:hello@hellonamekind.com">hello@hellonamekind.com</a></p><p>Use this address for general questions, name corrections, cultural context, advertising inquiries, or privacy requests.</p></section>
  <section><h2>Name corrections</h2><p>Name origins, meanings, and pronunciations can vary. When the contact channel opens, please include the name, the information you believe should change, and a reliable source or cultural context where possible.</p></section>
  <section><h2>Privacy requests</h2><p>The current no-account experience stores the naming journey locally on your device. You can remove it by choosing “Start over” or clearing site data in your browser. Other privacy requests may be sent to the email address above.</p></section>
</InfoLayout> }
