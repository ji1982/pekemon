export type PokemonType = 
  | 'Normal' | 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Ice' 
  | 'Fighting' | 'Poison' | 'Ground' | 'Flying' | 'Psychic' 
  | 'Bug' | 'Rock' | 'Ghost' | 'Dragon' | 'Steel' | 'Dark' | 'Fairy';

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';



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
  baseSpeed: number,
  baseSpAtk: number,
  level: number,
  stars: number
): { hp: number; atk: number; def: number; speed: number; spAtk: number } => {
  if (level <= 1) {
    return { 
      hp: baseHp, 
      atk: baseAtk, 
      def: baseDef,
      speed: baseSpeed,
      spAtk: baseSpAtk
    };
  }
  
  // 每升一级增加的属性比例
  // 星级越高，每级成长越好
  const growthRate = 0.1 + (stars * 0.05); // Common: 0.15, Uncommon: 0.20, Rare: 0.25, etc.
  
  const hp = Math.floor(baseHp * (1 + (level - 1) * growthRate));
  const atk = Math.floor(baseAtk * (1 + (level - 1) * growthRate));
  const def = Math.floor(baseDef * (1 + (level - 1) * growthRate));
  const speed = Math.floor(baseSpeed * (1 + (level - 1) * growthRate));
  const spAtk = Math.floor(baseSpAtk * (1 + (level - 1) * growthRate));
  
  return { hp, atk, def, speed, spAtk };
};

export interface Equipment {
  id: string;
  name: string;
  slot: 'Weapon' | 'Armor' | 'Accessory';
  atkBonus: number;
  defBonus: number;
  hpBonus: number;
  speedBonus?: number;    // 新增速度加成
  spAtkBonus?: number;    // 新增特攻加成
  typeAffinity?: PokemonType; // 属性共鸣：仅当宝可梦属性匹配时生效
  rarity: Rarity;
  skill?: string; // 装备技能
  imageUrl?: string; // 装备图片URL
}

export interface Pokemon {
  id: string;
  pokedexId: number;
  name: string;
  types: PokemonType[];
  rarity: Rarity;
  stars: number;
  baseHp: number;     // 基础体力（1级时的数值）
  baseAtk: number;    // 基础攻击（1级时的数值）
  baseDef: number;    // 基础防御（1级时的数值）
  baseSpeed: number;  // 基础速度（1级时的数值）
  baseSpAtk: number;  // 基础特攻（1级时的数值）
  level: number;      // 当前等级（1-100）
  exp: number;        // 当前经验值
  equipment: {
    Weapon?: Equipment;
    Armor?: Equipment;
    Accessory?: Equipment;
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
    speed: number;    // 新增敌人速度
    spAtk: number;    // 新增敌人特攻
  }[];
}

// 图鉴系统相关类型
export interface PokedexEntryStatus {
  pokedexId: number;
  obtained: boolean;
  count: number;
  maxStars: number;
}

export interface EquipmentEntryStatus {
  equipmentId: string;
  name: string;
  obtained: boolean;
  count: number;
}

// 成就系统相关类型
export interface Achievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  reward: { gold: number; items?: string[] };
  progress?: number;
  total?: number;
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
  // 新增图鉴和成就系统
  pokedexStatus: PokedexEntryStatus[];
  equipmentStatus: EquipmentEntryStatus[];
  achievements: Achievement[];
}