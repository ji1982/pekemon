import { Equipment, Rarity } from '../types';
import { v4 as uuidv4 } from 'uuid';

// 稀有度顺序
const RARITY_ORDER: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

// 获取下一个稀有度
export const getNextRarity = (currentRarity: Rarity): Rarity | null => {
  const currentIndex = RARITY_ORDER.indexOf(currentRarity);
  if (currentIndex === -1 || currentIndex >= RARITY_ORDER.length - 1) {
    return null;
  }
  return RARITY_ORDER[currentIndex + 1];
};

// 获取稀有度对应的属性倍数
export const getRarityMultiplier = (rarity: Rarity): number => {
  switch (rarity) {
    case 'Common': return 1;
    case 'Uncommon': return 1.5;
    case 'Rare': return 2;
    case 'Epic': return 3;
    case 'Legendary': return 5;
    default: return 1;
  }
};

// 获取合成费用
export const getSynthesisCost = (rarity: Rarity): number => {
  switch (rarity) {
    case 'Common': return 100;
    case 'Uncommon': return 300;
    case 'Rare': return 800;
    case 'Epic': return 2000;
    case 'Legendary': return 5000;
    default: return 100;
  }
};

// 装备技能池
const EQUIPMENT_SKILLS = [
  '破甲', '致命一击', '格挡', '先攻', 
  '暴怒', '再生', '反击', '专注'
];

// 获取技能几率
export const getSkillChance = (rarity: Rarity): number => {
  switch (rarity) {
    case 'Rare': return 0.1;
    case 'Epic': return 0.3;
    case 'Legendary': return 0.6;
    default: return 0;
  }
};

// 扩展的装备名称池 - 增加更多种类和主题
const WEAPON_NAMES = [
  // 基础武器
  '长剑', '短剑', '法杖', '匕首', '长矛', '战斧', '弓箭', '回旋镖',
  // 宝可梦主题武器
  '龙牙匕首', '火焰剑', '冰霜长矛', '雷电权杖', '岩石巨锤', '毒针', '钢刃', '妖精法杖',
  '超能念珠', '格斗拳套', '飞行之翼', '地面重锤', '虫鸣笛', '幽灵镰刀', '水之三叉戟',
  // 高级武器
  '烈焰之剑', '寒冰法杖', '雷霆之锤', '大地之矛', '星空权杖', '月光匕首', '日耀长剑'
];

const ARMOR_NAMES = [
  // 基础护甲
  '盔甲', '护盾', '胸甲', '鳞甲', '板甲', '轻甲', '重甲', '魔甲',
  // 宝可梦主题护甲
  '龙鳞铠甲', '火焰护甲', '冰霜盔甲', '雷电护盾', '岩石铠甲', '毒液护甲', '钢铁战甲', '妖精圣衣',
  '超能斗篷', '格斗护腕', '飞行披风', '地面重甲', '虫壳', '幽灵斗篷', '水之鳞甲',
  // 高级护甲
  '烈焰战甲', '寒冰圣铠', '雷霆护盾', '大地重甲', '星空斗篷', '月光轻甲', '日耀圣铠'
];

const ACCESSORY_NAMES = [
  // 基础饰品
  '项链', '戒指', '手镯', '耳环', '腰带', '护符', '宝石', '徽章',
  // 宝可梦主题饰品
  '龙眼宝石', '火焰项链', '冰霜戒指', '雷电耳环', '岩石护符', '毒液手镯', '钢铁徽章', '妖精宝石',
  '超能念珠', '格斗腰带', '飞行徽章', '地面护符', '虫鸣项链', '幽灵戒指', '水之宝石',
  // 高级饰品
  '烈焰之心', '寒冰之泪', '雷霆之眼', '大地之魂', '星空之戒', '月光之链', '日耀之冠'
];

const NAME_MAP: Record<string, string[]> = {
  Weapon: WEAPON_NAMES,
  Armor: ARMOR_NAMES,
  Accessory: ACCESSORY_NAMES
};

const PREFIXES = ['普通', '精良', '优质', '卓越', '史诗', '传说'];
const SUFFIXES = ['之刃', '之盾', '之力', '之魂', '之眼', '之心', '之翼', '之冠', '之怒', '之息', '之威', '之华'];

export const generateEquipmentName = (slot: string, rarity: Rarity): string => {
  const names = NAME_MAP[slot] || ['装备'];
  const baseName = names[Math.floor(Math.random() * names.length)];
  
  // 根据稀有度添加前缀/后缀
  if (rarity === 'Rare') {
    return `${baseName}${SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]}`;
  } else if (rarity === 'Epic') {
    return `${PREFIXES[3]}${baseName}`;
  } else if (rarity === 'Legendary') {
    const prefix = PREFIXES[5];
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    return `${prefix}${baseName}${suffix}`;
  }
  
  return baseName;
};

// 合成装备
export const synthesizeEquipment = (
  materials: Equipment[],
  targetRarity: Rarity
): Equipment => {
  if (materials.length < 3) {
    throw new Error('需要至少3件材料装备');
  }

  // 随机选择槽位类型（从材料中选择）
  const slotTypes = materials.map(eq => eq.slot);
  const randomSlot = slotTypes[Math.floor(Math.random() * slotTypes.length)];

  // 计算基础属性（取平均值然后应用倍数）
  const avgAtk = Math.floor(materials.reduce((sum, eq) => sum + eq.atkBonus, 0) / materials.length);
  const avgDef = Math.floor(materials.reduce((sum, eq) => sum + eq.defBonus, 0) / materials.length);
  const avgHp = Math.floor(materials.reduce((sum, eq) => sum + eq.hpBonus, 0) / materials.length);

  const multiplier = getRarityMultiplier(targetRarity);
  const atkBonus = Math.max(1, Math.floor(avgAtk * multiplier));
  const defBonus = Math.max(1, Math.floor(avgDef * multiplier));
  const hpBonus = Math.max(1, Math.floor(avgHp * multiplier));

  // 决定是否获得技能
  let skill: string | undefined = undefined;
  const skillChance = getSkillChance(targetRarity);
  if (Math.random() < skillChance) {
    skill = EQUIPMENT_SKILLS[Math.floor(Math.random() * EQUIPMENT_SKILLS.length)];
  }

  // 生成装备名称
  const name = generateEquipmentName(randomSlot, targetRarity);

  // 创建新装备
  const newEquipment: Equipment = {
    id: uuidv4(),
    name,
    slot: randomSlot,
    atkBonus,
    defBonus,
    hpBonus,
    rarity: targetRarity,
    skill
  };

  return newEquipment;
};

// 验证是否可以合成
export const canSynthesize = (
  materials: Equipment[],
  currentGold: number
): { valid: boolean; error?: string; cost?: number } => {
  if (materials.length < 3) {
    return { valid: false, error: '需要至少3件装备才能合成' };
  }

  // 检查所有装备是否同一稀有度
  const rarities = new Set(materials.map(eq => eq.rarity));
  if (rarities.size > 1) {
    return { valid: false, error: '所有材料装备必须是同一稀有度' };
  }

  const rarity = materials[0].rarity;
  const nextRarity = getNextRarity(rarity);
  if (!nextRarity) {
    return { valid: false, error: '无法继续提升稀有度' };
  }

  const cost = getSynthesisCost(rarity);
  if (currentGold < cost) {
    return { valid: false, error: `金币不足，需要${cost}金币` };
  }

  return { valid: true, cost };
};