import React, { useState, memo, useCallback, useMemo } from 'react';
import { Pokemon, Rarity } from '../types';
import { RARITY_LABELS } from '@shared/constants';
import { POKEDEX } from '@shared/constants';
import PokemonCard from './PokemonCard';
import { showNotification } from '../utils/NotificationUtils';

// 稀有度升级映射
const RARITY_UPGRADE_MAP: Record<Rarity, Rarity | null> = {
  Common: 'Uncommon',
  Uncommon: 'Rare',
  Rare: 'Epic',
  Epic: 'Legendary',
  Legendary: null // 传说级无法再进阶
};

// 获取随机宝可梦（基于目标稀有度）
const getRandomPokemonByRarity = (targetRarity: Rarity): Pokemon => {
  // 从 POKEDEX 中筛选指定稀有度的宝可梦
  const availablePokemon = POKEDEX.filter(poke => poke.rarity === targetRarity);
  
  if (availablePokemon.length === 0) {
    // 如果没有找到指定稀有度的宝可梦，返回一个默认的
    return {
      id: Math.random().toString(36).substr(2, 9),
      pokedexId: 1,
      name: '未知宝可梦',
      types: ['Normal'],
      rarity: targetRarity,
      stars: 1,
      baseHp: 50,
      baseAtk: 50,
      baseDef: 50,
      baseSpeed: 50,
      baseSpAtk: 50,
      level: 1,
      exp: 0,
      equipment: {}
    };
  }
  
  // 随机选择一个宝可梦
  const randomPoke = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    pokedexId: randomPoke.id,
    name: randomPoke.name,
    types: randomPoke.types,
    rarity: randomPoke.rarity,
    stars: 1,
    baseHp: randomPoke.baseStats.hp,
    baseAtk: randomPoke.baseStats.atk,
    baseDef: randomPoke.baseStats.def,
    baseSpeed: 50, // 默认速度值
    baseSpAtk: 50, // 默认特攻值
    level: 1,
    exp: 0,
    equipment: {}
  };
};

interface AdvanceModuleProps {
  inventory: Pokemon[];
  onAdvance: (selectedIds: string[], newPokemon: Pokemon) => void;
}

