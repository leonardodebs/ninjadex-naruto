import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { NINJAS } from './data/ninjas';
import { slugify, SITE_URL } from './seo';

const sitemap = readFileSync('public/sitemap.xml', 'utf8');

const sitemapNinjaSlugs = [...sitemap.matchAll(/\/ninja\/([a-z0-9-]+)</g)].map((m) => m[1]);

describe('sitemap x personagens', () => {
  it('tem uma URL para cada personagem, sem faltar nem sobrar', () => {
    const dosDados = NINJAS.map((n) => slugify(n.name)).sort();
    const doSitemap = [...sitemapNinjaSlugs].sort();
    expect(doSitemap).toEqual(dosDados);
  });

  it('nao repete URL', () => {
    expect(new Set(sitemapNinjaSlugs).size).toBe(sitemapNinjaSlugs.length);
  });

  it('inclui a home e as paginas legais', () => {
    expect(sitemap).toContain(`<loc>${SITE_URL}/</loc>`);
    expect(sitemap).toContain(`<loc>${SITE_URL}/privacidade.html</loc>`);
    expect(sitemap).toContain(`<loc>${SITE_URL}/termos.html</loc>`);
  });

  it('o indice de sitemaps aponta para o sitemap e usa o mesmo lastmod', () => {
    const index = readFileSync('public/sitemap_index.xml', 'utf8');
    expect(index).toContain(`<loc>${SITE_URL}/sitemap.xml</loc>`);

    const lastmodSitemap = sitemap.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    const lastmodIndex = index.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    expect(lastmodIndex).toBe(lastmodSitemap);
  });

  it('o robots.txt referencia os dois sitemaps', () => {
    const robots = readFileSync('public/robots.txt', 'utf8');
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap_index.xml`);
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });

  it('usa sempre o dominio de producao', () => {
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(0);
    for (const loc of locs) expect(loc.startsWith(SITE_URL)).toBe(true);
  });
});
