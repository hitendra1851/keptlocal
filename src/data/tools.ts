// Central tools registry. Add new tools here to surface them across the site.

export type ToolStatus = "live" | "soon";

export interface Tool {
  slug: string;
  name: string;
  shortName: string;
  pageTitle?: string; // Long-tail H1 + title tag override; name stays short for cards/breadcrumbs
  description: string;
  longDescription: string;
  category: "PDF" | "Image" | "Utility" | "AI";
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
    pageTitle: "Merge PDF Without Uploading",
    description: "Combine multiple PDFs into one — entirely in your browser.",
    longDescription:
      "Merge PDFs without uploading to any server — drag files in, arrange the order, and download the combined file instantly. No signup, no account, no watermark.",
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
  {
    slug: "split-pdf",
    name: "Split PDF",
    shortName: "Split PDF",
    pageTitle: "Split PDF — No Account, No Upload",
    description: "Extract pages or split into separate documents — entirely in your browser.",
    longDescription: "Split or extract PDF pages in your browser — no account, no upload, no watermark. Choose pages to extract or split every page into its own file. Downloads instantly.",
    category: "PDF",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    status: "live",
    keywords: ["split pdf", "extract pages from pdf", "split pdf without uploading", "pdf splitter online free", "extract pdf pages browser"],
    faq: [
      {
        q: "Are my files uploaded to a server?",
        a: "No. keptlocal runs entirely in your browser. Your PDF never leaves your device. Open DevTools → Network while splitting to confirm there are no upload requests.",
      },
      {
        q: "Can I extract non-consecutive pages?",
        a: "Yes. Enter a comma-separated list of pages and ranges — for example \"1, 3, 5-8\" extracts pages 1, 3, 5, 6, 7, and 8 into a single new PDF.",
      },
      {
        q: "What happens when I split all pages?",
        a: "Each page becomes its own PDF file. If the document has more than one page, the files are bundled into a ZIP archive that downloads automatically.",
      },
      {
        q: "Is there a page or file size limit?",
        a: "No hard limit. The practical ceiling is your device's available RAM — most modern laptops handle hundreds of pages without issue.",
      },
      {
        q: "Will the split pages keep their original quality?",
        a: "Yes. pdf-lib copies page content byte-for-byte without re-rendering, so text stays selectable, images stay sharp, and vector graphics are preserved.",
      },
      {
        q: "Can I split a password-protected PDF?",
        a: "Only if the PDF can be opened without a password (some PDFs restrict editing but allow viewing). If you need to unlock a protected PDF first, use your PDF reader to save an unlocked copy.",
      },
    ],
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    shortName: "PDF → JPG",
    pageTitle: "PDF to JPG in Your Browser",
    description: "Convert PDF pages to high-quality JPG images — entirely in your browser.",
    longDescription: "Convert PDF to JPG in your browser — no upload, no signup, no account needed. Choose a quality preset and every page renders locally. Single pages download as one file; multiple pages as a ZIP.",
    category: "PDF",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    status: "live",
    keywords: ["pdf to jpg", "convert pdf to image", "pdf to jpeg online free", "pdf to jpg without uploading", "export pdf pages as images"],
    faq: [
      {
        q: "Are my files uploaded to a server?",
        a: "No. Everything runs in your browser using pdf.js and the Canvas API. Your PDF bytes never leave your device — verify this in DevTools → Network while converting.",
      },
      {
        q: "What quality settings should I choose?",
        a: "Standard (1.5×) suits screen display and email attachments. High (2×) is good for presentations and web use. Best (3×) produces print-ready images around 216 DPI — use it when the output needs to be zoomed in or printed.",
      },
      {
        q: "Can I convert just one page instead of the whole PDF?",
        a: "Use our Split PDF tool to extract the page you want first, then run it through PDF to JPG. This keeps the tool focused and the download simple.",
      },
      {
        q: "How large will the output files be?",
        a: "A typical A4 page at Standard quality produces a JPG of roughly 200–500 KB. At Best quality expect 800 KB–2 MB per page, depending on content density.",
      },
      {
        q: "Will text in the PDF stay sharp?",
        a: "Yes. pdf.js renders text using the embedded font data at the scale you choose, so text is as sharp as the chosen resolution allows. Higher quality settings produce crisper text at smaller display sizes.",
      },
      {
        q: "Does this work on password-protected PDFs?",
        a: "Only PDFs that can be opened without a password. If the PDF requires a password to view its contents, the conversion will fail — unlock it in your PDF reader first.",
      },
    ],
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    shortName: "JPG → PDF",
    pageTitle: "JPG to PDF — No Watermark",
    description: "Combine images into a single PDF document — entirely in your browser.",
    longDescription: "Turn JPG, PNG, or WebP images into a PDF instantly — no watermark, no signup, no upload. Arrange image order, choose a page size, and download. Files never leave your device.",
    category: "PDF",
    icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12",
    status: "live",
    keywords: ["jpg to pdf", "multiple jpg to pdf", "convert multiple jpg to pdf", "images to pdf", "jpg to pdf free no sign up"],
    faq: [
      {
        q: "Are my images uploaded to a server?",
        a: "No. keptlocal converts images to PDF entirely in your browser using pdf-lib. Your files never leave your device — open DevTools → Network while converting to confirm there are no upload requests.",
      },
      {
        q: "Which image formats are supported?",
        a: "JPG, JPEG, PNG, and WebP. For WebP, the tool converts via the Canvas API before embedding, so the output quality matches the source. HEIC files (iPhone photos) need to be converted to JPG first.",
      },
      {
        q: "What page size should I choose?",
        a: "A4 and Letter centre and scale your image to fill a standard page with a small margin — good for documents you plan to print or share formally. Original sizes each page exactly to the image dimensions, ideal for photo archives or portfolios.",
      },
      {
        q: "Can I reorder images before converting?",
        a: "Yes — drag rows in the list to reorder them. The images appear in the PDF in the order shown.",
      },
      {
        q: "Is there a limit on number of images or file size?",
        a: "No hard limit. The practical ceiling is your device's RAM. Hundreds of images work fine on most modern laptops.",
      },
      {
        q: "Will image quality be preserved?",
        a: "Yes. pdf-lib embeds JPG and PNG bytes directly into the PDF without re-encoding. WebP images are converted to PNG losslessly before embedding.",
      },
    ],
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    shortName: "Rotate PDF",
    pageTitle: "Rotate PDF — No Upload",
    description: "Rotate all pages or specific pages 90°, 180°, or 270° — entirely in your browser.",
    longDescription: "Rotate PDF pages free in your browser — no upload, no account needed. Choose 90°, 180°, or 270°, optionally target specific pages, and download instantly.",
    category: "PDF",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    status: "live",
    keywords: ["rotate pdf", "rotate pdf pages", "rotate pdf without uploading", "fix upside down pdf", "rotate pdf online free"],
    faq: [
      {
        q: "Are my files uploaded to a server?",
        a: "No. Rotation runs entirely in your browser using pdf-lib. Your PDF never leaves your device — open DevTools → Network while rotating to confirm no upload requests.",
      },
      {
        q: "Can I rotate only specific pages?",
        a: "Yes. Leave 'Apply to' set to All pages to rotate everything, or enter a page range like '1, 3, 5-8' to target specific pages. The rest of the document is left unchanged.",
      },
      {
        q: "Does rotating change the page content or quality?",
        a: "No. pdf-lib sets the PDF rotation flag on each page — this tells PDF viewers how to display the page. The underlying content is untouched, so text stays selectable and images stay sharp.",
      },
      {
        q: "My PDF already has some rotated pages — will this make it worse?",
        a: "The rotation you choose is added to each page's existing rotation. So if a page is already rotated 90° and you apply 90° clockwise, the result is 180°. Use the preview in your PDF reader after downloading to check.",
      },
      {
        q: "Is there a page or file size limit?",
        a: "No hard limit. The practical ceiling is your device's available RAM.",
      },
      {
        q: "Will bookmarks and annotations be preserved?",
        a: "Yes. The tool only changes rotation metadata. All other document structure — bookmarks, annotations, form fields, embedded fonts — is preserved.",
      },
    ],
  },
  {
    slug: "reorder-pdf",
    name: "Reorder PDF Pages",
    shortName: "Reorder Pages",
    description: "Drag page thumbnails into the order you need — entirely in your browser.",
    longDescription: "Reorder PDF pages with drag and drop — free in your browser, nothing uploaded. See every page as a thumbnail, drag into the right order, and download the rearranged PDF instantly.",
    category: "PDF",
    icon: "M4 6h16M4 10h16M4 14h16M4 18h16",
    status: "live",
    keywords: ["reorder pdf pages", "rearrange pdf pages", "move pdf pages", "reorder pdf without uploading", "pdf page organizer free"],
    faq: [
      {
        q: "Are my files uploaded to a server?",
        a: "No. Page thumbnails are rendered by pdf.js in your browser, and the reordering is done by pdf-lib — also in your browser. Your PDF never leaves your device.",
      },
      {
        q: "Can I delete pages while reordering?",
        a: "Yes — click the × on any thumbnail to remove that page from the output. The remaining pages stay in their current order.",
      },
      {
        q: "Can I duplicate a page?",
        a: "Not with this tool — reordering only rearranges existing pages. To duplicate pages, use a dedicated PDF editor.",
      },
      {
        q: "How many pages can I reorder?",
        a: "There is no hard limit. Thumbnails for large documents take a few seconds to render — you will see them appear progressively as each page is processed.",
      },
      {
        q: "Will quality be preserved?",
        a: "Yes. pdf-lib copies page content byte-for-byte without re-rendering. Text stays selectable, images stay sharp.",
      },
      {
        q: "Does drag and drop work on mobile?",
        a: "Yes, on modern iOS (Safari 15+) and Android (Chrome) browsers. Touch-drag the thumbnail to move it.",
      },
    ],
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    shortName: "Watermark PDF",
    pageTitle: "Watermark PDF — Free, No Signup",
    description: "Stamp a diagonal text watermark across every PDF page — entirely in your browser.",
    longDescription: "Add a text watermark to a PDF — free, no registration, no account, nothing uploaded. Type the text, set opacity and size, and download the stamped PDF instantly.",
    category: "PDF",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    status: "live",
    keywords: ["watermark pdf", "add watermark to pdf", "stamp pdf online free", "watermark pdf without uploading", "confidential watermark pdf"],
    faq: [
      {
        q: "Are my files uploaded to a server?",
        a: "No. The watermark is drawn directly onto the PDF in your browser using pdf-lib. Your file never leaves your device — open DevTools → Network while watermarking to confirm no uploads.",
      },
      {
        q: "Can I remove the watermark later?",
        a: "The watermark is drawn as content on each page, not as a separate layer. It cannot be cleanly removed from the output PDF with standard tools. Keep the original unwatermarked file if you need to produce clean copies later.",
      },
      {
        q: "Can I watermark only specific pages?",
        a: "The tool currently applies the watermark to all pages. To watermark a subset, use Split PDF to extract those pages, watermark them, then use Merge PDF to recombine.",
      },
      {
        q: "What font is used?",
        a: "Helvetica — a PDF standard font that is embedded in every PDF viewer without needing to be bundled in the file, keeping the output file size small.",
      },
      {
        q: "Will the watermark cover the page content?",
        a: "The watermark is drawn at 15–35% opacity so underlying text and images remain readable through it. Adjust the opacity slider to suit your content.",
      },
      {
        q: "Is there a page or file size limit?",
        a: "No hard limit. The practical ceiling is your device's available RAM. Watermarking is fast — it only adds text drawing instructions to each page.",
      },
    ],
  },
  {
    slug: "pdf-page-count",
    name: "PDF Info Viewer",
    shortName: "PDF Info",
    description: "View page count, dimensions, metadata, and PDF version — entirely in your browser.",
    longDescription: "Find out how many pages a PDF has — instantly, no upload. Also shows file size, page dimensions, PDF version, and full metadata including title, author, and creation date.",
    category: "PDF",
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    status: "live",
    keywords: ["pdf info viewer", "pdf metadata viewer", "pdf page count", "check pdf details", "view pdf properties online free"],
    faq: [
      {
        q: "Are my files uploaded to a server?",
        a: "No. The PDF is read and parsed entirely in your browser using pdf-lib. Your file never leaves your device.",
      },
      {
        q: "What metadata can I see?",
        a: "Page count, file size, PDF version, page dimensions (width × height in mm and inches), title, author, subject, creator application, producer, creation date, and modification date.",
      },
      {
        q: "Why are some metadata fields blank?",
        a: "PDF metadata is optional. Many PDFs — especially those exported from tools like Word or printed to PDF — omit fields like Title or Author entirely. Blank fields mean the PDF has no value stored for that property.",
      },
      {
        q: "What does 'mixed page sizes' mean?",
        a: "Some PDFs contain pages of different dimensions — for example a portrait report with a landscape appendix. The tool reports each unique size found and how many pages use it.",
      },
      {
        q: "Can I edit the metadata?",
        a: "This tool is read-only. Editing PDF metadata requires a PDF editor.",
      },
      {
        q: "What is the PDF version number?",
        a: "The PDF specification has evolved through versions 1.0 to 1.7 and 2.0. The version stored in the file header indicates which features it may use. Most modern PDFs are version 1.4–1.7.",
      },
    ],
  },
  {
    slug: "compress-image",
    name: "Compress Image",
    shortName: "Compress Image",
    description: "Shrink JPG, PNG, and WebP images in your browser — no uploads, no limits.",
    longDescription: "Compress images for email, web, and social media — no upload, no account. Drop one or more JPG, PNG, or WebP files, choose a compression level, and download smaller files instantly.",
    category: "Image",
    icon: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4",
    status: "live",
    keywords: ["compress image", "reduce image file size", "compress jpg online free", "compress png without upload", "image compressor browser"],
    faq: [
      {
        q: "Are my images uploaded to a server?",
        a: "No. All compression runs in your browser using the browser-image-compression library. Your images never leave your device — open DevTools → Network while compressing to confirm there are no upload requests.",
      },
      {
        q: "Which image formats are supported?",
        a: "JPG, JPEG, PNG, and WebP. HEIC files (iPhone photos) need to be converted to JPG first — use our Convert Image tool.",
      },
      {
        q: "How much will the file size be reduced?",
        a: "It depends on the original image and the compression level chosen. JPG and WebP images often reduce by 50–80% with minimal visible quality loss. PNGs reduce less because the format is already lossless — compressing a PNG mainly reduces resolution for very large images.",
      },
      {
        q: "What is the difference between the compression levels?",
        a: "Light targets good visual quality at about 85% JPEG quality — suitable for photos you want to keep sharp. Balanced hits 75% quality, cutting file size significantly while remaining hard to distinguish from the original at typical viewing sizes. Aggressive targets 55% quality for the smallest possible files — noticeable on close inspection but fine for thumbnails, previews, and web-optimised images.",
      },
      {
        q: "Can I compress multiple images at once?",
        a: "Yes — drop or select multiple files in one go. Each image is compressed individually and shown with its before/after size. When more than one image is compressed, a Download ZIP button appears so you can grab them all in one click.",
      },
      {
        q: "Will the output be a different format?",
        a: "No. The tool preserves the original format — a JPG in, a JPG out; a PNG in, a PNG out. The only change is the file size.",
      },
      {
        q: "Is there a file size or image dimension limit?",
        a: "No hard limit. Very large images (50 MP+) may take a few seconds to process. The practical ceiling is your device's available RAM.",
      },
      {
        q: "Does this work on mobile?",
        a: "Yes — Chrome 90+, Safari 15+, and Firefox 90+ on both iOS and Android are supported.",
      },
    ],
  },
  {
    slug: "resize-image",
    name: "Resize Image",
    shortName: "Resize Image",
    pageTitle: "Resize Image Without Uploading",
    description: "Resize JPG, PNG, and WebP images by dimensions, percentage, or longest side — in your browser.",
    longDescription: "Resize images without uploading — set exact pixel dimensions, a percentage, or a longest-side limit. Free in your browser, no account needed. Aspect ratio lock keeps proportions correct.",
    category: "Image",
    icon: "M4 4h6v6H4V4zm10 10h6v6h-6v-6zM4 14h6v6H4v-6zm10-10h6v6h-6V4z",
    status: "live",
    keywords: ["resize image", "resize image online free", "change image dimensions", "resize jpg without upload", "scale image browser"],
    faq: [
      {
        q: "Are my images uploaded to a server?",
        a: "No. Resizing runs entirely in your browser using the Canvas API. Your image never leaves your device — open DevTools → Network while resizing to confirm there are no upload requests.",
      },
      {
        q: "What resize modes are available?",
        a: "Three modes: Dimensions lets you set an exact width and height in pixels, with an optional aspect ratio lock. Percentage scales the image by a percentage of its original size — 50% halves both dimensions. Longest side resizes the image so its longest edge matches a pixel value, keeping proportions intact — useful for thumbnail generation.",
      },
      {
        q: "How does the aspect ratio lock work?",
        a: "When the lock icon is active (locked), changing the width automatically updates the height to maintain the original proportions, and vice versa. Click the lock icon to unlock it and set width and height independently.",
      },
      {
        q: "Can I change the output format?",
        a: "Yes — choose JPG, PNG, or WebP, or keep the same format as the original. Converting a PNG to WebP typically reduces file size further. JPG does not support transparency; transparent PNGs resaved as JPG will get a white background.",
      },
      {
        q: "Will resizing up (enlarging) look good?",
        a: "Enlarging beyond the original dimensions degrades quality — browsers use bilinear interpolation which produces soft or pixelated results for significant upscaling. For upscaling, AI-powered tools (not currently on keptlocal) produce much better results.",
      },
      {
        q: "What formats are supported?",
        a: "JPG, PNG, and WebP. HEIC files need to be converted first — use the Convert Image tool.",
      },
    ],
  },
  {
    slug: "convert-image",
    name: "Convert Image",
    shortName: "Convert Image",
    pageTitle: "Convert Image — HEIC to JPG and More",
    description: "Convert HEIC, JPG, PNG, WebP, and AVIF images — including iPhone HEIC photos — entirely in your browser.",
    longDescription: "Convert HEIC to JPG (iPhone photos), PNG to WebP, and more — free in your browser, no upload needed. HEIC files from iPhone and iPad are fully supported. Drop files, pick a format, download instantly.",
    category: "Image",
    icon: "M8 7l4-4m0 0l4 4m-4-4v18",
    status: "live",
    keywords: ["convert image", "heic to jpg", "convert heic to jpeg online free", "png to webp browser", "image format converter no upload"],
    faq: [
      {
        q: "Are my images uploaded to a server?",
        a: "No. All conversion runs in your browser. HEIC decoding uses the heic2any library and format conversion uses the Canvas API — neither sends your files anywhere. Open DevTools → Network while converting to confirm zero upload requests.",
      },
      {
        q: "What formats can I convert from and to?",
        a: "Supported input formats: HEIC, HEIF (iPhone/iPad), JPG, PNG, WebP, and AVIF. Supported output formats: JPG, PNG, and WebP. AVIF output requires browser support for the AVIF encoder — available in Chrome 85+ and Firefox 93+.",
      },
      {
        q: "Why do I need to convert HEIC photos?",
        a: "iPhones and iPads capture photos in HEIC (High Efficiency Image Container) format by default from iOS 11 onwards. HEIC files are not universally supported — Windows, older Android devices, most websites, and many apps cannot open them. Converting to JPG makes photos universally compatible.",
      },
      {
        q: "Which output format should I choose?",
        a: "JPG is the universal choice — every device, app, and website supports it. PNG is best when you need a transparent background (logos, screenshots). WebP offers the best compression-to-quality ratio for web use and is supported in all modern browsers, but older software may not open it.",
      },
      {
        q: "Can I convert multiple HEIC photos at once?",
        a: "Yes — select or drop several files at once. Each is converted individually and shown in the list. When more than one conversion succeeds, a Download ZIP button appears so you can grab all the files in one click.",
      },
      {
        q: "Will the image quality change when converting?",
        a: "JPG output uses 92% quality by default, which is visually lossless for most content. Adjust the quality slider to trade between file size and visual fidelity. PNG output is lossless. WebP output uses 92% quality.",
      },
      {
        q: "Does converting HEIC to JPG preserve metadata (location, date)?",
        a: "EXIF metadata (camera settings, date) may not be fully preserved during HEIC decoding in the browser — this is a limitation of the heic2any library. If EXIF preservation is critical, use a desktop tool like EXIF-aware converters.",
      },
    ],
  },
  {
    slug: "crop-image",
    name: "Crop Image",
    shortName: "Crop Image",
    description: "Crop JPG, PNG, and WebP images with free-form or fixed-ratio selection — entirely in your browser.",
    longDescription: "Crop images free online — no watermark, no signup, no upload. Drag to select a crop region, choose an aspect ratio preset, and download the cropped result instantly.",
    category: "Image",
    icon: "M7 16V4a1 1 0 011-1h12M17 8v12a1 1 0 01-1 1H4",
    status: "live",
    keywords: ["crop image", "crop image online free", "crop photo browser", "crop jpg without upload", "image cropper no signup"],
    faq: [
      {
        q: "Are my images uploaded to a server?",
        a: "No. Cropping runs entirely in your browser using the Canvas API. Your image never leaves your device — open DevTools → Network while cropping to confirm there are no upload requests.",
      },
      {
        q: "How do I set the crop region?",
        a: "Click and drag on the image preview to draw a crop region. Drag the corner handles to resize the selection. The current selection dimensions and position are shown below the canvas.",
      },
      {
        q: "What aspect ratio presets are available?",
        a: "Free (unconstrained), 1:1 (square), 4:3 (standard photo/screen), 16:9 (widescreen), 3:2 (classic photo), and 2:3 (portrait). Selecting a preset constrains your drag to that ratio.",
      },
      {
        q: "Can I crop to an exact pixel size?",
        a: "The tool shows the crop dimensions in pixels as you drag. To hit exact pixel values, use the Free ratio and drag until the crop info reads the target dimensions. The output is always the exact pixel size shown.",
      },
      {
        q: "Can I change the output format?",
        a: "Yes — choose to keep the same format as the input, or convert to JPG, PNG, or WebP at the same time as cropping.",
      },
      {
        q: "Does cropping work on mobile?",
        a: "Yes. Touch-drag on the preview canvas to set the crop region. Corner handles can be moved with a precise touch.",
      },
    ],
  },
  {
    slug: "delete-pages-pdf",
    name: "Remove Pages from PDF",
    shortName: "Remove Pages",
    description: "Remove specific pages from a PDF — entirely in your browser.",
    longDescription: "Remove pages from a PDF without uploading — no signup, no account, no watermark. Enter the page numbers to remove and download the cleaned-up file instantly.",
    category: "PDF",
    icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    status: "live",
    keywords: ["remove pages from pdf", "delete pages from pdf", "remove pdf pages online free", "remove pages from pdf without uploading", "pdf page remover browser"],
    faq: [
      {
        q: "Are my files uploaded to a server?",
        a: "No. Page removal runs entirely in your browser using pdf-lib. Your PDF never leaves your device — open DevTools → Network while processing to confirm no upload requests.",
      },
      {
        q: "How do I specify which pages to remove?",
        a: "Enter a comma-separated list of page numbers and ranges — for example '1, 3, 5-8' removes pages 1, 3, 5, 6, 7, and 8. Pages are numbered from 1.",
      },
      {
        q: "Can I remove all pages?",
        a: "The tool requires at least one page to remain in the output. If you enter all page numbers, processing will stop with an error.",
      },
      {
        q: "Will the remaining pages keep their original quality?",
        a: "Yes. pdf-lib copies page content byte-for-byte without re-rendering. Text stays selectable, images stay sharp, and annotations are preserved.",
      },
      {
        q: "Is there a file size or page limit?",
        a: "No hard limit. The practical ceiling is your device's available RAM — most laptops handle hundreds of pages without issue.",
      },
      {
        q: "Can I undo after downloading?",
        a: "The tool only modifies a copy of the PDF in memory — your original file on disk is untouched. If you want the pages back, simply reload the original.",
      },
    ],
  },
  {
    slug: "add-page-numbers-pdf",
    name: "Add Page Numbers to PDF",
    shortName: "Add Page Numbers",
    description: "Stamp page numbers onto every PDF page — entirely in your browser.",
    longDescription: "Add page numbers to a PDF free in your browser — no signup, no account, no upload. Choose the position and starting number, download the numbered PDF instantly.",
    category: "PDF",
    icon: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14",
    status: "live",
    keywords: ["add page numbers to pdf", "number pdf pages online free", "pdf page numbering without upload", "stamp page numbers pdf browser", "pdf page number tool free"],
    faq: [
      {
        q: "Are my files uploaded to a server?",
        a: "No. Page numbering runs entirely in your browser using pdf-lib. Your PDF never leaves your device.",
      },
      {
        q: "Where are the page numbers placed?",
        a: "Choose from six positions: bottom center, bottom left, bottom right, top center, top left, or top right. Bottom center is the standard for most documents.",
      },
      {
        q: "Can I start numbering from a number other than 1?",
        a: "Yes — set the starting number to any positive integer. Useful when a document is a chapter or section within a larger work and pages should continue from a prior section's numbering.",
      },
      {
        q: "Will page numbers overlap my existing content?",
        a: "Page numbers are placed in the margin area at the top or bottom of the page. For standard A4 and Letter PDFs this avoids content. If your PDF has an unusual layout with content running to the very edge, the numbers may overlap — check the output before sharing.",
      },
      {
        q: "What font and size are used?",
        a: "Helvetica at 11pt — a standard PDF font that needs no embedding, keeping file size small. The size and style are fixed to keep the tool simple and the output clean.",
      },
      {
        q: "Is there a page or file size limit?",
        a: "No hard limit. Page numbering is fast — it only adds a small text drawing instruction to each page.",
      },
    ],
  },
  {
    slug: "pdf-to-text",
    name: "PDF to Text",
    shortName: "PDF to Text",
    description: "Extract all text from a PDF — entirely in your browser.",
    longDescription: "Extract text from a PDF without uploading — no signup, no account needed. Copy to clipboard or download as a .txt file. Runs entirely in your browser.",
    category: "PDF",
    icon: "M9 12h6m-6 4h6m-7-8h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    status: "live",
    keywords: ["pdf to text", "extract text from pdf", "pdf text extractor online free", "copy text from pdf browser", "pdf to txt without uploading"],
    faq: [
      {
        q: "Are my files uploaded to a server?",
        a: "No. Text extraction runs entirely in your browser using pdf.js. Your PDF never leaves your device — open DevTools → Network while processing to confirm zero upload requests.",
      },
      {
        q: "Why does the extracted text look scrambled or out of order?",
        a: "PDF does not store text in reading order — it stores it as positioned drawing instructions. pdf.js reconstructs reading order from position data, but complex multi-column layouts, tables, and rotated text can produce unexpected ordering. This is a limitation of the PDF format, not the tool.",
      },
      {
        q: "Can I extract text from a scanned PDF?",
        a: "Only if the PDF was OCR-processed and contains an embedded text layer. A scanned PDF that is just an image of a page contains no extractable text — the tool will return empty output for those pages.",
      },
      {
        q: "What encoding is the downloaded .txt file?",
        a: "UTF-8, which supports all languages and special characters present in the source PDF.",
      },
      {
        q: "Is there a page limit?",
        a: "No hard limit. Large PDFs take a few seconds as each page is processed in turn — you will see the progress update as pages are extracted.",
      },
      {
        q: "Can I extract text from a password-protected PDF?",
        a: "Only PDFs that can be opened without a password. If the PDF restricts content viewing, extraction will fail — unlock it in your PDF reader first.",
      },
    ],
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    shortName: "Compress PDF",
    description: "Reduce PDF file size by removing unused objects and metadata — entirely in your browser.",
    longDescription: "Compress a PDF without uploading — no signup, no account, no watermark. Strip metadata and unused objects to reduce file size. Runs entirely in your browser.",
    category: "PDF",
    icon: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4",
    status: "live",
    keywords: ["compress pdf", "reduce pdf file size", "compress pdf online free", "shrink pdf without uploading", "pdf compressor browser", "compress pdf for email"],
    faq: [
      {
        q: "Are my files uploaded to a server?",
        a: "No. All processing runs in your browser using pdf-lib. Your PDF never leaves your device.",
      },
      {
        q: "How much will the file size be reduced?",
        a: "It depends on the PDF. Documents with heavy metadata, form field data, or unused embedded resources can reduce significantly. PDFs that are already well-optimised may see minimal change. For image-heavy PDFs, the biggest size reductions require re-encoding images at lower quality — this tool does not re-encode images to preserve visual quality.",
      },
      {
        q: "What does 'remove metadata' do?",
        a: "Metadata includes the document title, author, creation date, software that created it, and custom properties. Stripping this removes those fields from the file — useful for privacy and for slightly reducing file size.",
      },
      {
        q: "Why is the size reduction smaller than I expected?",
        a: "Browser-based PDF compression removes metadata and unused document objects. For more aggressive compression — particularly re-encoding embedded images at lower quality — server-side tools using Ghostscript achieve much higher reductions. We plan to add a cloud-processing option for this in a future update.",
      },
      {
        q: "Will content or quality change?",
        a: "No visible content changes. Text, images, and formatting are preserved. Only invisible overhead (metadata, unused resources) is removed.",
      },
      {
        q: "Is there a file size limit?",
        a: "No hard limit. The practical ceiling is your device's available RAM.",
      },
    ],
  },
  {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    shortName: "Unlock PDF",
    description: "Remove password protection from a PDF — entirely in your browser.",
    longDescription: "Remove PDF password protection without uploading — no signup, no account needed. Enter the password once and download the unlocked file instantly.",
    category: "PDF",
    icon: "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z",
    status: "live",
    keywords: ["unlock pdf", "remove pdf password", "decrypt pdf online free", "pdf password remover browser", "unlock pdf without uploading"],
    faq: [
      { q: "Are my files uploaded to a server?", a: "No. The PDF is decrypted entirely in your browser using pdf-lib. Your file never leaves your device — open DevTools → Network while processing to confirm zero upload requests." },
      { q: "Do I need to know the password?", a: "Yes. This tool unlocks PDFs where you already know the password — it decrypts the file so you do not have to enter it every time you open it. It is not a password cracker." },
      { q: "What types of PDF protection does this handle?", a: "Standard PDF user passwords (required to open the document). Owner passwords (which restrict printing or editing) may also be removed on supported PDFs." },
      { q: "Why did it fail even though I entered the correct password?", a: "Some PDFs use AES-256 encryption with features not fully supported by pdf-lib. If the tool fails, try opening the PDF in Adobe Reader and using File → Save As to produce an unlocked copy." },
      { q: "Is there a file size limit?", a: "No hard limit. The practical ceiling is your device's available RAM." },
    ],
  },
  {
    slug: "pdf-to-png",
    name: "PDF to PNG",
    shortName: "PDF → PNG",
    description: "Convert PDF pages to high-quality PNG images — entirely in your browser.",
    longDescription: "Convert PDF pages to PNG images without uploading — no signup, no account, no watermark. Lossless quality, instant download. Multiple pages zip automatically.",
    category: "PDF",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    status: "live",
    keywords: ["pdf to png", "convert pdf to png online free", "pdf to png without uploading", "export pdf as png browser", "pdf page to image png"],
    faq: [
      { q: "Are my files uploaded to a server?", a: "No. Everything runs in your browser using pdf.js and the Canvas API. Your PDF never leaves your device." },
      { q: "What is the difference between PDF to PNG and PDF to JPG?", a: "PNG is lossless — every pixel is preserved exactly with no compression artefacts. This makes PNG better for PDFs containing text, diagrams, and screenshots. JPG uses lossy compression, producing smaller files at the cost of slight quality loss, which is acceptable for photographic content." },
      { q: "When should I use PNG instead of JPG?", a: "Use PNG when you need to preserve sharp text and crisp lines — presentations, technical diagrams, screenshots, and infographics. Use JPG when file size matters more than pixel-perfect quality — photo-heavy PDFs and web thumbnails." },
      { q: "How large will the output PNG files be?", a: "PNG files are larger than JPGs because they are lossless. A typical A4 page at Standard quality produces a PNG of roughly 500 KB–2 MB depending on content complexity." },
      { q: "Does this work on password-protected PDFs?", a: "Only PDFs openable without a password. Use the Unlock PDF tool first if needed." },
    ],
  },
  {
    slug: "rotate-image",
    name: "Rotate Image",
    shortName: "Rotate Image",
    description: "Rotate JPG, PNG, and WebP images by any angle — entirely in your browser.",
    longDescription: "Rotate images free in your browser — no upload, no signup, no account. Choose 90°/180°/270° or enter any custom angle and download instantly.",
    category: "Image",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    status: "live",
    keywords: ["rotate image", "rotate image online free", "rotate photo 90 degrees", "rotate jpg without upload", "image rotator browser"],
    faq: [
      { q: "Are my images uploaded to a server?", a: "No. Rotation uses the Canvas API entirely in your browser. Your image never leaves your device." },
      { q: "Can I rotate by a custom angle?", a: "Yes — enter any angle from 0 to 360 degrees. For custom angles, the canvas expands to fit the rotated image without clipping." },
      { q: "What happens to transparent areas after a custom-angle rotation?", a: "Areas outside the original image bounds become transparent on PNG output, and white on JPG output (JPG does not support transparency)." },
      { q: "Does rotating change image quality?", a: "90°/180°/270° rotations on PNG are lossless. Custom angles require resampling which introduces minor quality loss. JPG output always re-encodes at the chosen quality setting." },
      { q: "What formats are supported?", a: "JPG, PNG, and WebP input. Output can be saved in any of these formats." },
    ],
  },
  {
    slug: "flip-image",
    name: "Flip Image",
    shortName: "Flip Image",
    description: "Flip JPG, PNG, and WebP images horizontally or vertically — entirely in your browser.",
    longDescription: "Flip images horizontally or vertically free in your browser — no upload, no signup, no account needed. Mirror photos instantly.",
    category: "Image",
    icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 9H4m0 0l4 4m-4-4l4-4",
    status: "live",
    keywords: ["flip image", "mirror image online free", "flip image horizontally", "flip photo browser", "mirror photo without upload"],
    faq: [
      { q: "Are my images uploaded to a server?", a: "No. Flipping uses the Canvas API entirely in your browser. Your image never leaves your device." },
      { q: "What is the difference between horizontal and vertical flip?", a: "Horizontal flip (mirror) produces a left-right mirror image — as if reflected in a vertical mirror. Vertical flip produces an upside-down image — as if reflected in a horizontal mirror." },
      { q: "Can I flip both axes at once?", a: "Yes — apply horizontal flip, then vertical flip. Two flips in opposite axes is equivalent to a 180° rotation." },
      { q: "Does flipping change image quality?", a: "PNG flips are lossless. JPG output re-encodes at the chosen quality level." },
      { q: "What formats are supported?", a: "JPG, PNG, and WebP input and output." },
    ],
  },
  {
    slug: "grayscale-image",
    name: "Grayscale Image",
    shortName: "Grayscale Image",
    description: "Convert JPG, PNG, and WebP images to black and white — entirely in your browser.",
    longDescription: "Convert photos to black and white free in your browser — no upload, no signup, no account. Batch convert multiple images and download instantly.",
    category: "Image",
    icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707",
    status: "live",
    keywords: ["grayscale image", "convert image to black and white", "black and white photo online free", "grayscale photo browser", "remove color from image"],
    faq: [
      { q: "Are my images uploaded to a server?", a: "No. Grayscale conversion uses the Canvas API entirely in your browser. Your image never leaves your device." },
      { q: "What grayscale method is used?", a: "Luminosity weighting: each pixel's brightness is computed as 0.299R + 0.587G + 0.114B, matching human perception. Green contributes more to perceived brightness than red, and red more than blue." },
      { q: "Can I convert multiple images at once?", a: "Yes — drop or select several files. Each is converted individually and shown with a download button. A Download ZIP button appears when more than one image is processed." },
      { q: "Does the file format change?", a: "No — the output format matches the input. A JPG in produces a JPG out. You can also choose to convert to a different format at the same time." },
      { q: "What formats are supported?", a: "JPG, PNG, and WebP." },
    ],
  },
  {
    slug: "image-to-base64",
    name: "Image to Base64",
    shortName: "Image → Base64",
    description: "Convert images to Base64-encoded strings for use in HTML, CSS, and JSON — entirely in your browser.",
    longDescription: "Convert images to Base64 data URI without uploading — no signup, no account needed. Use the output directly in HTML, CSS, or JSON API payloads.",
    category: "Image",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    status: "live",
    keywords: ["image to base64", "convert image to base64 online", "base64 encode image browser", "image data uri generator", "jpg to base64 free"],
    faq: [
      { q: "Are my images uploaded to a server?", a: "No. Base64 encoding uses the FileReader API in your browser. Your image never leaves your device." },
      { q: "What is Base64 and why is it useful?", a: "Base64 is a way to represent binary data (like an image) as a string of ASCII characters. This lets you embed images directly in HTML, CSS, or JSON without a separate file reference — useful for email templates, inline styles, API payloads, and eliminating HTTP requests for small images." },
      { q: "How do I use the output in HTML?", a: "Use it as the src attribute: <img src=\"data:image/png;base64,iVBOR...\">. The data URI includes the MIME type prefix automatically." },
      { q: "How do I use it in CSS?", a: "Use it as a background-image value: background-image: url('data:image/png;base64,iVBOR...'). Works in all modern browsers." },
      { q: "Are there size limits?", a: "Large images produce very long strings. Browsers handle them fine, but very large Base64 strings (several MB) embedded directly in HTML can slow page loads — Base64 is best suited for small images like icons and logos." },
    ],
  },
  // --- PDF: Protect ---
  {
    slug: "protect-pdf",
    name: "Protect PDF",
    shortName: "Protect PDF",
    description: "Add a password to a PDF document — entirely in your browser.",
    longDescription: "Password-protect a PDF without uploading — no signup, no account, no watermark. Set a user password and download the encrypted file instantly.",
    category: "PDF",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    status: "live",
    keywords: ["protect pdf", "add password to pdf", "encrypt pdf online free", "password protect pdf browser", "secure pdf without uploading"],
    faq: [
      { q: "Are my files uploaded to a server?", a: "No. PDF encryption runs entirely in your browser using pdf-lib. Your document never leaves your device — open DevTools → Network while processing to confirm zero upload requests." },
      { q: "What does the user password do?", a: "The user password (also called the open password) is required to open the PDF in any viewer. Anyone who does not know the password will see a prompt and cannot access the content." },
      { q: "What encryption is used?", a: "AES-128-bit encryption, which is the standard used by most PDF tools and supported by all modern PDF viewers including Adobe Reader, Preview, Chrome, and Edge." },
      { q: "Can I remove the password later?", a: "Yes — use the Unlock PDF tool on keptlocal. Enter the password and download an unlocked copy." },
      { q: "Will the PDF work on all devices?", a: "Yes. Password-protected PDFs created with AES-128 open on any device with a PDF viewer — Windows, macOS, iOS, Android." },
      { q: "Is there a file size limit?", a: "No hard limit. The practical ceiling is your device's available RAM." },
    ],
  },
  // --- Image: Remove EXIF ---
  {
    slug: "remove-image-exif",
    name: "Remove Image Metadata",
    shortName: "Remove EXIF",
    description: "Strip GPS, camera, and date metadata from photos — entirely in your browser.",
    longDescription: "Remove EXIF metadata from photos without uploading — no signup, no account. Strip GPS location, camera model, date taken, and all hidden data. Files never leave your browser.",
    category: "Image",
    icon: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21",
    status: "live",
    keywords: ["remove exif data", "strip image metadata", "remove gps from photo", "clean image metadata online free", "exif remover browser no upload"],
    faq: [
      { q: "Are my images uploaded to a server?", a: "No. Metadata stripping runs entirely in your browser using the Canvas API. Your image never leaves your device." },
      { q: "What metadata is removed?", a: "All EXIF data: GPS coordinates, camera make and model, lens info, date and time taken, exposure settings, copyright strings, and any custom metadata fields embedded by your camera or phone." },
      { q: "Does stripping EXIF change the image quality?", a: "The tool re-encodes the image through the Canvas API at 95% quality for JPG — visually lossless for most photos. PNG output is lossless. If pixel-perfect fidelity is required, use a desktop EXIF editor that strips metadata without re-encoding." },
      { q: "Why would I want to remove EXIF data?", a: "Your phone's photos embed precise GPS coordinates by default. When you post a photo online or share it by email, that location data travels with the file — revealing where you live, work, or took the photo. Stripping it before sharing is a simple privacy step." },
      { q: "Can I process multiple photos at once?", a: "Yes — drop multiple files. Each is processed individually and shown with a download button. A ZIP option appears for batch downloads." },
      { q: "What formats are supported?", a: "JPG and PNG. HEIC files should be converted to JPG first using the Convert Image tool." },
    ],
  },
  // --- Utility tools ---
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    shortName: "QR Code",
    description: "Generate QR codes for URLs, text, or contact info — instantly in your browser.",
    longDescription: "Create QR codes free in your browser — no signup, no account, no upload. Enter any URL or text and download a PNG instantly. Nothing is sent to a server.",
    category: "Utility",
    icon: "M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h2v2h-2zm-4 0h2v2h-2zm2 4h2v2h-2zm-4 0h2v2h-2zm2 4h2v2h-2zm-4-2h2v2h-2zm4-8h2v2h-2z",
    status: "live",
    keywords: ["qr code generator", "create qr code free", "qr code maker online", "generate qr code browser", "qr code for url free"],
    faq: [
      { q: "Is anything sent to a server?", a: "No. QR codes are generated entirely in your browser using the qrcode.js library. No data leaves your device." },
      { q: "What can I encode in a QR code?", a: "Any text: URLs, plain text, email addresses (mailto:), phone numbers (tel:), Wi-Fi credentials, or vCard contact data. The most common use is a website URL." },
      { q: "What size should I choose?", a: "For screens: 200–300px. For print materials like business cards: use 400px+ and test that it scans reliably at the intended print size. A 1-inch QR code printed at 300 DPI works well down to 2cm." },
      { q: "What error correction level should I use?", a: "Medium (M) is the default and works for most uses. High (H) adds redundancy so the code scans even if up to 30% of it is covered or damaged — useful when printing on surfaces that may wear or if you plan to add a logo in the center." },
      { q: "Can I add a logo to the QR code?", a: "The tool generates a clean QR code PNG. Adding a logo requires an image editor — place the logo in the center and test that the code still scans (use High error correction level to allow for the covered area)." },
      { q: "Can I download as SVG instead of PNG?", a: "Currently the tool exports PNG only. SVG export is on the roadmap." },
    ],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortName: "Password Gen",
    description: "Generate strong, random passwords — instantly in your browser.",
    longDescription: "Generate secure random passwords free in your browser — no signup, no account, nothing stored. Choose length and character sets, copy instantly. All randomness uses your browser's cryptographic API.",
    category: "Utility",
    icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
    status: "live",
    keywords: ["password generator", "random password generator", "strong password generator free", "secure password maker browser", "generate password no signup"],
    faq: [
      { q: "Are my passwords stored or sent anywhere?", a: "No. Passwords are generated locally using the browser's Web Crypto API (window.crypto.getRandomValues). Nothing is sent to a server, logged, or stored." },
      { q: "What makes a password strong?", a: "Length is the biggest factor — a 16-character random password has more entropy than a shorter one regardless of complexity. Using all four character types (upper, lower, numbers, symbols) at 16+ characters produces passwords that are computationally infeasible to crack." },
      { q: "How is randomness generated?", a: "The tool uses window.crypto.getRandomValues — the browser's cryptographically secure random number generator, the same source used by banking and security software. It is not predictable like Math.random()." },
      { q: "Can I generate multiple passwords at once?", a: "Yes — click Generate multiple times or use the Bulk generate option to produce several options you can choose from." },
      { q: "Should I use a password manager?", a: "Yes. Generating a strong password is only the first step — storing it safely requires a password manager. Most modern browsers include one; dedicated options include Bitwarden (open source, free) and 1Password." },
    ],
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    shortName: "Word Counter",
    description: "Count words, characters, sentences, and estimate reading time — instantly in your browser.",
    longDescription: "Count words and characters free in your browser — no signup, no account, nothing uploaded. Paste text and get instant counts for words, characters, sentences, paragraphs, and reading time.",
    category: "Utility",
    icon: "M4 6h16M4 10h16M4 14h10",
    status: "live",
    keywords: ["word counter", "character counter", "count words online free", "word count tool", "character count checker no signup"],
    faq: [
      { q: "Is my text sent anywhere?", a: "No. All counting happens locally in your browser as you type. Your text never leaves your device." },
      { q: "How are words counted?", a: "Words are sequences of characters separated by spaces or line breaks. Hyphenated words (e.g. 'well-known') count as one word. Numbers count as words." },
      { q: "How is reading time calculated?", a: "Based on an average reading speed of 238 words per minute — the commonly cited research average for adult silent reading. Actual reading time varies by content complexity and individual reader." },
      { q: "Does it count characters with or without spaces?", a: "Both — the tool shows character counts with spaces and without spaces separately." },
      { q: "What is the character limit?", a: "There is no hard limit. Very large texts (book-length) may take a fraction of a second to process. The tool handles millions of characters without issue." },
      { q: "Can I use this for social media limits?", a: "Yes. Twitter/X allows 280 characters, LinkedIn posts up to 3,000, Instagram captions up to 2,200. The character counter tells you exactly where you stand." },
    ],
  },
];

export const liveTools = tools.filter((t) => t.status === "live");
export const comingSoonTools = tools.filter((t) => t.status === "soon");
