const https = require('https');
const fs = require('fs');
const path = require('path');

const targets = [
  { url: 'https://static.wikia.nocookie.net/naruto/images/4/4b/Kushina.png', name: 'Kushina_Uzumaki.webp' },
  { url: 'https://static.wikia.nocookie.net/naruto/images/e/ef/Yahiko.png', name: 'Yahiko.webp' },
  { url: 'https://static.wikia.nocookie.net/naruto/images/a/ab/Konohamaru_profile.png', name: 'Konohamaru_Sarutobi.webp' },
  { url: 'https://static.wikia.nocookie.net/naruto/images/3/36/Shizune.png', name: 'Shizune.webp' },
  { url: 'https://static.wikia.nocookie.net/naruto/images/6/6f/Rin_Nohara.png', name: 'Rin_Nohara.webp' }
];

targets.forEach(t => {
  const dest = path.join(__dirname, 'public', 'assets', 'ninjas', t.name);
  const file = fs.createWriteStream(dest);
  // User agent header sometimes needed for wikia
  const options = {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  };
  https.get(t.url, options, (response) => {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, options, (res) => {
            res.pipe(file);
            file.on('finish', () => file.close());
        })
    } else {
        response.pipe(file);
        file.on('finish', () => {
        file.close();
        console.log('Downloaded', t.name);
        });
    }
  }).on('error', (err) => {
    console.error('Error downloading ' + t.name, err.message);
  });
});
