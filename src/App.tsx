/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Shield, Zap, Wind, Flame, Droplets, Mountain, Skull, Star, Info, Users, ArrowRightLeft, Eye, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// --- Types ---
type Village = 'Konoha' | 'Suna' | 'Kiri' | 'Kumo' | 'Iwa' | 'Akatsuki' | 'Oto' | 'Taki' | 'Desconhecida';
type Rank = 'Genin' | 'Chunin' | 'Jonin' | 'Kage' | 'Nukenin' | 'Sannin';
type Element = 'Fogo' | 'Vento' | 'Relâmpago' | 'Terra' | 'Água' | 'Madeira' | 'Escuridão';

const ELEMENTS: Element[] = ['Fogo', 'Vento', 'Relâmpago', 'Terra', 'Água', 'Madeira', 'Escuridão'];
const RARITIES = ['S', 'A', 'B', 'C'] as const;
type Rarity = typeof RARITIES[number];

interface Ninja {
  id: number;
  name: string;
  village: Village;
  rank: Rank;
  elements: Element[];
  stats: {
    ninjutsu: number;
    taijutsu: number;
    genjutsu: number;
    strength: number;
    intelligence: number;
    speed: number;
  };
  image: string;
  description: string;
  rarity: 'S' | 'A' | 'B' | 'C';
  mentorId?: number;
  jutsus: string[];
}

