import React, { useState } from 'react';
import { Pokemon, Rarity } from '../types';
import { POKEDEX, RARITY_WEIGHTS } from '@shared/constants';
import PokemonCard from './PokemonCard';
import GachaEffects from './GachaEffects';

interface GachaSystemProps {
  onDraw: (pokes: Pokemon[]) => void;
  gold: number;
}

const GachaSystem: React.FC<GachaSystemProps> = ({ onDraw, gold }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [results, setResults] = useState<Pokemon[]>([]);
  
  // 使用ref存储最新的onDraw函数
  const onDrawRef = React.useRef(onDraw);
  
  // 当onDraw变化时更新ref
  React.useEffect(() => {
    onDrawRef.current = onDraw;
  }, [onDraw]);

  const generatePokemon = (): Pokemon => {
    const totalWeight = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    let selectedRarity: Rarity = 'Common';
    
    for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
      if (random < weight) { selectedRarity = rarity as Rarity; break; }
      random -= weight;
    }

    const possible = POKEDEX.filter(p => p.rarity === selectedRarity);
    const entry = possible[Math.floor(Math.random() * possible.length)] || POKEDEX[0];

    return {
      id: Math.random().toString(36).substr(2, 9),
      pokedexId: entry.id,
      name: entry.name,
      types: entry.types,
      rarity: entry.rarity,
      stars: 1,
      baseHp: entry.baseStats.hp,
      baseAtk: entry.baseStats.atk,
      baseDef: entry.baseStats.def,
      baseSpeed: 50, // 默认速度
      baseSpAtk: 50, // 默认特攻
      level: 1,
      exp: 0, // 初始经验
      equipment: {}
    };
  };

  const handlePull = (count: number) => {
    if (gold < count * 100) return;
    console.log('🎰 [GachaSystem] 开始抽卡:', { count, gold });
    setIsDrawing(true);
    setResults([]);
    
    if (count === 10) {
      // 十连抽特效
      setTimeout(() => {
        const newPokes = Array.from({ length: count }).map(generatePokemon);
        console.log('🎰 [GachaSystem] 抽卡完成，生成宝可梦:', newPokes.length);
        setResults(newPokes);
        onDrawRef.current(newPokes);
        setIsDrawing(false);
      }, 3000); // 3秒特效时间
    } else {
      // 单抽保持原有逻辑
      setTimeout(() => {
        const newPokes = Array.from({ length: count }).map(generatePokemon);
        console.log('🎰 [GachaSystem] 抽卡完成，生成宝可梦:', newPokes.length);
        setResults(newPokes);
        onDrawRef.current(newPokes);
        setIsDrawing(false);
      }, 1200);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-white italic">召唤祭坛</h2>
        <p className="text-gray-400">寻找那些传说中守护大地的伙伴。</p>
      </div>

      {!isDrawing && results.length === 0 && (
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="bg-[#1c1c3a] p-8 rounded-3xl border border-white/5 flex flex-col items-center w-72 group hover:scale-105 transition-all">
            <div 
              className="w-40 h-56 rounded-xl mb-6 flex items-center justify-center text-4xl shadow-xl bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('/back.jpeg')` }}
            />
            <h3 className="text-xl font-bold mb-2">单次召唤</h3>
            <button onClick={() => handlePull(1)} disabled={gold < 100} className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 rounded-xl font-bold">100 金币</button>
          </div>
          <div className="bg-[#1c1c3a] p-8 rounded-3xl border border-yellow-500/20 flex flex-col items-center w-72 group hover:scale-105 transition-all">
            <div 
              className="w-40 h-56 rounded-xl mb-6 flex items-center justify-center text-4xl shadow-xl bg-cover bg-center bg-no-repeat relative"
              style={{ backgroundImage: `url('/back.jpeg')` }}
            >
              <span className="absolute -top-4 -right-4 bg-red-600 text-[10px] px-2 py-1 rounded-full animate-bounce">必出精品</span>
            </div>
            <h3 className="text-xl font-bold mb-2">十连召唤</h3>
            <button onClick={() => handlePull(10)} disabled={gold < 1000} className="w-full py-3 bg-yellow-600 text-black hover:bg-yellow-500 disabled:bg-gray-700 rounded-xl font-black">1000 金币</button>
          </div>
        </div>
      )}

      {isDrawing && (
        <div className="flex flex-col items-center justify-center min-h-[400px] relative">
          {results.length === 0 ? (
            <>
              <GachaEffects isTenPull={true} />
              <p className="mt-8 text-xl font-bold text-yellow-500 animate-pulse">正在召唤传说中的伙伴...</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 border-4 border-t-yellow-400 border-r-transparent border-b-yellow-600 border-l-transparent rounded-full animate-spin" />
              <p className="mt-6 text-xl font-bold text-yellow-500 animate-pulse">正在沟通异界...</p>
            </>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-8 text-center pb-24 md:pb-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {results.map((p, i) => (
              <div key={p.id}>
                <PokemonCard pokemon={p} size="sm" />
              </div>
            ))}
          </div>
          <button onClick={() => setResults([])} className="px-12 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold">确认</button>
        </div>
      )}
    </div>
  );
};

export default GachaSystem;