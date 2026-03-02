import React, { useState, memo, useCallback, useMemo } from 'react';
import { Pokemon, PokedexEntryStatus, Rarity } from '../types';
import { RARITY_LABELS } from '@shared/constants';
import { POKEDEX } from '@shared/constants';
import PokemonCard from './PokemonCard';

interface PokedexModuleProps {
  pokedexStatus: PokedexEntryStatus[];
  inventory: Pokemon[];
}

const PokedexModule: React.FC<PokedexModuleProps> = memo(({ pokedexStatus, inventory }) => {
  const [filterRarity, setFilterRarity] = useState<Rarity | 'All'>('All');
  const [sortOption, setSortOption] = useState<'id' | 'name' | 'obtained'>('id');

  // 获取图鉴完成度
  const getPokedexCompletion = useCallback(() => {
    // 安全检查：确保pokedexStatus是数组
    if (!Array.isArray(pokedexStatus)) {
      return { obtained: 0, total: POKEDEX.length, percentage: 0 };
    }
    const total = POKEDEX.length;
    const obtained = pokedexStatus.filter(entry => entry.obtained).length;
    return { obtained, total, percentage: Math.round((obtained / total) * 100) };
  }, [pokedexStatus]);

  // 过滤和排序宝可梦
  const filteredAndSortedPokedex = useCallback(() => {
    let filtered = POKEDEX.filter(poke => {
      if (filterRarity === 'All') return true;
      return poke.rarity === filterRarity;
    });

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'id':
          return a.id - b.id;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'obtained':
          const aObtained = pokedexStatus.find(s => s.pokedexId === a.id)?.obtained || false;
          const bObtained = pokedexStatus.find(s => s.pokedexId === b.id)?.obtained || false;
          if (aObtained === bObtained) return a.id - b.id;
          return aObtained ? -1 : 1;
        default:
          return a.id - b.id;
      }
    });
  }, [filterRarity, sortOption, pokedexStatus]);

  const completion = useMemo(() => getPokedexCompletion(), [getPokedexCompletion]);
  const sortedAndFilteredPokedex = useMemo(() => filteredAndSortedPokedex(), [filteredAndSortedPokedex]);

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-black text-green-400 italic">宝可梦图鉴</h2>
        <p className="text-gray-400 mt-2">收集所有宝可梦，完成你的图鉴！</p>
        <div className="mt-4 bg-black/20 p-4 rounded-xl border border-green-500/20">
          <p className="text-lg font-bold text-green-400">
            图鉴完成度: {completion.obtained}/{completion.total} ({completion.percentage}%)
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${completion.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 筛选和排序选项 */}
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <div className="flex gap-2">
          <button 
            onClick={() => setFilterRarity('All')}
            className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
              filterRarity === 'All' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            全部
          </button>
          {(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] as Rarity[]).map(rarity => (
            <button 
              key={rarity}
              onClick={() => setFilterRarity(rarity)}
              className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                filterRarity === rarity 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {RARITY_LABELS[rarity]}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 ml-4">
          <span className="text-gray-400 text-sm">排序:</span>
          <button 
            onClick={() => setSortOption('id')}
            className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
              sortOption === 'id' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            编号
          </button>
          <button 
            onClick={() => setSortOption('name')}
            className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
              sortOption === 'name' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            名称
          </button>
          <button 
            onClick={() => setSortOption('obtained')}
            className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
              sortOption === 'obtained' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            已获得
          </button>
        </div>
      </div>

      {/* 宝可梦图鉴网格 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sortedAndFilteredPokedex.map(poke => {
          const status = pokedexStatus.find(s => s.pokedexId === poke.id);
          const obtained = status?.obtained || false;
          const maxStars = status?.maxStars || 0;
          
          // 如果已获得，显示实际的宝可梦；否则显示问号卡片
          const displayPokemon = obtained 
            ? inventory.find(p => p.pokedexId === poke.id && p.stars === maxStars)
            : null;

          return (
            <div key={poke.id} className="relative group">
              {displayPokemon ? (
                <PokemonCard pokemon={displayPokemon} size="sm" />
              ) : (
                <div className="w-32 h-44 bg-gray-800/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-600">
                  <span className="text-4xl text-gray-500">?</span>
                </div>
              )}
              
              {/* 图鉴信息覆盖层 */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center p-2">
                <div className="text-center">
                  <p className="text-white font-bold text-sm mb-1">#{poke.id.toString().padStart(3, '0')}</p>
                  <p className="text-white text-xs mb-2">{poke.name}</p>
                  <p className={`text-xs px-2 py-1 rounded-full ${
                    obtained 
                      ? 'bg-green-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    {obtained ? `已获得 (${maxStars}★)` : '未获得'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default PokedexModule;