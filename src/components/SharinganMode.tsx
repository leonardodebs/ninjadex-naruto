import React from 'react';
import { motion } from 'motion/react';
import { Eye } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Ninja } from '../types';

/**
 * Modo Sharingan: comparacao de dois ninjas com grafico radar.
 * Isolado neste modulo para ser carregado sob demanda (lazy), tirando
 * o recharts do bundle inicial.
 */
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

export default SharinganMode;
