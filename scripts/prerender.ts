/**
 * Pre-renderizacao das paginas de personagem.
 *
 * Problema que resolve: a SPA serve o mesmo index.html para as 84 URLs. No HTML
 * cru (antes de qualquer JavaScript rodar) todas declaram o mesmo title, a mesma
 * description e canonical apontando para a home. O Googlebot le o HTML cru
 * primeiro e, para um site sem autoridade, muitas vezes nem chega a renderizar o
 * JS. Resultado: as paginas de personagem viram duplicatas da home e nao entram
 * no indice.
 *
 * O que este script faz: depois do `vite build`, gera um arquivo HTML real por
 * personagem em dist/ninja/<slug>/index.html, com title, description, canonical,
 * Open Graph, Twitter Card, JSON-LD e o conteudo textual do personagem ja
 * presentes no HTML. O bundle continua sendo carregado, entao o React assume a
 * pagina normalmente e a experiencia do usuario nao muda.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { NINJAS } from '../src/data/ninjas';
import { SITE_URL, slugify } from '../src/seo';
import type { Ninja } from '../src/types';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

/** Escapa texto para uso seguro dentro de atributos e conteudo HTML. */
const esc = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Serializa JSON-LD escapando `<` para nunca fechar a tag <script> antes da hora. */
const jsonLd = (data: unknown): string =>
  JSON.stringify(data, null, 2).replace(/</g, '\\u003c');

