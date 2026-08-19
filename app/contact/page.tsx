import type { Metadata } from "next";
import { InfoLayout } from "../info-layout";

export const metadata: Metadata = { title:"Contact namekind", description:"Contact and operator information for namekind." };

export default function ContactPage() { return <InfoLayout eyebrow="Get in touch" title="Contact namekind" intro="Questions, corrections, cultural context, privacy requests, and thoughtful feedback are welcome.">
  <section><h2>Site operator</h2><p><strong>Harold Foster</strong><br />Ohio, United States</p></section>
  <section><h2>Email</h2><p>A dedicated domain email address will be published here before namekind’s public commercial launch. Until then, the site remains in a limited preview phase.</p></section>
  <section><h2>Name corrections</h2><p>Name origins, meanings, and pronunciations can vary. When the contact channel opens, please include the name, the information you believe should change, and a reliable source or cultural context where possible.</p></section>
  <section><h2>Privacy requests</h2><p>The current no-account experience stores the naming journey locally on your device. You can remove it by choosing “Start over” or clearing site data in your browser. A dedicated channel for other privacy requests will appear here before public launch.</p></section>
</InfoLayout> }
