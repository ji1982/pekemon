import React, { useState } from 'react';
import { EquipmentEntryStatus, Rarity } from '../types';
import { RARITY_LABELS } from '@shared/constants';
import { showNotification } from '../utils/NotificationUtils';

interface EquipmentPokedexModuleProps {
  equipmentStatus: EquipmentEntryStatus[];
  onClaimReward: (achievementId: string) => void;
}

const EquipmentPokedexModule: React.FC<EquipmentPokedexModuleProps> = ({ 
  equipmentStatus,
  onClaimReward
}) => {
  const [filterRarity, setFilterRarity] = useState<Rarity | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const rarityDistribution = getRarityDistribution();
  const totalEquipment = equipmentStatus.length;
  const obtainedEquipment = equipmentStatus.filter(e => e.obtained).length;
  const completionRate = totalEquipment > 0 ? Math.round((obtainedEquipment / totalEquipment) * 100) : 0;

  // 过滤装备
  const filteredEquipment = equipmentStatus.filter(entry => {
    // 搜索过滤
    if (searchTerm && !entry.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // 稀有度过滤
    if (filterRarity !== 'all') {
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
      
      if (entryRarity !== filterRarity) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-black text-blue-400 italic">装备图鉴</h2>
        <p className="text-gray-400 mt-2">收集所有装备，解锁特殊奖励！</p>
        
        {/* 图鉴进度 */}
        <div className="mt-6 bg-black/20 p-6 rounded-3xl border border-blue-500/20 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-blue-400 font-bold">图鉴完成度</span>
            <span className="text-yellow-400 font-bold">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-400">
            已收集 {obtainedEquipment}/{totalEquipment} 件装备
          </div>
        </div>
      </div>

      {/* 稀有度统计 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'] as Rarity[]).map(rarity => (
          <div 
            key={rarity}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              filterRarity === rarity 
                ? 'bg-blue-600/30 border-blue-500' 
                : 'bg-black/20 border-gray-600 hover:bg-black/30'
            }`}
            onClick={() => setFilterRarity(filterRarity === rarity ? 'all' : rarity)}
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

      {/* 搜索框 */}
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

      {/* 收集提示 */}
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
  );
};

export default EquipmentPokedexModule;