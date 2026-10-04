// Build-time Open Graph images: one 1200×630 PNG per tool and blog post, served at
// /og/tools/<slug>.png and /og/blog/<slug>.png. Rendered with satori (layout → SVG)
// and resvg (SVG → PNG); nothing here ships to the browser.
import type { APIRoute, GetStaticPaths } from "astro";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { tools } from "../../data/tools";
import { posts } from "../../data/posts";

const fontDir = (pkg: string) => join(process.cwd(), "node_modules", "@fontsource", pkg, "files");
const fonts = [
  { name: "Fraunces", weight: 500 as const, data: readFileSync(join(fontDir("fraunces"), "fraunces-latin-500-normal.woff")) },
  { name: "DM Sans", weight: 400 as const, data: readFileSync(join(fontDir("dm-sans"), "dm-sans-latin-400-normal.woff")) },
  { name: "DM Sans", weight: 500 as const, data: readFileSync(join(fontDir("dm-sans"), "dm-sans-latin-500-normal.woff")) },
];

// Design tokens from src/styles/global.css (light theme).
const paper = "#faf8f3";
const ink = "#1a1815";
const inkSoft = "#3a3631";
const rule = "#d9d4c5";
const accent = "#2d5016";

interface Card {
  eyebrow: string;
  title: string;
}

export const getStaticPaths: GetStaticPaths = () => [
  ...tools
    .filter((t) => t.status === "live")
    .map((t) => ({
      params: { slug: `tools/${t.slug}` },
      props: { eyebrow: `${t.category} tool`, title: t.pageTitle || t.name } satisfies Card,
    })),
  ...posts.map((p) => ({
    params: { slug: `blog/${p.slug}` },
    props: { eyebrow: `Guide · ${p.tags[0] ?? "keptlocal"}`, title: p.title } satisfies Card,
  })),
];

// Minimal element factory so satori can be used without React.
type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
  type,
  props: { style, children: children.length === 1 ? children[0] : children },
});

const lock = (): Node => ({
  type: "svg",
  props: {
    width: 44,
    height: 44,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    "stroke-width": 1.75,
    children: [
      { type: "rect", props: { x: 4, y: 10, width: 16, height: 11, rx: 1.5 } },
      { type: "path", props: { d: "M8 10V7a4 4 0 0 1 8 0v3" } },
      { type: "circle", props: { cx: 12, cy: 15.5, r: 1.25, fill: accent } },
    ],
  },
});

export const GET: APIRoute = async ({ props }) => {
  const { eyebrow, title } = props as Card;
  const titleSize = title.length > 70 ? 54 : title.length > 45 ? 62 : 72;

  const svg = await satori(
    h(
      "div",
      {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: paper,
        padding: "72px 96px",
        fontFamily: "DM Sans",
      },
      h(
        "div",
        { display: "flex", alignItems: "center", gap: 16 },
        lock(),
        h("div", { display: "flex", fontFamily: "Fraunces", fontSize: 40, color: ink }, "kept", h("span", { color: accent }, "local")),
      ),
      h(
        "div",
        { display: "flex", flexDirection: "column", gap: 20 },
        h("div", { fontSize: 26, fontWeight: 500, color: accent, textTransform: "uppercase", letterSpacing: 2 }, eyebrow),
        h("div", { fontFamily: "Fraunces", fontSize: titleSize, lineHeight: 1.1, color: ink, letterSpacing: -1 }, title),
      ),
      h(
        "div",
        { display: "flex", justifyContent: "space-between", borderTop: `2px solid ${rule}`, paddingTop: 24, fontSize: 26, color: inkSoft },
        h("span", { color: accent }, "keptlocal.com"),
        h("span", {}, "Runs in your browser. Nothing uploaded."),
      ),
    ),
    { width: 1200, height: 630, fonts },
  );

  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  return new Response(png, { headers: { "Content-Type": "image/png" } });
};
