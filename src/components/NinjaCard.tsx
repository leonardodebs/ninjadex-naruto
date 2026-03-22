import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, Zap, Wind, Flame, Droplets, Mountain, Skull, Star, 
  Trophy, Sword, Brain, Activity, User, Users 
} from 'lucide-react';
import { Ninja, Element } from '../types';

interface NinjaCardProps {
  ninja: Ninja;
  globalRank: number;
  mentorName?: string;
  disciples?: string[];
  onClick?: () => void;
}

// Utility functions
const calculatePowerScore = (stats: Ninja['stats']) => {
  const values = Object.values(stats);
  const sum = values.reduce((acc, curr) => acc + curr, 0);
  return (sum / values.length).toFixed(1);
};

const getShinobiClass = (score: number) => {
  if (score >= 95) return { label: 'Divindade Shinobi', color: 'text-yellow-400', border: 'border-yellow-400', bg: 'bg-yellow-400/10' };
  if (score >= 90) return { label: 'Lendário', color: 'text-red-400', border: 'border-red-400', bg: 'bg-red-400/10' };
  if (score >= 80) return { label: 'Elite', color: 'text-purple-400', border: 'border-purple-400', bg: 'bg-purple-400/10' };
  if (score >= 70) return { label: 'Jounin', color: 'text-blue-400', border: 'border-blue-400', bg: 'bg-blue-400/10' };
  return { label: 'Novato', color: 'text-gray-400', border: 'border-gray-400', bg: 'bg-gray-400/10' };
};

const getStrategicProfile = (stats: Ninja['stats']) => {
  const maxStat = Object.entries(stats).reduce((a, b) => a[1] > b[1] ? a : b);
  
  switch (maxStat[0]) {
    case 'intelligence': return 'Mestre Estratégista';
    case 'strength': return 'Combatente Brutal';
    case 'speed': return 'Assassino Relâmpago';
    case 'ninjutsu': return 'Mestre de Jutsus';
    case 'taijutsu': return 'Especialista Marcial';
    case 'genjutsu': return 'Ilusionista Supremo';
    default: return 'Equilibrado';
  }
};

const getElementIcon = (element: Element) => {
  switch (element) {
    case 'Fogo': return <Flame className="w-4 h-4 text-red-500" />;
    case 'Vento': return <Wind className="w-4 h-4 text-green-400" />;
    case 'Relâmpago': return <Zap className="w-4 h-4 text-yellow-400" />;
    case 'Terra': return <Mountain className="w-4 h-4 text-orange-700" />;
    case 'Água': return <Droplets className="w-4 h-4 text-blue-500" />;
    case 'Escuridão': return <Skull className="w-4 h-4 text-purple-900" />;
    default: return <Shield className="w-4 h-4 text-gray-400" />;
  }
};

const StatBar = ({ label, value, color, isDominant }: { label: string; value: number; color: string; isDominant: boolean }) => (
  <div className="mb-2 group">
    <div className="flex justify-between items-center mb-1">
      <span className={`text-[10px] uppercase tracking-wider font-semibold ${isDominant ? 'text-yellow-400 flex items-center gap-1' : 'text-gray-400'}`}>
        {label}
        {isDominant && <Star className="w-3 h-3 fill-yellow-400" />}
      </span>
      <span className="text-xs font-mono text-gray-300">{value}</span>
    </div>
    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden relative">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color} relative`}
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse" />
      </motion.div>
    </div>
  </div>
);

