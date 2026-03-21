const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Leonardo\\OneDrive\\Imagens\\ninjadex';
const destDir = path.join(__dirname, 'public', 'assets', 'ninjas');
const dataPath = path.join(__dirname, 'src', 'data', 'ninjas.ts');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// 1. Copiar todos os arquivos
const files = fs.readdirSync(srcDir);
files.forEach(file => {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
});

console.log(`${files.length} imagens copiadas para ${destDir}`);

// 2. Mapear e atualizar o ninjas.ts
let content = fs.readFileSync(dataPath, 'utf8');

// Vou usar um mapeamento simples baseado em regex para atualizar o campo "image" do ninja
// Tentando casar o nome do ninja (normalizado) com o nome do arquivo

const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');

const fileMap = {};
files.forEach(f => {
    const nameWithoutExt = path.parse(f).name;
    fileMap[normalize(nameWithoutExt)] = f;
});

// Mapeamentos manuais para casos especiais
const manualMap = {
    '4raikage': 'A (4º Raikage).webp',
    '3raikage': 'A (3º Raikage).webp', // Se existir
    'hiruzensarutobi': 'Hiruzen.webp',
    'gaara': 'Gaara.webp', // Se não estiver na lista acima, vou checar dnv
    'asumasarutobi': 'Asuma_Sarutobi.webp',
    'minatonamikaze': 'Minato_Namikaze.webp', 
    'nejihyuga': 'Neji_Part_2.png',
    'rocklee': 'Rock_Lee_Part_I.webp',
    'sakuraharuno': 'Sakura.jpeg',
    'shikamarunara': 'Shikamaru.webp',
    'hinatahyuga': 'hinata.jpg',
    'inoyamanaka': 'ino.jpg',
    'chojiakimichi': 'Choji_Part_I.webp',
    'killerbee': 'Killer Bee.jpg',
    'meiterumi': 'Mei_Terumi.webp',
    'akatsuchi': 'Akatsuchi.webp',
    'kurotsuchi': 'Kurotsuchi_Part_II.webp',
    'darui': 'Darui_.webp',
    'kankuro': 'Kankuro_.webp',
    'temari': 'Temari_na_Parte_I.webp',
    'zabuza': 'Zabuza.webp',
    'haku': 'Haku.webp',
    'jiraiya': 'Jiraiya_perfil.PNG.webp',
    'deidara': 'deirada.jpeg',
    'sasori': 'everything-you-need-to-know-about-sasori-of-the-red-sand-v0-szkhfmq8zcx11.jpg',
    'mightguy': 'guy.webp',
    'omoi': 'Omoi_Part_II.webp',
    'rasa': 'Quarto_Kazekage_vivo.PNG.webp',
    'cshee': 'Shi.webp',
    'utakata': 'Utakataa.webp',
    'yagura': 'Yagura.webp',
    'yugitonii': 'Yugito_Nii-910x679.jpg'
};

// Combinar manualMap com fileMap
Object.assign(fileMap, manualMap);

// Encontrar onde começa o array NINJAS
const ninjasArrayStart = content.indexOf('export const NINJAS: Ninja[] = [');
let ninjasText = content.substring(ninjasArrayStart);

// Regex para encontrar blocos de ninjas
const ninjaRegex = /{\s*id:\s*(\d+),\s*name:\s*'([^']+)',[\s\S]*?image:\s*'([^']+)',/g;

let updatedNinjasText = ninjasText.replace(ninjaRegex, (match, id, name, oldImage) => {
    const normName = normalize(name);
    // Procurar melhor match
    let fileName = fileMap[normName];
    
    // Tentar variações se não achou (ex: Naruto Uzumaki -> naruto)
    if (!fileName) {
        const firstPart = normName.split(' ')[0];
        fileName = fileMap[firstPart];
    }

    if (fileName) {
        console.log(`Matching ${name} with ${fileName}`);
        return match.replace(`image: '${oldImage}'`, `image: '/assets/ninjas/${fileName}'`);
    } else {
        // Se não achou por nome, talvez o arquivo tenha o ID?
        // Mas o usuário disse que os nomes estão nos arquivos.
        return match;
    }
});

content = content.substring(0, ninjasArrayStart) + updatedNinjasText;
fs.writeFileSync(dataPath, content);
console.log('ninjas.ts atualizado com referências locais.');
