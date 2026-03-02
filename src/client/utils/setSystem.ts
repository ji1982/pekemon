import { Pokemon, Equipment, PokemonType, SetBonus } from '../types';
import { TYPE_TRANSLATIONS } from '../constants';

// 6套完整的套装定义
export const EQUIPMENT_SETS: Record<string, SetBonus> = {
  // 烈焰之心套装 - 火属性
  '烈焰之心': {
    setName: '烈焰之心',
    requiredType: 'Fire',
    pieces: {
      Weapon: '烈焰之剑',
      Armor: '烈焰铠甲', 
      Accessory: '烈焰护符',
      Helmet: '烈焰头冠',
      Gloves: '烈焰拳套',
      Boots: '烈焰战靴'
    },
    bonuses: {
      2: {
        description: '🔥 火焰之力：攻击力提升15%',
        effect: (stats) => ({ ...stats, atk: Math.floor(stats.atk * 1.15) })
      },
      4: {
        description: '🔥 烈焰风暴：受到火属性攻击时，伤害减少30%',
        effect: (stats) => stats // 防御效果在战斗系统中处理
      },
      6: {
        description: '🔥 炎帝降临：每回合开始时恢复5%最大生命值，并有20%几率造成双倍伤害',
        effect: (stats) => ({ ...stats, hp: Math.floor(stats.hp * 1.05) }) // 生命值加成作为基础效果
      }
    }
  },

  // 深海之魂套装 - 水属性  
  '深海之魂': {
    setName: '深海之魂',
    requiredType: 'Water',
    pieces: {
      Weapon: '深海三叉戟',
      Armor: '深海鳞甲',
      Accessory: '深海珍珠',
      Helmet: '深海面罩',
      Gloves: '深海手套',
      Boots: '深海鳍靴'
    },
    bonuses: {
      2: {
        description: '💧 深海之力：生命值提升20%',
        effect: (stats) => ({ ...stats, hp: Math.floor(stats.hp * 1.20) })
      },
      4: {
        description: '💧 潮汐护盾：每回合结束时恢复3%最大生命值',
        effect: (stats) => ({ ...stats, hp: Math.floor(stats.hp * 1.03) })
      },
      6: {
        description: '💧 海神恩赐：所有水属性技能伤害提升50%，并免疫冰冻状态',
        effect: (stats) => ({ ...stats, atk: Math.floor(stats.atk * 1.25), hp: Math.floor(stats.hp * 1.10) })
      }
    }
  },

  // 大地之怒套装 - 地面属性
  '大地之怒': {
    setName: '大地之怒',
    requiredType: 'Ground',
    pieces: {
      Weapon: '大地之锤',
      Armor: '大地重甲',
      Accessory: '大地宝石',
      Helmet: '大地头盔',
      Gloves: '大地拳套',
      Boots: '大地战靴'
    },
    bonuses: {
      2: {
        description: '🌍 大地之力：防御力提升25%',
        effect: (stats) => ({ ...stats, def: Math.floor(stats.def * 1.25) })
      },
      4: {
        description: '🌍 岩石皮肤：受到物理攻击时，伤害减少20%',
        effect: (stats) => stats // 防御效果在战斗系统中处理
      },
      6: {
        description: '🌍 地震领域：攻击时有30%几率使目标眩晕1回合，并增加15%暴击率',
        effect: (stats) => ({ ...stats, atk: Math.floor(stats.atk * 1.15), def: Math.floor(stats.def * 1.10) })
      }
    }
  },

  // 雷霆之怒套装 - 电属性
  '雷霆之怒': {
    setName: '雷霆之怒',
    requiredType: 'Electric',
    pieces: {
      Weapon: '雷霆之杖',
      Armor: '雷霆护甲',
      Accessory: '雷霆项链',
      Helmet: '雷霆头饰',
      Gloves: '雷霆手套',
      Boots: '雷霆疾靴'
    },
    bonuses: {
      2: {
        description: '⚡ 雷霆之力：速度提升30%（先手攻击概率增加）',
        effect: (stats) => ({ ...stats, atk: Math.floor(stats.atk * 1.10) }) // 速度效果在战斗系统中处理
      },
      4: {
        description: '⚡ 电磁脉冲：每次攻击有25%几率使目标麻痹（跳过下回合）',
        effect: (stats) => stats // 状态效果在战斗系统中处理
      },
      6: {
        description: '⚡ 雷神降临：所有攻击必定先手，且有40%几率造成150%伤害',
        effect: (stats) => ({ ...stats, atk: Math.floor(stats.atk * 1.30), hp: Math.floor(stats.hp * 1.15) })
      }
    }
  },

  // 龙之威严套装 - 龙属性
  '龙之威严': {
    setName: '龙之威严',
    requiredType: 'Dragon',
    pieces: {
      Weapon: '龙牙巨剑',
      Armor: '龙鳞圣甲',
      Accessory: '龙心宝石',
      Helmet: '龙角头冠',
      Gloves: '龙爪拳套',
      Boots: '龙尾战靴'
    },
    bonuses: {
      2: {
        description: '🐉 龙族之力：全属性提升12%',
        effect: (stats) => ({
          ...stats,
          hp: Math.floor(stats.hp * 1.12),
          atk: Math.floor(stats.atk * 1.12),
          def: Math.floor(stats.def * 1.12)
        })
      },
      4: {
        description: '🐉 龙威震慑：对非龙属性敌人造成伤害时，额外造成15%真实伤害',
        effect: (stats) => ({ ...stats, atk: Math.floor(stats.atk * 1.15) })
      },
      6: {
        description: '🐉 龙神觉醒：每损失10%生命值，攻击力提升8%（最多提升40%），并免疫控制效果',
        effect: (stats) => ({
          ...stats,
          hp: Math.floor(stats.hp * 1.20),
          atk: Math.floor(stats.atk * 1.20),
          def: Math.floor(stats.def * 1.15)
        })
      }
    }
  },

  // 超能之秘套装 - 超能力属性
  '超能之秘': {
    setName: '超能之秘',
    requiredType: 'Psychic',
    pieces: {
      Weapon: '超能水晶',
      Armor: '超能力场',
      Accessory: '超能核心',
      Helmet: '超能头环',
      Gloves: '超能手套',
      Boots: '超能轻靴'
    },
    bonuses: {
      2: {
        description: '🔮 超能之力：生命值和攻击力各提升18%',
        effect: (stats) => ({
          ...stats,
          hp: Math.floor(stats.hp * 1.18),
          atk: Math.floor(stats.atk * 1.18)
        })
      },
      4: {
        description: '🔮 心灵链接：每回合开始时，有30%几率复制上回合使用的技能效果',
        effect: (stats) => stats // 技能效果在战斗系统中处理
      },
      6: {
        description: '🔮 精神主宰：免疫所有负面状态，且每次受到攻击时有25%几率反弹50%伤害',
        effect: (stats) => ({
          ...stats,
          hp: Math.floor(stats.hp * 1.25),
          def: Math.floor(stats.def * 1.20),
          atk: Math.floor(stats.atk * 1.15)
        })
      }
    }
  }
};

