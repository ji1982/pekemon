import React, { useState, useMemo } from 'react';
import { GameState, Equipment, Rarity } from '../types';
import { RARITY_LABELS } from '@shared/constants';
import { getEquipmentImage } from '../utils/equipmentImages';
import { showNotification } from '../utils/NotificationUtils';

// 装备技能池
const EQUIPMENT_SKILL_POOL = [
  '破甲', '致命一击', '格挡', '先攻', 
  '暴怒', '再生', '反击', '专注',
  '吸血', '眩晕'
];

// 稀有度顺序
const RARITY_ORDER: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

// 合成费用
const SYNTHESIS_COST: Record<Rarity, number> = {
  Common: 100,
  Uncommon: 300,
  Rare: 800,
  Epic: 2000,
  Legendary: 5000
};

// 属性加成倍数
const BONUS_MULTIPLIERS: Record<Rarity, number> = {
  Common: 1,
  Uncommon: 1.5,
  Rare: 2,
  Epic: 3,
  Legendary: 5
};

// 技能获取几率 - 统一调整为20%
const SKILL_CHANCE: Record<Rarity, number> = {
  Common: 0,
  Uncommon: 0,
  Rare: 0.2,
  Epic: 0.2,
  Legendary: 0.2
};

interface EquipmentSynthesisModuleProps {
  gameState: GameState;
  onSynthesize: (materialIds: string[], targetRarity: Rarity) => void;
}

