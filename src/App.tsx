/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Shield, Zap, Wind, Flame, Droplets, Mountain, Skull, Star, Info, Users, ArrowRightLeft, Eye, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

import { NINJAS, VILLAGES, ELEMENTS, DOJUTSUS, RARITIES } from './data/ninjas';
import { Ninja, Village, Element, Dojutsu, Rarity } from './types';
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

const DojutsuBadge: React.FC<{ dojutsu: Dojutsu }> = ({ dojutsu }) => {
  const colors: Record<Dojutsu, string> = {
    'Sharingan': 'bg-red-600 text-white border-red-700',
    'Mangekyō Sharingan': 'bg-red-900 text-white border-red-950',
    'Rinnegan': 'bg-purple-600 text-white border-purple-700',
    'Byakugan': 'bg-blue-100 text-blue-900 border-blue-200',
    'Rinne-Sharingan': 'bg-rose-800 text-white border-rose-950',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black border uppercase tracking-widest shadow-sm ${colors[dojutsu]}`}>
      <Eye size={10} />
      {dojutsu}
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
            {/* Schema SEO para Personagem (Repetido caso abra a página com ele aberto, ajuda a forçar a leitura do Modal) */}
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
            <img 
              src={ninja.image} 
              alt={`Avatar oficial reduzido do personagem ${ninja.name} de Naruto`}
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
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex flex-col gap-2">
          {ninja.dojutsus && (
            <div className="flex flex-wrap gap-1 justify-start">
              {ninja.dojutsus.map(d => <DojutsuBadge key={d} dojutsu={d} />)}
            </div>
          )}
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

const SharinganMode: React.FC<{ ninjas: Ninja[]; onClose: () => void; isDarkMode: boolean }> = ({ ninjas, onClose, isDarkMode }) => {
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className={`absolute inset-0 ${isDarkMode ? 'bg-black/95' : 'bg-stone-900/60 backdrop-blur-sm'}`} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto border-4 rounded-3xl p-8 flex flex-col md:flex-row gap-8 transition-colors ${
        isDarkMode 
          ? 'bg-[#1a1a1a] border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.3)]' 
          : 'bg-[#fdfcf0] border-stone-800 shadow-2xl'
      }`}>
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="flex justify-between w-full">
            <div className="text-center space-y-2">
              <img src={ninjas[0].image} alt={`Comparação: ${ninjas[0].name}`} loading="lazy" className={`w-24 h-24 object-contain rounded-full border-2 border-red-600 ${isDarkMode ? 'bg-stone-800' : 'bg-stone-100'}`} referrerPolicy="no-referrer" />
              <p className="text-red-600 font-serif font-bold">{ninjas[0].name}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Eye className="text-red-600 animate-pulse" size={48} />
              <p className="text-red-600 font-mono text-[10px] uppercase tracking-widest">Modo Sharingan</p>
            </div>
            <div className="text-center space-y-2">
              <img src={ninjas[1].image} alt={`Comparação: ${ninjas[1].name}`} loading="lazy" className={`w-24 h-24 object-contain rounded-full border-2 border-blue-600 ${isDarkMode ? 'bg-stone-800' : 'bg-stone-100'}`} referrerPolicy="no-referrer" />
              <p className="text-blue-600 font-serif font-bold">{ninjas[1].name}</p>
            </div>
          </div>
          
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke={isDarkMode ? "#333" : "#ccc"} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? '#666' : '#444', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name={ninjas[0].name} dataKey="A" stroke="#dc2626" fill="#dc2626" fillOpacity={0.5} />
                <Radar name={ninjas[1].name} dataKey="B" stroke="#2563eb" fill="#2563eb" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="w-full md:w-80 space-y-6">
          <h3 className={`text-2xl font-serif font-black uppercase border-b pb-2 transition-colors ${isDarkMode ? 'text-white border-red-600' : 'text-stone-900 border-stone-800'}`}>Análise de Combate</h3>
          <div className="space-y-4">
            {data.map(stat => (
              <div key={stat.subject} className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono uppercase">
                  <span className={isDarkMode ? 'text-stone-400' : 'text-stone-500'}>{stat.subject}</span>
                  <div className="flex gap-2">
                    <span className="text-red-600">{stat.A}</span>
                    <span className={isDarkMode ? 'text-stone-600' : 'text-stone-400'}>vs</span>
                    <span className="text-blue-600">{stat.B}</span>
                  </div>
                </div>
                <div className={`h-1 rounded-full overflow-hidden flex ${isDarkMode ? 'bg-stone-800' : 'bg-stone-200'}`}>
                  <div style={{ width: `${(stat.A / (stat.A + stat.B)) * 100}%` }} className="h-full bg-red-600" />
                  <div style={{ width: `${(stat.B / (stat.A + stat.B)) * 100}%` }} className="h-full bg-blue-600" />
                </div>
              </div>
            ))}
          </div>
          <button onClick={onClose} className="w-full py-3 bg-red-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20">Fechar Dossiê</button>
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
            <div className="flex flex-wrap gap-2 mb-4">
              {ninja.elements.map(el => (
                <div key={el} className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                  {el === 'Fogo' && <Flame size={12} />}
                  {el === 'Vento' && <Wind size={12} />}
                  {el === 'Relâmpago' && <Zap size={12} />}
                  {el === 'Terra' && <Mountain size={12} />}
                  {el === 'Água' && <Droplets size={12} />}
                  {el === 'Madeira' && <Shield size={12} />}
                  {el === 'Escuridão' && <Skull size={12} />}
                  <span>{el}</span>
                </div>
              ))}
            </div>
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
        <div className={`w-full md:w-3/5 flex-1 p-6 md:p-12 space-y-6 md:space-y-8 overflow-y-auto ${
          isDarkMode 
            ? 'bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950' 
            : 'bg-gradient-to-br from-[#fdfcf0] via-[#f7f5e8] to-[#eaddcf]'
        }`}>
          <div className="flex items-center gap-4 pr-10 md:pr-12">
            <motion.span layoutId={`rank-${ninja.id}`} className={`text-sm font-black px-4 py-1 rounded border-2 ${ninja.rank === 'Kage' ? 'border-red-600 text-red-600' : isDarkMode ? 'border-stone-600 text-stone-400' : 'border-stone-800 text-stone-800'} uppercase`}>
              {ninja.rank}
            </motion.span>
            <div className={`h-px flex-grow ${isDarkMode ? 'bg-stone-700' : 'bg-stone-200'}`} />
            <div className="flex flex-wrap gap-2 justify-end">
              {ninja.dojutsus && ninja.dojutsus.map(d => <DojutsuBadge key={d} dojutsu={d} />)}
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
                    <motion.div key={d.id} title={d.name} whileHover={{ scale: 1.1 }}>
                      <img onClick={() => onNavigate(d.id)} src={d.image} alt={`Ícone de relação do personagem ${d.name}`} loading="lazy" className={`inline-block h-8 w-8 rounded-full ring-2 object-cover cursor-pointer transition-transform ${isDarkMode ? 'ring-stone-800 bg-stone-700' : 'ring-white bg-stone-200'}`} referrerPolicy="no-referrer" />
                    </motion.div>
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
    return NINJAS.map(ninja => {
      const wrapProxy = (url: string) => {
        if (!url) return url;
        
        // Se for uma imagem da Wikia, usa o proxy statically.io que é mais estável para Fandom
        if (url.includes('static.wikia.nocookie.net')) {
          // Remove revisões para pegar a original e evitar problemas de cache
          const cleanUrl = url.split('/revision/')[0];
          return `https://cdn.statically.io/img/${cleanUrl.replace('https://', '')}`;
        }
        
        // Se for GitHub, também podemos usar statically para CDN
        if (url.includes('raw.githubusercontent.com')) {
          return url.replace('raw.githubusercontent.com', 'cdn.statically.io/gh').replace('/master/', '/');
        }
        
        // Se for MyAnimeList, usa i0.wp.com (Jetpack) para evitar bloqueios de hotlink
        if (url.includes('myanimelist.net')) {
          return `https://i0.wp.com/${url.replace('https://', '')}`;
        }
        
        return url;
      };
      
      return {
        ...ninja,
        image: wrapProxy(ninja.image)
      };
    });
  }, []);

  const [search, setSearch] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeVillage, setActiveVillage] = useState<Village | 'All'>('All');
  const [activeDojutsu, setActiveDojutsu] = useState<Dojutsu | 'All'>('All');
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
      const matchesDojutsu = activeDojutsu === 'All' || (ninja.dojutsus && ninja.dojutsus.includes(activeDojutsu));
      return matchesSearch && matchesVillage && matchesRarity && matchesDojutsu;
    });
  }, [ninjas, search, activeVillage, activeRarity, activeDojutsu]);

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
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl shadow-sm focus:ring-4 outline-none transition-all font-serif text-lg ${
                isDarkMode 
                  ? 'bg-stone-900 border-stone-800 text-stone-100 focus:ring-red-900/20 focus:border-red-900' 
                  : 'bg-white border-stone-200 text-stone-900 focus:ring-red-100 focus:border-red-600'
              }`}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
                  isDarkMode ? 'text-stone-500 hover:text-stone-300 hover:bg-stone-800' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
                }`}
                title="Limpar busca"
              >
                <X size={18} />
              </button>
            )}
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

            <div className="flex flex-wrap justify-center gap-2">
              <button 
                onClick={() => setActiveDojutsu('All')} 
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  activeDojutsu === 'All' 
                    ? 'bg-purple-600 text-white border-purple-600' 
                    : isDarkMode ? 'bg-stone-900 text-stone-600 border-stone-800' : 'bg-white text-stone-400 border-stone-200'
                }`}
              >
                Dōjutsu
              </button>
              {DOJUTSUS.map((dojutsu) => (
                <button 
                  key={dojutsu} 
                  onClick={() => setActiveDojutsu(dojutsu)} 
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    activeDojutsu === dojutsu 
                      ? isDarkMode ? 'bg-purple-100 text-purple-900 border-purple-100' : 'bg-purple-800 text-white border-purple-800' 
                      : isDarkMode ? 'bg-stone-900 text-stone-600 border-stone-800 hover:border-stone-700' : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {dojutsu}
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
              isDarkMode={isDarkMode}
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
          <p className={`text-[10px] font-mono uppercase tracking-[0.3em] ${isDarkMode ? 'text-stone-500' : 'text-stone-500'}`}>
            Feito por Leonardo Debs com uso de IA - Google IA Studio 🇧🇷
          </p>
        </div>
      </footer>
    </div>
  );
}
