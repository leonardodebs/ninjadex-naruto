/**
 * Utilitarios de SEO: slug de personagem, meta tags dinamicas e canonical.
 * Extraidos do App para permitir testes de comportamento.
 */

export const SITE_URL = 'https://ninjadex-naruto.vercel.app';

export const DEFAULT_TITLE = 'NinjaDex | Guia Completo de Personagens de Naruto Shippuden';
export const DEFAULT_DESC =
  'Explore o NinjaDex, o guia completo de 81+ shinobis de Naruto Shippuden. Veja status, jutsus, dōjutsus e afiliações de personagens como Naruto, Sasuke, Pain, Madara e Akatsuki.';

/** Gera slug URL-safe a partir do nome, removendo acentos e caracteres especiais. */
export const slugify = (name: string): string =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Serializa para JSON-LD escapando `<` para nunca quebrar a tag <script>. */
export const jsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, '\\u003c');

export const setCanonical = (url: string): void => {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = url;
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
  document.querySelector('meta[name="twitter:url"]')?.setAttribute('content', url);
};

export const setMeta = (title: string, desc: string, canonicalUrl?: string): void => {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', desc);
  if (canonicalUrl) setCanonical(canonicalUrl);
};
