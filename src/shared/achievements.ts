import { PokemonType, Rarity } from './types';

// 宝可梦图鉴条目
export interface PokedexEntry {
  id: number;
  name: string;
  types: PokemonType[];
  rarity: Rarity;
  baseStats: { hp: number; atk: number; def: number };
  collected: boolean; // 是否已收集
}

// 装备图鉴条目
export interface EquipmentPokedexEntry {
  id: string;
  name: string;
  slot: 'Weapon' | 'Armor' | 'Accessory';
  rarity: Rarity;
  typeAffinity?: PokemonType;
  collected: boolean; // 是否已收集
}

// 成就类型
export type AchievementType = 
  | 'POKEDEX_COMPLETE'      // 宝可梦图鉴完成度
  | 'EQUIPMENT_COMPLETE'   // 装备图鉴完成度  
  | 'RARITY_COLLECTION'    // 稀有度收集
  | 'TYPE_COLLECTION'      // 属性收集
  | 'LEVEL_MILESTONE'      // 等级里程碑
  | 'GOLD_MILESTONE'       // 金币里程碑
  | 'BATTLE_MILESTONE'     // 战斗里程碑

// 成就条目
export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  requirement: number; // 完成度要求（如：收集50只宝可梦）
  reward: {
    gold: number;
    items?: string[]; // 奖励物品ID
  };
  completed: boolean;
  completedAt?: number; // 完成时间戳
}

// 预定义的成就列表
export const ACHIEVEMENTS: Achievement[] = [
  // 宝可梦图鉴成就
  {
    id: 'pokedex_10',
    name: '初出茅庐',
    description: '收集10只不同的宝可梦',
    type: 'POKEDEX_COMPLETE',
    requirement: 10,
    reward: { gold: 1000 },
    completed: false
  },
  {
    id: 'pokedex_25',
    name: '小有成就',
    description: '收集25只不同的宝可梦',
    type: 'POKEDEX_COMPLETE',
    requirement: 25,
    reward: { gold: 2500 },
    completed: false
  },
  {
    id: 'pokedex_50',
    name: '宝可梦大师',
    description: '收集50只不同的宝可梦',
    type: 'POKEDEX_COMPLETE',
    requirement: 50,
    reward: { gold: 5000 },
    completed: false
  },
  {
    id: 'pokedex_100',
    name: '传说中的训练家',
    description: '收集100只不同的宝可梦',
    type: 'POKEDEX_COMPLETE',
    requirement: 100,
    reward: { gold: 10000 },
    completed: false
  },
  {
    id: 'pokedex_complete',
    name: '完美图鉴',
    description: '收集所有宝可梦',
    type: 'POKEDEX_COMPLETE',
    requirement: 999, // 实际数量会动态计算
    reward: { gold: 50000 },
    completed: false
  },

  // 装备图鉴成就
  {
    id: 'equipment_10',
    name: '装备新手',
    description: '收集10件不同的装备',
    type: 'EQUIPMENT_COMPLETE',
    requirement: 10,
    reward: { gold: 1000 },
    completed: false
  },
  {
    id: 'equipment_25',
    name: '装备达人',
    description: '收集25件不同的装备',
    type: 'EQUIPMENT_COMPLETE',
    requirement: 25,
    reward: { gold: 2500 },
    completed: false
  },
  {
    id: 'equipment_50',
    name: '装备大师',
    description: '收集50件不同的装备',
    type: 'EQUIPMENT_COMPLETE',
    requirement: 50,
    reward: { gold: 5000 },
    completed: false
  },
  {
    id: 'equipment_complete',
    name: '完美装备库',
    description: '收集所有装备',
    type: 'EQUIPMENT_COMPLETE',
    requirement: 999, // 实际数量会动态计算
    reward: { gold: 25000 },
    completed: false
  },

  // 稀有度收集成就
  {
    id: 'legendary_1',
    name: '传说的开始',
    description: '获得第一只传说级宝可梦',
    type: 'RARITY_COLLECTION',
    requirement: 1,
    reward: { gold: 5000 },
    completed: false
  },
  {
    id: 'epic_10',
    name: '史诗收藏家',
    description: '收集10只史诗级宝可梦',
    type: 'RARITY_COLLECTION',
    requirement: 10,
    reward: { gold: 3000 },
    completed: false
  },

  // 属性收集成就
  {
    id: 'type_all',
    name: '属性全收集',
    description: '收集所有18种属性的宝可梦',
    type: 'TYPE_COLLECTION',
    requirement: 18,
    reward: { gold: 8000 },
    completed: false
  },

  // 金币里程碑
  {
    id: 'gold_10k',
    name: '小富翁',
    description: '累计获得10,000金币',
    type: 'GOLD_MILESTONE',
    requirement: 10000,
    reward: { gold: 1000 },
    completed: false
  },
  {
    id: 'gold_100k',
    name: '大富豪',
    description: '累计获得100,000金币',
    type: 'GOLD_MILESTONE',
    requirement: 100000,
    reward: { gold: 5000 },
    completed: false
  },
  {
    id: 'gold_1m',
    name: '亿万富翁',
    description: '累计获得1,000,000金币',
    type: 'GOLD_MILESTONE',
    requirement: 1000000,
    reward: { gold: 20000 },
    completed: false
  }
];

