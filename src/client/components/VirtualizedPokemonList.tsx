import React, { useState, useEffect, useRef } from 'react';
import PokemonCard from './PokemonCard';

interface VirtualizedPokemonListProps {
  pokemons: any[];
  selectedIds: string[];
  toggleSelection: (id: string) => void;
  unequipItem: (pokeId: string, slot: 'Weapon' | 'Armor' | 'Accessory') => void;
  getFullStats: (poke: any) => { atk: number; def: number; hp: number };
  itemHeight?: number;
  containerHeight?: number;
}

const VirtualizedPokemonList: React.FC<VirtualizedPokemonListProps> = ({
  pokemons,
  selectedIds,
  toggleSelection,
  unequipItem,
  getFullStats,
  itemHeight = 200,
  containerHeight = 600
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算可见范围
  useEffect(() => {
    const updateVisibleRange = () => {
      if (!containerRef.current) return;
      
      const scrollTop = containerRef.current.scrollTop;
      const start = Math.floor(scrollTop / itemHeight);
      const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // 额外缓冲
      const end = Math.min(start + visibleCount, pokemons.length);
      
      setVisibleRange({ start, end });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', updateVisibleRange);
      updateVisibleRange(); // 初始计算
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateVisibleRange);
      }
    };
  }, [pokemons.length, itemHeight, containerHeight]);

  // 只渲染可见的宝可梦
  const visiblePokemons = pokemons.slice(visibleRange.start, visibleRange.end);

  return (
    <div 
      ref={containerRef}
      className="overflow-y-auto"
      style={{ height: containerHeight }}
    >
      {/* 占位符，保持滚动条正确 */}
      <div style={{ height: pokemons.length * itemHeight }}>
        {/* 可见区域的内容 */}
        <div style={{ 
          transform: `translateY(${visibleRange.start * itemHeight}px)`,
          position: 'relative'
        }}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {visiblePokemons.map(poke => {
              const stats = getFullStats(poke);
              return (
                <div key={poke.id} className="space-y-3">
                  <PokemonCard 
                    pokemon={{...poke, baseHp: stats.hp, baseAtk: stats.atk, baseDef: stats.def}} 
                    selected={selectedIds.includes(poke.id)} 
                    onClick={() => toggleSelection(poke.id)} 
                  />
                  <div className="flex flex-col gap-1 p-2 bg-black/30 rounded-xl border border-white/5">
                    {(['Weapon', 'Armor', 'Accessory'] as const).map(slot => (
                      <div key={slot} className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500">{slot === 'Weapon' ? '⚔️' : slot === 'Armor' ? '🛡️' : '💍'}</span>
                        {poke.equipment[slot] ? (
                          <button 
                            onClick={() => unequipItem(poke.id, slot)} 
                            className="text-red-400 hover:text-red-300 truncate max-w-[80px] text-right text-xs"
                          >
                            {poke.equipment[slot]?.name}
                          </button>
                        ) : (
                          <span className="text-gray-700 italic text-xs">未装备</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualizedPokemonList;