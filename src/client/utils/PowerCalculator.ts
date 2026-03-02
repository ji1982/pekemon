/**
 * 宝可梦综合实力评分计算器（包含装备和技能）
 * 修复版本：基础属性应用乘数，装备和技能不应用乘数
 */

import { Pokemon, Equipment } from '../types';

// 缓存计算结果，避免重复计算
const powerScoreCache = new Map<string, number>();
const powerBreakdownCache = new Map<string, any>();

// 稀有度权重系数
const RARITY_WEIGHTS: Record<string, number> = {
  Common: 1.0,
  Uncommon: 1.2,
  Rare: 1.5,
  Epic: 2.0,
  Legendary: 2.5
};

// 星级权重系数
const STAR_WEIGHTS: Record<number, number> = {
  1: 1.0,
  2: 1.3,
  3: 1.7,
  4: 2.2,
  5: 2.8
};

// 装备技能战力加成映射
const SKILL_POWER_BONUSES: Record<string, number> = {
  '破甲': 50,            // 忽略目标20%防御
  '致命一击': 80,        // 15%几率造成200%伤害
  '格挡': 60,            // 20%几率完全格挡攻击
  '先攻': 40,            // 战斗开始时先手攻击
  '暴怒': 70,            // 生命低于30%时攻击力+50%
  '再生': 50,            // 每回合恢复2%最大生命
  '反击': 60,            // 受到攻击时10%几率反击
  '专注': 30             // 技能冷却时间-1回合
};

// 生成缓存键
const generateCacheKey = (pokemon: Pokemon): string => {
  const { baseHp, baseAtk, baseDef, level, stars, rarity, equipment, types } = pokemon;
  const equipmentKey = JSON.stringify(equipment);
  return `${baseHp}-${baseAtk}-${baseDef}-${level}-${stars}-${rarity}-${equipmentKey}-${types.join(',')}`;
};

/**
 * 计算装备提供的基础属性加成
 * @param equipment 装备对象
 * @param pokemonType 宝可梦的属性类型（用于属性共鸣检查）
 * @returns 装备属性加成总和
 */
const calculateEquipmentStats = (equipment: Equipment | undefined, pokemonTypes: string[]): number => {
  if (!equipment) return 0;
  
  // 检查属性共鸣
  const hasAffinity = !equipment.typeAffinity || pokemonTypes.includes(equipment.typeAffinity);
  
  if (!hasAffinity) {
    return 0; // 无属性共鸣，不生效
  }
  
  // 装备属性加成总和
  const equipmentStats = (equipment.atkBonus || 0) + (equipment.defBonus || 0) + (equipment.hpBonus || 0);
  
  return equipmentStats;
};

/**
 * 计算装备技能提供的战力加成
 * @param equipment 装备对象
 * @returns 技能战力加成
 */
const calculateEquipmentSkillBonus = (equipment: Equipment | undefined): number => {
  if (!equipment || !equipment.skill) return 0;
  
  return SKILL_POWER_BONUSES[equipment.skill] || 0;
};

/**
 * 计算宝可梦的综合实力评分（包含装备和技能）
 * 战力 = (基础属性 × 乘数) + 装备属性 + 技能加成
 * @param pokemon 宝可梦对象
 * @returns 综合实力评分（四舍五入到整数）
 */
export const calculatePowerScore = (pokemon: Pokemon): number => {
  const cacheKey = generateCacheKey(pokemon);
  
  // 检查缓存
  if (powerScoreCache.has(cacheKey)) {
    return powerScoreCache.get(cacheKey)!;
  }
  
  const { baseHp, baseAtk, baseDef, level, stars, rarity, equipment, types } = pokemon;
  
  // 基础属性总和（攻击 + 防御 + HP）
  const baseStats = baseAtk + baseDef + baseHp;
  
  // 装备属性加成
  const weaponStats = calculateEquipmentStats(equipment?.Weapon, types);
  const armorStats = calculateEquipmentStats(equipment?.Armor, types);
  const accessoryStats = calculateEquipmentStats(equipment?.Accessory, types);
  const totalEquipmentStats = weaponStats + armorStats + accessoryStats;
  
  // 装备技能加成
  const weaponSkillBonus = calculateEquipmentSkillBonus(equipment?.Weapon);
  const armorSkillBonus = calculateEquipmentSkillBonus(equipment?.Armor);
  const accessorySkillBonus = calculateEquipmentSkillBonus(equipment?.Accessory);
  const totalSkillBonus = weaponSkillBonus + armorSkillBonus + accessorySkillBonus;
  
  // 乘数只应用于基础属性
  const levelMultiplier = 1 + (level - 1) * 0.02;
  const rarityMultiplier = RARITY_WEIGHTS[rarity] || 1.0;
  const starMultiplier = STAR_WEIGHTS[stars] || 1.0;
  
  const baseStatsWithMultipliers = baseStats * levelMultiplier * rarityMultiplier * starMultiplier;
  
  // 综合计算：(基础属性 × 乘数) + 装备属性 + 技能加成
  const finalScore = Math.round(baseStatsWithMultipliers + totalEquipmentStats + totalSkillBonus);
  
  // 缓存结果
  powerScoreCache.set(cacheKey, finalScore);
  
  return finalScore;
};