// 检查宝可梦是否满足套装属性要求
export const checkPokemonSetCompatibility = (pokemon: Pokemon, requiredType: PokemonType): boolean => {
  return pokemon.types.includes(requiredType);
};

// 计算套装激活件数
export const calculateActiveSetPieces = (pokemon: Pokemon, setDefinition: SetBonus): number => {
  if (!checkPokemonSetCompatibility(pokemon, setDefinition.requiredType)) {
    return 0; // 宝可梦不满足属性要求，套装无效
  }

  let activePieces = 0;
  const equipmentSlots = ['Weapon', 'Armor', 'Accessory', 'Helmet', 'Gloves', 'Boots'] as const;

  for (const slot of equipmentSlots) {
    const equippedItem = pokemon.equipment[slot];
    if (equippedItem && equippedItem.name === setDefinition.pieces[slot]) {
      activePieces++;
    }
  }

  return activePieces;
};

// 获取激活的套装效果
export const getActiveSetBonuses = (pokemon: Pokemon): Array<{setName: string, pieces: number, bonus: SetBonus['bonuses'][2]}> => {
  const activeBonuses: Array<{setName: string, pieces: number, bonus: SetBonus['bonuses'][2]}> = [];

  for (const [setName, setDefinition] of Object.entries(EQUIPMENT_SETS)) {
    const activePieces = calculateActiveSetPieces(pokemon, setDefinition);
    
    // 检查是否有激活的套装效果（2、4、6件）
    if (activePieces >= 6 && setDefinition.bonuses[6]) {
      activeBonuses.push({ setName, pieces: 6, bonus: setDefinition.bonuses[6] });
    } else if (activePieces >= 4 && setDefinition.bonuses[4]) {
      activeBonuses.push({ setName, pieces: 4, bonus: setDefinition.bonuses[4] });
    } else if (activePieces >= 2 && setDefinition.bonuses[2]) {
      activeBonuses.push({ setName, pieces: 2, bonus: setDefinition.bonuses[2] });
    }
  }

  return activeBonuses;
};

