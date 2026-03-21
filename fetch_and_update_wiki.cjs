const https = require('https');
const fs = require('fs');
const path = require('path');

const ninjaList = [
    { name: 'Hashirama Senju', title: 'Hashirama_Senju' },
    { name: 'Tobirama Senju', title: 'Tobirama_Senju' },
    { name: 'Minato Namikaze', title: 'Minato_Namikaze' },
    { name: 'Tsunade Senju', title: 'Tsunade' },
    { name: 'Yamato', title: 'Yamato' },
    { name: 'Sakura Haruno', title: 'Sakura_Haruno' },
    { name: 'Sai', title: 'Sai' },
    { name: 'Kiba Inuzuka', title: 'Kiba_Inuzuka' },
    { name: 'Choji Akimichi', title: 'Chōji_Akimichi' },
    { name: 'Madara Uchiha', title: 'Madara_Uchiha' },
    { name: 'Izuna Uchiha', title: 'Izuna_Uchiha' },
    { name: 'Fugaku Uchiha', title: 'Fugaku_Uchiha' },
    { name: 'Iruka Umino', title: 'Iruka_Umino' },
    { name: 'Danzō Shimura', title: 'Danzō_Shimura' },
    { name: 'Orochimaru', title: 'Orochimaru' },
    { name: 'Kisame Hoshigaki', title: 'Kisame_Hoshigaki' },
    { name: 'Obito Uchiha', title: 'Obito_Uchiha' },
    { name: 'Gaara', title: 'Gaara' },
    { name: 'Zabuza Momochi', title: 'Zabuza_Momochi' },
    { name: 'Chojuro', title: 'Chōjūrō' },
    { name: 'Suigetsu Hozuki', title: 'Suigetsu_Hōzuki' },
    { name: 'Roshi', title: 'Rōshi' },
    { name: 'Yagura Karatachi', title: 'Yagura_Karatachi' },
    { name: 'Kaguya Ōtsutsuki', title: 'Kaguya_Ōtsutsuki' },
    { name: 'Mū (2º Tsuchikage)', title: 'Mū' },
    { name: 'Gengetsu Hōzuki (2º Mizukage)', title: 'Gengetsu_Hōzuki' },
    { name: 'A (3º Raikage)', title: 'A_(Third_Raikage)' },
    { name: 'Terceiro Kazekage', title: 'Third_Kazekage' },
    { name: 'Karin Uzumaki', title: 'Karin' },
    { name: 'Jūgo', title: 'Jūgo' },
    { name: 'Kimimaro', title: 'Kimimaro' },
    { name: 'Tayuya', title: 'Tayuya' },
    { name: 'Jirobo', title: 'Jirōbō' },
    { name: 'Kidomaru', title: 'Kidōmaru' },
    { name: 'Sakon e Ukon', title: 'Sakon_and_Ukon' },
    { name: 'Indra Ōtsutsuki', title: 'Indra_Ōtsutsuki' },
    { name: 'Ashura Ōtsutsuki', title: 'Asura_Ōtsutsuki' }
];

const titles = ninjaList.map(n => encodeURIComponent(n.title)).join('|');
const apiUrl = `https://naruto.fandom.com/api.php?action=query&prop=pageimages&titles=${titles}&format=json&pithumbsize=1000`;

https.get(apiUrl, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data);
        const pages = json.query.pages;
        const results = {};
        for (const key in pages) {
            const page = pages[key];
            if (page.thumbnail) {
                // Procurar o nome original correspondente
                const original = ninjaList.find(n => n.title.replace(/_/g, ' ') === page.title.replace(/_/g, ' '));
                if (original) {
                    results[original.name] = page.thumbnail.source;
                }
            }
        }
        updateNinjasFile(results);
    });
}).on('error', err => console.error(err));

function updateNinjasFile(imageMap) {
    const dataPath = path.join(__dirname, 'src', 'data', 'ninjas.ts');
    let content = fs.readFileSync(dataPath, 'utf8');

    for (const name in imageMap) {
        // Regex para encontrar o bloco desse ninja e atualizar APENAS o image se ele for original ou local não existente
        // Mas o usuário quer atualizar, então vou sobrescrever.
        const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(name:\\s*'${escapedName}',[\\s\\S]*?image:\\s*')([^']+)(')`, 'g');
        
        if (content.match(regex)) {
            console.log(`Updating ${name} image to Wiki URL.`);
            content = content.replace(regex, `$1${imageMap[name]}$3`);
        }
    }

    fs.writeFileSync(dataPath, content);
    console.log('ninjas.ts atualizado com links da Wiki.');
}
