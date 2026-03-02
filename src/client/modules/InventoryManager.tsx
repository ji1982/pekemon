import React from 'react';
import { useGameContext } from '../hooks/GameContext';
import InventoryModule from '../components/InventoryModule';
import { showNotification } from '../utils/NotificationUtils';

interface InventoryManagerProps {
  activeTab: string;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ activeTab }) => {
  const { gameState, dispatch } = useGameContext();

  const toggleTeamMember = (id: string) => {
    if (!gameState) return;
    const isSelected = gameState.teamIds.includes(id);
    if (isSelected) {
      dispatch({ type: 'UPDATE_TEAM', payload: gameState.teamIds.filter(tid => tid !== id) });
    } else if (gameState.teamIds.length < 3) {
      dispatch({ type: 'UPDATE_TEAM', payload: [...gameState.teamIds, id] });
    }
  };

  const saveTeam = () => {
    if (!gameState) return;
    dispatch({ type: 'UPDATE_TEAM', payload: gameState.teamIds });
    showNotification("出战小队已保存！", "success");
  };

  const unequipItem = (pokeId: string, slot: 'Weapon' | 'Armor' | 'Accessory') => {
    if (!gameState) return;
    const poke = gameState.inventory.find(p => p.id === pokeId);
    const item = poke?.equipment[slot];
    if (!poke || !item) return;

    dispatch({ 
      type: 'EQUIP_ITEM', 
      payload: { pokemonId: pokeId, slot, equipmentId: null } 
    });
  };

  const getFullStats = (poke: any) => {
    let atk = poke.baseAtk;
    let def = poke.baseDef;
    let hp = poke.baseHp;

    Object.values(poke.equipment).forEach((e: any) => {
      if (!e) return;
      const affinityMatch = !e.typeAffinity || poke.types.includes(e.typeAffinity);
      if (affinityMatch) {
        atk += e.atkBonus;
        def += e.defBonus;
        hp += e.hpBonus;
      }
    });

    return { atk, def, hp };
  };

  if (activeTab === 'inventory' && gameState) {
    return (
      <InventoryModule 
        gameState={gameState} 
        toggleTeamMember={toggleTeamMember} 
        saveTeam={saveTeam} 
        unequipItem={unequipItem} 
        getFullStats={getFullStats}
      />
    );
  }

  return null;
};
