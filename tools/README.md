# tools

Scripts auxiliares de manutenção de dados e imagens, usados pontualmente durante
o desenvolvimento. Não fazem parte do build nem do CI, e não vão para o bundle.

Rode a partir da raiz do projeto, por exemplo `node tools/sort_ninjas.cjs`.

Aviso: `generate_sitemap.cjs` está desatualizado. O `sitemap.xml` e o
`sitemap_index.xml` em `public/` são mantidos à mão, com `lastmod` e prioridades.
Rodá-lo sobrescreve o sitemap. Não rode sem revisar.
