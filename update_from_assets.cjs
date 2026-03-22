const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'ninjas.ts');
let content = fs.readFileSync(dataPath, 'utf8');

const mapping = {
    'Hiruzen Sarutobi': '/assets/ninjas/Hiruzen_Sarutobi_updated.png',
    'Tsunade Senju': '/assets/ninjas/Tsunade_Senju_updated.jpg',
    'Choji Akimichi': '/assets/ninjas/Choji_Akimichi_updated.jpg',
    'Madara Uchiha': '/assets/ninjas/Madara_Uchiha.webp',
    'Gaara': '/assets/ninjas/Gaara_updated.webp'
};

for (const name in mapping) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(name:\\s*'${escapedName}',[\\s\\S]*?image:\\s*')([^']+)(')`, 'g');
    
    if (content.match(regex)) {
        console.log(`Updating ${name} to local path: ${mapping[name]}`);
        content = content.replace(regex, `$1${mapping[name]}$3`);
    } else {
        console.log(`Failed to find ${name} in ninjas.ts`);
    }
}

fs.writeFileSync(dataPath, content);
console.log('ninjas.ts atualizado com as fotos da pasta padrão.');
