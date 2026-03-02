import React, { useState, useMemo } from 'react';
import { GameState, Pokemon, Rarity } from '../types';
import PokemonCard from './PokemonCard';
import { RARITY_WEIGHT } from '../types';
import { TYPE_TRANSLATIONS } from '@shared/constants';

// 稀有度边框颜色映射（白、绿、蓝、紫、金）
const RARITY_BORDER_COLORS: Record<Rarity, string> = {
  Common: '#FFFFFF',      // 白色
  Uncommon: '#4CAF50',    // 绿色
  Rare: '#2196F3',        // 蓝色
  Epic: '#9C27B0',        // 紫色
  Legendary: '#FFD700'    // 金色
};

// 稀有度背景颜色映射
const RARITY_BACKGROUND_COLORS: Record<Rarity, string> = {
  Common: 'bg-white/20',      // 白色
  Uncommon: 'bg-green-500/20',    // 绿色
  Rare: 'bg-blue-500/20',        // 蓝色
  Epic: 'bg-purple-500/20',        // 紫色
  Legendary: 'bg-yellow-500/20'    // 金色
};

interface InventoryModuleProps {
  gameState: GameState;
  toggleTeamMember: (id: string) => void;
  saveTeam: () => void;
  unequipItem: (pokeId: string, slot: 'Weapon' | 'Armor' | 'Accessory') => void;
  getFullStats: (poke: Pokemon) => { atk: number; def: number; hp: number };
}

const InventoryModule: React.FC<InventoryModuleProps> = ({ 
  gameState, 
  toggleTeamMember, 
  saveTeam, 
  unequipItem, 
  getFullStats 
}) => {
  const [sortOption, setSortOption] = useState<'rarity' | 'level' | 'stars'>('rarity');

  // 排序函数
  const sortPokemon = (pokes: Pokemon[]): Pokemon[] => {
    return [...pokes].sort((a, b) => {
      switch (sortOption) {
        case 'rarity':
          return RARITY_WEIGHT[b.rarity] - RARITY_WEIGHT[a.rarity];
        case 'level':
          return b.level - a.level;
        case 'stars':
          return b.stars - a.stars;
        default:
          return RARITY_WEIGHT[b.rarity] - RARITY_WEIGHT[a.rarity];
      }
    });
  };

  const sortedInventory = sortPokemon(gameState.inventory);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-[#16162d] p-6 rounded-3xl border border-white/5">
        <div>
          <h2 className="text-4xl font-black text-yellow-500 italic">精灵中心</h2>
          <p className="text-gray-400 mt-2">点击宝可梦卡片加入/移出出战阵容（最多3个）。</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, slotIndex) => {
              const pokeId = gameState.teamIds[slotIndex];
              const hasPokemon = !!pokeId;
              const pokemon = hasPokemon ? gameState.inventory.find(p => p.id === pokeId) : null;
              const rarity = pokemon?.rarity;
              
              return (
                <div 
                  key={slotIndex}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:scale-110 ${
                    hasPokemon 
                      ? rarity ? RARITY_BACKGROUND_COLORS[rarity] : 'bg-blue-600/20' 
                      : 'border-dashed border-gray-600 bg-black/40'
                  }`}
                  style={{
                    borderColor: hasPokemon && rarity ? RARITY_BORDER_COLORS[rarity] : undefined
                  }}
                  onClick={() => hasPokemon && toggleTeamMember(pokeId)}
                >
                  {hasPokemon ? (
                    <img 
                      src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemon?.pokedexId.toString().padStart(3,'0')}.png`} 
                      className="w-10 h-10 object-contain" 
                      alt=""
                    />
                  ) : (
                    <span className="text-xs text-gray-500">{slotIndex + 1}</span>
                  )}
                </div>
              );
            })}
          </div>
          <button 
            onClick={saveTeam} 
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-2 rounded-full font-black text-sm transition-all shadow-lg"
          >
            保存出战阵容
          </button>
        </div>
      </div>
      
      {/* 排序选项 */}
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => setSortOption('rarity')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            sortOption === 'rarity' 
              ? 'bg-yellow-600 text-white shadow-lg' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          按稀有度
        </button>
        <button 
          onClick={() => setSortOption('level')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            sortOption === 'level' 
              ? 'bg-yellow-600 text-white shadow-lg' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          按等级
        </button>
        <button 
          onClick={() => setSortOption('stars')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            sortOption === 'stars' 
              ? 'bg-yellow-600 text-white shadow-lg' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          按星级
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sortedInventory.map(poke => {
          const stats = getFullStats(poke);
          const isSelected = gameState.teamIds.includes(poke.id);
          return (
            <div key={poke.id} className="space-y-3 relative">
              <PokemonCard 
                pokemon={{...poke, baseHp: stats.hp, baseAtk: stats.atk, baseDef: stats.def}} 
                selected={isSelected}
                onClick={() => toggleTeamMember(poke.id)}
                className={isSelected ? 'scale-95 opacity-50' : 'hover:scale-105 cursor-pointer'}
              />
              {/* 右上角选中图标 - 相对于卡片定位 */}
              {isSelected && (
                <div 
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center cursor-pointer z-20 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTeamMember(poke.id);
                  }}
                >
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
              <div className="flex flex-col gap-1 p-2 bg-black/30 rounded-xl border border-white/5">
                {(['Weapon', 'Armor', 'Accessory'] as const).map(slot => (
                  <div key={slot} className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-500">{slot === 'Weapon' ? '⚔️' : slot === 'Armor' ? '🛡️' : '💍'}</span>
                    {poke.equipment[slot] ? (
                      <button onClick={() => unequipItem(poke.id, slot)} className="text-red-400 hover:text-red-300 truncate max-w-[80px] text-right">
                        {poke.equipment[slot]?.name}
                      </button>
                    ) : (
                      <span className="text-gray-700 italic">未装备</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryModule;