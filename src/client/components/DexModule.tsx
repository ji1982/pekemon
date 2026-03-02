import React, { useState } from 'react';
import { Pokemon, PokedexEntryStatus, EquipmentEntryStatus, Rarity } from '../types';
import { RARITY_LABELS } from '@shared/constants';
import { POKEDEX } from '@shared/constants';
import PokemonCard from './PokemonCard';
import { showNotification } from '../utils/NotificationUtils';

interface DexModuleProps {
  pokedexStatus: PokedexEntryStatus[];
  equipmentStatus: EquipmentEntryStatus[];
  inventory: Pokemon[];
  onClaimReward: (achievementId: string) => void;
}

const DexModule: React.FC<DexModuleProps> = ({ 
  pokedexStatus, 
  equipmentStatus, 
  inventory, 
  onClaimReward 
}) => {
  const [activeTab, setActiveTab] = useState<'pokedex' | 'equipment'>('pokedex');
  
  // 宝可梦图鉴相关状态
  const [pokedexFilterRarity, setPokedexFilterRarity] = useState<Rarity | 'All'>('All');
  const [pokedexSortOption, setPokedexSortOption] = useState<'id' | 'name' | 'obtained'>('id');
  
  // 装备图鉴相关状态
  const [equipmentFilterRarity, setEquipmentFilterRarity] = useState<Rarity | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 获取宝可梦图鉴完成度
  const getPokedexCompletion = () => {
    // 安全检查：确保pokedexStatus是数组
    if (!Array.isArray(pokedexStatus)) {
      return { obtained: 0, total: POKEDEX.length, percentage: 0 };
    }
    const total = POKEDEX.length;
    const obtained = pokedexStatus.filter(entry => entry.obtained).length;
    return { obtained, total, percentage: Math.round((obtained / total) * 100) };
  };

  // 过滤和排序宝可梦
  const filteredAndSortedPokedex = () => {
    let filtered = POKEDEX.filter(poke => {
      if (pokedexFilterRarity === 'All') return true;
      return poke.rarity === pokedexFilterRarity;
    });

    return filtered.sort((a, b) => {
      switch (pokedexSortOption) {
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
  };

  // 获取所有装备的稀有度分布
  const getRarityDistribution = () => {
    const distribution: Record<Rarity, { total: number; obtained: number }> = {
      Common: { total: 0, obtained: 0 },
      Uncommon: { total: 0, obtained: 0 },
      Rare: { total: 0, obtained: 0 },
      Epic: { total: 0, obtained: 0 },
      Legendary: { total: 0, obtained: 0 }
    };

    equipmentStatus.forEach(entry => {
      // 这里需要从装备名称推断稀有度，实际项目中应该存储装备的完整信息
      let rarity: Rarity = 'Common';
      if (entry.name.includes('史诗') || entry.name.includes('Epic')) {
        rarity = 'Epic';
      } else if (entry.name.includes('传说') || entry.name.includes('Legendary')) {
        rarity = 'Legendary';
      } else if (entry.name.includes('稀有') || entry.name.includes('Rare')) {
        rarity = 'Rare';
      } else if (entry.name.includes('优秀') || entry.name.includes('Uncommon')) {
        rarity = 'Uncommon';
      }
      
      distribution[rarity].total++;
      if (entry.obtained) {
        distribution[rarity].obtained++;
      }
    });

    return distribution;
  };

  // 过滤装备
  const filteredEquipment = equipmentStatus.filter(entry => {
    // 搜索过滤
    if (searchTerm && !entry.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // 稀有度过滤
    if (equipmentFilterRarity !== 'all') {
      let entryRarity: Rarity = 'Common';
      if (entry.name.includes('史诗') || entry.name.includes('Epic')) {
        entryRarity = 'Epic';
      } else if (entry.name.includes('传说') || entry.name.includes('Legendary')) {
        entryRarity = 'Legendary';
      } else if (entry.name.includes('稀有') || entry.name.includes('Rare')) {
        entryRarity = 'Rare';
      } else if (entry.name.includes('优秀') || entry.name.includes('Uncommon')) {
        entryRarity = 'Uncommon';
      }
      
      if (entryRarity !== equipmentFilterRarity) {
        return false;
      }
    }
    
    return true;
  });

  const pokedexCompletion = getPokedexCompletion();
  const sortedAndFilteredPokedex = filteredAndSortedPokedex();
  const rarityDistribution = getRarityDistribution();
  const totalEquipment = equipmentStatus.length;
  const obtainedEquipment = equipmentStatus.filter(e => e.obtained).length;
  const equipmentCompletionRate = totalEquipment > 0 ? Math.round((obtainedEquipment / totalEquipment) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-black text-green-400 italic">
          {activeTab === 'pokedex' ? '宝可梦图鉴' : '装备图鉴'}
        </h2>
        <p className="text-gray-400 mt-2">
          {activeTab === 'pokedex' ? '收集所有宝可梦，完成你的图鉴！' : '收集所有装备，解锁特殊奖励！'}
        </p>
      </div>

      {/* 标签切换 */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('pokedex')}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'pokedex' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          📚 宝可梦图鉴
        </button>
        <button
          onClick={() => setActiveTab('equipment')}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'equipment' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          🛡️ 装备图鉴
        </button>
      </div>

      {/* 宝可梦图鉴内容 */}
      {activeTab === 'pokedex' && (
        <div className="space-y-8">
          {/* 宝可梦图鉴进度 */}
          <div className="bg-black/20 p-4 rounded-xl border border-green-500/20">
            <p className="text-lg font-bold text-green-400">
              图鉴完成度: {pokedexCompletion.obtained}/{pokedexCompletion.total} ({pokedexCompletion.percentage}%)
            </p>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${pokedexCompletion.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* 宝可梦筛选和排序选项 */}
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <div className="flex gap-2">
              <button 
                onClick={() => setPokedexFilterRarity('All')}
                className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                  pokedexFilterRarity === 'All' 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                全部
              </button>
              {(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] as Rarity[]).map(rarity => (
                <button 
                  key={rarity}
                  onClick={() => setPokedexFilterRarity(rarity)}
                  className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                    pokedexFilterRarity === rarity 
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
                onClick={() => setPokedexSortOption('id')}
                className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                  pokedexSortOption === 'id' 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                编号
              </button>
              <button 
                onClick={() => setPokedexSortOption('name')}
                className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                  pokedexSortOption === 'name' 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                名称
              </button>
              <button 
                onClick={() => setPokedexSortOption('obtained')}
                className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${
                  pokedexSortOption === 'obtained' 
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
      )}

      {/* 装备图鉴内容 */}
      {activeTab === 'equipment' && (
        <div className="space-y-8">
          {/* 装备图鉴进度 */}
          <div className="bg-black/20 p-6 rounded-3xl border border-blue-500/20 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-blue-400 font-bold">图鉴完成度</span>
              <span className="text-yellow-400 font-bold">{equipmentCompletionRate}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${equipmentCompletionRate}%` }}
              ></div>
            </div>
            <div className="text-center mt-2 text-sm text-gray-400">
              已收集 {obtainedEquipment}/{totalEquipment} 件装备
            </div>
          </div>

          {/* 装备稀有度统计 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] as Rarity[]).map(rarity => (
              <div 
                key={rarity}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  equipmentFilterRarity === rarity 
                    ? 'bg-blue-600/30 border-blue-500' 
                    : 'bg-black/20 border-gray-600 hover:bg-black/30'
                }`}
                onClick={() => setEquipmentFilterRarity(equipmentFilterRarity === rarity ? 'all' : rarity)}
              >
                <div className="text-center">
                  <div className="font-bold text-white">{RARITY_LABELS[rarity]}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {rarityDistribution[rarity].obtained}/{rarityDistribution[rarity].total}
                  </div>
                  <div className="text-xs text-green-400 mt-1">
                    {rarityDistribution[rarity].total > 0 
                      ? Math.round((rarityDistribution[rarity].obtained / rarityDistribution[rarity].total) * 100) + '%' 
                      : '0%'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 装备搜索框 */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="搜索装备..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 w-full max-w-md"
            />
          </div>

          {/* 装备列表 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredEquipment.map(entry => {
              // 推断装备稀有度
              let rarity: Rarity = 'Common';
              if (entry.name.includes('史诗') || entry.name.includes('Epic')) {
                rarity = 'Epic';
              } else if (entry.name.includes('传说') || entry.name.includes('Legendary')) {
                rarity = 'Legendary';
              } else if (entry.name.includes('稀有') || entry.name.includes('Rare')) {
                rarity = 'Rare';
              } else if (entry.name.includes('优秀') || entry.name.includes('Uncommon')) {
                rarity = 'Uncommon';
              }

              return (
                <div 
                  key={entry.equipmentId}
                  className={`relative p-3 rounded-xl border-2 transition-all ${
                    entry.obtained 
                      ? 'border-blue-500 bg-blue-900/20' 
                      : 'border-gray-600 bg-gray-800/20 opacity-60'
                  }`}
                >
                  {/* 装备图标占位符 */}
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg">⚔️</span>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-sm font-bold truncate ${
                      entry.obtained ? 'text-white' : 'text-gray-500'
                    }`}>
                      {entry.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {RARITY_LABELS[rarity]}
                    </div>
                    {entry.obtained && entry.count > 1 && (
                      <div className="text-xs text-yellow-400 mt-1">
                        ×{entry.count}
                      </div>
                    )}
                  </div>
                  
                  {!entry.obtained && (
                    <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                      <span className="text-gray-500 text-xs">未获得</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 装备收集提示 */}
          {obtainedEquipment === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <p>还没有获得任何装备！通过抽卡、战斗或合成来获取装备吧！</p>
            </div>
          )}

          {obtainedEquipment > 0 && obtainedEquipment < totalEquipment && (
            <div className="text-center text-gray-400 mt-8">
              <p>继续努力！还有 {totalEquipment - obtainedEquipment} 件装备等待你发现！</p>
            </div>
          )}

          {obtainedEquipment === totalEquipment && (
            <div className="text-center text-yellow-400 mt-8 animate-pulse">
              <p>🎉 恭喜！你已经收集了所有装备！</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DexModule;