/**
 * 获取战斗力评级文本
 * @param score 综合实力评分
 * @returns 评级文本
 */
export const getPowerRating = (score: number): string => {
  if (score >= 10000) return 'SSS';
  if (score >= 5000) return 'SS';
  if (score >= 2000) return 'S';
  if (score >= 1000) return 'A';
  if (score >= 500) return 'B';
  if (score >= 200) return 'C';
  return 'D';
};

/**
 * 获取详细的战力分解信息（用于调试或详细显示）
 * @param pokemon 宝可梦对象
 * @returns 战力分解详情
 */
export const getPowerBreakdown = (pokemon: Pokemon): {
  baseStats: number;
  baseStatsWithMultipliers: number;
  equipmentStats: number;
  skillBonus: number;
  multipliers: {
    level: number;
    rarity: number;
    stars: number;
  };
  finalScore: number;
} => {
  const cacheKey = generateCacheKey(pokemon);
  
  // 检查缓存
  if (powerBreakdownCache.has(cacheKey)) {
    return powerBreakdownCache.get(cacheKey)!;
  }
  
  const { baseHp, baseAtk, baseDef, level, stars, rarity, equipment, types } = pokemon;
  
  const baseStats = baseAtk + baseDef + baseHp;
  
  const weaponStats = calculateEquipmentStats(equipment?.Weapon, types);
  const armorStats = calculateEquipmentStats(equipment?.Armor, types);
  const accessoryStats = calculateEquipmentStats(equipment?.Accessory, types);
  const equipmentStats = weaponStats + armorStats + accessoryStats;
  
  const weaponSkillBonus = calculateEquipmentSkillBonus(equipment?.Weapon);
  const armorSkillBonus = calculateEquipmentSkillBonus(equipment?.Armor);
  const accessorySkillBonus = calculateEquipmentSkillBonus(equipment?.Accessory);
  const skillBonus = weaponSkillBonus + armorSkillBonus + accessorySkillBonus;
  
  const levelMultiplier = 1 + (level - 1) * 0.02;
  const rarityMultiplier = RARITY_WEIGHTS[rarity] || 1.0;
  const starMultiplier = STAR_WEIGHTS[stars] || 1.0;
  
  const baseStatsWithMultipliers = baseStats * levelMultiplier * rarityMultiplier * starMultiplier;
  const finalScore = Math.round(baseStatsWithMultipliers + equipmentStats + skillBonus);
  
  const result = {
    baseStats,
    baseStatsWithMultipliers,
    equipmentStats,
    skillBonus,
    multipliers: {
      level: levelMultiplier,
      rarity: rarityMultiplier,
      stars: starMultiplier
    },
    finalScore
  };
  
  // 缓存结果
  powerBreakdownCache.set(cacheKey, result);
  
  return result;
};

/**
 * 清除所有缓存
 */
export const clearPowerScoreCache = (): void => {
  powerScoreCache.clear();
  powerBreakdownCache.clear();
};

/**
 * 清除特定宝可梦的缓存
 * @param pokemon 宝可梦对象
 */
export const clearPowerScoreCacheForPokemon = (pokemon: Pokemon): void => {
  const cacheKey = generateCacheKey(pokemon);
  powerScoreCache.delete(cacheKey);
  powerBreakdownCache.delete(cacheKey);
};