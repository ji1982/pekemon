import React, { useState } from 'react';
import { GameProvider, useGameContext } from './hooks/GameContext';
import { GameStateManager } from './modules/GameStateManager';
import { BattleManager } from './modules/BattleManager';
import { GachaManager } from './modules/GachaManager';
import { InventoryManager } from './modules/InventoryManager';
import { EquipmentManager } from './modules/EquipmentManager';
import Layout from './components/Layout';
import MapModule from './components/MapModule';
import AdvanceModule from './components/AdvanceModule';
import SynthesisModule from './components/SynthesisModule';
import DexModule from './components/DexModule';
import AchievementSystem from './components/AchievementSystem';
import PokemonCard from './components/PokemonCard';
import { showNotification } from './utils/NotificationUtils';
import { RARITY_LABELS } from '@shared/constants';
import { INITIAL_STAGES } from './utils/stages';

// 导入类型
import { Stage, Rarity, Pokemon } from './types';

// 稀有度权重
const RARITY_WEIGHT: Record<string, number> = {
  'Common': 1,
  'Uncommon': 2,
  'Rare': 3,
  'Epic': 4,
  'Legendary': 5
};



const AppContent: React.FC<{ currentSaveSlot: string; onBackToStart?: () => void }> = ({ currentSaveSlot, onBackToStart }) => {
  const [activeTab, setActiveTab] = useState<'map' | 'inventory' | 'gacha' | 'synthesis' | 'advance' | 'battle' | 'equipment' | 'equipSynthesis' | 'pokedex' | 'achievements' | 'equipmentPokedex'>('map');
  const [battleStage, setBattleStage] = useState<Stage | null>(null);
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

  // 确保gameState存在
  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b1a] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p>正在加载游戏数据...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      gameState={gameState}
    >
      {activeTab === 'map' && (
        <MapModule 
          stages={INITIAL_STAGES} 
          unlockedStages={gameState.unlockedStages}
          onStageSelect={handleStartBattle}
        />
      )}

      <GachaManager activeTab={activeTab} />
      <InventoryManager activeTab={activeTab} />
      <EquipmentManager activeTab={activeTab} />
      <BattleManager 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        battleStage={battleStage}
        setBattleStage={setBattleStage}
        playerTeam={gameState.teamIds.map(id => gameState.inventory.find(p => p.id === id)).filter(Boolean) as Pokemon[]}
      />

      {activeTab === 'synthesis' && (
        <SynthesisModule 
          inventory={gameState.inventory} 
          onSynthesize={(ids) => {
            // 从inventory中获取选中的宝可梦
            const selectedPokemon = ids.map(id => gameState.inventory.find(poke => poke.id === id)).filter(Boolean) as Pokemon[];
            if (selectedPokemon.length !== 3) return;
            
            // 确保所有选中的宝可梦都是相同的
            const firstPokemon = selectedPokemon[0];
            const allSame = selectedPokemon.every(poke => 
              poke.pokedexId === firstPokemon.pokedexId && 
              poke.stars === firstPokemon.stars && 
              poke.level === firstPokemon.level
            );
            if (!allSame) return;
            
            // 创建新的宝可梦，星级+1
            const newPokemon = {
              ...firstPokemon,
              id: Math.random().toString(36).substr(2, 9),
              stars: firstPokemon.stars + 1
            };
            
            // 从inventory中移除选中的宝可梦
            const updatedInventory = gameState.inventory.filter(poke => !ids.includes(poke.id));
            // 添加新生成的宝可梦
            updatedInventory.push(newPokemon);
            // 更新游戏状态
            dispatch({ 
              type: 'SET_GAME_STATE', 
              payload: { 
                ...gameState, 
                inventory: updatedInventory 
              } 
            });
            showNotification(`🎉 升星成功！${firstPokemon.name} 升级为 ${newPokemon.stars} 星！`, "success");
          }}
        />
      )}

      {activeTab === 'advance' && (
        <AdvanceModule 
          inventory={gameState.inventory} 
          onAdvance={(selectedIds, newPokemon) => {
            // 从inventory中移除选中的宝可梦
            const updatedInventory = gameState.inventory.filter(poke => !selectedIds.includes(poke.id));
            // 添加新生成的宝可梦
            updatedInventory.push(newPokemon);
            // 更新游戏状态
            dispatch({ 
              type: 'SET_GAME_STATE', 
              payload: { 
                ...gameState, 
                inventory: updatedInventory 
              } 
            });
            showNotification(`🎉 进阶成功！获得了 ${RARITY_LABELS[newPokemon.rarity]} ${newPokemon.name}！`, "success");
          }}
        />
      )}

      {activeTab === 'pokedex' && (
        <DexModule 
          pokedexStatus={gameState.pokedexStatus}
          equipmentStatus={gameState.equipmentStatus}
          inventory={gameState.inventory}
          onClaimReward={(achievementId) => {
            showNotification(`🎁 成就奖励已领取！获得了 ${achievementId} 的奖励！`, "success");
          }}
        />
      )}

      {activeTab === 'achievements' && (
        <AchievementSystem 
          achievements={gameState.achievements}
          onClaimReward={(achievementId) => {
            showNotification(`🎁 成就奖励已领取！获得了 ${achievementId} 的奖励！`, "success");
          }}
        />
      )}
    </Layout>
  );
};

const App: React.FC<{ currentSaveSlot?: string; onBackToStart?: () => void }> = ({ currentSaveSlot = '1', onBackToStart }) => {
  return (
    <GameProvider>
      <GameStateManager currentSaveSlot={currentSaveSlot}>
        <AppContent currentSaveSlot={currentSaveSlot} onBackToStart={onBackToStart} />
      </GameStateManager>
    </GameProvider>
  );
};





export default App;
