// Run `load` once, on the visitor's first interaction with the page (pointer, key, drag,
// focus or scroll), or after the page has been idle for a few seconds, whichever comes first.
// Tool components use it to start fetching their heavy libraries (pdf-lib, pdf.js, JSZip, ...)
// early enough to be ready by the time a file is dropped, without competing with first paint.
const EVENTS = ["pointerdown", "keydown", "dragenter", "focusin", "touchstart", "scroll"] as const;

export function onFirstInteraction(load: () => unknown, idleMs = 4000): void {
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    for (const e of EVENTS) window.removeEventListener(e, run, true);
    clearTimeout(timer);
    Promise.resolve(load()).catch(() => {
      /* a failed prefetch is retried by the tool's own await */
    });
  };
  for (const e of EVENTS) window.addEventListener(e, run, { capture: true, passive: true, once: true });
  const timer = setTimeout(run, idleMs);
}
