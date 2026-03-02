import React from 'react';
import { useGameContext } from '../hooks/GameContext';
import EquipmentSynthesisModule from '../components/EquipmentSynthesisModule';
import { showNotification } from '../utils/NotificationUtils';
import { getSynthesisCost } from '../utils/equipmentSynthesis';
import { generateRandomEquipment } from '../utils/gameUtils';
import { TYPE_TRANSLATIONS, RARITY_LABELS } from '@shared/constants';
import { Equipment, Rarity, PokemonType } from '../types';

interface EquipmentManagerProps {
  activeTab: string;
}

export const EquipmentManager: React.FC<EquipmentManagerProps> = ({ activeTab }) => {
  const { gameState, dispatch } = useGameContext();

  const equipItem = (pokeId: string, equipId: string) => {
    if (!gameState) return;
    const poke = gameState.inventory.find(p => p.id === pokeId);
    const equip = gameState.equipmentInventory.find(e => e.id === equipId);
    if (!poke || !equip) return;

    dispatch({ 
      type: 'EQUIP_ITEM', 
      payload: { pokemonId: pokeId, slot: equip.slot, equipmentId: equipId } 
    });
  };

  const handleEquipmentSynthesis = (consumedIds: string[], targetRarity: Rarity) => {
    if (!gameState) return;
    const materialRarity = gameState.equipmentInventory.find(eq => eq.id === consumedIds[0])?.rarity || 'Common';
    const cost = getSynthesisCost(materialRarity);
    
    // 根据消耗的材料确定槽位
    const materialSlot = gameState.equipmentInventory.find(eq => eq.id === consumedIds[0])?.slot || 'Weapon';
    
    // 生成新装备
    const types: PokemonType[] = ['Fire', 'Water', 'Grass', 'Electric', 'Normal', 'Psychic', 'Dragon'];
    const hasAffinity = Math.random() > 0.6;
    const hasSkill = Math.random() > (targetRarity === 'Legendary' ? 0.4 : targetRarity === 'Epic' ? 0.7 : 0.9);
    
    // 装备名称模板
    const weaponNames = ['龙牙匕首', '火焰剑', '神圣权杖', '冰霜长矛', '暗影利刃'];
    const armorNames = ['坚硬外壳', '神圣圣衣', '暗影斗篷', '冰霜盔甲', '龙鳞铠甲'];
    const accessoryNames = ['龙眼宝石', '雷电耳环', '火焰项链', '丝绸围巾', '神圣徽章', '冰霜戒指'];
    
    // 设置名称
    let name: string;
    if (materialSlot === 'Weapon') {
      name = weaponNames[Math.floor(Math.random() * weaponNames.length)];
    } else if (materialSlot === 'Armor') {
      name = armorNames[Math.floor(Math.random() * armorNames.length)];
    } else {
      name = accessoryNames[Math.floor(Math.random() * accessoryNames.length)];
    }
    
    // 如果是Legendary装备，添加前缀
    if (targetRarity === 'Legendary') {
      name = `远古${name}`;
    }
    
    // 生成新装备
    const newEquipment = generateRandomEquipment(targetRarity);
    
    // 更新装备图鉴状态
    let updatedEquipmentStatus = [...gameState.equipmentStatus];
    const existingEntry = updatedEquipmentStatus.find(entry => entry.name === newEquipment.name);
    if (existingEntry) {
      existingEntry.obtained = true;
      existingEntry.count += 1;
    } else {
      updatedEquipmentStatus.push({
        equipmentId: newEquipment.id,
        name: newEquipment.name,
        obtained: true,
        count: 1
      });
    }
    
    // 检查成就
    const updatedAchievements = checkAchievements(
      gameState.achievements, 
      gameState.pokedexStatus, 
      updatedEquipmentStatus, 
      gameState.gold - cost
    );
    
    // 更新游戏状态
    dispatch({ type: 'UPDATE_GOLD', payload: -cost });
    consumedIds.forEach(id => {
      dispatch({ type: 'REMOVE_EQUIPMENT', payload: id });
    });
    dispatch({ type: 'ADD_EQUIPMENT', payload: newEquipment });
    dispatch({ type: 'UPDATE_EQUIPMENT_STATUS', payload: updatedEquipmentStatus });
    dispatch({ type: 'UPDATE_ACHIEVEMENTS', payload: updatedAchievements });
    
    showNotification(`🎉 装备合成成功！获得了 ${RARITY_LABELS[targetRarity]} ${newEquipment.name}！`, "success");
  };

  // 检查成就函数（暂时复制，后续会移到utils）
  const checkAchievements = (achievements: any[], pokedexStatus: any[], equipmentStatus: any[], gold: number): any[] => {
    const updatedAchievements = [...achievements];
    const obtainedPokemonCount = pokedexStatus.filter(entry => entry.obtained).length;
    const obtainedEquipmentCount = equipmentStatus.filter(entry => entry.obtained).length;
    
    updatedAchievements.forEach(achievement => {
      if (!achievement.completed) {
        if (achievement.type === 'POKEDEX_COMPLETE' && obtainedPokemonCount >= achievement.requirement) {
          achievement.completed = true;
        } else if (achievement.type === 'EQUIPMENT_COMPLETE' && obtainedEquipmentCount >= achievement.requirement) {
          achievement.completed = true;
        } else if (achievement.type === 'GOLD_MILESTONE' && gold >= achievement.requirement) {
          achievement.completed = true;
        }
      }
    });
    
    return updatedAchievements;
  };

  if (activeTab === 'equipSynthesis' && gameState) {
    return (
      <EquipmentSynthesisModule 
        gameState={gameState}
        onSynthesize={handleEquipmentSynthesis}
      />
    );
  }

  if (activeTab === 'equipment' && gameState) {
    return (
      <div className="max-w-6xl mx-auto space-y-10 py-10">
        <h2 className="text-4xl font-black text-blue-400 italic text-center">装备库</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 装备列表 */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xl font-bold border-b border-white/5 pb-2">拥有装备 ({gameState.equipmentInventory.length})</h3>
            {gameState.equipmentInventory.length === 0 && <p className="text-gray-600">暂无装备，快去挑战关卡掉落吧！</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gameState.equipmentInventory.map(eq => (
                <div key={eq.id} className="bg-[#1c1c3a] p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-3">
                    {eq.image && (
                      <img 
                        src={eq.image} 
                        alt={eq.name}
                        className="w-12 h-12 object-cover rounded-lg border border-white/20"
                      />
                    )}
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-lg text-white">{eq.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${eq.rarity === 'Legendary' ? 'bg-yellow-600' : eq.rarity === 'Epic' ? 'bg-purple-600' : eq.rarity === 'Rare' ? 'bg-blue-600' : 'bg-gray-700'}`}>{eq.slot}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    {eq.atkBonus > 0 && <span className="text-yellow-400">攻击 +{eq.atkBonus}</span>}
                    {eq.defBonus > 0 && <span className="text-blue-400">防御 +{eq.defBonus}</span>}
                    {eq.hpBonus > 0 && <span className="text-green-400">生命 +{eq.hpBonus}</span>}
                  </div>
                  {eq.typeAffinity && (
                    <div className="text-[10px] text-purple-400 border border-purple-500/30 p-1 rounded bg-purple-500/5 mb-3">
                      共鸣：{TYPE_TRANSLATIONS[eq.typeAffinity]} 属性宝可梦佩戴生效
                    </div>
                  )}
                  {eq.skill && (
                    <div className="text-[10px] text-orange-400 border border-orange-500/30 p-1 rounded bg-orange-500/5 mb-3">
                      💫 技能：{eq.skill}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <select onChange={(e) => e.target.value && equipItem(e.target.value, eq.id)} className="bg-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg w-full">
                      <option value="">点击装备...</option>
                      {gameState.inventory.map(p => {
                        const match = !eq.typeAffinity || p.types.includes(eq.typeAffinity);
                        return (
                          <option 
                            key={p.id} 
                            value={p.id}
                            style={{ 
                              color: match ? 'green' : 'red',
                              fontWeight: match ? 'bold' : 'normal'
                            }}
                          >
                            {p.name} (Lv.{p.level}) {match ? '✅' : '❌'}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 说明 */}
          <div className="bg-black/20 p-6 rounded-3xl border border-white/5 h-fit">
             <h4 className="font-bold text-blue-400 mb-4 uppercase tracking-widest">装备规则</h4>
             <ul className="text-sm text-gray-400 space-y-3">
                <li>• 装备增加三维基础属性，提升战力。</li>
                <li>• <span className="text-purple-400">属性共鸣</span>：只有当宝可梦属性匹配时，装备加成才生效。</li>
                <li>• <span className="text-orange-400">特殊技能</span>：高级装备附带特殊战斗技能，大幅提升战斗力。</li>
                <li>• 挑战关卡有几率掉落随机属性装备（掉落率已调整）。</li>
                <li>• 每个宝可梦拥有三个槽位：武器、护甲、饰品。</li>
                <li>• <span className="text-green-400">装备图片</span>：每个装备都有独特的图标，便于识别。</li>
             </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
