import React, { useEffect } from 'react';
import { useGameContext } from '../hooks/GameContext';
import { useSaveLoad } from '../hooks/useSaveLoad';
import { useStamina } from '../hooks/useStamina';
import { initializePokedexStatus, initializeEquipmentStatus, initializeAchievements } from '../utils/initializers';

interface GameStateManagerProps {
  currentSaveSlot?: string;
  children: React.ReactNode;
}

export const GameStateManager: React.FC<GameStateManagerProps> = ({ currentSaveSlot = '1', children }) => {
  const { gameState, dispatch, loading, setLoading } = useGameContext();
  // 每次currentSaveSlot变化时，重新初始化useSaveLoad
  const { saveGameState, loadGameState, saveStatus } = useSaveLoad(currentSaveSlot);
  
  // 使用ref来存储最新的loadGameState和saveGameState函数
  const loadGameStateRef = React.useRef(loadGameState);
  const saveGameStateRef = React.useRef(saveGameState);
  
  // 只在currentSaveSlot变化时更新ref
  useEffect(() => {
    loadGameStateRef.current = loadGameState;
    saveGameStateRef.current = saveGameState;
  }, [currentSaveSlot]);

  // 加载游戏状态
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 使用ref中存储的最新loadGameState函数
        const savedState = await loadGameStateRef.current();
        if (savedState && savedState.inventory) {
          // 确保所有宝可梦都有 exp 字段
          const inventoryWithExp = savedState.inventory.map((poke: any) => ({
            ...poke,
            exp: poke.exp || 0
          }));
          
          // 确保图鉴、装备图鉴和成就状态存在，如果不存在则初始化
          const gameStateWithAllFields = {
            ...savedState,
            inventory: inventoryWithExp,
            pokedexStatus: Array.isArray(savedState.pokedexStatus) ? savedState.pokedexStatus : initializePokedexStatus(),
            equipmentStatus: Array.isArray(savedState.equipmentStatus) ? savedState.equipmentStatus : initializeEquipmentStatus(),
            achievements: Array.isArray(savedState.achievements) ? savedState.achievements : initializeAchievements()
          };
          
          dispatch({ type: 'SET_GAME_STATE', payload: gameStateWithAllFields });
        } else {
          // 没有存档数据，不覆盖现有状态，只初始化缺失字段
          if (gameState) {
            const gameStateWithAllFields = {
              ...gameState,
              pokedexStatus: Array.isArray(gameState.pokedexStatus) ? gameState.pokedexStatus : initializePokedexStatus(),
              equipmentStatus: Array.isArray(gameState.equipmentStatus) ? gameState.equipmentStatus : initializeEquipmentStatus(),
              achievements: Array.isArray(gameState.achievements) ? gameState.achievements : initializeAchievements()
            };
            dispatch({ type: 'SET_GAME_STATE', payload: gameStateWithAllFields });
          }
        }
      } catch (error) {
        console.error('加载游戏数据失败:', error);
        // 使用初始状态
        const initialState = {
          gold: 2000,
          stamina: 100,
          maxStamina: 100,
          lastStaminaUpdate: Date.now(),
          inventory: [
            {
              id: 'starter',
              pokedexId: 4,
              name: '小火龙',
              types: ['Fire'],
              rarity: 'Common',
              stars: 1,
              baseHp: 39,
              baseAtk: 52,
              baseDef: 43,
              level: 1,
              exp: 0,
              equipment: {}
            }
          ],
          teamIds: ['starter'],
          savedTeamIds: ['starter'],
          equipmentInventory: [],
          unlockedStages: 1,
          pokedexStatus: initializePokedexStatus(),
          equipmentStatus: initializeEquipmentStatus(),
          achievements: initializeAchievements()
        };
        dispatch({ type: 'SET_GAME_STATE', payload: initialState });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [currentSaveSlot, dispatch, setLoading]);

  // 监听游戏状态变化并保存
  useEffect(() => {
    if (!loading && gameState) {
      console.log('游戏状态变化，尝试保存:', { currentSaveSlot, gameState: { ...gameState, inventory: gameState.inventory.length } });
      // 直接调用saveGameState，内部会处理哈希比较
      saveGameStateRef.current(gameState).catch(error => {
        console.error('状态保存失败:', error);
      });
    }
  }, [gameState, loading, currentSaveSlot]);

  // 体力恢复 - 暂时禁用以解决抽卡保存问题
  // useStamina(gameState, dispatch, loading);

  return <>{children}</>;
};
