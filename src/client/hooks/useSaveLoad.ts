import { useState, useRef, useEffect } from 'react';
import { GameState } from '../types';

const API_BASE_URL = '/api';

export const useSaveLoad = (currentSaveSlot: string = '1') => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // 保存队列和防抖
  const saveQueueRef = useRef<GameState[]>([]);
  const isSavingRef = useRef(false);
  const lastSaveTimeRef = useRef<number>(0);
  // 存储当前存档槽ID
  const currentSaveSlotRef = useRef(currentSaveSlot);
  // 存储上次保存的gameState哈希，避免重复保存
  const lastGameStateHashRef = useRef('');
  
  // 当currentSaveSlot变化时，更新ref
  useEffect(() => {
    currentSaveSlotRef.current = currentSaveSlot;
  }, [currentSaveSlot]);

  // 计算gameState的哈希值
  const getGameStateHash = (state: GameState): string => {
    const hashString = JSON.stringify({
      gold: state.gold,
      stamina: state.stamina,
      maxStamina: state.maxStamina,
      lastStaminaUpdate: state.lastStaminaUpdate,
      inventory: state.inventory.map(p => ({ 
        id: p.id, 
        pokedexId: p.pokedexId,
        level: p.level,
        exp: p.exp,
        equipment: Object.keys(p.equipment).sort()
      })),
      teamIds: [...state.teamIds].sort().join(','),
      savedTeamIds: [...state.savedTeamIds].sort().join(','),
      equipmentInventory: state.equipmentInventory.map(e => ({ 
        id: e.id, 
        name: e.name,
        slot: e.slot,
        rarity: e.rarity
      })),
      unlockedStages: state.unlockedStages,
      pokedexStatus: state.pokedexStatus.map(p => ({ 
        pokedexId: p.pokedexId, 
        obtained: p.obtained,
        count: p.count,
        maxStars: p.maxStars
      })),
      equipmentStatus: state.equipmentStatus.map(e => ({ 
        equipmentId: e.equipmentId, 
        obtained: e.obtained,
        count: e.count
      })),
      achievements: state.achievements.map(a => ({ 
        id: a.id, 
        completed: a.completed,
        progress: a.progress
      }))
    });
    console.log('🔍 [useSaveLoad] 计算哈希:', hashString.substring(0, 50));
    return hashString;
  };

  // 保存游戏状态
  const saveGameState = async (stateToSave: GameState) => {
    const now = Date.now();
    const stateHash = getGameStateHash(stateToSave);
    
    // 如果gameState哈希值没有变化，不保存
    if (stateHash === lastGameStateHashRef.current) {
      console.log('跳过保存，gameState未变化');
      return;
    }
    
    console.log('触发保存操作:', { currentSaveSlot: currentSaveSlotRef.current, timestamp: now, inventoryCount: stateToSave.inventory.length, hash: stateHash.substring(0, 20) });
    
    // 如果距离上次保存不到2000ms，加入队列等待
    if (now - lastSaveTimeRef.current < 2000) {
      console.log('保存请求加入队列（时间间隔过短）');
      saveQueueRef.current.push(stateToSave);
      return;
    }

    // 如果正在保存，加入队列
    if (isSavingRef.current) {
      console.log('保存请求加入队列（正在保存）');
      saveQueueRef.current.push(stateToSave);
      return;
    }

    // 开始保存
    isSavingRef.current = true;
    lastSaveTimeRef.current = now;
    setSaveStatus('saving');

    try {
      const url = `${API_BASE_URL}/saves/${currentSaveSlotRef.current}`;
      console.log('发送保存请求:', url);
      console.log('📤 [useSaveLoad] 保存的完整状态:', {
        gold: stateToSave.gold,
        inventoryCount: stateToSave.inventory.length,
        teamIds: stateToSave.teamIds,
        unlockedStages: stateToSave.unlockedStages
      });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stateToSave),
      });
      
      console.log('保存请求响应:', { status: response.status, ok: response.ok });
      
      if (response.ok) {
        // 只有保存成功后才更新哈希值
        lastGameStateHashRef.current = stateHash;
        setSaveStatus('saved');
        console.log('✅ [useSaveLoad] 保存成功！inventory数量:', stateToSave.inventory.length);
        setTimeout(() => setSaveStatus('idle'), 1000);
      } else {
        setSaveStatus('error');
        console.log('❌ [useSaveLoad] 保存失败:', response.status);
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      setSaveStatus('error');
      console.error('❌ [useSaveLoad] 保存请求出错:', error);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } finally {
      isSavingRef.current = false;
      
      // 处理队列中的剩余保存请求
      if (saveQueueRef.current.length > 0) {
        // 只保存队列中最新的状态，丢弃中间状态
        const latestGameState = saveQueueRef.current[saveQueueRef.current.length - 1];
        console.log('处理队列中的保存请求，使用最新状态:', saveQueueRef.current.length);
        saveQueueRef.current = []; // 清空队列
        setTimeout(() => saveGameState(latestGameState), 100);
      }
    }
  };

  // 加载游戏状态
  const loadGameState = async (): Promise<GameState | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/saves/${currentSaveSlotRef.current}`);
      
      if (response.ok) {
        const savedState = await response.json();
        return savedState;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  return {
    saveGameState,
    loadGameState,
    saveStatus
  };
};