// --- Mock Data ---
const NINJAS: Ninja[] = [
  {
    id: 1,
    name: 'Hashirama Senju',
    village: 'Konoha',
    rank: 'Kage',
    elements: ['Madeira', 'Água', 'Terra'],
    stats: { ninjutsu: 100, taijutsu: 95, genjutsu: 85, strength: 98, intelligence: 90, speed: 92 },
    image: 'https://static.wikia.nocookie.net/naruto/images/2/2e/Kid_Hashirama.png',
    description: 'O Primeiro Hokage e fundador da Vila Oculta da Folha.',
    rarity: 'S',
    jutsus: ['Mokuton: Shin Sūsenju', 'Mokuton: Kajukai Kōrin', 'Hokage-shiki Jijun Jutsu']
  },
  {
    id: 2,
    name: 'Tobirama Senju',
    village: 'Konoha',
    rank: 'Kage',
    elements: ['Água'],
    stats: { ninjutsu: 98, taijutsu: 90, genjutsu: 85, strength: 88, intelligence: 100, speed: 98 },
    image: 'https://static.wikia.nocookie.net/naruto/images/7/70/Kid_Tobirama.png',
    description: 'O Segundo Hokage, criador de diversos Jutsus proibidos.',
    rarity: 'S',
    mentorId: 1,
    jutsus: ['Hiraishin no Jutsu', 'Edo Tensei', 'Suiton: Suiryūdan no Jutsu']
  },
  {
    id: 3,
    name: 'Hiruzen Sarutobi',
    village: 'Konoha',
    rank: 'Kage',
    elements: ['Fogo', 'Terra'],
    stats: { ninjutsu: 95, taijutsu: 85, genjutsu: 90, strength: 80, intelligence: 100, speed: 82 },
    image: 'https://static.wikia.nocookie.net/naruto/images/e/e8/Young_Hiruzen_Mobile.png',
    description: 'O Terceiro Hokage, conhecido como "O Professor".',
    rarity: 'S',
    mentorId: 2,
    jutsus: ['Katon: Karyū Endan', 'Doton: Doryūheki', 'Shiki Fūjin']
  },
  {
    id: 4,
    name: 'Minato Namikaze',
    village: 'Konoha',
    rank: 'Kage',
    elements: ['Relâmpago', 'Vento'],
    stats: { ninjutsu: 98, taijutsu: 95, genjutsu: 80, strength: 85, intelligence: 98, speed: 100 },
    image: 'https://static.wikia.nocookie.net/naruto/images/e/eb/Minato_Jonin.png',
    description: 'O Quarto Hokage, o Relâmpago Amarelo de Konoha.',
    rarity: 'S',
    mentorId: 10,
    jutsus: ['Rasengan', 'Hiraishin no Jutsu', 'Shiki Fūjin']
  },
  {
    id: 5,
    name: 'Tsunade Senju',
    village: 'Konoha',
    rank: 'Kage',
    elements: ['Fogo', 'Água'],
    stats: { ninjutsu: 90, taijutsu: 100, genjutsu: 80, strength: 100, intelligence: 92, speed: 85 },
    image: 'https://images.weserv.nl/?url=https://static.wikia.nocookie.net/naruto/images/b/b3/Tsunade_infobox2.png',
    description: 'A Quinta Hokage e a maior Ninja Médica do mundo.',
    rarity: 'S',
    mentorId: 3,
    jutsus: ['Byakugō no Jutsu', 'Tsūtenkyaku', 'Katsuyu: Mōshiyu']
  },
  {
    id: 6,
    name: 'Kakashi Hatake',
    village: 'Konoha',
    rank: 'Jonin',
    elements: ['Relâmpago', 'Terra'],
    stats: { ninjutsu: 90, taijutsu: 88, genjutsu: 85, strength: 82, intelligence: 95, speed: 90 },
    image: 'https://static.wikia.nocookie.net/naruto/images/2/27/Kakashi_Hatake.png',
    description: 'O Ninja Copiador que já foi o Sexto Hokage.',
    rarity: 'A',
    mentorId: 4,
    jutsus: ['Chidori (Raikiri)', 'Kamui', 'Doton: Doryūheki']
  },
  {
    id: 7,
    name: 'Naruto Uzumaki',
    village: 'Konoha',
    rank: 'Kage',
    elements: ['Vento'],
    stats: { ninjutsu: 95, taijutsu: 90, genjutsu: 40, strength: 95, intelligence: 80, speed: 92 },
    image: 'https://static.wikia.nocookie.net/naruto/images/d/d6/Naruto_Part_I.png',
    description: 'O Sétimo Hokage e o Jinchuriki da Raposa de Nove Caudas.',
    rarity: 'S',
    mentorId: 6,
    jutsus: ['Rasengan', 'Kage Bunshin no Jutsu', 'Fūton: Rasenshuriken']
  },
  {
    id: 8,
    name: 'Sasuke Uchiha',
    village: 'Konoha',
    rank: 'Nukenin',
    elements: ['Fogo', 'Relâmpago'],
    stats: { ninjutsu: 98, taijutsu: 92, genjutsu: 95, strength: 88, intelligence: 94, speed: 98 },
    image: 'https://static.wikia.nocookie.net/naruto/images/2/21/Sasuke_Part_1.png',
    description: 'O último sobrevivente do clã Uchiha e portador do Rinnegan.',
    rarity: 'S',
    mentorId: 6,
    jutsus: ['Chidori', 'Amaterasu', 'Susanoo']
  },
  {
    id: 9,
    name: 'Sakura Haruno',
    village: 'Konoha',
    rank: 'Jonin',
    elements: ['Água', 'Terra'],
    stats: { ninjutsu: 85, taijutsu: 95, genjutsu: 80, strength: 98, intelligence: 95, speed: 82 },
    image: 'https://static.wikia.nocookie.net/naruto/images/6/64/Sakura_Part_1.png',
    description: 'Uma Ninja Médica excepcional com força sobre-humana.',
    rarity: 'A',
    mentorId: 6,
    jutsus: ['Byakugō no Jutsu', 'Ōkashō', 'Saikan Chūshutsu no Jutsu']
  },
  {
    id: 10,
    name: 'Jiraiya',
    village: 'Konoha',
    rank: 'Sannin',
    elements: ['Fogo', 'Terra'],
    stats: { ninjutsu: 95, taijutsu: 90, genjutsu: 80, strength: 90, intelligence: 92, speed: 85 },
    image: 'https://static.wikia.nocookie.net/naruto/images/1/1f/Jiraiya_Young.png',
    description: 'O Sábio dos Sapos e um dos Três Sannins Lendários.',
    rarity: 'S',
    mentorId: 3,
    jutsus: ['Rasengan', 'Gamaguchi Shibari', 'Senpō: Goemon']
  },
  {
    id: 11,
    name: 'Orochimaru',
    village: 'Oto',
    rank: 'Sannin',
    elements: ['Vento', 'Terra'],
    stats: { ninjutsu: 98, taijutsu: 85, genjutsu: 95, strength: 85, intelligence: 100, speed: 90 },
    image: 'https://static.wikia.nocookie.net/naruto/images/1/14/Orochimaru_Infobox.png',
    description: 'Um Sannin Lendário obcecado pela imortalidade.',
    rarity: 'S',
    mentorId: 3,
    jutsus: ['Kusanagi no Tsurugi', 'Edo Tensei', 'Yamata no Jutsu']
  },
  {
    id: 12,
    name: 'Itachi Uchiha',
    village: 'Akatsuki',
    rank: 'Nukenin',
    elements: ['Fogo', 'Água'],
    stats: { ninjutsu: 96, taijutsu: 85, genjutsu: 100, strength: 82, intelligence: 100, speed: 96 },
    image: 'https://static.wikia.nocookie.net/naruto/images/e/e9/Itachi_Child_OL.png',
    description: 'Um prodígio do clã Uchiha que sacrificou tudo pela paz.',
    rarity: 'S',
    jutsus: ['Tsukuyomi', 'Amaterasu', 'Susanoo']
  },
  {
    id: 13,
    name: 'Shisui Uchiha',
    village: 'Konoha',
    rank: 'Jonin',
    elements: ['Fogo', 'Vento'],
    stats: { ninjutsu: 92, taijutsu: 90, genjutsu: 100, strength: 80, intelligence: 95, speed: 100 },
    image: 'https://static.wikia.nocookie.net/naruto/images/1/1d/Shisui_Child_OL.png',
    description: 'Conhecido como "Shisui do Teletransporte", mestre do Genjutsu.',
    rarity: 'A',
    jutsus: ['Kotoamatsukami', 'Shunshin no Jutsu', 'Susanoo']
  },
  {
    id: 14,
    name: 'Neji Hyuga',
    village: 'Konoha',
    rank: 'Jonin',
    elements: ['Água', 'Terra'],
    stats: { ninjutsu: 70, taijutsu: 98, genjutsu: 60, strength: 85, intelligence: 90, speed: 92 },
    image: 'https://static.wikia.nocookie.net/naruto/images/7/7e/Neji_Part_I.png',
    description: 'Um gênio do clã Hyuga e mestre do Punho Suave.',
    rarity: 'A',
    mentorId: 20,
    jutsus: ['Hakke Rokujūyon Shō', 'Hakkeshō Kaiten', 'Jūken']
  },
  {
    id: 15,
    name: 'Hinata Hyuga',
    village: 'Konoha',
    rank: 'Chunin',
    elements: ['Fogo', 'Relâmpago'],
    stats: { ninjutsu: 65, taijutsu: 85, genjutsu: 60, strength: 75, intelligence: 82, speed: 80 },
    image: 'https://static.wikia.nocookie.net/naruto/images/9/97/Hinata.png',
    description: 'A Princesa do Byakugan e herdeira do clã Hyuga.',
    rarity: 'B',
    mentorId: 59,
    jutsus: ['Shugohakke Rokujūyon Shō', 'Jūbu Sōshiken', 'Hakke Kūshō']
  },
  {
    id: 16,
    name: 'Shikamaru Nara',
    village: 'Konoha',
    rank: 'Jonin',
    elements: ['Terra', 'Fogo'],
    stats: { ninjutsu: 85, taijutsu: 60, genjutsu: 70, strength: 65, intelligence: 100, speed: 75 },
    image: 'https://static.wikia.nocookie.net/naruto/images/4/44/Shikamaru_Part_I.png',
    description: 'O estrategista brilhante com um QI superior a 200.',
    rarity: 'A',
    mentorId: 19,
    jutsus: ['Kagemane no Jutsu', 'Kageyose no Jutsu', 'Kage Kubi Shibari no Jutsu']
  },
  {
    id: 17,
    name: 'Choji Akimichi',
    village: 'Konoha',
    rank: 'Jonin',
    elements: ['Fogo', 'Terra'],
    stats: { ninjutsu: 75, taijutsu: 90, genjutsu: 50, strength: 100, intelligence: 65, speed: 60 },
    image: 'https://static.wikia.nocookie.net/naruto/images/7/7d/Ch%C5%8Dji_Akimichi.png',
    description: 'Um membro leal do clã Akimichi com força física imensa.',
    rarity: 'B',
    mentorId: 19,
    jutsus: ['Baika no Jutsu', 'Nikudan Sensha', 'Chō Baika no Jutsu']
  },
  {
    id: 18,
    name: 'Ino Yamanaka',
    village: 'Konoha',
    rank: 'Jonin',
    elements: ['Terra', 'Água'],
    stats: { ninjutsu: 80, taijutsu: 60, genjutsu: 85, strength: 60, intelligence: 85, speed: 75 },
    image: 'https://static.wikia.nocookie.net/naruto/images/d/dd/Ino.png',
    description: 'Mestra em técnicas de transferência de mente.',
    rarity: 'B',
    mentorId: 19,
    jutsus: ['Shinkenshin no Jutsu', 'Shinranshin no Jutsu', 'Iryō Ninjutsu']
  },
  {
    id: 19,
    name: 'Asuma Sarutobi',
    village: 'Konoha',
    rank: 'Jonin',
    elements: ['Fogo', 'Vento'],
    stats: { ninjutsu: 85, taijutsu: 90, genjutsu: 70, strength: 88, intelligence: 85, speed: 82 },
    image: 'https://static.wikia.nocookie.net/naruto/images/7/7c/Asuma.png',
    description: 'Líder do Time 10 e mestre em combate com lâminas de chakra.',
    rarity: 'A',
    mentorId: 3,
    jutsus: ['Hien', 'Katon: Haisekishō', 'Raigō: Senjusatsu']
  },
  {
    id: 20,
    name: 'Might Guy',
    village: 'Konoha',
    rank: 'Jonin',
    elements: ['Fogo', 'Relâmpago'],
    stats: { ninjutsu: 20, taijutsu: 100, genjutsu: 10, strength: 98, intelligence: 75, speed: 100 },
    image: 'https://static.wikia.nocookie.net/naruto/images/3/31/Might_Guy.png',
    description: 'A Besta Verde de Konoha, mestre supremo do Taijutsu.',
    rarity: 'S',
    jutsus: ['Hachimon Tonkō', 'Asajaku', 'Hirudora']
  },
  {
    id: 21,
    name: 'Rock Lee',
    village: 'Konoha',
    rank: 'Jonin',
    elements: [],
    stats: { ninjutsu: 0, taijutsu: 98, genjutsu: 0, strength: 92, intelligence: 70, speed: 95 },
    image: 'https://static.wikia.nocookie.net/naruto/images/9/97/Rock_Lee_Part_I.png',
    description: 'Um especialista em Taijutsu que prova que o trabalho duro vence o talento.',
    rarity: 'A',
    mentorId: 20,
    jutsus: ['Omote Renge', 'Ura Renge', 'Hachimon Tonkō']
  },
  {
    id: 56,
    name: 'Tenten',
    village: 'Konoha',
    rank: 'Chunin',
    elements: [],
    stats: { ninjutsu: 60, taijutsu: 85, genjutsu: 30, strength: 65, intelligence: 70, speed: 80 },
    image: 'https://static.wikia.nocookie.net/naruto/images/d/da/Tenten_Part_1.png',
    description: 'Especialista em armas ninjas e ferramentas de invocação, sempre pronta para o combate.',
    rarity: 'C',
    mentorId: 20,
    jutsus: ['Sōshōryū', 'Bashōsen', 'Buki Kuchiyose']
  },
  {
    id: 59,
    name: 'Kurenai Yuhi',
    village: 'Konoha',
    rank: 'Jonin',
    elements: [],
    stats: { ninjutsu: 75, taijutsu: 70, genjutsu: 95, strength: 60, intelligence: 85, speed: 80 },
    image: 'https://static.wikia.nocookie.net/naruto/images/6/67/Kurenai_Part_I.png',
    description: 'Uma das melhores especialistas em Genjutsu de Konoha e líder do Time 8.',
    rarity: 'B',
    jutsus: ['Magen: Jubaku Satsu', 'Magen: Kokoni Arazu no Jutsu', 'Genjutsu: Flower Petal Escape']
  },
  {
    id: 57,
    name: 'Kiba Inuzuka',
    village: 'Konoha',
    rank: 'Chunin',
    elements: ['Terra'],
    stats: { ninjutsu: 70, taijutsu: 85, genjutsu: 40, strength: 80, intelligence: 60, speed: 90 },
    image: 'https://static.wikia.nocookie.net/naruto/images/0/03/Kiba.png',
    description: 'Membro do clã Inuzuka, luta sempre ao lado de seu fiel cão ninja, Akamaru.',
    rarity: 'C',
    mentorId: 59,
    jutsus: ['Gatsūga', 'Jūjin Bunshin', 'Inuzuka Ryū Jinjū Konbi Henge']
  },
  {
    id: 58,
    name: 'Shino Aburame',
    village: 'Konoha',
    rank: 'Chunin',
    elements: ['Fogo', 'Terra', 'Água'],
    stats: { ninjutsu: 85, taijutsu: 60, genjutsu: 50, strength: 60, intelligence: 85, speed: 70 },
    image: 'https://static.wikia.nocookie.net/naruto/images/9/9c/Shino.png',
    description: 'Membro do clã Aburame, utiliza insetos parasitas em combate para drenar o chakra do inimigo.',
    rarity: 'C',
    mentorId: 59,
    jutsus: ['Kikaichū no Jutsu', 'Mushi Bunshin no Jutsu', 'Mushikame no Jutsu']
  },
  // Akatsuki
  {
    id: 22,
    name: 'Pain (Nagato)',
    village: 'Akatsuki',
    rank: 'Nukenin',
    elements: ['Fogo', 'Vento', 'Relâmpago', 'Terra', 'Água'],
    stats: { ninjutsu: 100, taijutsu: 85, genjutsu: 90, strength: 88, intelligence: 95, speed: 90 },
    image: 'https://static.wikia.nocookie.net/naruto/images/0/06/Nagato_Early_Akatsuki.png',
    description: 'Líder da Akatsuki e portador do Rinnegan, busca a paz através da dor.',
    rarity: 'S',
    mentorId: 10,
    jutsus: ['Shinra Tensei', 'Banshō Ten\'in', 'Chibaku Tensei']
  },
  {
    id: 23,
    name: 'Konan',
    village: 'Akatsuki',
    rank: 'Nukenin',
    elements: ['Vento', 'Terra', 'Água'],
    stats: { ninjutsu: 92, taijutsu: 75, genjutsu: 85, strength: 70, intelligence: 92, speed: 88 },
    image: 'https://static.wikia.nocookie.net/naruto/images/3/36/Young_Konan_OL.png',
    description: 'O "Anjo" da Akatsuki, mestra em técnicas de origami de papel.',
    rarity: 'S',
    mentorId: 10,
    jutsus: ['Shikigami no Mai', 'Kami Shigure', 'Kami no Shisha no Jutsu']
  },
  {
    id: 24,
    name: 'Kisame Hoshigaki',
    village: 'Akatsuki',
    rank: 'Nukenin',
    elements: ['Água', 'Terra'],
    stats: { ninjutsu: 94, taijutsu: 92, genjutsu: 70, strength: 98, intelligence: 85, speed: 82 },
    image: 'https://static.wikia.nocookie.net/naruto/images/f/f7/Kisame_Hoshigaki_full.png',
    description: 'A Besta sem Cauda, mestre da Samehada e um dos Sete Espadachins.',
    rarity: 'S',
    jutsus: ['Suiton: Daikōdan no Jutsu', 'Suiton: Bakusui Shōha', 'Samehada Fusion']
  },
  {
    id: 25,
    name: 'Deidara',
    village: 'Akatsuki',
    rank: 'Nukenin',
    elements: ['Terra'],
    stats: { ninjutsu: 95, taijutsu: 80, genjutsu: 75, strength: 78, intelligence: 88, speed: 90 },
    image: 'https://static.wikia.nocookie.net/naruto/images/f/f5/NUNSRDeidara.png',
    description: 'Um artista que usa argila explosiva. A arte é um estouro!',
    rarity: 'S',
    jutsus: ['C3', 'C4 Karura', 'C0']
  },
  {
    id: 26,
    name: 'Sasori',
    village: 'Akatsuki',
    rank: 'Nukenin',
    elements: [],
    stats: { ninjutsu: 98, taijutsu: 85, genjutsu: 80, strength: 80, intelligence: 96, speed: 85 },
    image: 'https://static.wikia.nocookie.net/naruto/images/1/12/Sasori_UNSR.png',
    description: 'Sasori da Areia Vermelha, o maior mestre de marionetes da história.',
    rarity: 'S',
    jutsus: ['Akahigi: Hyakki no Sōen', 'Satetsu Kaihō', 'Sandaime Kazekage Puppet']
  },
  {
    id: 27,
    name: 'Hidan',
    village: 'Akatsuki',
    rank: 'Nukenin',
    elements: [],
    stats: { ninjutsu: 80, taijutsu: 90, genjutsu: 60, strength: 88, intelligence: 65, speed: 85 },
    image: 'https://static.wikia.nocookie.net/naruto/images/f/ff/NSUNRHidan.png',
    description: 'O seguidor imortal de Jashin que usa rituais de sangue.',
    rarity: 'S',
    jutsus: ['Jujutsu: Shijihyōketsu', 'Immortality', 'Scythe Combat']
  },
  {
    id: 28,
    name: 'Kakuzu',
    village: 'Akatsuki',
    rank: 'Nukenin',
    elements: ['Fogo', 'Vento', 'Relâmpago', 'Terra', 'Água'],
    stats: { ninjutsu: 95, taijutsu: 88, genjutsu: 75, strength: 95, intelligence: 90, speed: 80 },
    image: 'https://static.wikia.nocookie.net/naruto/images/1/1a/Kakuzu_UNSR.png',
    description: 'Um ninja tesoureiro que possui cinco corações e domina todos os elementos.',
    rarity: 'S',
    jutsus: ['Jigokuzuki', 'Kiri Same', 'Earth Grudge Fear']
  },
  {
    id: 29,
    name: 'Zetsu',
    village: 'Akatsuki',
    rank: 'Nukenin',
    elements: ['Madeira', 'Terra'],
    stats: { ninjutsu: 85, taijutsu: 70, genjutsu: 80, strength: 75, intelligence: 98, speed: 75 },
    image: 'https://images.weserv.nl/?url=https://static.wikia.nocookie.net/naruto/images/5/5f/White_Zetsu.png',
    description: 'O espião da Akatsuki, dividido entre as metades branca e preta.',
    rarity: 'A',
    jutsus: ['Kagerō', 'Hōshi no Jutsu', 'Mokuton: Sashiki no Jutsu']
  },
  {
    id: 30,
    name: 'Obito Uchiha',
    village: 'Akatsuki',
    rank: 'Nukenin',
    elements: ['Fogo', 'Madeira', 'Terra'],
    stats: { ninjutsu: 98, taijutsu: 92, genjutsu: 98, strength: 90, intelligence: 95, speed: 96 },
    image: 'https://static.wikia.nocookie.net/naruto/images/4/4a/Obito_Uchiha.png',
    description: 'O verdadeiro mentor por trás da Akatsuki, portador do Kamui.',
    rarity: 'S',
    mentorId: 4,
    jutsus: ['Kamui', 'Izanagi', 'Katon: Bakufū Ranbu']
  },
  // Suna
  {
    id: 31,
    name: 'Gaara',
    village: 'Suna',
    rank: 'Kage',
    elements: ['Vento', 'Terra'],
    stats: { ninjutsu: 96, taijutsu: 70, genjutsu: 75, strength: 80, intelligence: 92, speed: 85 },
    image: 'https://static.wikia.nocookie.net/naruto/images/2/20/Gaara_in_Part_I.png',
    description: 'O Quinto Kazekage, mestre da manipulação de areia.',
    rarity: 'S',
    jutsus: ['Sabaku Kyū', 'Sabaku Sōsō', 'Sabaku Taisō']
  },
  {
    id: 32,
    name: 'Temari',
    village: 'Suna',
    rank: 'Jonin',
    elements: ['Vento'],
    stats: { ninjutsu: 90, taijutsu: 75, genjutsu: 70, strength: 78, intelligence: 90, speed: 82 },
    image: 'https://static.wikia.nocookie.net/naruto/images/b/bb/Temari_newshot.png',
    description: 'Uma das melhores usuárias de Vento, usa um leque gigante em combate.',
    rarity: 'A',
    jutsus: ['Kiri Kiri Mai', 'Fūton: Tatsu no Ōshigoto', 'Daikamaitachi no Jutsu']
  },
  {
    id: 33,
    name: 'Kankuro',
    village: 'Suna',
    rank: 'Jonin',
    elements: [],
    stats: { ninjutsu: 88, taijutsu: 70, genjutsu: 75, strength: 75, intelligence: 88, speed: 78 },
    image: 'https://static.wikia.nocookie.net/naruto/images/7/7d/Kankur%C5%8D1.png',
    description: 'Mestre marionetista da Vila da Areia, usa corvos e formigas mecânicas.',
    rarity: 'A',
    jutsus: ['Kurohigi: Kiki Ippatsu', 'Kurohigi: Sanshōuo', 'Kurohigi: Salamander']
  },
  {
    id: 34,
    name: 'Rasa',
    village: 'Suna',
    rank: 'Kage',
    elements: ['Terra', 'Água'],
    stats: { ninjutsu: 94, taijutsu: 80, genjutsu: 80, strength: 85, intelligence: 90, speed: 82 },
    image: 'https://static.wikia.nocookie.net/naruto/images/2/24/Yondaime_Kazekage.png',
    description: 'O Quarto Kazekage, capaz de manipular o Pó de Ouro.',
    rarity: 'S',
    jutsus: ['Sakinn no Jutsu', 'Jidō Bōgyo', 'Gold Dust Manipulation']
  },
  {
    id: 35,
    name: 'Chiyo',
    village: 'Suna',
    rank: 'Jonin',
    elements: [],
    stats: { ninjutsu: 95, taijutsu: 85, genjutsu: 90, strength: 70, intelligence: 98, speed: 80 },
    image: 'https://static.wikia.nocookie.net/naruto/images/7/73/Chiyo.png',
    description: 'A lendária conselheira de Suna, mestre suprema de marionetes.',
    rarity: 'S',
    jutsus: ['Shirohigi: Jitchippu no Shū', 'Kishō Tensei', 'Puppet Mastery']
  },
  // Kumo
  {
    id: 36,
    name: 'A (4º Raikage)',
    village: 'Kumo',
    rank: 'Kage',
    elements: ['Relâmpago', 'Terra', 'Água'],
    stats: { ninjutsu: 92, taijutsu: 98, genjutsu: 60, strength: 100, intelligence: 85, speed: 100 },
    image: 'https://static.wikia.nocookie.net/naruto/images/4/4c/Fourth_Raikage_2.png',
    description: 'O Quarto Raikage, famoso por sua velocidade e força bruta eletrizante.',
    rarity: 'S',
    jutsus: ['Rariattu', 'Erubō', 'Raigeki']
  },
  {
    id: 37,
    name: 'Killer Bee',
    village: 'Kumo',
    rank: 'Jonin',
    elements: ['Relâmpago', 'Água'],
    stats: { ninjutsu: 94, taijutsu: 96, genjutsu: 80, strength: 95, intelligence: 82, speed: 94 },
    image: 'https://static.wikia.nocookie.net/naruto/images/6/63/Killer_B.png',
    description: 'O Jinchuriki do Oito-Caudas e mestre do estilo de sete espadas.',
    rarity: 'S',
    jutsus: ['Lariat', 'Bijū-dama', 'Acrobat']
  },
  {
    id: 38,
    name: 'Darui',
    village: 'Kumo',
    rank: 'Jonin',
    elements: ['Água', 'Relâmpago'],
    stats: { ninjutsu: 92, taijutsu: 88, genjutsu: 75, strength: 85, intelligence: 90, speed: 88 },
    image: 'https://static.wikia.nocookie.net/naruto/images/4/45/Darui.png',
    description: 'Braço direito do Raikage e mestre do Estilo Tempestade.',
    rarity: 'A',
    mentorId: 36,
    jutsus: ['Ranton: Reizeru Pankushā', 'Suiton: Suijinheki', 'Raiton: Kuroi Kaminari']
  },
  {
    id: 39,
    name: 'C (Shee)',
    village: 'Kumo',
    rank: 'Jonin',
    elements: ['Relâmpago'],
    stats: { ninjutsu: 85, taijutsu: 70, genjutsu: 92, strength: 65, intelligence: 94, speed: 82 },
    image: 'https://static.wikia.nocookie.net/naruto/images/7/7a/Shee.png',
    description: 'Ninja sensor e médico de elite da Vila da Nuvem.',
    rarity: 'B',
    mentorId: 36,
    jutsus: ['Raiton: Raigen Raikōchū', 'Iryō Ninjutsu', 'Sensing']
  },
  {
    id: 40,
    name: 'Omoi',
    village: 'Kumo',
    rank: 'Chunin',
    elements: ['Relâmpago'],
    stats: { ninjutsu: 82, taijutsu: 85, genjutsu: 65, strength: 78, intelligence: 80, speed: 85 },
    image: 'https://static.wikia.nocookie.net/naruto/images/9/9f/Omoi_Part_II.png',
    description: 'Um espadachim habilidoso que tende a pensar demais nas situações.',
    rarity: 'B',
    mentorId: 37,
    jutsus: ['Kumo-Ryū Damashii-giri', 'Kumo-Ryū Mikazuki-giri', 'Sword Combat']
  },
  // Kiri
  {
    id: 41,
    name: 'Mei Terumi',
    village: 'Kiri',
    rank: 'Kage',
    elements: ['Fogo', 'Água', 'Terra'],
    stats: { ninjutsu: 96, taijutsu: 82, genjutsu: 85, strength: 80, intelligence: 92, speed: 85 },
    image: 'https://static.wikia.nocookie.net/naruto/images/6/6f/Mei.png',
    description: 'A Quinta Mizukage, possui duas Kekkei Genkai: Lava e Fervura.',
    rarity: 'S',
    jutsus: ['Yōton: Yōkai no Jutsu', 'Fūton: Kōmyō no Jutsu', 'Suiton: Suijinheki']
  },
  {
    id: 42,
    name: 'Zabuza Momochi',
    village: 'Kiri',
    rank: 'Nukenin',
    elements: ['Água'],
    stats: { ninjutsu: 88, taijutsu: 92, genjutsu: 75, strength: 90, intelligence: 85, speed: 88 },
    image: 'https://static.wikia.nocookie.net/naruto/images/a/a6/Zabuza_OL.png',
    description: 'O Demônio da Névoa Oculta, mestre do assassinato silencioso.',
    rarity: 'A',
    jutsus: ['Suiton: Suiryūdan no Jutsu', 'Kirigakure no Jutsu', 'Kubikiribōchū Combat']
  },
  {
    id: 43,
    name: 'Haku',
    village: 'Kiri',
    rank: 'Nukenin',
    elements: ['Água', 'Vento'],
    stats: { ninjutsu: 90, taijutsu: 85, genjutsu: 80, strength: 70, intelligence: 92, speed: 96 },
    image: 'https://static.wikia.nocookie.net/naruto/images/3/35/Haku%27s_shinobi_attire.png',
    description: 'Portador da Kekkei Genkai de Gelo e fiel seguidor de Zabuza.',
    rarity: 'A',
    mentorId: 42,
    jutsus: ['Sensatsu Suishō', 'Makyō Hyōshō', 'Thousand Flying Water Needles']
  },
  {
    id: 44,
    name: 'Chojuro',
    village: 'Kiri',
    rank: 'Jonin',
    elements: ['Água'],
    stats: { ninjutsu: 85, taijutsu: 88, genjutsu: 70, strength: 82, intelligence: 80, speed: 85 },
    image: 'https://static.wikia.nocookie.net/naruto/images/d/d8/Chojuro_2.png',
    description: 'Um dos Sete Espadachins da Névoa, portador da Hiramekarei.',
    rarity: 'A',
    mentorId: 41,
    jutsus: ['Hiramekarei Kai', 'Suiton: Suiryūdan no Jutsu', 'Sword Mastery']
  },
  {
    id: 45,
    name: 'Suigetsu Hozuki',
    village: 'Kiri',
    rank: 'Nukenin',
    elements: ['Água'],
    stats: { ninjutsu: 88, taijutsu: 85, genjutsu: 70, strength: 85, intelligence: 82, speed: 88 },
    image: 'https://static.wikia.nocookie.net/naruto/images/3/3e/Suigetsu_H%C5%8Dzuki.png',
    description: 'Capaz de transformar seu corpo em água, busca as espadas da Névoa.',
    rarity: 'B',
    jutsus: ['Suika no Jutsu', 'Suiton: Gōkyaku no Jutsu', 'Sword Combat']
  },
  // Iwa
  {
    id: 46,
    name: 'Onoki',
    village: 'Iwa',
    rank: 'Kage',
    elements: ['Terra', 'Vento', 'Fogo'],
    stats: { ninjutsu: 98, taijutsu: 60, genjutsu: 85, strength: 65, intelligence: 100, speed: 75 },
    image: 'https://static.wikia.nocookie.net/naruto/images/6/67/%C5%8Cnoki.png',
    description: 'O Terceiro Tsuchikage, mestre do Estilo Poeira (Jinton).',
    rarity: 'S',
    jutsus: ['Jinton: Genkai Hakuri no Jutsu', 'Doton: Kajūgan no Jutsu', 'Flight']
  },
  {
    id: 47,
    name: 'Kurotsuchi',
    village: 'Iwa',
    rank: 'Jonin',
    elements: ['Terra', 'Fogo', 'Água'],
    stats: { ninjutsu: 90, taijutsu: 85, genjutsu: 80, strength: 82, intelligence: 88, speed: 88 },
    image: 'https://static.wikia.nocookie.net/naruto/images/2/29/Kurotsuchi_Part_II.png',
    description: 'Neta de Onoki e futura Tsuchikage, mestre do Estilo Lava.',
    rarity: 'A',
    mentorId: 46,
    jutsus: ['Yōton: Sekkaigyō no Jutsu', 'Doton: Kanchūsen', 'Suiton: Mizurappa']
  },
  {
    id: 48,
    name: 'Akatsuchi',
    village: 'Iwa',
    rank: 'Jonin',
    elements: ['Terra'],
    stats: { ninjutsu: 85, taijutsu: 88, genjutsu: 65, strength: 95, intelligence: 75, speed: 70 },
    image: 'https://static.wikia.nocookie.net/naruto/images/1/16/Akatsuchi_Part_II.png',
    description: 'O "Escudo de Iwa", conhecido por sua imensa força e técnicas de terra.',
    rarity: 'B',
    mentorId: 46,
    jutsus: ['Doton: Gōremu no Jutsu', 'Doton: Kanchūsen', 'Strength']
  },
  {
    id: 49,
    name: 'Roshi',
    village: 'Iwa',
    rank: 'Nukenin',
    elements: ['Terra', 'Fogo'],
    stats: { ninjutsu: 94, taijutsu: 85, genjutsu: 75, strength: 90, intelligence: 85, speed: 82 },
    image: 'https://static.wikia.nocookie.net/naruto/images/3/37/Roshi_OL.png',
    description: 'O Jinchuriki do Quatro-Caudas, mestre do Estilo Lava.',
    rarity: 'S',
    jutsus: ['Yōton: Kakugyō no Jutsu', 'Shakuton: Kajō no Jutsu', 'Lava Release']
  },
  // Outros Jinchuriki e Lendários
  {
    id: 50,
    name: 'Yugito Nii',
    village: 'Kumo',
    rank: 'Jonin',
    elements: ['Fogo'],
    stats: { ninjutsu: 88, taijutsu: 92, genjutsu: 70, strength: 80, intelligence: 85, speed: 95 },
    image: 'https://static.wikia.nocookie.net/naruto/images/2/2f/Yugito.png',
    description: 'A Jinchuriki de Matatabi (Duas-Caudas), conhecida por sua velocidade e garras flamejantes.',
    rarity: 'S',
    jutsus: ['Katon: Nezumi Kedama', 'Neko-zume', 'Bijū-dama']
  },
  {
    id: 51,
    name: 'Yagura Karatachi',
    village: 'Kiri',
    rank: 'Kage',
    elements: ['Água', 'Vento'],
    stats: { ninjutsu: 94, taijutsu: 85, genjutsu: 80, strength: 80, intelligence: 90, speed: 88 },
    image: 'https://static.wikia.nocookie.net/naruto/images/e/e0/Yagura.png',
    description: 'O Quarto Mizukage e Jinchuriki de Isobu (Três-Caudas), controlava perfeitamente sua Bijuu.',
    rarity: 'S',
    jutsus: ['Suiton: Mizukagami no Jutsu', 'Sango Shō', 'Bijū-dama']
  },
  {
    id: 52,
    name: 'Han',
    village: 'Iwa',
    rank: 'Jonin',
    elements: ['Fogo', 'Água'],
    stats: { ninjutsu: 85, taijutsu: 95, genjutsu: 65, strength: 98, intelligence: 80, speed: 92 },
    image: 'https://static.wikia.nocookie.net/naruto/images/3/3c/Han.png',
    description: 'O Jinchuriki de Kokuō (Cinco-Caudas), usa uma armadura a vapor para aumentar sua força e velocidade.',
    rarity: 'S',
    jutsus: ['Futton: Kairiki Musō', 'Funsuiken', 'Bijū-dama']
  },
  {
    id: 53,
    name: 'Utakata',
    village: 'Kiri',
    rank: 'Nukenin',
    elements: ['Água'],
    stats: { ninjutsu: 90, taijutsu: 80, genjutsu: 75, strength: 75, intelligence: 85, speed: 88 },
    image: 'https://static.wikia.nocookie.net/naruto/images/2/27/Utakata.png',
    description: 'O Jinchuriki de Saiken (Seis-Caudas), mestre em Ninjutsu de Bolhas de Sabão.',
    rarity: 'S',
    jutsus: ['Suiton: Hōmatsu no Jutsu', 'Santōryū', 'Bijū-dama']
  },
  {
    id: 54,
    name: 'Fū',
    village: 'Taki',
    rank: 'Jonin',
    elements: ['Vento'],
    stats: { ninjutsu: 88, taijutsu: 85, genjutsu: 70, strength: 75, intelligence: 82, speed: 94 },
    image: 'https://static.wikia.nocookie.net/naruto/images/f/f6/Fu.png',
    description: 'A Jinchuriki de Chōmei (Sete-Caudas), capaz de voar e usar técnicas de pó de escama.',
    rarity: 'S',
    jutsus: ['Mushikui', 'Hiden: Rinpungakure no Jutsu', 'Bijū-dama']
  },
  {
    id: 55,
    name: 'Hagoromo Ōtsutsuki',
    village: 'Desconhecida',
    rank: 'Kage',
    elements: ['Fogo', 'Vento', 'Relâmpago', 'Terra', 'Água', 'Madeira', 'Escuridão'],
    stats: { ninjutsu: 100, taijutsu: 100, genjutsu: 100, strength: 100, intelligence: 100, speed: 100 },
    image: 'https://static.wikia.nocookie.net/naruto/images/8/83/Kid_Hagoromo.png',
    description: 'O Sábio dos Seis Caminhos, criador do Ninshu e o primeiro Jinchuriki do Dez-Caudas (Shinju).',
    rarity: 'S',
    jutsus: ['Banbutsu Sōzō', 'Chibaku Tensei', 'Rikudō Senjutsu']
  },
  {
    id: 60,
    name: 'Sai',
    village: 'Konoha',
    rank: 'Chunin',
    elements: ['Terra', 'Água'],
    stats: { ninjutsu: 88, taijutsu: 82, genjutsu: 75, strength: 70, intelligence: 92, speed: 85 },
    image: 'https://static.wikia.nocookie.net/naruto/images/0/07/Sai_Infobox.png',
    description: 'Um talentoso artista da ANBU Raiz que aprendeu a expressar emoções através do Time 7.',
    rarity: 'A',
    mentorId: 11,
    jutsus: ['Chōjū Giga', 'Sumi-gasumi', 'Koshi Tandan']
  },
  {
    id: 61,
    name: 'Yamato',
    village: 'Konoha',
    rank: 'Jonin',
    elements: ['Madeira', 'Terra', 'Água'],
    stats: { ninjutsu: 92, taijutsu: 85, genjutsu: 80, strength: 82, intelligence: 90, speed: 84 },
    image: 'https://static.wikia.nocookie.net/naruto/images/f/f7/Yamato_newshot.png',
    description: 'Um capitão da ANBU e o único sobrevivente dos experimentos de Orochimaru com as células de Hashirama.',
    rarity: 'A',
    mentorId: 6,
    jutsus: ['Mokuton: Jukai Kōtan', 'Mokuton: Mokujōheki', 'Hokage-shiki Jijun Jutsu']
  },
  {
    id: 62,
    name: 'Iruka Umino',
    village: 'Konoha',
    rank: 'Chunin',
    elements: ['Fogo', 'Água'],
    stats: { ninjutsu: 75, taijutsu: 72, genjutsu: 70, strength: 68, intelligence: 85, speed: 74 },
    image: 'https://static.wikia.nocookie.net/naruto/images/b/bc/Iruka.png',
    description: 'Instrutor da Academia Ninja e a primeira pessoa a reconhecer e acreditar em Naruto.',
    rarity: 'C',
    jutsus: ['Kekkai Hōjin', 'Gōkyū no Jutsu']
  }
];