const EquipmentSynthesisModule: React.FC<EquipmentSynthesisModuleProps> = ({ 
  gameState, 
  onSynthesize 
}) => {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [targetRarity, setTargetRarity] = useState<Rarity | null>(null);

  // 按稀有度分组装备
  const equipmentByRarity = useMemo(() => {
    const groups: Record<Rarity, Equipment[]> = {
      Common: [],
      Uncommon: [],
      Rare: [],
      Epic: [],
      Legendary: []
    };
    
    gameState.equipmentInventory.forEach(eq => {
      groups[eq.rarity].push(eq);
    });
    
    return groups;
  }, [gameState.equipmentInventory]);

  // 获取可合成的稀有度
  const availableSynthesisOptions = useMemo(() => {
    const options: { rarity: Rarity; count: number; cost: number; nextRarity: Rarity }[] = [];
    
    RARITY_ORDER.slice(0, -1).forEach((rarity, index) => {
      const count = equipmentByRarity[rarity].length;
      if (count >= 3) {
        const nextRarity = RARITY_ORDER[index + 1];
        options.push({
          rarity,
          count,
          cost: SYNTHESIS_COST[rarity],
          nextRarity
        });
      }
    });
    
    return options;
  }, [equipmentByRarity]);

  // 选择材料
  const toggleMaterialSelection = (equipId: string) => {
    if (selectedMaterials.includes(equipId)) {
      setSelectedMaterials(selectedMaterials.filter(id => id !== equipId));
    } else if (selectedMaterials.length < 3) {
      setSelectedMaterials([...selectedMaterials, equipId]);
    }
  };

  // 开始合成
  const handleSynthesize = () => {
    if (selectedMaterials.length !== 3 || !targetRarity) {
      showNotification('请选择3件相同稀有度的装备进行合成！', 'error');
      return;
    }
    
    // 验证所有选中的装备都是相同稀有度
    const selectedEquipment = selectedMaterials.map(id => 
      gameState.equipmentInventory.find(eq => eq.id === id)
    ).filter(Boolean) as Equipment[];
    
    const firstRarity = selectedEquipment[0]?.rarity;
    const allSameRarity = selectedEquipment.every(eq => eq.rarity === firstRarity);
    
    if (!allSameRarity) {
      showNotification('所选装备必须是相同稀有度！', 'error');
      return;
    }
    
    // 检查金币是否足够
    const cost = SYNTHESIS_COST[firstRarity];
    if (gameState.gold < cost) {
      showNotification(`金币不足！合成需要 ${cost} 金币`, 'error');
      return;
    }
    
    onSynthesize(selectedMaterials, targetRarity);
    setSelectedMaterials([]);
    setTargetRarity(null);
  };

  // 清除选择
  const clearSelection = () => {
    setSelectedMaterials([]);
    setTargetRarity(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-10">
      <h2 className="text-4xl font-black text-purple-400 italic text-center">装备合成</h2>
      
      {/* 合成说明 */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-3xl border border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-300 mb-3">合成规则</h3>
        <ul className="text-sm text-gray-300 space-y-2">
          <li>• 消耗3件相同稀有度的装备，合成1件更高稀有度的装备</li>
          <li>• 属性按比例提升：优秀(+50%)、稀有(+100%)、史诗(+200%)、传说(+400%)</li>
          <li>• 稀有及以上装备有几率获得特殊技能</li>
          <li>• 合成需要消耗金币，稀有度越高消耗越多</li>
        </ul>
      </div>

      {/* 可用合成选项 */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white">可合成选项</h3>
        
        {availableSynthesisOptions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">暂无可合成的装备组合，收集更多装备吧！</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSynthesisOptions.map(option => (
              <div 
                key={option.rarity}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  targetRarity === option.nextRarity 
                    ? 'border-purple-500 bg-purple-900/20' 
                    : 'border-gray-700 hover:border-purple-400/50'
                }`}
                onClick={() => setTargetRarity(option.nextRarity)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white">
                    {RARITY_LABELS[option.rarity]} → {RARITY_LABELS[option.nextRarity]}
                  </span>
                  <span className="text-yellow-400 font-mono">{option.cost}💰</span>
                </div>
                <div className="text-sm text-gray-400">
                  可用: {option.count}件 | 需要: 3件
                </div>
                <div className="mt-2 text-xs text-purple-400">
                  属性提升: +{Math.round((BONUS_MULTIPLIERS[option.nextRarity] - 1) * 100)}%
                  {SKILL_CHANCE[option.nextRarity] > 0 && ` | 技能几率: ${Math.round(SKILL_CHANCE[option.nextRarity] * 100)}%`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 材料选择区域 */}
      {targetRarity && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white">
              选择材料 ({selectedMaterials.length}/3)
            </h3>
            <button 
              onClick={clearSelection}
              className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors"
            >
              清除选择
            </button>
          </div>
          
          {(() => {
            const currentIndex = RARITY_ORDER.indexOf(targetRarity) - 1;
            const materialRarity = currentIndex >= 0 ? RARITY_ORDER[currentIndex] : 'Common';
            const materials = equipmentByRarity[materialRarity];
            
            return (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {materials.length === 0 ? (
                  <p className="col-span-full text-gray-500 text-center">没有可用的材料装备</p>
                ) : (
                  materials.map(eq => (
                    <div 
                      key={eq.id}
                      className={`bg-[#1c1c3a] p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedMaterials.includes(eq.id)
                          ? 'border-yellow-500 ring-2 ring-yellow-500/30 bg-yellow-900/10'
                          : 'border-white/10 hover:border-yellow-500/50'
                      }`}
                      onClick={() => toggleMaterialSelection(eq.id)}
                    >
                      <div className="flex justify-center mb-2">
                        <img 
                          src={getEquipmentImage(eq)} 
                          alt={eq.name}
                          className="w-12 h-12 object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/48/4a5568/FFFFFF?text=?';
                          }}
                        />
                      </div>
                      <div className="text-xs text-center text-white font-medium truncate">
                        {eq.name}
                      </div>
                      <div className={`text-[10px] px-1 py-0.5 rounded-full mt-1 ${
                        eq.rarity === 'Legendary' ? 'bg-yellow-600' : 
                        eq.rarity === 'Epic' ? 'bg-purple-600' : 
                        eq.rarity === 'Rare' ? 'bg-blue-600' : 'bg-gray-700'
                      }`}>
                        {RARITY_LABELS[eq.rarity]}
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })()}
          
          {/* 合成按钮 */}
          {selectedMaterials.length === 3 && (
            <div className="text-center">
              <button
                onClick={handleSynthesize}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                🔥 立即合成 🔥
              </button>
            </div>
          )}
        </div>
      )}

      {/* 当前金币显示 */}
      <div className="text-center text-gray-400">
        当前金币: <span className="text-yellow-400 font-bold">{gameState.gold.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default EquipmentSynthesisModule;