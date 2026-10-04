// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

// <lastmod> for each sitemap URL = last commit date of the page's source file.
// Needs full git history in CI (deploy.yml checks out with fetch-depth: 0).
function lastCommitDate(url) {
  const path = new URL(url).pathname.replace(/^\/|\/$/g, '');
  const candidates = path === ''
    ? ['src/pages/index.astro']
    : [`src/pages/${path}.astro`, `src/pages/${path}/index.astro`];
  const file = candidates.find((f) => existsSync(f));
  if (!file) return undefined;
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], { encoding: 'utf8' }).trim();
    return date || undefined;
  } catch {
    return undefined;
  }
}

// https://astro.build/config
export default defineConfig({
  site: 'https://keptlocal.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/kl-stats') && !page.includes('/agent') && !page.includes('/offline'),
      serialize(item) {
        const lastmod = lastCommitDate(item.url);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
});
