export type PokemonType = 
  | 'Normal' | 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Ice' 
  | 'Fighting' | 'Poison' | 'Ground' | 'Flying' | 'Psychic' 
  | 'Bug' | 'Rock' | 'Ghost' | 'Dragon' | 'Steel' | 'Dark' | 'Fairy';

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';



// 稀有度权重，用于排序（数值越大越稀有）
export const RARITY_WEIGHT: Record<Rarity, number> = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Epic: 4,
  Legendary: 5
};

// 套装效果类型
export interface SetBonusEffect {
  pieces: number; // 需要的件数 (2, 4, 6)
  effect: string; // 效果描述
  statBonuses?: {
    atk?: number;
    def?: number;
    hp?: number;
    critRate?: number;
    critDamage?: number;
  };
}

// 套装定义
export interface EquipmentSet {
  id: string;
  name: string;
  requiredType: PokemonType;
  description: string;
  bonuses: SetBonusEffect[];
  pieces: {
    Weapon: string;
    Armor: string; 
    Accessory: string;
    Helmet: string;
    Gloves: string;
    Boots: string;
  };
}

// 计算升级所需经验的函数
export const calculateExpForLevel = (level: number): number => {
  if (level <= 0) return 0;
  if (level >= 100) return Infinity; // 100级为上限
  
  // 使用指数增长公式：base * level^1.5
  // 这样低等级升级快，高等级升级慢
  const baseExp = 100;
  return Math.floor(baseExp * Math.pow(level, 1.5));
};

// 计算从当前经验到下一级所需的经验
export const calculateExpToNextLevel = (currentLevel: number, currentExp: number): number => {
  const expForCurrentLevel = calculateExpForLevel(currentLevel);
  const expForNextLevel = calculateExpForLevel(currentLevel + 1);
  
  if (currentLevel >= 100) return 0;
  
  return Math.max(0, expForNextLevel - currentExp);
};

// 根据基础属性和等级计算实际属性
export const calculateStatsFromLevel = (
  baseHp: number,
  baseAtk: number,
  baseDef: number,
  level: number,
  stars: number
): { hp: number; atk: number; def: number } => {
  if (level <= 1) {
    return { hp: baseHp, atk: baseAtk, def: baseDef };
  }
  
  // 每升一级增加的属性比例
  // 星级越高，每级成长越好
  const growthRate = 0.1 + (stars * 0.05); // Common: 0.15, Uncommon: 0.20, Rare: 0.25, etc.
  
  const hp = Math.floor(baseHp * (1 + (level - 1) * growthRate));
  const atk = Math.floor(baseAtk * (1 + (level - 1) * growthRate));
  const def = Math.floor(baseDef * (1 + (level - 1) * growthRate));
  
  return { hp, atk, def };
};

export interface Equipment {
  id: string;
  name: string;
  slot: 'Weapon' | 'Armor' | 'Accessory' | 'Helmet' | 'Gloves' | 'Boots';
  atkBonus: number;
  defBonus: number;
  hpBonus: number;
  typeAffinity?: PokemonType; // 属性共鸣：仅当宝可梦属性匹配时生效
  rarity: Rarity;
  skill?: string; // 装备技能
  imageUrl?: string; // 装备图片URL
  set?: string; // 所属套装ID
}

export interface Pokemon {
  id: string;
  pokedexId: number;
  name: string;
  types: PokemonType[];
  rarity: Rarity;
  stars: number;
  baseHp: number; // 基础HP（1级时的数值）
  baseAtk: number; // 基础攻击（1级时的数值）
  baseDef: number; // 基础防御（1级时的数值）
  level: number;   // 当前等级（1-100）
  exp: number;     // 当前经验值
  equipment: {
    Weapon?: Equipment;
    Armor?: Equipment;
    Accessory?: Equipment;
    Helmet?: Equipment;
    Gloves?: Equipment;
    Boots?: Equipment;
  };
}

export interface Stage {
  id: number;
  name: string;
  difficulty: number;
  staminaCost: number;
  goldReward: number;
  enemies: {
    pokedexId: number;
    name: string;
    level: number;
    types: PokemonType[];
    hp: number;
    atk: number;
    def: number;
  }[];
}

export interface GameState {
  gold: number;
  stamina: number;
  maxStamina: number;
  lastStaminaUpdate: number;
  inventory: Pokemon[];
  teamIds: string[]; // 选中的3个宝可梦ID
  savedTeamIds: string[]; // 已保存的出战阵容
  equipmentInventory: Equipment[];
  unlockedStages: number;
  pokedexStatus: any[];
  equipmentStatus: any[];
  achievements: any[];
}