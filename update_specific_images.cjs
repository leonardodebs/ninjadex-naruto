const https = require('https');
const fs = require('fs');
const path = require('path');

const updates = [
    { name: 'Hiruzen Sarutobi', url: 'https://static.wikia.nocookie.net/naruto/images/e/e8/Young_Hiruzen_Mobile.png/revision/latest/scale-to-width-down/1200' },
    { name: 'Tsunade Senju', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjxLdRFCp9FG_RQjV98b8_FXVUZXfufEvpIg&s' },
    { name: 'Choji Akimichi', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXzisBO0gdBrjf9qEPuHtp19mfEr-A-zU9SA&s' },
    { name: 'Madara Uchiha', url: 'https://static.wikia.nocookie.net/viloes/images/2/27/Madara-Uchiha.webp/revision/latest' },
    { name: 'Gaara', url: 'https://i.redd.it/what-if-gaara-was-the-main-character-thou-it-would-be-weird-v0-yqimrg73ci3e1.jpg?width=900&format=pjpg&auto=webp&s=fe012f2dc7e01ac3031b30d52a91548fddefa3bb' }
];

async function run() {
    const dataPath = path.join(__dirname, 'src', 'data', 'ninjas.ts');
    const destDir = path.join(__dirname, 'public', 'assets', 'ninjas');
    let content = fs.readFileSync(dataPath, 'utf8');

    for (const update of updates) {
        // Obter extensão
        let ext = update.url.includes('webp') ? '.webp' : 
                  update.url.includes('png') ? '.png' : '.jpg';
                  
        const fileName = `${update.name.replace(/\s+/g, '_')}_updated${ext}`;
        const filePath = path.join(destDir, fileName);

        console.log(`Downloading new image for ${update.name}...`);
        try {
            await downloadImage(update.url, filePath);
            const localPath = `/assets/ninjas/${fileName}`;

            const escapedName = update.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(name:\\s*'${escapedName}',[\\s\\S]*?image:\\s*')([^']+)(')`, 'g');
            
            if (content.match(regex)) {
                console.log(`Updating ${update.name} image to local path: ${localPath}`);
                content = content.replace(regex, `$1${localPath}$3`);
            }
        } catch (err) {
            console.error(`Failed to download ${update.name}: ${err.message}`);
        }
    }

    fs.writeFileSync(dataPath, content);
}

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                // Tenta lidar com redirecionamentos simples (ex: Reddit)
                if (res.statusCode === 301 || res.statusCode === 302) {
                    downloadImage(res.headers.location, dest).then(resolve).catch(reject);
                    return;
                }
                reject(new Error(`Status Code: ${res.statusCode}`));
                return;
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

run();