// 应用套装效果到基础属性
export const applySetBonusesToStats = (baseStats: {hp: number, atk: number, def: number}, pokemon: Pokemon): {hp: number, atk: number, def: number} => {
  let finalStats = { ...baseStats };
  
  const activeBonuses = getActiveSetBonuses(pokemon);
  
  // 应用所有激活的套装效果（按优先级：6件 > 4件 > 2件）
  const sortedBonuses = activeBonuses.sort((a, b) => b.pieces - a.pieces);
  
  for (const bonus of sortedBonuses) {
    if (bonus.bonus.effect) {
      finalStats = bonus.bonus.effect(finalStats);
    }
  }
  
  return finalStats;
};

// 生成套装装备
export const generateSetEquipment = (setName: string, slot: keyof SetBonus['pieces'], rarity: 'Epic' | 'Legendary' = 'Epic'): Equipment => {
  const setDefinition = EQUIPMENT_SETS[setName];
  if (!setDefinition) {
    throw new Error(`Unknown set: ${setName}`);
  }

  const equipmentName = setDefinition.pieces[slot];
  const basePower = rarity === 'Legendary' ? 400 : 250;

  // 根据槽位分配基础属性
  let atkBonus = 0, defBonus = 0, hpBonus = 0;
  
  switch (slot) {
    case 'Weapon':
      atkBonus = basePower;
      hpBonus = Math.floor(basePower * 0.3);
      defBonus = Math.floor(basePower * 0.2);
      break;
    case 'Armor':
      defBonus = basePower;
      hpBonus = Math.floor(basePower * 0.3);
      atkBonus = Math.floor(basePower * 0.2);
      break;
    case 'Accessory':
      hpBonus = basePower * 2;
      atkBonus = Math.floor(basePower * 0.3);
      defBonus = Math.floor(basePower * 0.3);
      break;
    case 'Helmet':
      atkBonus = Math.floor(basePower * 0.4);
      defBonus = Math.floor(basePower * 0.4);
      hpBonus = Math.floor(basePower * 0.8);
      break;
    case 'Gloves':
      atkBonus = Math.floor(basePower * 0.6);
      defBonus = Math.floor(basePower * 0.3);
      hpBonus = Math.floor(basePower * 0.5);
      break;
    case 'Boots':
      hpBonus = Math.floor(basePower * 1.2);
      atkBonus = Math.floor(basePower * 0.3);
      defBonus = Math.floor(basePower * 0.3);
      break;
  }

  // 使用现有的装备图片系统
  const imageUrl = getEquipmentImageFromName(equipmentName);

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: equipmentName,
    slot: slot,
    atkBonus,
    defBonus,
    hpBonus,
    typeAffinity: setDefinition.requiredType,
    rarity,
    setImage: setName,
    imageUrl
  };
};

// 根据装备名称获取图片（复用现有系统）
const getEquipmentImageFromName = (name: string): string => {
  // 这里应该调用现有的 getEquipmentImage 函数
  // 但由于模块循环依赖问题，我们直接使用默认图片
  // 在实际应用中，应该从 equipmentImages 模块导入
  return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png';
};

// 获取套装信息用于显示
export const getSetInfoForDisplay = (setName: string): SetBonus | null => {
  return EQUIPMENT_SETS[setName] || null;
};