const VILLAGES: { id: Village; label: string; color: string }[] = [
  { id: 'Konoha', label: 'Konoha', color: 'bg-emerald-700' },
  { id: 'Suna', label: 'Suna', color: 'bg-amber-600' },
  { id: 'Kiri', label: 'Kiri', color: 'bg-blue-600' },
  { id: 'Kumo', label: 'Kumo', color: 'bg-yellow-500' },
  { id: 'Iwa', label: 'Iwa', color: 'bg-stone-600' },
  { id: 'Akatsuki', label: 'Akatsuki', color: 'bg-red-900' },
  { id: 'Oto', label: 'Oto', color: 'bg-purple-900' },
  { id: 'Taki', label: 'Taki', color: 'bg-teal-600' },
  { id: 'Desconhecida', label: 'Outros', color: 'bg-stone-800' }
];

// --- Components ---

const ElementBadge: React.FC<{ element: Element }> = ({ element }) => {
  const icons: Record<Element, React.ReactNode> = {
    'Fogo': <Flame size={12} />,
    'Vento': <Wind size={12} />,
    'Relâmpago': <Zap size={12} />,
    'Terra': <Mountain size={12} />,
    'Água': <Droplets size={12} />,
    'Madeira': <Shield size={12} />,
    'Escuridão': <Skull size={12} />,
  };

  const colors: Record<Element, string> = {
    'Fogo': 'bg-red-100 text-red-800 border-red-200',
    'Vento': 'bg-green-100 text-green-800 border-green-200',
    'Relâmpago': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Terra': 'bg-amber-100 text-amber-800 border-amber-200',
    'Água': 'bg-blue-100 text-blue-800 border-blue-200',
    'Madeira': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Escuridão': 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${colors[element]}`}>
      {icons[element]}
      {element}
    </span>
  );
};

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-stone-500">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color}`} 
      />
    </div>
  </div>
);

