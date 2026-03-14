const fs = require('fs');

const code = fs.readFileSync('src/App.tsx', 'utf-8');

// We need to extract the NINJAS array.
const startIdx = code.indexOf('const NINJAS: Ninja[] = [');
const endIdx = code.indexOf('];', startIdx) + 2;

const ninjasStr = code.substring(startIdx, endIdx);

// We can use a regex to match each ninja object.
// But it's easier to just evaluate it.
// Since it's TypeScript, we might need to remove type annotations or just use a regex.
// Let's use a regex to extract each object block.
const blocks = [];
let currentBlock = '';
let braceCount = 0;
let inString = false;
let escape = false;
let inArray = false;

for (let i = startIdx + 'const NINJAS: Ninja[] = ['.length; i < endIdx - 2; i++) {
    const char = code[i];
    
    if (escape) {
        escape = false;
        currentBlock += char;
        continue;
    }
    
    if (char === '\\') {
        escape = true;
        currentBlock += char;
        continue;
    }
    
    if (char === "'" || char === '"') {
        if (!inString) {
            inString = char;
        } else if (inString === char) {
            inString = false;
        }
    }
    
    if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
    }
    
    currentBlock += char;
    
    if (braceCount === 0 && currentBlock.trim().endsWith('}')) {
        blocks.push(currentBlock.trim());
        currentBlock = '';
        // skip comma
        while (code[i+1] === ',' || code[i+1] === ' ' || code[i+1] === '\n' || code[i+1] === '\r') {
            i++;
        }
    }
}

// Now we have an array of string blocks, each representing a ninja.
// Let's extract the name of each ninja to sort them.
const ninjas = blocks.map(block => {
    const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
    return {
        name: nameMatch ? nameMatch[1] : '',
        block: block
    };
});

// Define the desired order for Konoha
const konohaOrder = [
    // Hokages
    'Hashirama Senju', 'Tobirama Senju', 'Hiruzen Sarutobi', 'Minato Namikaze', 'Tsunade Senju',
    // Time 7
    'Kakashi Hatake', 'Yamato', 'Naruto Uzumaki', 'Sasuke Uchiha', 'Sakura Haruno', 'Sai',
    // Time 8
    'Kurenai Yuhi', 'Hinata Hyuga', 'Kiba Inuzuka', 'Shino Aburame',
    // Time 9 (Guy)
    'Might Guy', 'Neji Hyuga', 'Rock Lee', 'Tenten',
    // Time 10 (Ino-Shika-Cho)
    'Asuma Sarutobi', 'Shikamaru Nara', 'Ino Yamanaka', 'Choji Akimichi',
    // Sannin
    'Jiraiya',
    // Uchiha Clan (Konoha)
    'Madara Uchiha', 'Izuna Uchiha', 'Fugaku Uchiha', 'Shisui Uchiha',
    // Outros Konoha
    'Iruka Umino', 'Danzō Shimura'
];

const konohaNinjas = [];
const otherNinjas = [];

ninjas.forEach(n => {
    if (konohaOrder.includes(n.name)) {
        konohaNinjas.push(n);
    } else {
        otherNinjas.push(n);
    }
});

// Sort konohaNinjas based on konohaOrder
konohaNinjas.sort((a, b) => konohaOrder.indexOf(a.name) - konohaOrder.indexOf(b.name));

const sortedNinjas = [...konohaNinjas, ...otherNinjas];

const newNinjasStr = 'const NINJAS: Ninja[] = [\n  ' + sortedNinjas.map(n => n.block).join(',\n  ') + '\n];';

const newCode = code.substring(0, startIdx) + newNinjasStr + code.substring(endIdx);

fs.writeFileSync('src/App.tsx', newCode);
console.log('Done sorting ninjas.');
