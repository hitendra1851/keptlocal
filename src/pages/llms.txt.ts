// /llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI agents.
// Generated from the tool and post registries so it never drifts out of date.
import type { APIRoute } from "astro";
import { tools } from "../data/tools";
import { posts } from "../data/posts";

const site = "https://keptlocal.com";

export const GET: APIRoute = () => {
  const live = tools.filter((t) => t.status === "live");
  const section = (category: string, heading: string) => {
    const items = live.filter((t) => t.category === category);
    if (items.length === 0) return "";
    return `## ${heading}\n\n${items
      .map((t) => `- [${t.name}](${site}/tools/${t.slug}/): ${t.description}`)
      .join("\n")}\n`;
  };

  const body = `# keptlocal

> Free PDF, image, and utility tools that run entirely in the browser. Files are processed on the user's device with JavaScript and WebAssembly and are never uploaded to a server. No signup, no watermark, no file limits beyond device memory.

How to verify the no-upload claim: open the browser's DevTools Network tab while running any tool; no upload requests are made. Tools keep working offline once a page has been loaded.

${section("PDF", "PDF tools")}
${section("Image", "Image tools")}
${section("Utility", "Utility tools")}
${section("AI", "AI tools")}
## Guides

${posts.map((p) => `- [${p.title}](${site}/blog/${p.slug}/): ${p.description}`).join("\n")}

## About

- [About keptlocal](${site}/about/): who builds it and why
- [Privacy policy](${site}/privacy/)
- [All tools](${site}/tools/)
`.replace(/\n{3,}/g, "\n\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