const AdvanceModule: React.FC<AdvanceModuleProps> = memo(({ inventory, onAdvance }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'rarity' | 'level' | 'stars'>('rarity');

  // 一键选择稀有度最低的8个相同稀有度宝可梦
  const autoSelectLowestRarity = useCallback(() => {
    // 按稀有度分组
    const rarityGroups: Record<Rarity, Pokemon[]> = {
      Common: [],
      Uncommon: [],
      Rare: [],
      Epic: [],
      Legendary: []
    };
    
    inventory.forEach(poke => {
      rarityGroups[poke.rarity].push(poke);
    });
    
    // 按稀有度权重从低到高排序（Common -> Legendary）
    const rarityOrder: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    
    // 找到第一个数量 >= 8 的稀有度组
    for (const rarity of rarityOrder) {
      const group = rarityGroups[rarity];
      if (group.length >= 8) {
        // 从该组中选择前8个（按星级排序，优先选择低星级的）
        const sortedGroup = [...group].sort((a, b) => a.stars - b.stars);
        const selectedIds = sortedGroup.slice(0, 8).map(poke => poke.id);
        setSelected(selectedIds);
        return;
      }
    }
  }, [inventory]);

  const toggle = useCallback((id: string) => {
    if (selected.includes(id)) {
      setSelected(prev => prev.filter(x => x !== id));
    } else if (selected.length < 8) {
      setSelected(prev => [...prev, id]);
    }
  }, [selected]);

  // 检查是否可以选择8只同稀有度同星级的宝可梦
  const canSelectForAdvance = useCallback((poke: Pokemon) => {
    if (selected.includes(poke.id)) return true;
    if (selected.length >= 8) return false;
    
    // 如果还没有选择任何宝可梦，可以选任意
    if (selected.length === 0) return true;
    
    // 检查是否与已选宝可梦同稀有度和同星级
    const firstSelected = inventory.find(p => p.id === selected[0]);
    return firstSelected && poke.rarity === firstSelected.rarity && poke.stars === firstSelected.stars;
  }, [selected, inventory]);

  // 检查是否可以进阶
  const canAdvance = useCallback(() => {
    if (selected.length !== 8) return false;
    
    const firstSelected = inventory.find(p => p.id === selected[0]);
    if (!firstSelected) return false;
    
    // 检查所有选中的宝可梦是否同稀有度和同星级
    const allSameRarityAndStars = selected.every(id => {
      const poke = inventory.find(p => p.id === id);
      return poke && poke.rarity === firstSelected.rarity && poke.stars === firstSelected.stars;
    });
    
    if (!allSameRarityAndStars) return false;
    
    // 检查是否有更高稀有度可以进阶
    return RARITY_UPGRADE_MAP[firstSelected.rarity] !== null;
  }, [selected, inventory]);

  const handleAdvance = useCallback(() => {
    if (!canAdvance()) return;
    
    const firstSelected = inventory.find(p => p.id === selected[0]);
    if (!firstSelected) return;
    
    const targetRarity = RARITY_UPGRADE_MAP[firstSelected.rarity];
    if (!targetRarity) return;
    
    const newPokemon = getRandomPokemonByRarity(targetRarity);
    onAdvance(selected, newPokemon);
    setSelected([]);
  }, [selected, inventory, onAdvance, canAdvance]);

  // 排序函数
  const sortPokemon = useCallback((pokes: Pokemon[]): Pokemon[] => {
    return [...pokes].sort((a, b) => {
      switch (sortOption) {
        case 'rarity':
          const rarityOrder: Record<Rarity, number> = {
            Common: 1, Uncommon: 2, Rare: 3, Epic: 4, Legendary: 5
          };
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        case 'level':
          return b.level - a.level;
        case 'stars':
          return b.stars - a.stars;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [sortOption]);

  const sortedInventory = useMemo(() => sortPokemon(inventory), [inventory, sortPokemon]);

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-black text-orange-400 italic">进阶实验室</h2>
        <p className="text-gray-400 mt-2">消耗 8 只同稀有度同星级的宝可梦进行进阶，获得高一级稀有度的随机宝可梦</p>
        
        {/* 排序选项 */}
        <div className="mt-4 flex justify-center gap-4">
          <button 
            onClick={() => setSortOption('rarity')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              sortOption === 'rarity' 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            按稀有度
          </button>
          <button 
            onClick={() => setSortOption('level')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              sortOption === 'level' 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            按等级
          </button>
          <button 
            onClick={() => setSortOption('stars')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              sortOption === 'stars' 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            按星级
          </button>
        </div>
      </div>
      
      {/* 进阶区域 */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 p-12 bg-black/40 rounded-[3rem] border border-orange-500/20 shadow-2xl">
        <div className="flex flex-wrap gap-2 justify-center">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-32 h-44 border-2 border-dashed border-orange-500/30 rounded-2xl flex items-center justify-center bg-orange-900/10">
              {selected[i] ? (
                <PokemonCard 
                  pokemon={inventory.find(p => p.id === selected[i])!} 
                  size="sm" 
                  onClick={() => toggle(selected[i])} 
                />
              ) : (
                <span className="text-2xl opacity-30">✨</span>
              )}
            </div>
          ))}
        </div>
        <div className="text-4xl">➡️</div>
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleAdvance} 
            disabled={!canAdvance()} 
            className="w-40 h-40 bg-orange-600 hover:bg-orange-500 disabled:opacity-30 rounded-full font-black text-xl shadow-2xl transition-all active:scale-95"
          >
            开始进阶
          </button>
          <button 
            onClick={autoSelectLowestRarity}
            className="w-40 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-bold transition-all"
          >
            一键选择
          </button>
          <div className="text-center text-sm text-gray-400 min-h-6">
            {selected.length > 0 ? (
              <>
                已选择 {selected.length}/8 只
              </>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
        </div>
      </div>
      
      {/* 宝可梦列表 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sortedInventory.map(poke => (
          <div key={poke.id} className="relative">
            <PokemonCard 
              pokemon={poke} 
              size="sm" 
              selected={selected.includes(poke.id)}
              onClick={() => canSelectForAdvance(poke) && toggle(poke.id)}
              className={canSelectForAdvance(poke) ? 'hover:scale-105 cursor-pointer' : 'opacity-30 cursor-not-allowed'}
            />
            {/* 右上角选中图标 - 相对于PokemonCard定位 */}
            {selected.includes(poke.id) && (
              <div 
                className="absolute top-0 right-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer z-20 shadow-lg -translate-y-1 translate-x-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(poke.id);
                }}
              >
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* 进阶规则说明 */}
      <div className="bg-black/20 p-6 rounded-3xl border border-orange-500/20 max-w-4xl mx-auto">
        <h3 className="font-bold text-orange-400 mb-3 text-center">进阶规则</h3>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>• 消耗 <span className="text-orange-400 font-bold">8只同稀有度同星级</span> 的宝可梦</li>
          <li>• 进阶后获得 <span className="text-orange-400 font-bold">高一级稀有度</span> 的随机宝可梦</li>
          <li>• 稀有度顺序：普通 → 优秀 → 稀有 → 史诗 → 传说</li>
          <li>• 传说级宝可梦 <span className="text-red-400">无法再进阶</span></li>
          <li>• 进阶后的宝可梦为 <span className="text-yellow-400">1星1级</span> 状态</li>
        </ul>
      </div>
    </div>
  );
});

export default AdvanceModule;
