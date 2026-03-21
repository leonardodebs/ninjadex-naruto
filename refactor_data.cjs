const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
const dataPath = path.join(__dirname, 'src', 'data', 'ninjas.ts');

if (!fs.existsSync(path.join(__dirname, 'src', 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'src', 'data'), { recursive: true });
}

const content = fs.readFileSync(appPath, 'utf8').split('\n');

// Extrair sub-partes
const elements = content.slice(16, 21).join('\n'); // Linhas 17-21 (0-indexed: 16-21)
const ninjas = content.slice(44, 1076).join('\n'); // Linhas 45-1076 (0-indexed: 44-1076)
const villages = content.slice(1077, 1088).join('\n'); // Linhas 1078-1088 (0-indexed: 1077-1088)

const newFileContent = `import { Ninja, Village, Element, Dojutsu } from '../types';

export ${elements}

export ${ninjas}

export ${villages}
`;

fs.writeFileSync(dataPath, newFileContent);
console.log('Data extracted to src/data/ninjas.ts');

// Agora criar uma versão do App.tsx sem os dados
// Vamos remover as linhas 11 a 1089 (tipos redundantes e dados)
const newAppContent = [
    ...content.slice(0, 10),
    "import { NINJAS, VILLAGES, ELEMENTS, DOJUTSUS, RARITIES } from './data/ninjas';",
    ...content.slice(1089)
].join('\n');

fs.writeFileSync(appPath, newAppContent);
console.log('App.tsx refactored');
