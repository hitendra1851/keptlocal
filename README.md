# keptlocal

**[keptlocal.com](https://keptlocal.com)** — 37 free PDF and image tools that run entirely in your browser. No uploads, no accounts, no signup. Files never leave your device.

[![Astro](https://img.shields.io/badge/Astro-5-orange)](https://astro.build)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Why this exists

Most free "online PDF tools" upload your file to a server, process it there, and send the result back. That's fine for a public flyer. It's a real risk for a contract, a medical record, or a tax return — you're trusting a company you've never audited with a document you can't take back once it's uploaded.

keptlocal does the same jobs — merge, split, compress, convert, watermark, sign, and more — entirely on your own device, using [pdf-lib](https://github.com/Hopding/pdf-lib) and [pdf.js](https://github.com/mozilla/pdf.js) running in your browser tab. No file data is ever sent anywhere. This isn't a marketing claim: open DevTools → Network tab, run any tool, and watch it stay empty.

The site also works **offline** once you've opened a tool page while online — a service worker caches it, so it keeps working with no connection at all.

## What's here

**PDF (20 tools):** Merge, Split, Reorder Pages, Rotate, Watermark, Add Page Numbers, Remove Pages, Crop, Sign, Fill Form, Flatten, Add Image, Protect (AES‑256), Unlock, Compress (recompresses embedded photos, not just metadata), PDF to JPG/PNG/Text, JPG to PDF, PDF Info Viewer

**Image (14 tools):** Compress, Resize, Crop, Rotate, Flip, Grayscale, Convert (HEIC/JPG/PNG/WebP/SVG in any direction), Remove EXIF metadata, Image to Base64

**Utility (3 tools):** QR Code Generator, Password Generator, Word Counter

Every tool is a standalone Astro page plus a vanilla-JS component — see [`src/data/tools.ts`](src/data/tools.ts) for the registry and [`src/components/tools/`](src/components/tools) for the implementations.

## Tech stack

- **[Astro 5](https://astro.build)** — static site generation, no client-side framework overhead
- **[pdf-lib](https://github.com/Hopding/pdf-lib)** — pure-JS PDF read/write ([@cantoo/pdf-lib](https://github.com/cantoo-scribe/pdf-lib) fork for the two tools that need real AES‑256 encryption, which upstream pdf-lib doesn't support)
- **[pdf.js](https://github.com/mozilla/pdf.js)** — Mozilla's PDF renderer, for PDF→image conversion and text extraction
- **Canvas API**, **[heic2any](https://github.com/alexcorvi/heic2any)**, **[browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)**, **[jszip](https://github.com/Stuk/jszip)**, **[qrcode](https://github.com/soldair/node-qrcode)**, **[exifr](https://github.com/MikeKovarik/exifr)** — image processing and utilities
- **Tailwind CSS v4**
- Every library above is bundled at build time from npm — nothing is fetched from a third-party CDN at runtime, so there's no external host to trust (or go down) while a tool is actually processing a file
- A hand-written service worker (`public/sw.js`) provides offline support with no third-party runtime dependency

Hosted on AWS Amplify + CloudFront + S3. Monetized via Google AdSense (no paid tier, no signup, no free-tier limits).

## Running locally

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # → dist/
npm run preview   # serve the production build locally
```

## Adding a new tool

1. Register it in [`src/data/tools.ts`](src/data/tools.ts) (`status: "live"` when ready).
2. Build the interactive component in `src/components/tools/YourTool.astro`. Keep the `<script>` tag *without* an explicit `type="module"` — Astro only bundles inline scripts it controls the `type` attribute for; an explicit `type="module"` opts a script out of bundling entirely and Astro emits it byte-for-byte, unresolved bare imports included.
3. Add the page at `src/pages/tools/your-tool.astro` using `ToolLayout`.
4. The homepage, sitemap, and footer pick it up automatically.

Each tool page carries ~800–1200 words of supporting content (how-to, use cases, technical explanation, limits, FAQ) alongside the tool itself.

## Contributing

Issues and pull requests are welcome — new tools, bug fixes, and correctness fixes especially. If you're fixing a tool that produces incorrect output (a bad PDF, wrong colors, a corrupted file), please include a way to reproduce it.

## License

[MIT](LICENSE)

## Author

Built by [Hitendra Patel](https://keptlocal.com/about/).
