import { EXP_TABLE } from './gameUtils';

// 计算当前经验值占到下一级所需经验的百分比
export const calculateExpPercentage = (currentLevel: number, currentExp: number): number => {
  if (currentLevel >= 100) return 100;
  
  const expForCurrentLevel = EXP_TABLE[currentLevel] || 0;
  const expForNextLevel = EXP_TABLE[currentLevel + 1] || EXP_TABLE[100];
  
  if (expForNextLevel <= expForCurrentLevel) return 100;
  
  const expInCurrentLevel = currentExp - expForCurrentLevel;
  const expNeededForNextLevel = expForNextLevel - expForCurrentLevel;
  
  return Math.min(100, Math.max(0, (expInCurrentLevel / expNeededForNextLevel) * 100));
};

// 获取当前等级的经验范围
export const getExpRange = (currentLevel: number): { current: number; next: number } => {
  if (currentLevel >= 100) {
    return { current: EXP_TABLE[100], next: EXP_TABLE[100] };
  }
  return {
    current: EXP_TABLE[currentLevel] || 0,
    next: EXP_TABLE[currentLevel + 1] || EXP_TABLE[100]
  };
};