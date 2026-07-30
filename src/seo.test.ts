import { describe, it, expect, beforeEach } from 'vitest';
import { slugify, jsonLd, setMeta, DEFAULT_TITLE } from './seo';
import { NINJAS } from './data/ninjas';

describe('slugify', () => {
  it('remove acentos e macrons', () => {
    expect(slugify('Hagoromo Ōtsutsuki')).toBe('hagoromo-otsutsuki');
    expect(slugify('Danzō Shimura')).toBe('danzo-shimura');
    expect(slugify('Fū')).toBe('fu');
  });

  it('normaliza espacos, parenteses e simbolos', () => {
    expect(slugify('Pain (Nagato)')).toBe('pain-nagato');
    expect(slugify('A (4º Raikage)')).toBe('a-4-raikage');
    expect(slugify('Sakon e Ukon')).toBe('sakon-e-ukon');
  });

  it('nao deixa hifen sobrando nas pontas', () => {
    expect(slugify('  Naruto!  ')).toBe('naruto');
  });
});

describe('slugs dos personagens', () => {
  it('todos os 81 personagens geram um slug nao vazio', () => {
    for (const n of NINJAS) {
      expect(slugify(n.name).length).toBeGreaterThan(0);
    }
  });

  it('os slugs sao unicos (rota /ninja/:slug sem colisao)', () => {
    const slugs = NINJAS.map((n) => slugify(n.name));
    const unicos = new Set(slugs);
    expect(unicos.size).toBe(slugs.length);
  });
});

describe('jsonLd', () => {
  it('escapa `<` para nao quebrar a tag <script>', () => {
    const out = jsonLd({ x: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('</script>');
    expect(out).toContain('\\u003c');
  });
});

describe('setMeta', () => {
  beforeEach(() => {
    document.head.innerHTML = `
      <title>old</title>
      <meta name="description" content="old" />
      <meta property="og:title" content="old" />
      <meta property="og:url" content="old" />
      <link rel="canonical" href="old" />
    `;
  });

  it('atualiza titulo, descricao e canonical', () => {
    setMeta(DEFAULT_TITLE, 'nova desc', 'https://ninjadex-naruto.vercel.app/ninja/naruto-uzumaki');
    expect(document.title).toBe(DEFAULT_TITLE);
    expect(
      document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ).toBe('nova desc');
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://ninjadex-naruto.vercel.app/ninja/naruto-uzumaki');
    expect(
      document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
    ).toBe('https://ninjadex-naruto.vercel.app/ninja/naruto-uzumaki');
  });
});
