import { useEffect, useRef } from 'react';
import { GameState } from '../types';
import { STAMINA_RECOVERY_MS } from '@shared/constants';

export const useStamina = (
  gameState: GameState | null,
  dispatch: React.Dispatch<any>,
  loading: boolean
) => {
  // 使用ref来存储最新的gameState
  const gameStateRef = useRef(gameState);
  
  // 当gameState变化时，更新ref
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  
  useEffect(() => {
    if (loading || !gameState) return;
    
    const interval = setInterval(() => {
      const currentGameState = gameStateRef.current;
      if (!currentGameState) return;
      
      // 检查是否需要恢复体力
      const now = Date.now();
      if (now - currentGameState.lastStaminaUpdate >= STAMINA_RECOVERY_MS && currentGameState.stamina < currentGameState.maxStamina) {
        dispatch({
          type: 'UPDATE_STAMINA',
          payload: 1
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [loading, dispatch]);
};
