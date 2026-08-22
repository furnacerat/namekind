export const dynamic = "force-dynamic";

const defaultPublisherId = "pub-2430691199031112";

export function GET() {
  const publisherId = process.env.GOOGLE_ADSENSE_PUBLISHER_ID || defaultPublisherId;
  return new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, { headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"public, max-age=3600"} });
}
