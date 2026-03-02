import { Pokemon, Equipment, SetEffect } from '../types';
import { SETS } from './setSystem';

// 检查宝可梦是否满足套装的属性要求
export const checkPokemonTypeMatch = (pokemon: Pokemon, requiredTypes: string[]): boolean => {
  if (requiredTypes.length === 0) return true;
  
  // 检查宝可梦是否拥有套装要求的任意一个属性
  return requiredTypes.some(requiredType => 
    pokemon.types.includes(requiredType as any)
  );
};

// 获取宝可梦当前激活的套装效果
export const getActiveSetEffects = (pokemon: Pokemon): SetEffect[] => {
  const equippedItems = Object.values(pokemon.equipment).filter(Boolean) as Equipment[];
  if (equippedItems.length === 0) return [];
  
  // 按套装分组
  const setGroups: Record<string, Equipment[]> = {};
  equippedItems.forEach(item => {
    if (item.set && item.setId) {
      if (!setGroups[item.setId]) {
        setGroups[item.setId] = [];
      }
      setGroups[item.setId].push(item);
    }
  });
  
  const activeEffects: SetEffect[] = [];
  
  // 检查每个套装的激活效果
  Object.entries(setGroups).forEach(([setId, items]) => {
    const set = SETS.find(s => s.id === setId);
    if (!set) return;
    
    // 检查属性要求
    const typeMatch = checkPokemonTypeMatch(pokemon, set.requiredTypes);
    if (!typeMatch) return; // 属性不匹配，效果不生效
    
    const itemCount = items.length;
    
    // 检查2件套效果
    if (itemCount >= 2 && set.effects['2']) {
      activeEffects.push({
        ...set.effects['2'],
        setName: set.name,
        pieces: 2
      });
    }
    
    // 检查4件套效果
    if (itemCount >= 4 && set.effects['4']) {
      activeEffects.push({
        ...set.effects['4'],
        setName: set.name,
        pieces: 4
      });
    }
    
    // 检查6件套效果
    if (itemCount >= 6 && set.effects['6']) {
      activeEffects.push({
        ...set.effects['6'],
        setName: set.name,
        pieces: 6
      });
    }
  });
  
  return activeEffects;
};

// 计算套装效果对属性的加成
export const calculateSetBonuses = (pokemon: Pokemon) => {
  const setEffects = getActiveSetEffects(pokemon);
  let hpBonus = 0;
  let atkBonus = 0;
  let defBonus = 0;
  let specialEffects: string[] = [];
  
  setEffects.forEach(effect => {
    if (effect.type === 'stat') {
      hpBonus += effect.hp || 0;
      atkBonus += effect.atk || 0;
      defBonus += effect.def || 0;
    } else if (effect.type === 'special') {
      specialEffects.push(effect.description);
    }
  });
  
  return {
    hpBonus,
    atkBonus,
    defBonus,
    specialEffects,
    activeSets: setEffects.map(effect => ({
      name: effect.setName,
      pieces: effect.pieces,
      description: effect.description
    }))
  };
};