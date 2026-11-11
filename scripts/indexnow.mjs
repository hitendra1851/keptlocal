// Notify IndexNow (Bing, Yandex, Seznam, Naver…) about changed pages after a deploy.
// Reads the built sitemap and submits URLs whose <lastmod> is recent.
//   node scripts/indexnow.mjs              URLs modified in the last 48 hours
//   INDEXNOW_ALL=1 node scripts/indexnow.mjs   every URL in the sitemap
import { readFileSync, readdirSync } from "node:fs";

const HOST = "keptlocal.com";
const keyFile = readdirSync("public").find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("IndexNow key file (public/<32 hex>.txt) not found");
const key = keyFile.slice(0, -4);

const xml = readdirSync("dist")
  .filter((f) => /^sitemap-\d+\.xml$/.test(f))
  .map((f) => readFileSync(`dist/${f}`, "utf8"))
  .join("");
const entries = [...xml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g)].map(([, loc, lastmod]) => ({ loc, lastmod }));
const since = Date.now() - 48 * 3600 * 1000;
const urlList = entries
  .filter((e) => process.env.INDEXNOW_ALL === "1" || !e.lastmod || Date.parse(e.lastmod) >= since)
  .map((e) => e.loc);

if (!urlList.length) {
  console.log("IndexNow: no recently changed URLs");
  process.exit(0);
}
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URL(s), HTTP ${res.status}`);
// 200/202 = accepted. Anything else is logged but never fails the deploy.
