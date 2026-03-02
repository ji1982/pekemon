/**
 * 宝可梦综合实力评分计算器（修复版 - 包含装备和技能）
 * 
 * 修复说明：装备属性和技能加成不应受到等级/稀有度/星级乘数影响
 * 战力 = (基础属性 × 乘数) + 装备属性 + 技能加成
 */

import { Pokemon, Equipment } from '../types';

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
  '破甲': 150,           // 忽略目标20%防御
  '致命一击': 200,       // 15%几率造成200%伤害
  '格挡': 120,           // 20%几率完全格挡攻击
  '先攻': 100,           // 战斗开始时先手攻击
  '暴怒': 180,           // 生命低于30%时攻击力+50%
  '再生': 80,            // 每回合恢复2%最大生命
  '反击': 160,           // 受到攻击时10%几率反击
  '专注': 90             // 技能冷却时间-1回合
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
 * 计算宝可梦的综合实力评分（修复版）
 * 战力 = (基础属性 × 乘数) + 装备属性 + 技能加成
 * @param pokemon 宝可梦对象
 * @returns 综合实力评分（四舍五入到整数）
 */
export const calculatePowerScore = (pokemon: Pokemon): number => {
  const { baseHp, baseAtk, baseDef, level, stars, rarity, equipment, types } = pokemon;
  
  // 基础属性总和（攻击 + 防御 + HP）
  const baseStats = baseAtk + baseDef + baseHp;
  
  // 装备属性加成（不应用乘数）
  const weaponStats = calculateEquipmentStats(equipment?.Weapon, types);
  const armorStats = calculateEquipmentStats(equipment?.Armor, types);
  const accessoryStats = calculateEquipmentStats(equipment?.Accessory, types);
  const totalEquipmentStats = weaponStats + armorStats + accessoryStats;
  
  // 装备技能加成（不应用乘数）
  const weaponSkillBonus = calculateEquipmentSkillBonus(equipment?.Weapon);
  const armorSkillBonus = calculateEquipmentSkillBonus(equipment?.Armor);
  const accessorySkillBonus = calculateEquipmentSkillBonus(equipment?.Accessory);
  const totalSkillBonus = weaponSkillBonus + armorSkillBonus + accessorySkillBonus;
  
  // 乘数只应用于基础属性
  const levelMultiplier = 1 + (level - 1) * 0.02;
  const rarityMultiplier = RARITY_WEIGHTS[rarity] || 1.0;
  const starMultiplier = STAR_WEIGHTS[stars] || 1.0;
  
  // 修正后的计算：(基础属性 × 乘数) + 装备属性 + 技能加成
  const finalScore = (baseStats * levelMultiplier * rarityMultiplier * starMultiplier) + totalEquipmentStats + totalSkillBonus;
  
  return Math.round(finalScore);
};

/**
 * 获取战斗力评级文本
 * @param score 综合实力评分
 * @returns 评级文本
 */
export const getPowerRating = (score: number): string => {
  if (score >= 15000) return 'SSS';
  if (score >= 10000) return 'SS';
  if (score >= 6000) return 'S';
  if (score >= 3000) return 'A';
  if (score >= 1500) return 'B';
  if (score >= 600) return 'C';
  return 'D';
};

/**
 * 获取详细的战力分解信息（用于调试或详细显示）
 * @param pokemon 宝可梦对象
 * @returns 战力分解详情
 */
export const getPowerBreakdown = (pokemon: Pokemon): {
  baseStats: number;
  equipmentStats: number;
  skillBonus: number;
  multipliers: {
    level: number;
    rarity: number;
    stars: number;
  };
  finalScore: number;
} => {
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
  
  const multipliedBaseStats = baseStats * levelMultiplier * rarityMultiplier * starMultiplier;
  const finalScore = Math.round(multipliedBaseStats + equipmentStats + skillBonus);
  
  return {
    baseStats: Math.round(multipliedBaseStats),
    equipmentStats,
    skillBonus,
    multipliers: {
      level: levelMultiplier,
      rarity: rarityMultiplier,
      stars: starMultiplier
    },
    finalScore
  };
};