const NinjaCard: React.FC<{ 
  ninja: Ninja; 
  onClick: () => void; 
  isSelectedForComparison: boolean;
  onCompareToggle: (e: React.MouseEvent) => void;
  isDarkMode: boolean;
}> = ({ ninja, onClick, isSelectedForComparison, onCompareToggle, isDarkMode }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layoutId={`card-${ninja.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative border-2 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer ${
        isDarkMode 
          ? 'bg-stone-900 border-stone-700 text-stone-100' 
          : 'bg-[#fdfcf0] border-stone-300 text-stone-900'
      } ${
        isSelectedForComparison ? 'border-red-600 ring-4 ring-red-100' : ''
      }`}
    >
      {/* Paper Texture Overlay */}
      <div className={`absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')] ${isDarkMode ? 'invert' : ''}`} />
      
      {/* Rarity Badge */}
      <div className="absolute top-2 left-2 z-10">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-sm shadow-md ${
          ninja.rarity === 'S' ? 'bg-red-600 animate-pulse' :
          ninja.rarity === 'A' ? 'bg-orange-500' :
          ninja.rarity === 'B' ? 'bg-blue-600' : 'bg-stone-500'
        }`}>
          {ninja.rarity}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={onCompareToggle}
          className={`p-2 rounded-full transition-all shadow-md ${
            isSelectedForComparison 
              ? 'bg-red-600 text-white' 
              : isDarkMode 
                ? 'bg-stone-800 text-stone-400 hover:text-red-500' 
                : 'bg-white/80 text-stone-400 hover:text-red-600'
          }`}
          title="Comparar"
        >
          <ArrowRightLeft size={16} />
        </button>
      </div>
      
      {/* Card Header */}
      <div className={`p-4 pt-12 flex justify-between items-start border-b ${isDarkMode ? 'border-stone-700 bg-stone-800/50' : 'border-stone-200 bg-stone-50/50'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full border-2 overflow-hidden shrink-0 shadow-inner ${isDarkMode ? 'border-stone-600 bg-stone-700' : 'border-stone-300 bg-stone-200'}`}>
            <img 
              src={ninja.image} 
              alt="" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${ninja.id}/100/100`;
              }}
            />
          </div>
          <div>
            <motion.h3 layoutId={`name-${ninja.id}`} className={`text-lg font-serif font-bold leading-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>{ninja.name}</motion.h3>
            <motion.p layoutId={`id-${ninja.id}`} className={`text-[10px] font-mono uppercase tracking-[0.2em] ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>ID: #{ninja.id.toString().padStart(4, '0')}</motion.p>
          </div>
        </div>
        <motion.div layoutId={`village-${ninja.id}`} className={`px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest ${VILLAGES.find(v => v.id === ninja.village)?.color || 'bg-stone-500'}`}>
          {ninja.village}
        </motion.div>
      </div>

      {/* Image Section */}
      <div className={`relative aspect-square overflow-hidden ${isDarkMode ? 'bg-stone-800' : 'bg-stone-200'}`}>
        <motion.img 
          layoutId={`img-${ninja.id}`}
          src={ninja.image} 
          alt={ninja.name}
          className="w-full h-full object-contain p-4 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${ninja.id}/400/400`;
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex flex-wrap gap-1">
            {ninja.elements.map(el => <ElementBadge key={el} element={el} />)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 flex-grow flex flex-col">
        <div className="flex items-center gap-2">
          <motion.span layoutId={`rank-${ninja.id}`} className={`text-[10px] font-black px-2 py-0.5 rounded border-2 ${ninja.rank === 'Kage' ? 'border-red-600 text-red-600' : isDarkMode ? 'border-stone-600 text-stone-400' : 'border-stone-800 text-stone-800'} uppercase`}>
            {ninja.rank}
          </motion.span>
          <div className={`h-px flex-grow ${isDarkMode ? 'bg-stone-700' : 'bg-stone-200'}`} />
        </div>

        <div className="space-y-3 pt-2">
          <StatBar label="Ninjutsu" value={ninja.stats.ninjutsu} color="bg-red-600" />
          <StatBar label="Taijutsu" value={ninja.stats.taijutsu} color="bg-orange-500" />
          <StatBar label="Genjutsu" value={ninja.stats.genjutsu} color="bg-indigo-600" />
        </div>
      </div>

      {/* Footer Decoration */}
      <div className={`h-2 w-full mt-auto ${isDarkMode ? 'bg-red-900' : 'bg-stone-800'}`} />
    </motion.div>
  );
};

