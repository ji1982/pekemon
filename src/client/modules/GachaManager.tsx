import React from 'react';
import { useGameContext } from '../hooks/GameContext';
import GachaSystem from '../components/GachaSystem';
import { Pokemon } from '../types';

interface GachaManagerProps {
  activeTab: string;
}

export const GachaManager: React.FC<GachaManagerProps> = ({ activeTab }) => {
  const { gameState, dispatch } = useGameContext();

  const handleGachaDraw = (newPokes: Pokemon[]) => {
    if (!gameState) return;
    
    const cost = newPokes.length === 10 ? 1000 : 100;
    console.log('🎰 [GachaManager] 开始抽卡:', { newPokesCount: newPokes.length, cost, currentGold: gameState.gold, currentInventoryCount: gameState.inventory.length });
    console.log('🎰 [GachaManager] 当前gameState:', { gold: gameState.gold, inventoryCount: gameState.inventory.length });
    
    // 使用单次dispatch更新所有相关状态
    dispatch({ 
      type: 'GACHA_DRAW', 
      payload: { 
        newPokemons: newPokes, 
        cost 
      } 
    });
    console.log('🎰 [GachaManager] dispatch已发送，等待reducer处理');
  };

  if (activeTab === 'gacha' && gameState) {
    return (
      <GachaSystem 
        gold={gameState.gold} 
        onDraw={handleGachaDraw} 
      />
    );
  }

  return null;
};
