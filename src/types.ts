export type Village = 'Konoha' | 'Suna' | 'Kiri' | 'Kumo' | 'Iwa' | 'Akatsuki' | 'Oto' | 'Taki' | 'Desconhecida';
export type Rank = 'Genin' | 'Chunin' | 'Jonin' | 'Kage' | 'Nukenin' | 'Sannin';
export type Element = 'Fogo' | 'Vento' | 'Relâmpago' | 'Terra' | 'Água' | 'Madeira' | 'Escuridão';
export type Dojutsu = 'Sharingan' | 'Mangekyō Sharingan' | 'Rinnegan' | 'Byakugan' | 'Rinne-Sharingan';
export type Rarity = 'S' | 'A' | 'B' | 'C';

export interface Ninja {
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
  rarity: Rarity;
  mentorId?: number;
  jutsus: string[];
  dojutsus?: Dojutsu[];
}