const SharinganMode: React.FC<{ ninjas: Ninja[]; onClose: () => void }> = ({ ninjas, onClose }) => {
  const data = [
    { subject: 'Ninjutsu', A: ninjas[0].stats.ninjutsu, B: ninjas[1].stats.ninjutsu, full: 100 },
    { subject: 'Taijutsu', A: ninjas[0].stats.taijutsu, B: ninjas[1].stats.taijutsu, full: 100 },
    { subject: 'Genjutsu', A: ninjas[0].stats.genjutsu, B: ninjas[1].stats.genjutsu, full: 100 },
    { subject: 'Força', A: ninjas[0].stats.strength, B: ninjas[1].stats.strength, full: 100 },
    { subject: 'Inteligência', A: ninjas[0].stats.intelligence, B: ninjas[1].stats.intelligence, full: 100 },
    { subject: 'Velocidade', A: ninjas[0].stats.speed, B: ninjas[1].stats.speed, full: 100 },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-4 border-red-600 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.3)] p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="flex justify-between w-full">
            <div className="text-center space-y-2">
              <img src={ninjas[0].image} className="w-24 h-24 object-contain rounded-full border-2 border-red-600 bg-stone-800" referrerPolicy="no-referrer" />
              <p className="text-red-600 font-serif font-bold">{ninjas[0].name}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Eye className="text-red-600 animate-pulse" size={48} />
              <p className="text-red-600 font-mono text-[10px] uppercase tracking-widest">Modo Sharingan</p>
            </div>
            <div className="text-center space-y-2">
              <img src={ninjas[1].image} className="w-24 h-24 object-contain rounded-full border-2 border-blue-600 bg-stone-800" referrerPolicy="no-referrer" />
              <p className="text-blue-600 font-serif font-bold">{ninjas[1].name}</p>
            </div>
          </div>
          
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name={ninjas[0].name} dataKey="A" stroke="#dc2626" fill="#dc2626" fillOpacity={0.5} />
                <Radar name={ninjas[1].name} dataKey="B" stroke="#2563eb" fill="#2563eb" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="w-full md:w-80 space-y-6">
          <h3 className="text-2xl font-serif font-black text-white uppercase border-b border-red-600 pb-2">Análise de Combate</h3>
          <div className="space-y-4">
            {data.map(stat => (
              <div key={stat.subject} className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-stone-400 uppercase">
                  <span>{stat.subject}</span>
                  <div className="flex gap-2">
                    <span className="text-red-600">{stat.A}</span>
                    <span className="text-stone-600">vs</span>
                    <span className="text-blue-600">{stat.B}</span>
                  </div>
                </div>
                <div className="h-1 bg-stone-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${(stat.A / (stat.A + stat.B)) * 100}%` }} className="h-full bg-red-600" />
                  <div style={{ width: `${(stat.B / (stat.A + stat.B)) * 100}%` }} className="h-full bg-blue-600" />
                </div>
              </div>
            ))}
          </div>
          <button onClick={onClose} className="w-full py-3 bg-red-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all">Fechar Dossiê</button>
        </div>
      </motion.div>
    </div>
  );
};

