// Copy the OCR engine (tesseract.js worker, WASM cores, English model) into public/ocr/<version>/
// so it is served from keptlocal.com itself: no third-party CDN, and cacheable for offline use.
// Runs automatically before `npm run dev` and `npm run build` (predev / prebuild).
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkgDir = (name) => dirname(require.resolve(`${name}/package.json`));
const version = JSON.parse(readFileSync(join(pkgDir("tesseract.js"), "package.json"), "utf8")).version;
const out = join("public", "ocr", version);

const files = [
  // The worker picks one of these LSTM builds at runtime depending on the browser's WASM features.
  [join(pkgDir("tesseract.js"), "dist", "worker.min.js"), "worker.min.js"],
  [join(pkgDir("tesseract.js-core"), "tesseract-core-lstm.wasm.js"), "core/tesseract-core-lstm.wasm.js"],
  [join(pkgDir("tesseract.js-core"), "tesseract-core-simd-lstm.wasm.js"), "core/tesseract-core-simd-lstm.wasm.js"],
  [join(pkgDir("tesseract.js-core"), "tesseract-core-relaxedsimd-lstm.wasm.js"), "core/tesseract-core-relaxedsimd-lstm.wasm.js"],
  // Compact integer model (~3 MB) rather than the 11 MB float one; accuracy is close for printed text.
  [join(pkgDir("@tesseract.js-data/eng"), "4.0.0_best_int", "eng.traineddata.gz"), "lang/eng.traineddata.gz"],
];

for (const [src, rel] of files) {
  const dest = join(out, rel);
  mkdirSync(dirname(dest), { recursive: true });
  if (!existsSync(dest)) copyFileSync(src, dest);
}
console.log(`OCR assets ready in ${out}`);
