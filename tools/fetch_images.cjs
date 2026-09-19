const https = require('https');

const titles = [
  'Boruto_Uzumaki', 'Sarada_Uchiha', 'Mitsuki', 'Kawaki', 'Momoshiki_Ōtsutsuki',
  'Mū', 'Gengetsu_Hōzuki', 'A_(Third_Raikage)', 'Third_Kazekage',
  'Karin', 'Jūgo', 'Kimimaro', 'Tayuya', 'Jirōbō', 'Kidōmaru', 'Sakon_and_Ukon',
  'Indra_Ōtsutsuki', 'Asura_Ōtsutsuki', 'Izuna_Uchiha', 'Fugaku_Uchiha'
].join('|');

const url = `https://naruto.fandom.com/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(titles)}&format=json&pithumbsize=1000`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const pages = json.query.pages;
    for (const key in pages) {
      console.log(pages[key].title + ' : ' + (pages[key].thumbnail ? pages[key].thumbnail.source : 'NOT FOUND'));
    }
  });
}).on('error', err => console.error(err));