export const NinjaCard: React.FC<NinjaCardProps> = ({ ninja, globalRank, mentorName, disciples, onClick }) => {
  const powerScore = parseFloat(calculatePowerScore(ninja.stats));
  const classification = getShinobiClass(powerScore);
  const strategicProfile = getStrategicProfile(ninja.stats);
  
  const dominantStat = Object.entries(ninja.stats).reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="w-full max-w-4xl mx-auto bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-yellow-500/10 hover:border-gray-700 transition-all cursor-pointer group relative"
    >
      {/* SEO: JSON-LD Schema para classificar como Personagem Fictício no Google */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FictionalCharacter",
        "name": ninja.name,
        "description": ninja.description,
        "image": `https://ninjadex-naruto.vercel.app${ninja.image}`,
        "memberOf": {
          "@type": "Organization",
          "name": ninja.village
        },
        "knowsAbout": ninja.jutsus
      })}} />

      {/* Background Glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r from-transparent via-${classification.color.split('-')[1]}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />

      <div className="flex flex-col md:flex-row h-full relative z-10">
        
        {/* LEFT COLUMN (40%) */}
        <div className="w-full md:w-2/5 relative h-[400px] md:h-auto overflow-hidden bg-gray-950">
          <motion.img 
            src={ninja.image} 
            alt={`Foto oficial do personagem ${ninja.name} de Naruto`}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://picsum.photos/seed/${ninja.name.replace(/\s/g, '')}/400/600`;
            }}
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/40" />
          <div className={`absolute inset-0 border-2 ${classification.border} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

          {/* Rank Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
              <Trophy className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">{ninja.rank}</span>
            </div>
          </div>

          {/* Chakra Nature */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
            {ninja.elements.map((el, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10" title={el}>
                {getElementIcon(el)}
                <span className="text-[8px] font-bold text-white uppercase tracking-tighter">{el}</span>
              </div>
            ))}
          </div>

          {/* Strategic Profile Seal */}
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <div className="inline-block px-4 py-1 bg-black/80 backdrop-blur-md border-y border-white/10">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono">
                {strategicProfile}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (60%) */}
        <div className="w-full md:w-3/5 p-6 md:p-8 bg-gradient-to-br from-gray-900 to-gray-950 relative">
          {/* Texture */}
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          {/* Header */}
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-1 font-sans">{ninja.name}</h2>
              <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${classification.border} ${classification.color} ${classification.bg}`}>
                {classification.label}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Power Score</div>
              <div className="text-4xl font-mono font-bold text-white flex items-center justify-end gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                {powerScore}
              </div>
              <div className="text-[10px] text-gray-600 font-mono">Rank Global #{globalRank}</div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
            {mentorName && (
              <div className="bg-gray-800/50 p-2 rounded border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase flex items-center gap-1 mb-1">
                  <User className="w-3 h-3" /> Mestre
                </div>
                <div className="text-sm text-gray-300 font-medium truncate">{mentorName}</div>
              </div>
            )}
            {disciples && disciples.length > 0 && (
              <div className="bg-gray-800/50 p-2 rounded border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase flex items-center gap-1 mb-1">
                  <Users className="w-3 h-3" /> Discípulos
                </div>
                <div className="text-sm text-gray-300 font-medium truncate">{disciples.join(', ')}</div>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-2 relative z-10">
            {ninja.description}
          </p>

          {/* Jutsus */}
          <div className="mb-6 relative z-10">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Jutsus Principais
            </div>
            <div className="flex flex-wrap gap-2">
              {ninja.jutsus.slice(0, 3).map((jutsu, i) => (
                <span 
                  key={i} 
                  className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 rounded border border-gray-700 transition-colors cursor-help"
                  title="Técnica Especial"
                >
                  {jutsu}
                </span>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 relative z-10">
            <StatBar label="Ninjutsu" value={ninja.stats.ninjutsu} color="bg-blue-500" isDominant={dominantStat === 'ninjutsu'} />
            <StatBar label="Taijutsu" value={ninja.stats.taijutsu} color="bg-orange-500" isDominant={dominantStat === 'taijutsu'} />
            <StatBar label="Genjutsu" value={ninja.stats.genjutsu} color="bg-purple-500" isDominant={dominantStat === 'genjutsu'} />
            <StatBar label="Inteligência" value={ninja.stats.intelligence} color="bg-emerald-500" isDominant={dominantStat === 'intelligence'} />
            <StatBar label="Força" value={ninja.stats.strength} color="bg-red-500" isDominant={dominantStat === 'strength'} />
            <StatBar label="Velocidade" value={ninja.stats.speed} color="bg-yellow-500" isDominant={dominantStat === 'speed'} />
          </div>

        </div>
      </div>
    </motion.div>
  );
};
