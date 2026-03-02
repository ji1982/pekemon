import React, { useState, memo, useMemo, useCallback } from 'react';
import { Pokemon } from '../types';
import PokemonCard from './PokemonCard';
import { RARITY_WEIGHT } from '../utils/gameUtils';
import { showNotification } from '../utils/NotificationUtils';

interface SynthesisModuleProps {
  inventory: Pokemon[];
  onSynthesize: (ids: string[]) => void;
}

export const SynthesisModule: React.FC<SynthesisModuleProps> = memo(({ inventory, onSynthesize }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'rarity' | 'level' | 'stars'>('rarity');

  const toggle = useCallback((id: string) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : p.length < 3 ? [...p, id] : p), []);

  // 快速选择相同宝可梦的功能
  const quickSelectSamePokemon = useCallback(() => {
    // 找到所有可以升星的宝可梦组合
    const groups: Record<string, Pokemon[]> = {};
    
    inventory.forEach(poke => {
      const key = `${poke.pokedexId}-${poke.stars}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(poke);
    });
    
    // 找到至少有3只的组合
    const candidates = Object.entries(groups)
      .filter(([_, group]) => group.length >= 3)
      .map(([key, group]) => ({ key, group }));
    
    if (candidates.length === 0) {
      showNotification('没有找到3只星级相同的同名宝可梦', 'info');
      return;
    }
    
    // 选择稀有度最低、等级最低、星级最低的组合
    const bestCandidate = candidates.reduce((best, current) => {
      const bestPoke = best.group[0];
      const currentPoke = current.group[0];
      
      // 按稀有度比较（数值越小稀有度越低）
      if (RARITY_WEIGHT[currentPoke.rarity] < RARITY_WEIGHT[bestPoke.rarity]) {
        return current;
      }
      if (RARITY_WEIGHT[currentPoke.rarity] > RARITY_WEIGHT[bestPoke.rarity]) {
        return best;
      }
      
      // 稀有度相同时按等级比较（数值越小等级越低）
      if (currentPoke.level < bestPoke.level) {
        return current;
      }
      if (currentPoke.level > bestPoke.level) {
        return best;
      }
      
      // 等级相同时按星级比较（数值越小星级越低）
      if (currentPoke.stars < bestPoke.stars) {
        return current;
      }
      if (currentPoke.stars > bestPoke.stars) {
        return best;
      }
      
      return best;
    }, candidates[0]);
    
    // 选择前3只
    const selectedIds = bestCandidate.group.slice(0, 3).map(p => p.id);
    setSelected(selectedIds);
  }, [inventory]);

  // 复合排序函数
  const sortPokemon = useCallback((pokes: Pokemon[]): Pokemon[] => {
    return [...pokes].sort((a, b) => {
      switch (sortOption) {
        case 'rarity':
          // 按稀有度排序（Legendary > Epic > Rare > Uncommon > Common）
          return RARITY_WEIGHT[b.rarity] - RARITY_WEIGHT[a.rarity];
        case 'level':
          // 按等级排序（高 → 低）
          return b.level - a.level;
        case 'stars':
          // 按星级排序（高 → 低）
          return b.stars - a.stars;
        default:
          // 按名称排序（字母顺序）
          return a.name.localeCompare(b.name);
      }
    });
  }, [sortOption]);

  const sortedInventory = useMemo(() => sortPokemon(inventory), [inventory, sortPokemon, sortOption]);

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-black text-purple-400 italic">升星实验室</h2>
        <p className="text-gray-400 mt-2">消耗 3 只种类、星级和等级完全相同的宝可梦进行升星</p>
        
        {/* 排序选项 */}
        <div className="mt-4 flex justify-center gap-4">
          <button 
            onClick={() => setSortOption('rarity')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              sortOption === 'rarity' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            按稀有度
          </button>
          <button 
            onClick={() => setSortOption('level')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              sortOption === 'level' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            按等级
          </button>
          <button 
            onClick={() => setSortOption('stars')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              sortOption === 'stars' 
                ? 'bg-purple-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            按星级
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 p-12 bg-black/40 rounded-[3rem] border border-purple-500/20 shadow-2xl">
        <div className="flex gap-4">
          {[0,1,2].map(i => (
            <div key={i} className="w-40 h-56 border-2 border-dashed border-purple-500/30 rounded-2xl flex items-center justify-center bg-purple-900/10">
              {selected[i] ? <PokemonCard pokemon={inventory.find(p => p.id === selected[i])!} size="sm" onClick={() => toggle(selected[i])} /> : <span className="text-3xl opacity-30">⭐</span>}
            </div>
          ))}
        </div>
        <div className="text-4xl">➡️</div>
        <div className="flex flex-col gap-4">
          <button onClick={() => { onSynthesize(selected); setSelected([]); }} disabled={selected.length !== 3} className="w-32 h-32 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 rounded-full font-black text-xl shadow-2xl transition-all active:scale-95">开始升星</button>
          <button 
            onClick={quickSelectSamePokemon}
            className="w-32 h-12 bg-green-600 hover:bg-green-500 rounded-full font-bold text-sm shadow-lg transition-all"
            title="自动选择3只可升星的宝可梦"
          >
            ⚡ 快速选择
          </button>
        </div>
      </div>
      
      {/* 显示当前排序方式 */}
      <div className="text-center text-sm text-gray-500">
        当前排序: {
          sortOption === 'rarity' ? '稀有度 (SSR → N)' :
          sortOption === 'level' ? '等级 (高 → 低)' :
          '星级 (高 → 低)'
        }
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {sortedInventory.map(p => (
          <div key={p.id} className="relative">
            <PokemonCard 
              pokemon={p} 
              size="sm" 
              selected={selected.includes(p.id)}
              onClick={() => toggle(p.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default SynthesisModule;