// 装备图鉴预定义（基于现有装备系统扩展）
export const EQUIPMENT_POKEDEX: EquipmentPokedexEntry[] = [
  // 武器
  { id: 'weapon_common_1', name: '木制短剑', slot: 'Weapon', rarity: 'Common', collected: false },
  { id: 'weapon_common_2', name: '铁制长剑', slot: 'Weapon', rarity: 'Common', collected: false },
  { id: 'weapon_uncommon_1', name: '精钢战斧', slot: 'Weapon', rarity: 'Uncommon', collected: false },
  { id: 'weapon_rare_1', name: '神圣权杖', slot: 'Weapon', rarity: 'Rare', collected: false },
  { id: 'weapon_epic_1', name: '龙之怒', slot: 'Weapon', rarity: 'Epic', collected: false },
  { id: 'weapon_legendary_1', name: '创世神剑', slot: 'Weapon', rarity: 'Legendary', collected: false },
  
  // 防具
  { id: 'armor_common_1', name: '皮甲', slot: 'Armor', rarity: 'Common', collected: false },
  { id: 'armor_common_2', name: '铁甲', slot: 'Armor', rarity: 'Common', collected: false },
  { id: 'armor_uncommon_1', name: '精钢铠甲', slot: 'Armor', rarity: 'Uncommon', collected: false },
  { id: 'armor_rare_1', name: '神圣护甲', slot: 'Armor', rarity: 'Rare', collected: false },
  { id: 'armor_epic_1', name: '龙鳞铠甲', slot: 'Armor', rarity: 'Epic', collected: false },
  { id: 'armor_legendary_1', name: '创世神甲', slot: 'Armor', rarity: 'Legendary', collected: false },
  
  // 饰品
  { id: 'accessory_common_1', name: '铜戒指', slot: 'Accessory', rarity: 'Common', collected: false },
  { id: 'accessory_common_2', name: '银项链', slot: 'Accessory', rarity: 'Common', collected: false },
  { id: 'accessory_uncommon_1', name: '精钢徽章', slot: 'Accessory', rarity: 'Uncommon', collected: false },
  { id: 'accessory_rare_1', name: '神圣徽章', slot: 'Accessory', rarity: 'Rare', collected: false },
  { id: 'accessory_epic_1', name: '龙之护符', slot: 'Accessory', rarity: 'Epic', collected: false },
  { id: 'accessory_legendary_1', name: '创世神符', slot: 'Accessory', rarity: 'Legendary', collected: false }
];

// 属性类型列表（用于属性收集成就）
export const ALL_POKEMON_TYPES: PokemonType[] = [
  'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic',
  'Bug', 'Rock', 'Ghost', 'Dragon', 'Steel', 'Dark', 'Fairy'
];