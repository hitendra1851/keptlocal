# CLAUDE.md — keptlocal project context

> This file is read automatically by Claude Code on every session.
> It contains everything an AI assistant needs to be productive on this project
> without asking the human (Hiten) to re-explain anything.

---

## 1. Project at a glance

**keptlocal** is a privacy-first, browser-only PDF and image tools website at
**[keptlocal.com](https://keptlocal.com)**. All file processing happens client-side in
WebAssembly — files never leave the user's browser. The site is monetized
exclusively through Google AdSense.

**Tagline:** "Your files. Kept local."

**Founder:** Hiten Mahalwar — Technical Lead at Vohra Wound Physicians, 15+ years in
Healthcare IT, deep .NET / Azure AI / data engineering background. Based in
Ahmedabad, India. Building this as a side project for fast AdSense revenue.

**Business model:** AdSense only. No paid tiers, no email gates, no signups, no
freemium. Revenue comes from ad impressions on tool and content pages. This is
a deliberate constraint — it forces us to compete on volume + UX, not conversion
funnels.

---

## 2. The big-picture vision

### What we are building toward (12–18 month horizon)

A **focused PDF + image toolkit** with 30–50 client-side tools, a content blog
of 60–100 SEO-optimized articles, and a small layer of AI-powered "smart" tools
(opt-in cloud processing via Azure AI Document Intelligence) layered on top.

**The bet:** privacy-first positioning + faster Core Web Vitals + cleaner UX
beat the incumbents (iLovePDF, Smallpdf, ILoveIMG) on long-tail queries
they don't optimize for. We can't beat them on "pdf merger" (head term). We can
beat them on "merge pdf without uploading", "ai pdf summarizer free",
"compress pdf to under 100kb", and the hundreds of similar long-tails.

### Why this niche

- Massive search volume (PDF-to-Word alone gets 2.5M+ searches/month)
- High AdSense CPC ($3–$12 per click for PDF/image keywords)
- Client-side architecture = $0 hosting on Cloudflare Pages
- Privacy angle is structurally uncopyable for incumbents (their business model requires server-side processing)
- AI-resistant (ChatGPT can't merge your PDFs)
- Hiten's Azure AI skills create a real moat for "smart" tools later

### Realistic revenue timeline

| Milestone | When | Notes |
|---|---|---|
| First AdSense $ | Month 3–4 | After 12 tools + 8 blog posts + AdSense approval (~Week 8) |
| $100/month | Month 6–9 | Requires ~50K monthly pageviews at typical RPM |
| $500/month | Month 12–15 | Add Ezoic at 10K sessions for 50–150% RPM lift |
| $1,000/month | Month 15–24 | Apply to Mediavine Journey (lowered to 1K sessions Jan 2026) |

### Non-goals (explicit constraints)

- **No paid plans.** Free forever for the user. Don't suggest adding a Pro tier.
- **No signup walls.** Don't gate anything behind email capture.
- **No JS-heavy frameworks.** Astro static-first is non-negotiable for Core Web Vitals.
- **No ads inside tool UI.** Ads only on the surrounding page. Documented harm to UX = bounce.
- **No tools that get AdSense-banned.** See § 8 for the explicit no-go list.

---

## 3. Tech stack (decisions are locked, don't litigate)

### Frontend
- **Astro 5+** — static site generator, file-based routing, zero JS by default
- **Tailwind CSS v4** — utility-first styling, config in `src/styles/global.css`
- **Alpine.js or vanilla TS** — for tool interactivity (NOT React. NOT Vue.)
- **Client-side libraries:** `pdf-lib` (PDF manipulation), `pdf.js` (PDF rendering),
  `browser-image-compression` + `mozjpeg-wasm` (image), Canvas API (image edit),
  `heic2any`, `qrcode.js`, `JSZip`
- **Fonts:** Fraunces (display serif) + DM Sans (body sans) via Google Fonts

### Backend (only when genuinely needed)
- **Python FastAPI** on **Azure Container Apps** with scale-to-zero
- Used only for tools that cannot run client-side: heavy PDF compression,
  PDF↔Word/Excel conversion, OCR, Azure AI Document Intelligence integrations
- **Do NOT add a backend prematurely.** Every tool gets a "can this run client-side?"
  evaluation. The answer is yes 80% of the time.

### Hosting & infra
- **Cloudflare Pages** — free, unlimited bandwidth, commercial use allowed
- **Cloudflare DNS, SSL, WAF, Email Routing** — all free tier
- **GitHub** for source control + auto-deploy on push to `main`
- Branch pushes get preview URLs automatically

### Analytics & monitoring
- **Google Search Console** — primary SEO data source
- **Google Analytics 4** — pageview/event tracking with IP anonymization
- **Cloudflare Web Analytics** — cookieless backup
- **UptimeRobot** — free uptime monitoring

### Monetization
- **Google AdSense** — apply at Week 8 with 20+ tool pages and 8+ blog posts
- **Ezoic** — at 10K sessions, expect 50–150% RPM lift
- **Raptive** — when traffic crosses 25K pageviews/mo with 50%+ Tier-1 (lowered Oct 2025)

### Choices we explicitly rejected and why
- ❌ **Next.js + Vercel** — Vercel Hobby tier prohibits commercial use including AdSense
- ❌ **Blazor WASM** — Googlebot sees empty loading shell, AdSense will reject as low-value
- ❌ **WordPress** — slow Core Web Vitals, plugin bloat
- ❌ **React for tool UIs** — overkill for 80–200 line tool components, hurts INP
- ❌ **Server-rendered everything** — would cost $$ from day one, slower TTFB than CDN edge

---

## 4. Project structure & conventions

```
keptlocal/
├── astro.config.mjs              # Site URL, sitemap integration
├── package.json
├── tsconfig.json
├── public/
│   ├── favicon.svg               # Lock-icon brand mark
│   ├── robots.txt                # Allow all + sitemap reference
│   └── (future: og images, logos)
└── src/
    ├── data/
    │   └── tools.ts              # CENTRAL TOOL REGISTRY — single source of truth
    ├── layouts/
    │   ├── BaseLayout.astro      # SEO meta, schema, font load, dark-mode FOUC fix
    │   └── ToolLayout.astro      # Tool page template w/ sidebar + FAQ + ad slots
    ├── components/
    │   ├── Header.astro          # Sticky nav, dark-mode toggle
    │   ├── Footer.astro          # Legal links, tool index
    │   ├── ToolCard.astro        # Homepage grid card (live or "soon")
    │   ├── PrivacyBadge.astro    # "Files never leave your browser" pill
    │   ├── FAQ.astro             # Accessible <details> accordion
    │   └── tools/
    │       ├── PdfMerge.astro    # Working tool component
    │       └── (each new tool gets its own file here)
    ├── pages/
    │   ├── index.astro           # Homepage
    │   ├── about.astro           # E-E-A-T: founder bio, mission
    │   ├── privacy.astro         # GDPR + AdSense-compliant policy
    │   ├── terms.astro
    │   ├── contact.astro
    │   ├── blog/                 # SEO blog posts (to be added)
    │   │   └── [slug].astro
    │   └── tools/
    │       ├── merge-pdf.astro   # Tool page (uses ToolLayout)
    │       └── (one .astro file per live tool)
    └── styles/
        └── global.css            # Design tokens + Tailwind v4 @theme config
```

### Naming conventions
- Tool slugs: kebab-case verb-noun (e.g., `merge-pdf`, `compress-image`, `pdf-to-jpg`)
- Component files: PascalCase (e.g., `PdfMerge.astro`)
- Page files: kebab-case matching the URL (e.g., `merge-pdf.astro`)
- All paths in code use absolute imports from `src/` (no `../../../`)

### Code style
- TypeScript strict mode (already configured)
- Prefer `<details>` over JS for accordions (a11y + zero JS)
- All client-side JS in `<script type="module">` inside the component
- Tool libraries loaded from `esm.sh` CDN with pinned versions (no bundling needed)
- No emojis in UI copy unless explicitly part of brand voice (which it isn't)
- Indent: 2 spaces, no tabs
- Single quotes in JS/TS; double quotes in HTML attributes

### Design system (locked)
- **Aesthetic:** "private library" — warm cream paper, deep forest green accent, editorial serif
- **Colors:** Defined as CSS custom properties in `global.css` under `@theme`. NEVER hardcode hex values in components. Always use `var(--color-*)`.
- **Typography:** Fraunces (display, serif) + DM Sans (body, sans). No other fonts.
- **Spacing rhythm:** Tailwind defaults. Generous whitespace. Lock icon is the ONLY recurring visual element.
- **Dark mode:** Class-based (`html.dark`), toggle persists in `localStorage`, pre-paint script prevents FOUC.
- **No purple gradients.** No glassmorphism. No "Inter font + black bg" SaaS-template look.

---

## 5. The tool registry pattern

`src/data/tools.ts` is the **single source of truth** for what tools exist.

To add a new tool, the workflow is:
1. Add an entry to the `tools` array with `status: "live"` (or `"soon"` for placeholder)
2. Create the interactive component at `src/components/tools/[ToolName].astro`
3. Create the page at `src/pages/tools/[slug].astro` using `ToolLayout`
4. The homepage grid, footer, and sitemap pick up the new tool automatically

**The page template every tool follows** (this is critical for SEO + AdSense):

1. Breadcrumb
2. Privacy badge + H1 (verb-noun, matches primary keyword exactly)
3. One-sentence value prop
4. The tool itself (above the fold, no big hero pushing it down)
5. **Ad slot: below tool output** (highest RPM position)
6. SEO content body — 800–1200 words structured as:
   - How to use (numbered steps)
   - When to use this (3–5 specific use cases)
   - How it works under the hood (technical depth = E-E-A-T)
   - Limits and what to expect
   - Privacy / comparison with alternatives
   - **FAQ with 5–10 Q&As** (auto-rendered as FAQPage schema)
7. Sidebar: secondary ad slot + "Verify it's local" trust block

If a tool page doesn't hit ~800 words of supporting content, AdSense will flag
it as "low-value." This is non-negotiable for monetized pages.

---

## 6. Roadmap — what to build, in order

### Phase 1: MVP (current) — ✅ partially shipped
- [x] Astro repo setup, Tailwind v4, design system
- [x] Homepage, About, Privacy, Terms, Contact
- [x] Merge PDF (working, client-side via pdf-lib)
- [x] Schema markup (Organization, WebApplication, FAQPage, BreadcrumbList)
- [x] Sitemap generation
- [x] Dark mode
- [x] Mobile responsive

### Phase 2: Reach 12 live tools (weeks 1–4 post-deploy)

Build these in order. All client-side. Each follows the ToolLayout template.

| # | Slug | Library | Est. effort |
|---|---|---|---|
| 1 | `merge-pdf` | pdf-lib | ✅ done |
| 2 | `split-pdf` | pdf-lib | 2–3h |
| 3 | `pdf-to-jpg` | pdf.js | 3–4h |
| 4 | `jpg-to-pdf` | pdf-lib | 2h |
| 5 | `rotate-pdf` | pdf-lib | 2h |
| 6 | `reorder-pdf` | pdf-lib | 3h (drag-drop UI) |
| 7 | `pdf-page-count` | pdf-lib | 1h |
| 8 | `watermark-pdf` | pdf-lib | 3h |
| 9 | `compress-image` | browser-image-compression | 2h |
| 10 | `resize-image` | Canvas API | 2h |
| 11 | `convert-image` | Canvas API + heic2any | 3h |
| 12 | `crop-image` | Canvas API | 3h |

**Target: 12 tools live by end of week 4.** That's the floor for AdSense application.

### Phase 3: SEO content + AdSense application (weeks 5–8)

- Write 8 blog posts at `/blog/[slug]` (1500–2500 words each):
  1. "How to merge PDFs without uploading them"
  2. "Why your PDF tools shouldn't be uploading your files"
  3. "Compressing PDFs: file size vs. quality explained"
  4. "PDF to JPG: when (and when not) to convert"
  5. "HEIC to JPG: the iPhone photo problem and how to fix it"
  6. "Image compression formats compared: JPG vs WebP vs AVIF in 2026"
  7. "How browser-based file tools actually work (WebAssembly explained)"
  8. "PDF privacy: what happens to files on free online tools"

- Add author bio with photo to About page (E-E-A-T requirement)
- **Apply for AdSense end of Week 8**

### Phase 4: Backend tools (weeks 9–16)

Stand up Python FastAPI on Azure Container Apps (scale-to-zero) for:
- True PDF compression (Ghostscript / pikepdf)
- PDF → Word (LibreOffice headless)
- PDF → Excel with table extraction (camelot/pdfplumber)
- Word → PDF
- OCR PDF (pytesseract or Azure AI Vision)
- PDF unlock (with user-provided password)
- Image background remover (rembg, GPU not required for v1)

Critical: these tools UPLOAD files to a server — that's a deviation from our
"never leaves browser" promise. Each backend-tool page must clearly disclose
this with an explicit toggle ("Use cloud processing for higher quality?")
and a privacy statement.

### Phase 5: AI moat tools (months 4–6)

Hiten's Azure AI Document Intelligence skill is the differentiator here.
Build tools that incumbents can't easily copy:
- AI PDF Summarizer
- PDF → Structured JSON (table/KV extraction)
- Invoice / receipt parser
- Resume parser
- Smart PDF redactor

These can be loss leaders for traffic — each visit might cost $0.001 in Azure
calls, but the SEO value of being the only privacy-first AI PDF site is large.

---

## 7. SEO playbook (read this before optimizing anything)

### Keyword strategy

We do NOT compete on head terms ("pdf merger", "compress pdf"). We compete on
**long-tail problem-shaped queries** because they convert and rank fastest.

Target patterns:
- "[tool] without uploading"
- "[tool] without download"
- "[tool] in browser"
- "[format A] to [format B]"
- "[tool] no watermark"
- "[tool] no signup"
- "bulk [tool]"
- "free [tool] no limit"
- "[tool] for [specific use case]" (e.g., "compress pdf for email attachment")

For each new tool page, identify 1 primary keyword (head) + 5–10 long-tail
variations and weave them naturally into the 800–1200 words of content.

### On-page checklist for every tool page

- [ ] H1 matches primary keyword exactly
- [ ] Title tag: `[Tool name] — Free & Private | keptlocal` (50–60 chars)
- [ ] Meta description: 140–160 chars, action-oriented, mentions "browser" or "private"
- [ ] Tool is visible above the fold on mobile (no big hero pushing it down)
- [ ] 800–1200 words of supporting content below the tool
- [ ] FAQ section with 5–10 Q&As
- [ ] Internal links to 3–5 related tools
- [ ] WebApplication schema (auto-generated by ToolLayout)
- [ ] FAQPage schema (auto-generated from tool data)
- [ ] BreadcrumbList schema (auto-generated)
- [ ] Image alt text on every image
- [ ] Loads in <2.5s LCP on slow 3G (test with PageSpeed Insights)

### Backlink strategy (in priority order)

1. **Show HN** (Tuesday/Wednesday 7–9am PT, technical title) — one good post = permanent DR-92 link
2. **r/InternetIsBeautiful**, **r/SomebodyMakeThis**, **r/webdev**, **r/sideproject** — participate before promoting
3. **Product Hunt** launch (Sunday for Tuesday)
4. **AlternativeTo.net** — list as alternative to iLovePDF/Smallpdf
5. **Directories:** ScrollLaunch, Fazier, SaaSHub, BetaList, Uneed, resource.fyi, Tinytools.directory, Prototypr
6. **Guest posts:** dev.to, Hashnode ("how I built this" angle)
7. **AVOID:** PBNs, Fiverr packages, paid link schemes — Dec 2025 spam updates kill these

### Core Web Vitals targets (must hit for monetization to work)

| Metric | Target | How |
|---|---|---|
| LCP | ≤ 2.5s | Static HTML on Cloudflare edge, preload critical fonts |
| INP | ≤ 200ms | No heavy JS on main thread; tool JS lazy-loads on first interaction |
| CLS | ≤ 0.1 | Ad slots reserve space with `min-height`; no layout shifts |

Run `npm run build && npm run preview` then test with [PageSpeed Insights](https://pagespeed.web.dev/).

---

## 8. AdSense rules — explicit no-go list

These will get the site **banned**. Don't propose building any of them:

- Password crackers / WiFi recovery tools
- YouTube / Spotify / streaming downloaders
- Paywall bypass tools
- Anonymizers / free VPN framed as bypass
- Software key generators / DRM circumvention
- Spyware / stalkerware (yes really, some sites flirt with this)
- IMEI lookup, doxxing tools
- Fake document generators (fake invoice, fake ID)
- Gaming cheats / DDoS tools

Ad placement rules:
- ❌ NEVER inside the tool UI itself
- ❌ NEVER above-the-fold ad that pushes the tool below the fold on mobile
- ❌ NEVER more than 3 ads on a single screen at once
- ✅ Below tool output (highest RPM)
- ✅ In-content (after ~300 words)
- ✅ Sidebar (sticky if possible)
- ✅ Mobile bottom anchor (high viewability)
- ✅ Reserve space for every ad slot to prevent CLS

---

## 9. Deployment workflow

### Local dev
```bash
npm install
npm run dev   # http://localhost:4321
```

### Production build
```bash
npm run build       # outputs to dist/
npm run preview     # test the built site locally
```

### Deploy
1. Push to `main` on GitHub
2. Cloudflare Pages auto-builds and deploys (~90s)
3. Custom domain `keptlocal.com` already configured (or pending DNS)
4. Branch pushes get preview URLs at `[branch].keptlocal.pages.dev`

### What requires a human (Hiten) — DO NOT attempt these as the AI
- Pushing to GitHub (no credentials in this env, by design)
- Buying domains, configuring DNS
- Cloudflare Pages dashboard actions
- AdSense application & ad code installation
- Anything involving payment, credentials, OAuth

When you produce code, your job is to:
1. Write the files
2. Verify with `npm run build` that the site still compiles
3. Tell Hiten exactly what to commit and push

---

## 10. Working agreements with the AI assistant

### Be opinionated, not deferential
This project succeeds or fails on a small number of correct decisions made fast.
If Hiten asks for something that contradicts the tech stack or monetization
strategy, push back with the actual trade-off — don't just comply. Examples:

- "Can we add a paywall for advanced features?" → Push back. Business model is locked to AdSense-only. Document the alternative if user insists.
- "Let's use React for this tool" → Push back. Astro + vanilla JS is the rule. React only if the tool genuinely needs it (rare).
- "Add a chatbot widget" → Push back. Hurts CLS and INP. Killer for AdSense RPM.

### Reading the conventions vs. reasoning from scratch
The decisions in §3, §4, §5, §7, §8 are LOCKED. Don't re-litigate them per task.
The decisions in §6 are PLANNED but flexible — propose reorderings if you have
data, but default to executing the listed order.

### When uncertain about scope
If a task is ambiguous, prefer ONE concrete interpretation and ship it, with a
note at the end like "I interpreted X as Y; let me know if you meant Z."
Don't stall asking 3 clarifying questions for things you could just decide.

### Tool component template
Use `src/components/tools/PdfMerge.astro` as the reference implementation for
new tools. It demonstrates:
- Drop zone + file input pattern
- File list with drag-to-reorder
- Status messaging
- Progress indication
- Error handling
- ESM import of pdf-lib from esm.sh
- Cleanup of object URLs (avoid memory leaks)
- `beforeunload` warning during processing

Match this pattern unless there's a clear reason to deviate.

### Content writing voice
- Calm, confident, slightly editorial — not "MARKETING ENERGY!"
- Explain things technically when relevant (E-E-A-T signal)
- Sentences vary in length. Some short. Others stretch out a bit when the concept calls for it.
- Use British/Indian English spellings? No — American English for SEO reach
- Never use exclamation points in product copy. Once per blog post max if at all.
- Avoid: "Welcome to", "We're excited to", "Game-changer", "Revolutionary"

---

## 11. Reference data: top competitors

Study these but don't copy:

| Site | Visits/mo | Strength | Weakness we can exploit |
|---|---|---|---|
| iLovePDF | 287M | Tool depth, mobile apps | Upload-required, India-heavy = low ad RPM, paid tier nagging |
| Smallpdf | ~150M | Brand recognition, design | Aggressive upsell, file limits on free tier |
| TinyPNG | ~30M | Single-purpose excellence | Only does PNG/JPG compress |
| PDF24 | ~25M | Comprehensive, free | Cluttered UI, weak mobile |
| Sejda | ~10M | Power features | Daily task limits on free tier |
| ILoveIMG | ~50M | Image focus | Same parent as iLovePDF, same limitations |
| Photopea | ~20M | Photoshop alternative | Niche to graphics editing |

Our wedge: be smaller, cleaner, faster, fully client-side, and absolutely
honest about what's happening with files. We win on long-tails they ignore.

---

## 12. Quick reference: useful commands

```bash
# Dev
npm run dev

# Build & preview
npm run build && npm run preview

# Type-check (Astro does this automatically on build)
npx astro check

# Add a new tool quickly (manual steps)
# 1. Edit src/data/tools.ts, add entry with status: "live"
# 2. Create src/components/tools/YourTool.astro
# 3. Create src/pages/tools/your-tool.astro
# 4. npm run build to verify

# Run Lighthouse locally
npx lighthouse http://localhost:4321 --view
```

---

## 13. Where to find more context

- `README.md` — quick-start, deploy instructions
- `src/data/tools.ts` — what tools exist and their metadata
- `src/components/tools/PdfMerge.astro` — reference implementation
- `src/layouts/ToolLayout.astro` — the SEO-optimized tool page template
- Conversations with Claude (anthropic.com/claude) about strategic decisions — Hiten will paste context as needed

---

## 14. Things to remember for every session

1. **Privacy-first is the brand.** Every decision filters through "does this break the no-upload promise?"
2. **AdSense is the only revenue.** Every UX decision considers ad RPM impact (placement, CLS, dwell time).
3. **Long-tails > head terms.** We're not trying to outrank iLovePDF for "pdf merger." We rank for 50 long-tails it ignores.
4. **Static-first.** Never add a backend unless the tool literally cannot run in the browser.
5. **800–1200 words of supporting content** on every monetized tool page. Non-negotiable.
6. **Hiten pushes the code.** AI writes; human deploys. No credentials in this environment.
7. **Build, don't deliberate.** When in doubt, ship something and iterate.

---

*Last updated: May 2026 — Phase 1 MVP shipped, deploying to Cloudflare Pages, AdSense application targeted for end of Week 8.*
