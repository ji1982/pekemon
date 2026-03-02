import { Pokemon, Rarity, Equipment, PokemonType } from '../types';
import { getEquipmentImage } from './equipmentImages';

// 经验值表 - 1到100级所需经验值
export const EXP_TABLE = Array.from({ length: 101 }, (_, i) => {
  if (i === 0) return 0;
  // 使用指数增长公式：level^3 * 10
  return Math.floor(i ** 3 * 10);
});

// 计算当前等级所需经验
export const getExpForNextLevel = (currentLevel: number): number => {
  if (currentLevel >= 100) return 0;
  return EXP_TABLE[currentLevel + 1] - EXP_TABLE[currentLevel];
};

// 根据经验值计算等级
export const getLevelFromExp = (exp: number): number => {
  for (let level = 100; level >= 1; level--) {
    if (exp >= EXP_TABLE[level]) {
      return level;
    }
  }
  return 1;
};

// 计算升级后的属性增长
export const calculateStatGrowth = (baseStat: number, rarity: Rarity, stars: number): number => {
  // 基础增长率基于稀有度和星级
  const rarityMultipliers: Record<Rarity, number> = {
    Common: 1,
    Uncommon: 2,
    Rare: 3,
    Epic: 4,
    Legendary: 5
  };
  
  const starMultiplier = 1 + (stars - 1) * 0.2; // 每颗星增加20%成长率
  const growthRate = rarityMultipliers[rarity] * starMultiplier;
  
  // 返回属性增长值（基础属性的1-3%）
  return Math.max(1, Math.floor(baseStat * (0.01 + 0.02 * growthRate)));
};

// 稀有度权重映射
export const RARITY_WEIGHT: Record<Rarity, number> = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Epic: 4,
  Legendary: 5
};

// 装备技能映射
export const EQUIPMENT_SKILLS: Record<string, string> = {
  '破甲': '忽略目标20%防御',
  '致命一击': '15%几率造成200%伤害',
  '格挡': '20%几率完全格挡攻击',
  '先攻': '战斗开始时先手攻击',
  '暴怒': '生命低于30%时攻击力+50%',
  '再生': '每回合恢复2%最大生命',
  '反击': '受到攻击时10%几率反击',
  '专注': '技能冷却时间-1回合',
  '吸血': '攻击时，恢复自身造成伤害的15%体力',
  '眩晕': '攻击时，15%几率造成对手眩晕，对手停止一回合行动'
};

// 更新图鉴状态
export const updatePokedexStatus = (inventory: Pokemon[], currentStatus: any[]): any[] => {
  const updatedStatus = [...currentStatus];
  
  inventory.forEach(poke => {
    const existingEntry = updatedStatus.find(entry => entry.pokedexId === poke.pokedexId);
    if (existingEntry) {
      existingEntry.obtained = true;
      existingEntry.count += 1;
      existingEntry.maxStars = Math.max(existingEntry.maxStars, poke.stars);
    } else {
      updatedStatus.push({
        pokedexId: poke.pokedexId,
        obtained: true,
        count: 1,
        maxStars: poke.stars
      });
    }
  });
  
  return updatedStatus;
};

// 检查成就
export const checkAchievements = (achievements: any[], pokedexStatus: any[], equipmentStatus: any[], gold: number): any[] => {
  const updatedAchievements = [...achievements];
  const obtainedPokemonCount = pokedexStatus.filter(entry => entry.obtained).length;
  const obtainedEquipmentCount = equipmentStatus.filter(entry => entry.obtained).length;
  
  updatedAchievements.forEach(achievement => {
    if (!achievement.completed) {
      if (achievement.type === 'POKEDEX_COMPLETE' && obtainedPokemonCount >= achievement.requirement) {
        achievement.completed = true;
      } else if (achievement.type === 'EQUIPMENT_COMPLETE' && obtainedEquipmentCount >= achievement.requirement) {
        achievement.completed = true;
      } else if (achievement.type === 'GOLD_MILESTONE' && gold >= achievement.requirement) {
        achievement.completed = true;
      }
    }
  });
  
  return updatedAchievements;
};

// 生成随机装备（包含技能和图片）
export const generateRandomEquipment = (rarity: Rarity): Equipment => {
  const types: PokemonType[] = ['Fire', 'Water', 'Grass', 'Electric', 'Normal', 'Psychic', 'Dragon'];
  const hasAffinity = Math.random() > 0.6;
  const hasSkill = Math.random() > 0.8; // 20%几率有技能
  
  // 装备名称模板
  const weaponNames = ['龙牙匕首', '火焰剑', '神圣权杖', '冰霜长矛', '暗影利刃'];
  const armorNames = ['坚硬外壳', '神圣圣衣', '暗影斗篷', '冰霜盔甲', '龙鳞铠甲'];
  const accessoryNames = ['龙眼宝石', '雷电耳环', '火焰项链', '丝绸围巾', '神圣徽章', '冰霜戒指'];
  
  const slots: ('Weapon' | 'Armor' | 'Accessory')[] = ['Weapon', 'Armor', 'Accessory'];
  const slot = slots[Math.floor(Math.random() * slots.length)];
  
  // 根据稀有度设置属性
  const powerMap: Record<Rarity, number> = { 
    Common: 15, 
    Uncommon: 35, 
    Rare: 80, 
    Epic: 200, 
    Legendary: 600 
  };
  const power = powerMap[rarity];
  
  // 随机选择技能
  const skills = Object.keys(EQUIPMENT_SKILLS);
  const skill = hasSkill ? skills[Math.floor(Math.random() * skills.length)] : undefined;
  
  // 设置名称
  let name: string;
  if (slot === 'Weapon') {
    name = weaponNames[Math.floor(Math.random() * weaponNames.length)];
  } else if (slot === 'Armor') {
    name = armorNames[Math.floor(Math.random() * armorNames.length)];
  } else {
    name = accessoryNames[Math.floor(Math.random() * accessoryNames.length)];
  }
  
  // 如果是Legendary装备，添加前缀
  if (rarity === 'Legendary') {
    name = `远古${name}`;
  }

  // 获取装备图片
  const image = getEquipmentImage(slot, rarity, name);

  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    slot,
    atkBonus: slot === 'Weapon' ? power : Math.floor(power * 0.4),
    defBonus: slot === 'Armor' ? power : Math.floor(power * 0.4),
    hpBonus: slot === 'Accessory' ? power * 2.5 : Math.floor(power * 0.8),
    typeAffinity: hasAffinity ? types[Math.floor(Math.random() * types.length)] : undefined,
    rarity,
    skill: skill,
    image: image
  };
};