const ExpandedNinjaCard: React.FC<{ 
  ninja: Ninja; 
  onClose: () => void; 
  onNavigate: (id: number) => void;
  allNinjas: Ninja[];
  isDarkMode: boolean;
}> = ({ ninja, onClose, onNavigate, allNinjas, isDarkMode }) => {
  const mentor = ninja.mentorId ? allNinjas.find(n => n.id === ninja.mentorId) : null;
  const disciples = allNinjas.filter(n => n.mentorId === ninja.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/90"
      />
      
      <motion.div
        layoutId={`card-${ninja.id}`}
        className={`relative w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border-4 ${
          isDarkMode ? 'bg-stone-900 border-stone-700 text-stone-100' : 'bg-[#fdfcf0] border-stone-800 text-stone-900'
        }`}
      >
        {/* Paper Texture Overlay */}
        <div className={`absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')] ${isDarkMode ? 'invert' : ''}`} />

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors shadow-lg ${
              isDarkMode ? 'bg-stone-800 text-stone-100 hover:bg-red-900' : 'bg-stone-800 text-white hover:bg-red-700'
            }`}
            title="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Left Side: Image & Basic Info */}
        <div className={`w-full md:w-2/5 h-64 md:h-auto relative flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-stone-800' : 'bg-stone-200'}`}>
          <motion.img 
            layoutId={`img-${ninja.id}`}
            src={ninja.image} 
            alt={ninja.name}
            className="max-w-full max-h-full object-contain p-4 md:p-8"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${ninja.id}/400/400`;
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-12 h-12 rounded-full border-2 overflow-hidden shrink-0 ${isDarkMode ? 'border-stone-600 bg-stone-700' : 'border-white/50 bg-stone-800'}`}>
                <img src={ninja.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <motion.div layoutId={`village-${ninja.id}`} className={`px-4 py-1 rounded-full text-xs font-bold text-white uppercase tracking-widest ${VILLAGES.find(v => v.id === ninja.village)?.color || 'bg-stone-500'}`}>
                {ninja.village}
              </motion.div>
            </div>
            <motion.h2 layoutId={`name-${ninja.id}`} className="text-4xl font-serif font-black text-white leading-tight">{ninja.name}</motion.h2>
            <motion.p layoutId={`id-${ninja.id}`} className="text-xs font-mono uppercase tracking-[0.3em] text-stone-300 mt-1">Dossiê de Rank S • #{ninja.id.toString().padStart(4, '0')}</motion.p>
          </div>
        </div>

        {/* Right Side: Detailed Stats & Description */}
        <div className="w-full md:w-3/5 flex-1 p-6 md:p-12 space-y-6 md:space-y-8 overflow-y-auto">
          <div className="flex items-center gap-4 pr-10 md:pr-12">
            <motion.span layoutId={`rank-${ninja.id}`} className={`text-sm font-black px-4 py-1 rounded border-2 ${ninja.rank === 'Kage' ? 'border-red-600 text-red-600' : isDarkMode ? 'border-stone-600 text-stone-400' : 'border-stone-800 text-stone-800'} uppercase`}>
              {ninja.rank}
            </motion.span>
            <div className={`h-px flex-grow ${isDarkMode ? 'bg-stone-700' : 'bg-stone-200'}`} />
            <div className="flex gap-2">
              {ninja.elements.map(el => <ElementBadge key={el} element={el} />)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {mentor && (
              <div onClick={() => onNavigate(mentor.id)} className={`p-4 rounded-xl border cursor-pointer transition-all group ${
                isDarkMode ? 'bg-stone-800 border-stone-700 hover:bg-red-900/20 hover:border-red-900' : 'bg-stone-100 border-stone-200 hover:bg-red-50 hover:border-red-200'
              }`}>
                <p className={`text-[10px] font-mono uppercase mb-2 ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>Mestre</p>
                <div className="flex items-center gap-3">
                  <img src={mentor.image} className={`w-10 h-10 rounded-full object-contain ${isDarkMode ? 'bg-stone-700' : 'bg-stone-200'}`} referrerPolicy="no-referrer" />
                  <p className={`font-serif font-bold group-hover:text-red-600 ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{mentor.name}</p>
                </div>
              </div>
            )}
            {disciples.length > 0 && (
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-stone-800 border-stone-700' : 'bg-stone-100 border-stone-200'}`}>
                <p className={`text-[10px] font-mono uppercase mb-2 ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>Discípulos</p>
                <div className="flex -space-x-2 overflow-hidden">
                  {disciples.map(d => (
                    <img key={d.id} onClick={() => onNavigate(d.id)} src={d.image} className={`inline-block h-8 w-8 rounded-full ring-2 object-contain cursor-pointer hover:scale-110 transition-transform ${isDarkMode ? 'ring-stone-800 bg-stone-700' : 'ring-white bg-stone-200'}`} referrerPolicy="no-referrer" title={d.name} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className={`text-xs font-mono uppercase tracking-widest border-b pb-2 ${isDarkMode ? 'text-stone-500 border-stone-700' : 'text-stone-400 border-stone-200'}`}>Descrição do Alvo</h4>
            <p className={`text-lg font-serif italic leading-relaxed ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
              {ninja.description}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className={`text-xs font-mono uppercase tracking-widest border-b pb-2 flex items-center gap-2 ${isDarkMode ? 'text-stone-500 border-stone-700' : 'text-stone-400 border-stone-200'}`}>
              <Zap size={14} /> Principais Jutsus
            </h4>
            <div className="flex flex-wrap gap-2">
              {ninja.jutsus.map((jutsu, idx) => (
                <span 
                  key={idx}
                  className={`px-3 py-1.5 rounded-lg text-sm font-serif border shadow-sm ${
                    isDarkMode ? 'bg-stone-800 text-stone-200 border-stone-700' : 'bg-stone-800 text-stone-100 border-stone-700'
                  }`}
                >
                  {jutsu}
                </span>
              ))}
            </div>
          </div>

          <div className={`space-y-6 p-6 rounded-2xl border ${isDarkMode ? 'bg-stone-800/50 border-stone-700' : 'bg-stone-50 border-stone-200'}`}>
            <h4 className={`text-xs font-mono uppercase tracking-widest ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>Capacidades de Combate</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <StatBar label="Ninjutsu" value={ninja.stats.ninjutsu} color="bg-red-600" />
              <StatBar label="Taijutsu" value={ninja.stats.taijutsu} color="bg-orange-500" />
              <StatBar label="Genjutsu" value={ninja.stats.genjutsu} color="bg-indigo-600" />
              <StatBar label="Força" value={ninja.stats.strength} color={isDarkMode ? 'bg-stone-600' : 'bg-stone-800'} />
              <StatBar label="Inteligência" value={ninja.stats.intelligence} color="bg-emerald-600" />
              <StatBar label="Velocidade" value={ninja.stats.speed} color="bg-yellow-500" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const ninjas = useMemo(() => {
    const villageOrder: Record<Village, number> = {
      'Konoha': 1,
      'Suna': 2,
      'Kumo': 3,
      'Kiri': 4,
      'Iwa': 5,
      'Akatsuki': 6,
      'Oto': 7,
      'Taki': 8,
      'Desconhecida': 9
    };

    return NINJAS.map(ninja => {
      const wrapProxy = (url: string) => {
        if (!url) return url;
        // Se for uma imagem da Wikia e não tiver o proxy, adiciona
        if (url.includes('static.wikia.nocookie.net') && !url.includes('weserv.nl')) {
          return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
        }
        return url;
      };
      
      return {
        ...ninja,
        image: wrapProxy(ninja.image)
      };
    }).sort((a, b) => {
      // Ordenar por Vila
      const villageDiff = (villageOrder[a.village] || 99) - (villageOrder[b.village] || 99);
      if (villageDiff !== 0) return villageDiff;

      // Ordenar por Rank (Kage primeiro)
      if (a.rank === 'Kage' && b.rank !== 'Kage') return -1;
      if (a.rank !== 'Kage' && b.rank === 'Kage') return 1;

      // Ordenar por ID para manter consistência
      return a.id - b.id;
    });
  }, []);

  const [search, setSearch] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeVillage, setActiveVillage] = useState<Village | 'All'>('All');
  const [activeRarity, setActiveRarity] = useState<Rarity | 'All'>('All');
  const [selectedNinjaId, setSelectedNinjaId] = useState<number | null>(null);
  const [comparisonIds, setComparisonIds] = useState<number[]>([]);
  const [isChidoriMode, setIsChidoriMode] = useState(false);
  const [typedKeys, setTypedKeys] = useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newTyped = (typedKeys + e.key).slice(-7);
      setTypedKeys(newTyped);
      if (newTyped.toLowerCase() === 'chidori') {
        setIsChidoriMode(true);
        setTimeout(() => setIsChidoriMode(false), 5000);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typedKeys]);

  const filteredNinjas = useMemo(() => {
    return ninjas.filter(ninja => {
      const matchesSearch = ninja.name.toLowerCase().includes(search.toLowerCase());
      const matchesVillage = activeVillage === 'All' || ninja.village === activeVillage;
      const matchesRarity = activeRarity === 'All' || ninja.rarity === activeRarity;
      return matchesSearch && matchesVillage && matchesRarity;
    });
  }, [ninjas, search, activeVillage, activeRarity]);

  const selectedNinja = useMemo(() => 
    ninjas.find(n => n.id === selectedNinjaId), 
  [ninjas, selectedNinjaId]);

  const comparisonNinjas = useMemo(() => 
    ninjas.filter(n => comparisonIds.includes(n.id)),
  [ninjas, comparisonIds]);

  const toggleComparison = (id: number) => {
    setComparisonIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-red-200 selection:text-red-900 ${
      isChidoriMode ? 'bg-blue-900 invert' : isDarkMode ? 'bg-stone-950 text-stone-100' : 'bg-[#f5f2ed] text-stone-900'
    }`}>
      {/* Background Texture */}
      <div className={`fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] ${isDarkMode ? 'invert' : ''}`} />

      {/* Header */}
      <header className="relative pt-12 pb-8 px-4 max-w-7xl mx-auto text-center space-y-8">
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-2xl transition-all shadow-lg border-2 ${
              isDarkMode 
                ? 'bg-stone-800 border-stone-700 text-yellow-500 hover:bg-stone-700' 
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className={`text-6xl md:text-8xl font-serif font-black uppercase tracking-tighter flex items-center justify-center gap-4 ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>
            <span className="text-red-700">Ninja</span>dex
          </h1>
          <p className={`font-mono text-xs uppercase tracking-[0.4em] ${isDarkMode ? 'text-stone-500' : 'text-stone-500'}`}>Livro Bingo • Registro Oficial de Shinobis</p>
        </motion.div>

        {/* Search & Filter Section */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="relative group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-stone-600 group-focus-within:text-red-500' : 'text-stone-400 group-focus-within:text-red-600'}`} size={20} />
            <input
              type="text"
              placeholder="Buscar ninja pelo nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl shadow-sm focus:ring-4 outline-none transition-all font-serif text-lg ${
                isDarkMode 
                  ? 'bg-stone-900 border-stone-800 text-stone-100 focus:ring-red-900/20 focus:border-red-900' 
                  : 'bg-white border-stone-200 text-stone-900 focus:ring-red-100 focus:border-red-600'
              }`}
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => setActiveVillage('All')} 
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border-2 ${
                  activeVillage === 'All' 
                    ? isDarkMode ? 'bg-stone-100 text-stone-900 border-stone-100' : 'bg-stone-800 text-white border-stone-800' 
                    : isDarkMode ? 'bg-stone-900 text-stone-500 border-stone-800 hover:border-stone-700' : 'bg-white text-stone-500 border-stone-200'
                }`}
              >
                Todos
              </button>
              {VILLAGES.map((v) => (
                <button 
                  key={v.id} 
                  onClick={() => setActiveVillage(v.id)} 
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border-2 ${
                    activeVillage === v.id 
                      ? `${v.color} text-white border-transparent` 
                      : isDarkMode ? 'bg-stone-900 text-stone-500 border-stone-800 hover:border-stone-700' : 'bg-white text-stone-500 border-stone-200'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => setActiveRarity('All')} 
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  activeRarity === 'All' 
                    ? 'bg-red-600 text-white border-red-600' 
                    : isDarkMode ? 'bg-stone-900 text-stone-600 border-stone-800' : 'bg-white text-stone-400 border-stone-200'
                }`}
              >
                Ranks
              </button>
              {RARITIES.map((rarity) => (
                <button 
                  key={rarity} 
                  onClick={() => setActiveRarity(rarity)} 
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    activeRarity === rarity 
                      ? isDarkMode ? 'bg-stone-100 text-stone-900 border-stone-100' : 'bg-stone-800 text-white border-stone-800' 
                      : isDarkMode ? 'bg-stone-900 text-stone-600 border-stone-800 hover:border-stone-700' : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  Rank {rarity}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 pb-24">
        <AnimatePresence mode="popLayout">
          {filteredNinjas.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredNinjas.map(ninja => (
                <NinjaCard 
                  key={ninja.id} 
                  ninja={ninja} 
                  onClick={() => setSelectedNinjaId(ninja.id)}
                  isSelectedForComparison={comparisonIds.includes(ninja.id)}
                  onCompareToggle={(e) => {
                    e.stopPropagation();
                    toggleComparison(ninja.id);
                  }}
                  isDarkMode={isDarkMode}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center space-y-4">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${isDarkMode ? 'bg-stone-900 text-stone-800' : 'bg-stone-100 text-stone-300'}`}><Info size={40} /></div>
              <h2 className={`text-2xl font-serif font-bold ${isDarkMode ? 'text-stone-700' : 'text-stone-400'}`}>Nenhum registro encontrado no Livro Bingo</h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {selectedNinja && (
            <ExpandedNinjaCard 
              ninja={selectedNinja} 
              onClose={() => setSelectedNinjaId(null)} 
              onNavigate={(id) => setSelectedNinjaId(id)}
              allNinjas={ninjas}
              isDarkMode={isDarkMode}
            />
          )}
          {comparisonNinjas.length === 2 && (
            <SharinganMode 
              ninjas={comparisonNinjas} 
              onClose={() => setComparisonIds([])} 
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={`border-t py-12 transition-colors ${isDarkMode ? 'border-stone-800 bg-stone-900/50' : 'border-stone-200 bg-stone-50/50'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className={`flex justify-center gap-6 ${isDarkMode ? 'text-stone-700' : 'text-stone-400'}`}>
            <Users size={20} />
            <ArrowRightLeft size={20} />
            <Eye size={20} />
          </div>
          <p className={`text-[10px] font-mono uppercase tracking-[0.3em] ${isDarkMode ? 'text-stone-600' : 'text-stone-400'}`}>Propriedade da Aliança Shinobi • Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}
