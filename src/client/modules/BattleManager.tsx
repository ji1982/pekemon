import React, { useState } from 'react';
import { useGameContext } from '../hooks/GameContext';
import BattleSystem from '../components/BattleSystem';
import { Stage, Pokemon, Equipment } from '../types';
import { showNotification } from '../utils/NotificationUtils';
import { getLevelFromExp, calculateStatGrowth, updatePokedexStatus, checkAchievements, generateRandomEquipment } from '../utils/gameUtils';

interface BattleManagerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  battleStage: Stage | null;
  setBattleStage: (stage: Stage | null) => void;
  playerTeam: Pokemon[];
}

export const BattleManager: React.FC<BattleManagerProps> = ({ 
  activeTab, 
  setActiveTab, 
  battleStage, 
  setBattleStage, 
  playerTeam 
}) => {
  const { gameState, dispatch } = useGameContext();

  const handleStartBattle = (stage: Stage) => {
    if (!gameState) return;
    if (gameState.stamina < stage.staminaCost) {
      showNotification("体力不足！", "warning");
      return;
    }
    if (gameState.teamIds.length === 0) {
      showNotification("请先在背包中选择出战小队！", "warning");
      return;
    }
    setBattleStage(stage);
    // 先扣体力，如果失败会返还
    dispatch({ type: 'UPDATE_STAMINA', payload: -stage.staminaCost });
    setActiveTab('battle');
  };

  const handleBattleFinish = (win: boolean, rewards: { gold: number }) => {
    if (!gameState || !battleStage) return;
    if (win) {
      // 调整掉落率：总装备掉落概率20%，其中包含史诗和传奇装备
      const dropChance = Math.random();
      let newEquip: Equipment | null = null;
      
      if (dropChance < 0.001) { // 0.1% 几率掉落 Legendary 装备
        newEquip = generateRandomEquipment('Legendary');
      } else if (dropChance < 0.021) { // 2% 几率掉落 Epic 装备
        newEquip = generateRandomEquipment('Epic');
      } else if (dropChance < 0.071) { // 5% 几率掉落 Rare 装备
        newEquip = generateRandomEquipment('Rare');
      } else if (dropChance < 0.141) { // 7% 几率掉落 Uncommon 装备
        newEquip = generateRandomEquipment('Uncommon');
      } else if (dropChance < 0.300) { // 15.9% 几率掉落 Common 装备
        newEquip = generateRandomEquipment('Common');
      }
      
      // 计算经验值奖励（基于关卡难度）
      const expReward = battleStage.difficulty * 50;
      
      // 更新宝可梦经验值并处理升级
      const updatedInventory = gameState.teamIds.map(teamId => {
        const poke = gameState.inventory.find(p => p.id === teamId);
        if (!poke) return poke;
        
        const newExp = (poke.exp || 0) + expReward;
        const currentLevel = poke.level;
        const newLevel = getLevelFromExp(newExp);
        
        if (newLevel > currentLevel) {
          // 升级！计算属性增长
          const hpGrowth = calculateStatGrowth(poke.baseHp, poke.rarity, poke.stars);
          const atkGrowth = calculateStatGrowth(poke.baseAtk, poke.rarity, poke.stars);
          const defGrowth = calculateStatGrowth(poke.baseDef, poke.rarity, poke.stars);
          
          return {
            ...poke,
            exp: newExp,
            level: newLevel,
            baseHp: poke.baseHp + hpGrowth * (newLevel - currentLevel),
            baseAtk: poke.baseAtk + atkGrowth * (newLevel - currentLevel),
            baseDef: poke.baseDef + defGrowth * (newLevel - currentLevel)
          };
        } else {
          return {
            ...poke,
            exp: newExp
          };
        }
      }).filter(Boolean) as Pokemon[];
      
      // 合并更新后的宝可梦和其他宝可梦
      const fullUpdatedInventory = gameState.inventory.map(poke => {
        const updatedPoke = updatedInventory.find(up => up.id === poke.id);
        return updatedPoke || poke;
      });

      // 更新图鉴状态
      const updatedPokedexStatus = updatePokedexStatus(fullUpdatedInventory, gameState.pokedexStatus);
      
      // 更新成就状态
      const updatedAchievements = checkAchievements(
        gameState.achievements, 
        updatedPokedexStatus, 
        gameState.equipmentStatus, 
        gameState.gold + rewards.gold
      );

      // 更新装备图鉴状态
      let updatedEquipmentStatus = [...gameState.equipmentStatus];
      if (newEquip) {
        const existingEntry = updatedEquipmentStatus.find(entry => entry.equipmentId === newEquip.id);
        if (existingEntry) {
          existingEntry.obtained = true;
          existingEntry.count += 1;
        } else {
          updatedEquipmentStatus.push({
            equipmentId: newEquip.id,
            name: newEquip.name,
            obtained: true,
            count: 1
          });
        }
      }
      
      // 重新检查成就（包含新的装备图鉴状态）
      const finalAchievements = checkAchievements(
        gameState.achievements, 
        updatedPokedexStatus, 
        updatedEquipmentStatus, 
        gameState.gold + rewards.gold
      );

      // 一次性更新所有状态
      dispatch({ 
        type: 'BATTLE_RESULT', 
        payload: { 
          win, 
          rewards: { gold: rewards.gold, exp: expReward },
          newEquipment: newEquip
        } 
      });
      
      // 更新宝可梦经验（在主dispatch之后）
      updatedInventory.forEach(updatedPoke => {
        dispatch({ type: 'UPDATE_POKEMON', payload: { id: updatedPoke.id, pokemon: updatedPoke } });
      });
      
      // 更新图鉴和成就
      dispatch({ type: 'UPDATE_POKEDEX', payload: updatedPokedexStatus });
      dispatch({ type: 'UPDATE_EQUIPMENT_STATUS', payload: updatedEquipmentStatus });
      dispatch({ type: 'UPDATE_ACHIEVEMENTS', payload: finalAchievements });
      
      if (newEquip) {
        dispatch({ type: 'ADD_EQUIPMENT', payload: newEquip });
      }

      if (newEquip) {
        showNotification(`战斗胜利！获得了金币 x${rewards.gold}、经验 x${expReward} 和装备：${newEquip.name}！`, "success");
      } else {
        showNotification(`战斗胜利！获得了金币 x${rewards.gold} 和经验 x${expReward}！`, "success");
      }
    } else {
      // 挑战失败，返还体力
      dispatch({ type: 'UPDATE_STAMINA', payload: battleStage.staminaCost });
      showNotification("挑战失败！体力已返还。", "error");
    }
    setBattleStage(null);
    setActiveTab('map');
  };

  if (activeTab === 'battle' && battleStage) {
    return (
      <BattleSystem 
        playerTeam={playerTeam} 
        stage={battleStage} 
        onFinish={handleBattleFinish} 
      />
    );
  }

  return null;
};