/** Troca o valor do atributo content de uma <meta> identificada por name/property. */
const setMetaContent = (
  html: string,
  attr: 'name' | 'property',
  key: string,
  value: string,
): string => {
  const re = new RegExp(`(<meta[^>]*${attr}="${key}"[^>]*content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`meta ${attr}="${key}" nao encontrada no template`);
  return html.replace(re, `$1${esc(value)}$2`);
};

const buildDescription = (n: Ninja): string => {
  const jutsus = n.jutsus.slice(0, 3).join(', ');
  return `${n.name}: ${n.description} Aldeia: ${n.village}. Rank: ${n.rank}. Jutsus: ${jutsus}.`;
};

/**
 * Conteudo estatico injetado dentro de #root. O React usa createRoot().render(),
 * que substitui o conteudo do container ao montar, entao isso serve como conteudo
 * indexavel no HTML cru e como primeira pintura para quem esta em conexao lenta.
 */
const buildBody = (n: Ninja, url: string): string => {
  // Alguns personagens nao tem elemento ou dojutsu cadastrado; omite a linha
  // inteira em vez de deixar um rotulo vazio no HTML.
  const elements = n.elements?.length
    ? `<p><strong>Elementos:</strong> ${n.elements.map((e) => esc(e)).join(' &middot; ')}</p>`
    : '';
  const dojutsus = n.dojutsus?.length
    ? `<p><strong>Dōjutsus:</strong> ${n.dojutsus.map((d) => esc(d)).join(' &middot; ')}</p>`
    : '';
  const jutsus = n.jutsus.map((j) => `<li>${esc(j)}</li>`).join('');
  const s = n.stats;

  return `
      <main style="max-width:760px;margin:0 auto;padding:40px 20px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.7;color:#1c1917">
        <nav><a href="/" style="color:#991b1b;text-decoration:none">← NinjaDex</a></nav>
        <h1 style="font-size:2rem;color:#991b1b;margin:16px 0 4px">${esc(n.name)}</h1>
        <p style="color:#78716c;margin:0 0 24px">
          ${esc(n.village)} &middot; Rank ${esc(n.rank)} &middot; Classificação ${esc(n.rarity)}
        </p>
        <p>${esc(n.description)}</p>
        ${elements}
        ${dojutsus}
        <h2 style="font-size:1.15rem;margin-top:28px">Principais jutsus</h2>
        <ul>${jutsus}</ul>
        <h2 style="font-size:1.15rem;margin-top:28px">Atributos de combate</h2>
        <ul>
          <li>Ninjutsu: ${s.ninjutsu}</li>
          <li>Taijutsu: ${s.taijutsu}</li>
          <li>Genjutsu: ${s.genjutsu}</li>
          <li>Força: ${s.strength}</li>
          <li>Inteligência: ${s.intelligence}</li>
          <li>Velocidade: ${s.speed}</li>
        </ul>
${buildRelatedLinks(n)}
      </main>`;
};

/**
 * Links internos rastreaveis entre personagens. Sem eles o Googlebot nao tem
 * como descobrir as paginas: o Search Console reportava "Nenhuma pagina de
 * referencia foi detectada" porque os cards da home sao <div onClick>, nao <a>.
 */
const buildRelatedLinks = (n: Ninja): string => {
  const link = (o: Ninja) =>
    `<li><a href="/ninja/${slugify(o.name)}" style="color:#991b1b">${esc(o.name)}</a></li>`;

  const mentor = n.mentorId ? NINJAS.find((o) => o.id === n.mentorId) : undefined;
  const disciples = NINJAS.filter((o) => o.mentorId === n.id);

  const relacionados = NINJAS.filter(
    (o) => o.id !== n.id && o.village === n.village && o.id !== mentor?.id,
  ).slice(0, 8);

  const blocos: string[] = [];
  if (mentor) blocos.push(`<h2 style="font-size:1.15rem;margin-top:28px">Mestre</h2><ul>${link(mentor)}</ul>`);
  if (disciples.length)
    blocos.push(
      `<h2 style="font-size:1.15rem;margin-top:28px">Discípulos</h2><ul>${disciples.map(link).join('')}</ul>`,
    );
  if (relacionados.length)
    blocos.push(
      `<h2 style="font-size:1.15rem;margin-top:28px">Outros shinobis de ${esc(n.village)}</h2><ul>${relacionados
        .map(link)
        .join('')}</ul>`,
    );

  return `        ${blocos.join('\n        ')}`;
};

const buildStructuredData = (n: Ninja, url: string): string => {
  const character = {
    '@context': 'https://schema.org',
    '@type': 'FictionalCharacter',
    name: n.name,
    description: n.description,
    url,
    image: encodeURI(`${SITE_URL}${n.image}`),
    inLanguage: 'pt-BR',
    memberOf: { '@type': 'Organization', name: n.village },
    knowsAbout: n.jutsus,
    isPartOf: {
      '@type': 'CreativeWork',
      name: 'Naruto Shippuden',
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'NinjaDex', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: n.name, item: url },
    ],
  };

  return `<script type="application/ld+json">
${jsonLd(character)}
    </script>

    <script type="application/ld+json">
${jsonLd(breadcrumb)}
    </script>`;
};

const renderPage = (template: string, n: Ninja): string => {
  const slug = slugify(n.name);
  const url = `${SITE_URL}/ninja/${slug}`;
  const title = `${n.name} | NinjaDex - Naruto Shippuden`;
  const description = buildDescription(n);
  // encodeURI porque varios arquivos de imagem tem espaco no nome.
  const image = encodeURI(`${SITE_URL}${n.image}`);

  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);

  html = html.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${esc(url)}$2`,
  );

  html = setMetaContent(html, 'name', 'description', description);
  html = setMetaContent(html, 'property', 'og:url', url);
  html = setMetaContent(html, 'property', 'og:title', title);
  html = setMetaContent(html, 'property', 'og:description', description);
  html = setMetaContent(html, 'property', 'og:image', image);
  html = setMetaContent(html, 'property', 'og:image:alt', `${n.name} - NinjaDex`);
  html = setMetaContent(html, 'name', 'twitter:url', url);
  html = setMetaContent(html, 'name', 'twitter:title', title);
  html = setMetaContent(html, 'name', 'twitter:description', description);
  html = setMetaContent(html, 'name', 'twitter:image', image);

  // og:type passa de website para article, mais adequado a uma pagina de conteudo.
  html = setMetaContent(html, 'property', 'og:type', 'article');

  // Troca o JSON-LD de colecao (lista dos 81) pelo do personagem + breadcrumb.
  // O lookahead impede que o casamento atravesse o </script> do bloco anterior
  // (o WebSite), que senao seria removido junto.
  const notClose = '(?:(?!<\\/script>)[\\s\\S])*?';
  const collectionBlock = new RegExp(
    `<script type="application\\/ld\\+json">${notClose}"@type": "CollectionPage"${notClose}<\\/script>`,
  );
  if (!collectionBlock.test(html)) {
    throw new Error('bloco JSON-LD de CollectionPage nao encontrado no template');
  }
  html = html.replace(collectionBlock, buildStructuredData(n, url));
  html = html.replace(
    '<!-- Structured Data: CollectionPage + ItemList (todos os 81 personagens) -->',
    '<!-- Structured Data: FictionalCharacter + BreadcrumbList -->',
  );

  if (!html.includes('<div id="root"></div>')) {
    throw new Error('container #root vazio nao encontrado no template');
  }
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${buildBody(n, url)}\n    </div>`,
  );

  return html;
};

/**
 * Indice rastreavel na home. Da ao Googlebot 81 links <a href> no HTML cru,
 * que e o unico caminho de descoberta enquanto o sitemap nao e relido.
 */
const buildHomeIndex = (): string => {
  const porAldeia = new Map<string, Ninja[]>();
  for (const n of NINJAS) {
    const lista = porAldeia.get(n.village) ?? [];
    lista.push(n);
    porAldeia.set(n.village, lista);
  }

  const secoes = [...porAldeia.entries()]
    .map(([aldeia, lista]) => {
      const itens = lista
        .map(
          (n) =>
            `<li><a href="/ninja/${slugify(n.name)}" style="color:#991b1b">${esc(n.name)}</a></li>`,
        )
        .join('');
      return `<h2 style="font-size:1.1rem;margin-top:24px">${esc(aldeia)}</h2><ul>${itens}</ul>`;
    })
    .join('\n        ');

  return `
      <main style="max-width:900px;margin:0 auto;padding:40px 20px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;line-height:1.7;color:#1c1917">
        <h1 style="font-size:2rem;color:#991b1b;margin:0 0 4px">NinjaDex</h1>
        <p style="color:#78716c">Guia completo de ${NINJAS.length} shinobis de Naruto Shippuden, com status, jutsus e dōjutsus.</p>
        ${secoes}
      </main>`;
};

const main = () => {
  const templatePath = join(DIST, 'index.html');
  const template = readFileSync(templatePath, 'utf8');

  const seen = new Set<string>();
  let count = 0;

  for (const ninja of NINJAS) {
    const slug = slugify(ninja.name);
    if (!slug) throw new Error(`slug vazio para "${ninja.name}"`);
    if (seen.has(slug)) throw new Error(`slug duplicado: ${slug}`);
    seen.add(slug);

    const outDir = join(DIST, 'ninja', slug);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), renderPage(template, ninja), 'utf8');
    count++;
  }

  // A home e reescrita por ultimo, ja que o template acima veio dela.
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('container #root vazio nao encontrado no template da home');
  }
  const home = template.replace(
    '<div id="root"></div>',
    `<div id="root">${buildHomeIndex()}\n    </div>`,
  );
  writeFileSync(templatePath, home, 'utf8');

  const linksNaHome = [...home.matchAll(/href="\/ninja\//g)].length;
  if (linksNaHome !== count) {
    throw new Error(`home tem ${linksNaHome} links, esperado ${count}`);
  }

  console.log(
    `prerender: ${count} paginas de personagem geradas, home com ${linksNaHome} links rastreaveis`,
  );
};

main();
