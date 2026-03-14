# 🥷 Ninjadex - Livro Bingo Moderno

O **Ninjadex** é uma aplicação web moderna inspirada no universo de Naruto Shippuden, funcionando como um "Livro Bingo" digital. Ele permite explorar, filtrar e comparar os ninjas mais poderosos das diversas vilas ocultas.



## ✨ Funcionalidades

- **🔍 Busca e Filtragem Avançada:** Filtre ninjas por nome, vila, rank, raridade, elementos e dojutsu.
- **📊 Estatísticas Detalhadas:** Visualização de atributos (Ninjutsu, Taijutsu, Genjutsu, Força, Inteligência e Velocidade) através de gráficos de radar interativos.
- **⚔️ Modo de Comparação:** Selecione dois ninjas para comparar suas habilidades lado a lado.
- **🌓 Modo Escuro/Claro:** Suporte total a temas escuro e claro para uma melhor experiência de leitura.
- **📱 Design Responsivo:** Interface otimizada para dispositivos móveis e desktop.
- **🎭 Animações Fluídas:** Transições suaves e animações de interface utilizando Motion.

## 🚀 Tecnologias Utilizadas

- **React 19:** Biblioteca principal para construção da interface.
- **TypeScript:** Tipagem estática para maior segurança e produtividade.
- **Vite:** Build tool extremamente rápida para desenvolvimento moderno.
- **Tailwind CSS 4:** Estilização baseada em utilitários para um design consistente e rápido.
- **Lucide React:** Conjunto de ícones bonitos e consistentes.
- **Motion (Framer Motion):** Biblioteca poderosa para animações e gestos.
- **Recharts:** Biblioteca de gráficos para visualização das estatísticas dos ninjas.

## 📦 Estrutura do Projeto

```text
/
├── src/
│   ├── components/     # Componentes reutilizáveis (Cards, Modais, Filtros)
│   ├── App.tsx         # Componente principal e lógica da aplicação
│   ├── types.ts        # Definições de tipos TypeScript
│   ├── index.css       # Configurações globais do Tailwind e fontes
│   └── main.tsx        # Ponto de entrada da aplicação
├── public/             # Ativos estáticos
├── metadata.json       # Metadados da aplicação
└── package.json        # Dependências e scripts
```

## 🛠️ Scripts Utilitários

O projeto inclui alguns scripts auxiliares para gerenciamento de dados:

- `fetch_images.cjs`: Script para buscar e validar URLs de imagens dos ninjas.
- `sort_ninjas.cjs`: Script para organizar a lista de ninjas por critérios específicos.

## 🛠️ Como Executar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse no navegador:**
   O projeto estará disponível em `http://localhost:3000`.

## 📜 Licença

Este projeto é para fins educacionais e de entretenimento. Todos os direitos dos personagens e do universo de Naruto pertencem à Masashi Kishimoto e seus respectivos detentores de direitos.

---
Desenvolvido com ❤️ por [Seu Nome/GitHub]
