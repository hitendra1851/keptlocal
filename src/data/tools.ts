// Central tools registry. Add new tools here to surface them across the site.

export type ToolStatus = "live" | "soon";

export interface Tool {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  category: "PDF" | "Image" | "AI";
  icon: string; // SVG path snippet
  status: ToolStatus;
  keywords: string[]; // for internal search + schema
  faq: { q: string; a: string }[];
}

export const tools: Tool[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    shortName: "Merge PDF",
    description: "Combine multiple PDFs into one — entirely in your browser.",
    longDescription:
      "Drag your PDFs in, arrange the order, click merge. The combined file downloads instantly. Files never leave your device.",
    category: "PDF",
    icon: "M9 12h6m-6 4h6m-7-8h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    status: "live",
    keywords: ["merge pdf", "combine pdf", "join pdf", "pdf merger online", "merge pdf without upload"],
    faq: [
      {
        q: "Are my files uploaded anywhere?",
        a: "No. keptlocal runs entirely in your browser using WebAssembly. Your PDFs never touch a server — you can verify this in your browser's Network tab while merging.",
      },
      {
        q: "Is there a file size or page limit?",
        a: "There is no hard limit. The practical limit is your device's available RAM — most modern laptops handle hundreds of pages comfortably.",
      },
      {
        q: "Will the original quality be preserved?",
        a: "Yes. We use pdf-lib to combine the source documents byte-for-byte without re-rendering. Text remains selectable, images stay sharp, and bookmarks transfer where supported.",
      },
      {
        q: "Can I reorder pages before merging?",
        a: "You can reorder entire PDF files by dragging them in the list. Page-level reordering within a single PDF is available on our Reorder PDF Pages tool (coming soon).",
      },
      {
        q: "Does this work offline?",
        a: "Once the page is loaded, yes — the merge runs locally. You can verify by disabling your network connection after the page loads, then merging files.",
      },
    ],
  },
  // Future tools (status: soon) — visible on homepage to telegraph the roadmap
  { slug: "split-pdf", name: "Split PDF", shortName: "Split PDF", description: "Extract pages or split into separate documents.", longDescription: "", category: "PDF", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", status: "soon", keywords: [], faq: [] },
  { slug: "pdf-to-jpg", name: "PDF to JPG", shortName: "PDF → JPG", description: "Convert PDF pages to high-quality JPG images.", longDescription: "", category: "PDF", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", status: "soon", keywords: [], faq: [] },
  { slug: "jpg-to-pdf", name: "JPG to PDF", shortName: "JPG → PDF", description: "Combine images into a single PDF document.", longDescription: "", category: "PDF", icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12", status: "soon", keywords: [], faq: [] },
  { slug: "rotate-pdf", name: "Rotate PDF", shortName: "Rotate PDF", description: "Rotate pages 90°, 180°, or 270°.", longDescription: "", category: "PDF", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", status: "soon", keywords: [], faq: [] },
  { slug: "reorder-pdf", name: "Reorder PDF Pages", shortName: "Reorder Pages", description: "Drag pages into the order you need.", longDescription: "", category: "PDF", icon: "M4 6h16M4 10h16M4 14h16M4 18h16", status: "soon", keywords: [], faq: [] },
  { slug: "watermark-pdf", name: "Watermark PDF", shortName: "Watermark PDF", description: "Add a text or image watermark to PDF pages.", longDescription: "", category: "PDF", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", status: "soon", keywords: [], faq: [] },
  { slug: "pdf-page-count", name: "PDF Info Viewer", shortName: "PDF Info", description: "View page count, size, and metadata.", longDescription: "", category: "PDF", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", status: "soon", keywords: [], faq: [] },
  { slug: "compress-image", name: "Compress Image", shortName: "Compress Image", description: "Shrink JPG, PNG, and WebP files without quality loss.", longDescription: "", category: "Image", icon: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4", status: "soon", keywords: [], faq: [] },
  { slug: "resize-image", name: "Resize Image", shortName: "Resize Image", description: "Change image dimensions with aspect lock.", longDescription: "", category: "Image", icon: "M4 4h6v6H4V4zm10 10h6v6h-6v-6zM4 14h6v6H4v-6zm10-10h6v6h-6V4z", status: "soon", keywords: [], faq: [] },
  { slug: "convert-image", name: "Convert Image", shortName: "Convert Image", description: "Convert between HEIC, WebP, AVIF, JPG, PNG.", longDescription: "", category: "Image", icon: "M8 7l4-4m0 0l4 4m-4-4v18", status: "soon", keywords: [], faq: [] },
  { slug: "crop-image", name: "Crop Image", shortName: "Crop Image", description: "Free-form or fixed-ratio image crop.", longDescription: "", category: "Image", icon: "M7 16V4a1 1 0 011-1h12M17 8v12a1 1 0 01-1 1H4", status: "soon", keywords: [], faq: [] },
];

export const liveTools = tools.filter((t) => t.status === "live");
export const comingSoonTools = tools.filter((t) => t.status === "soon");
