import { PokemonType, Rarity } from './types';

export const TYPE_TRANSLATIONS: Record<PokemonType, string> = {
  Normal: '普', Fire: '火', Water: '水', Electric: '电',
  Grass: '草', Ice: '冰', Fighting: '格斗', Poison: '毒',
  Ground: '地面', Flying: '飞', Psychic: '超能力', Bug: '虫',
  Rock: '岩石', Ghost: '幽灵', Dragon: '龙', Steel: '钢',
  Dark: '恶', Fairy: '妖精'
};

export const TYPE_COLORS: Record<PokemonType, string> = {
  Normal: '#A8A77A', Fire: '#EE8130', Water: '#6390F0', Electric: '#F7D02C',
  Grass: '#7AC74C', Ice: '#96D9D6', Fighting: '#C22E28', Poison: '#A33EA1',
  Ground: '#E2BF65', Flying: '#A98FF3', Psychic: '#F95587', Bug: '#A6B91A',
  Rock: '#B6A136', Ghost: '#735797', Dragon: '#6F35FC', Steel: '#B7B7CE',
  Dark: '#705746', Fairy: '#D685AD'
};

// 完整的属性克制表 (攻击方 -> 防御方 -> 倍率)
export const TYPE_CHART: Record<PokemonType, Record<PokemonType, number>> = {
  Normal: {
    Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 1, Poison: 1,
    Ground: 1, Flying: 1, Psychic: 1, Bug: 1, Rock: 0.5, Ghost: 0, Dragon: 1, Steel: 0.5, Dark: 1, Fairy: 1
  },
  Fire: {
    Normal: 1, Fire: 0.5, Water: 0.5, Electric: 1, Grass: 2, Ice: 2, Fighting: 1, Poison: 1,
    Ground: 1, Flying: 1, Psychic: 1, Bug: 2, Rock: 0.5, Ghost: 1, Dragon: 0.5, Steel: 2, Dark: 1, Fairy: 1
  },
  Water: {
    Normal: 1, Fire: 2, Water: 0.5, Electric: 1, Grass: 0.5, Ice: 1, Fighting: 1, Poison: 1,
    Ground: 2, Flying: 1, Psychic: 1, Bug: 1, Rock: 2, Ghost: 1, Dragon: 0.5, Steel: 1, Dark: 1, Fairy: 1
  },
  Electric: {
    Normal: 1, Fire: 1, Water: 2, Electric: 0.5, Grass: 0.5, Ice: 1, Fighting: 1, Poison: 1,
    Ground: 0, Flying: 2, Psychic: 1, Bug: 1, Rock: 1, Ghost: 1, Dragon: 0.5, Steel: 1, Dark: 1, Fairy: 1
  },
  Grass: {
    Normal: 1, Fire: 0.5, Water: 2, Electric: 1, Grass: 0.5, Ice: 1, Fighting: 1, Poison: 0.5,
    Ground: 2, Flying: 0.5, Psychic: 1, Bug: 0.5, Rock: 2, Ghost: 1, Dragon: 0.5, Steel: 0.5, Dark: 1, Fairy: 1
  },
  Ice: {
    Normal: 1, Fire: 0.5, Water: 0.5, Electric: 1, Grass: 2, Ice: 0.5, Fighting: 1, Poison: 1,
    Ground: 2, Flying: 2, Psychic: 1, Bug: 1, Rock: 1, Ghost: 1, Dragon: 2, Steel: 0.5, Dark: 1, Fairy: 1
  },
  Fighting: {
    Normal: 2, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 2, Fighting: 1, Poison: 0.5,
    Ground: 1, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dragon: 1, Steel: 2, Dark: 2, Fairy: 0.5
  },
  Poison: {
    Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 2, Ice: 1, Fighting: 1, Poison: 0.5,
    Ground: 0.5, Flying: 1, Psychic: 1, Bug: 1, Rock: 0.5, Ghost: 0.5, Dragon: 1, Steel: 0, Dark: 1, Fairy: 2
  },
  Ground: {
    Normal: 1, Fire: 2, Water: 1, Electric: 2, Grass: 0.5, Ice: 1, Fighting: 1, Poison: 2,
    Ground: 1, Flying: 0, Psychic: 1, Bug: 0.5, Rock: 2, Ghost: 1, Dragon: 1, Steel: 2, Dark: 1, Fairy: 1
  },
  Flying: {
    Normal: 1, Fire: 1, Water: 1, Electric: 0.5, Grass: 2, Ice: 1, Fighting: 2, Poison: 1,
    Ground: 1, Flying: 1, Psychic: 1, Bug: 2, Rock: 0.5, Ghost: 1, Dragon: 1, Steel: 0.5, Dark: 1, Fairy: 1
  },
  Psychic: {
    Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 2, Poison: 2,
    Ground: 1, Flying: 1, Psychic: 0.5, Bug: 1, Rock: 1, Ghost: 1, Dragon: 1, Steel: 0.5, Dark: 0, Fairy: 1
  },
  Bug: {
    Normal: 1, Fire: 0.5, Water: 1, Electric: 1, Grass: 2, Ice: 1, Fighting: 0.5, Poison: 0.5,
    Ground: 1, Flying: 0.5, Psychic: 2, Bug: 1, Rock: 1, Ghost: 0.5, Dragon: 1, Steel: 0.5, Dark: 2, Fairy: 0.5
  },
  Rock: {
    Normal: 1, Fire: 2, Water: 1, Electric: 1, Grass: 1, Ice: 2, Fighting: 0.5, Poison: 1,
    Ground: 0.5, Flying: 2, Psychic: 1, Bug: 2, Rock: 1, Ghost: 1, Dragon: 1, Steel: 0.5, Dark: 1, Fairy: 1
  },
  Ghost: {
    Normal: 0, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 1, Poison: 1,
    Ground: 1, Flying: 1, Psychic: 2, Bug: 1, Rock: 1, Ghost: 2, Dragon: 1, Steel: 1, Dark: 0.5, Fairy: 1
  },
  Dragon: {
    Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 1, Poison: 1,
    Ground: 1, Flying: 1, Psychic: 1, Bug: 1, Rock: 1, Ghost: 1, Dragon: 2, Steel: 0.5, Dark: 1, Fairy: 0
  },
  Steel: {
    Normal: 1, Fire: 0.5, Water: 0.5, Electric: 0.5, Grass: 1, Ice: 2, Fighting: 1, Poison: 1,
    Ground: 1, Flying: 1, Psychic: 1, Bug: 1, Rock: 2, Ghost: 1, Dragon: 1, Steel: 0.5, Dark: 1, Fairy: 2
  },
  Dark: {
    Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 0.5, Poison: 1,
    Ground: 1, Flying: 1, Psychic: 2, Bug: 1, Rock: 1, Ghost: 2, Dragon: 1, Steel: 1, Dark: 0.5, Fairy: 0.5
  },
  Fairy: {
    Normal: 1, Fire: 0.5, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 2, Poison: 0.5,
    Ground: 1, Flying: 1, Psychic: 1, Bug: 1, Rock: 1, Ghost: 1, Dragon: 2, Steel: 0.5, Dark: 2, Fairy: 1
  }
};

export interface PokedexEntry {
  id: number;
  name: string;
  types: PokemonType[];
  rarity: Rarity;
  baseStats: { hp: number; atk: number; def: number };
}

// 根据官方基础数据构建完整的宝可梦图鉴
export const POKEDEX: PokedexEntry[] = [
  // 火系（8张）
  { id: 4, name: '小火龙', types: ['Fire'], rarity: 'Common', baseStats: { hp: 39, atk: 52, def: 43 } },
  { id: 5, name: '火恐龙', types: ['Fire'], rarity: 'Uncommon', baseStats: { hp: 58, atk: 64, def: 58 } },
  { id: 6, name: '喷火龙', types: ['Fire', 'Flying'], rarity: 'Rare', baseStats: { hp: 78, atk: 84, def: 78 } },
  { id: 255, name: '火稚鸡', types: ['Fire'], rarity: 'Common', baseStats: { hp: 45, atk: 60, def: 40 } },
  { id: 256, name: '力壮鸡', types: ['Fire', 'Fighting'], rarity: 'Uncommon', baseStats: { hp: 60, atk: 85, def: 60 } },
  { id: 257, name: '火焰鸡', types: ['Fire', 'Fighting'], rarity: 'Rare', baseStats: { hp: 80, atk: 120, def: 70 } },
  { id: 146, name: '火焰鸟', types: ['Fire', 'Flying'], rarity: 'Epic', baseStats: { hp: 90, atk: 100, def: 90 } },
  { id: 646, name: '莱希拉姆', types: ['Dragon', 'Fire'], rarity: 'Legendary', baseStats: { hp: 100, atk: 120, def: 90 } },
  
  // 水系（8张）
  { id: 7, name: '杰尼龟', types: ['Water'], rarity: 'Common', baseStats: { hp: 44, atk: 48, def: 65 } },
  { id: 8, name: '卡咪龟', types: ['Water'], rarity: 'Uncommon', baseStats: { hp: 59, atk: 63, def: 80 } },
  { id: 9, name: '水箭龟', types: ['Water'], rarity: 'Rare', baseStats: { hp: 79, atk: 83, def: 100 } },
  { id: 116, name: '墨海马', types: ['Water'], rarity: 'Common', baseStats: { hp: 30, atk: 40, def: 70 } },
  { id: 117, name: '角金鱼', types: ['Water'], rarity: 'Uncommon', baseStats: { hp: 55, atk: 65, def: 95 } },
  { id: 230, name: '刺龙王', types: ['Water', 'Dragon'], rarity: 'Rare', baseStats: { hp: 75, atk: 95, def: 95 } },
  { id: 144, name: '急冻鸟', types: ['Ice', 'Flying'], rarity: 'Epic', baseStats: { hp: 90, atk: 85, def: 100 } },
  { id: 384, name: '烈空坐', types: ['Dragon', 'Flying'], rarity: 'Legendary', baseStats: { hp: 105, atk: 150, def: 90 } },
  
  // 草系（7张）
  { id: 1, name: '妙蛙种子', types: ['Grass', 'Poison'], rarity: 'Common', baseStats: { hp: 45, atk: 49, def: 49 } },
  { id: 2, name: '妙蛙草', types: ['Grass', 'Poison'], rarity: 'Uncommon', baseStats: { hp: 60, atk: 62, def: 63 } },
  { id: 3, name: '妙蛙花', types: ['Grass', 'Poison'], rarity: 'Rare', baseStats: { hp: 80, atk: 82, def: 83 } },
  { id: 43, name: '走路草', types: ['Grass', 'Poison'], rarity: 'Common', baseStats: { hp: 45, atk: 50, def: 55 } },
  { id: 44, name: '臭臭花', types: ['Grass', 'Poison'], rarity: 'Uncommon', baseStats: { hp: 60, atk: 65, def: 70 } },
  { id: 45, name: '霸王花', types: ['Grass', 'Poison'], rarity: 'Rare', baseStats: { hp: 75, atk: 80, def: 85 } },
  { id: 716, name: '哲尔尼亚斯', types: ['Fairy'], rarity: 'Legendary', baseStats: { hp: 126, atk: 131, def: 95 } },
  
  // 电系（7张）
  { id: 25, name: '皮卡丘', types: ['Electric'], rarity: 'Common', baseStats: { hp: 35, atk: 55, def: 40 } },
  { id: 26, name: '雷丘', types: ['Electric'], rarity: 'Rare', baseStats: { hp: 60, atk: 90, def: 55 } },
  { id: 81, name: '小磁怪', types: ['Electric', 'Steel'], rarity: 'Common', baseStats: { hp: 25, atk: 35, def: 70 } },
  { id: 82, name: '三合一磁怪', types: ['Electric', 'Steel'], rarity: 'Uncommon', baseStats: { hp: 60, atk: 60, def: 95 } },
  { id: 462, name: '自爆磁怪', types: ['Electric', 'Steel'], rarity: 'Rare', baseStats: { hp: 70, atk: 70, def: 115 } },
  { id: 145, name: '闪电鸟', types: ['Electric', 'Flying'], rarity: 'Epic', baseStats: { hp: 90, atk: 90, def: 85 } },
  { id: 172, name: '皮卡丘（帽子）', types: ['Electric'], rarity: 'Rare', baseStats: { hp: 35, atk: 55, def: 40 } },
  
  // 冰系（6张）
  { id: 86, name: '小海狮', types: ['Water', 'Ice'], rarity: 'Common', baseStats: { hp: 65, atk: 45, def: 55 } },
  { id: 87, name: '白海狮', types: ['Water', 'Ice'], rarity: 'Uncommon', baseStats: { hp: 90, atk: 70, def: 80 } },
  { id: 131, name: '帝牙海狮', types: ['Water', 'Ice'], rarity: 'Rare', baseStats: { hp: 130, atk: 85, def: 80 } },
  { id: 361, name: '小冰怪', types: ['Ice'], rarity: 'Common', baseStats: { hp: 50, atk: 30, def: 50 } },
  { id: 362, name: '多多冰', types: ['Ice'], rarity: 'Uncommon', baseStats: { hp: 60, atk: 60, def: 60 } },
  { id: 583, name: '浪鼓鲸', types: ['Ice'], rarity: 'Rare', baseStats: { hp: 70, atk: 60, def: 60 } },
  
  // 格斗系（6张）
  { id: 66, name: '腕力', types: ['Fighting'], rarity: 'Common', baseStats: { hp: 70, atk: 80, def: 50 } },
  { id: 67, name: '豪力', types: ['Fighting'], rarity: 'Uncommon', baseStats: { hp: 80, atk: 100, def: 70 } },
  { id: 68, name: '怪力', types: ['Fighting'], rarity: 'Rare', baseStats: { hp: 90, atk: 130, def: 80 } },
  { id: 106, name: '巴尔郎', types: ['Fighting'], rarity: 'Common', baseStats: { hp: 50, atk: 120, def: 53 } },
  { id: 107, name: '飞腿郎', types: ['Fighting'], rarity: 'Uncommon', baseStats: { hp: 50, atk: 110, def: 95 } },
  { id: 108, name: '快拳郎', types: ['Fighting'], rarity: 'Rare', baseStats: { hp: 50, atk: 105, def: 75 } },
  
  // 毒系（3张）
  { id: 109, name: '瓦斯弹', types: ['Poison'], rarity: 'Common', baseStats: { hp: 40, atk: 65, def: 95 } },
  { id: 110, name: '双弹瓦斯', types: ['Poison'], rarity: 'Uncommon', baseStats: { hp: 65, atk: 90, def: 120 } },
  { id: 94, name: '耿鬼', types: ['Ghost', 'Poison'], rarity: 'Rare', baseStats: { hp: 60, atk: 65, def: 60 } },
  
  // 地面系（6张）
  { id: 74, name: '小拳石', types: ['Rock', 'Ground'], rarity: 'Common', baseStats: { hp: 40, atk: 80, def: 100 } },
  { id: 75, name: '隆隆石', types: ['Rock', 'Ground'], rarity: 'Uncommon', baseStats: { hp: 55, atk: 95, def: 115 } },
  { id: 76, name: '隆隆岩', types: ['Rock', 'Ground'], rarity: 'Rare', baseStats: { hp: 80, atk: 120, def: 130 } },
  { id: 328, name: '土居忍', types: ['Ground'], rarity: 'Common', baseStats: { hp: 45, atk: 70, def: 50 } },
  { id: 329, name: '土居士', types: ['Ground'], rarity: 'Uncommon', baseStats: { hp: 50, atk: 70, def: 105 } },
  { id: 330, name: '穿梭次郎', types: ['Ground', 'Dragon'], rarity: 'Rare', baseStats: { hp: 85, atk: 100, def: 70 } },
  
  // 飞行系（6张）
  { id: 16, name: '波波', types: ['Normal', 'Flying'], rarity: 'Common', baseStats: { hp: 40, atk: 45, def: 40 } },
  { id: 17, name: '比比鸟', types: ['Normal', 'Flying'], rarity: 'Uncommon', baseStats: { hp: 63, atk: 60, def: 55 } },
  { id: 18, name: '大比雕', types: ['Normal', 'Flying'], rarity: 'Rare', baseStats: { hp: 83, atk: 80, def: 75 } },
  { id: 415, name: '小嘴蜗', types: ['Bug', 'Flying'], rarity: 'Common', baseStats: { hp: 30, atk: 30, def: 30 } },
  { id: 416, name: '敏捷虫', types: ['Bug', 'Flying'], rarity: 'Uncommon', baseStats: { hp: 50, atk: 50, def: 50 } },
  { id: 417, name: '碧翼蝶', types: ['Bug', 'Flying'], rarity: 'Rare', baseStats: { hp: 70, atk: 80, def: 80 } },
  
  // 岩石系（3张）
  { id: 138, name: '化石盔', types: ['Rock', 'Water'], rarity: 'Common', baseStats: { hp: 30, atk: 80, def: 90 } },
  { id: 139, name: '镰刀盔', types: ['Rock', 'Water'], rarity: 'Uncommon', baseStats: { hp: 60, atk: 115, def: 105 } },
  { id: 142, name: '化石翼龙', types: ['Rock', 'Flying'], rarity: 'Rare', baseStats: { hp: 80, atk: 105, def: 65 } },
  
  // 虫系（3张）
  { id: 10, name: '绿毛虫', types: ['Bug'], rarity: 'Common', baseStats: { hp: 45, atk: 30, def: 35 } },
  { id: 11, name: '铁甲蛹', types: ['Bug'], rarity: 'Uncommon', baseStats: { hp: 50, atk: 20, def: 55 } },
  { id: 12, name: '巴大蝶', types: ['Bug', 'Flying'], rarity: 'Rare', baseStats: { hp: 60, atk: 90, def: 80 } },
  
  // 幽灵系（4张）
  { id: 92, name: '鬼斯', types: ['Ghost', 'Poison'], rarity: 'Common', baseStats: { hp: 30, atk: 35, def: 30 } },
  { id: 93, name: '鬼斯通', types: ['Ghost', 'Poison'], rarity: 'Uncommon', baseStats: { hp: 45, atk: 50, def: 45 } },
  { id: 94, name: '耿鬼', types: ['Ghost', 'Poison'], rarity: 'Rare', baseStats: { hp: 60, atk: 65, def: 60 } },
  { id: 487, name: '骑拉帝纳', types: ['Ghost', 'Dragon'], rarity: 'Legendary', baseStats: { hp: 150, atk: 100, def: 120 } },
  
  // 超能力系（7张）
  { id: 122, name: '魔墙人偶', types: ['Psychic', 'Fairy'], rarity: 'Common', baseStats: { hp: 40, atk: 45, def: 65 } },
  { id: 132, name: '呆呆兽', types: ['Water', 'Psychic'], rarity: 'Common', baseStats: { hp: 90, atk: 65, def: 65 } },
  { id: 133, name: '呆壳兽', types: ['Water', 'Psychic'], rarity: 'Uncommon', baseStats: { hp: 95, atk: 75, def: 110 } },
  { id: 134, name: '呆河王', types: ['Water', 'Psychic'], rarity: 'Rare', baseStats: { hp: 95, atk: 100, def: 110 } },
  { id: 65, name: '胡地', types: ['Psychic'], rarity: 'Epic', baseStats: { hp: 55, atk: 125, def: 80 } },
  { id: 493, name: '阿尔宙斯', types: ['Normal'], rarity: 'Legendary', baseStats: { hp: 120, atk: 120, def: 120 } },
  
  // 龙系（4张）
  { id: 147, name: '迷你龙', types: ['Dragon'], rarity: 'Common', baseStats: { hp: 41, atk: 64, def: 45 } },
  { id: 148, name: '哈克龙', types: ['Dragon'], rarity: 'Uncommon', baseStats: { hp: 61, atk: 84, def: 65 } },
  { id: 149, name: '快龙', types: ['Dragon', 'Flying'], rarity: 'Rare', baseStats: { hp: 91, atk: 134, def: 95 } },
  { id: 384, name: '烈空坐', types: ['Dragon', 'Flying'], rarity: 'Legendary', baseStats: { hp: 105, atk: 150, def: 90 } },
  
  // 恶系（4张）
  { id: 228, name: '戴鲁比', types: ['Dark', 'Fire'], rarity: 'Common', baseStats: { hp: 45, atk: 60, def: 40 } },
  { id: 229, name: '黑鲁加', types: ['Dark', 'Fire'], rarity: 'Uncommon', baseStats: { hp: 70, atk: 90, def: 70 } },
  { id: 248, name: '班基拉斯', types: ['Rock', 'Dark'], rarity: 'Rare', baseStats: { hp: 100, atk: 130, def: 110 } },
  { id: 798, name: '恶食大王', types: ['Dark', 'Grass'], rarity: 'Legendary', baseStats: { hp: 100, atk: 100, def: 100 } },
  
  // 钢系（3张）
  { id: 374, name: '可可多拉', types: ['Steel', 'Rock'], rarity: 'Common', baseStats: { hp: 40, atk: 50, def: 60 } },
  { id: 375, name: '可拉可拉', types: ['Steel', 'Rock'], rarity: 'Uncommon', baseStats: { hp: 50, atk: 60, def: 100 } },
  
  // 妖精系（5张）
  { id: 35, name: '皮皮', types: ['Fairy'], rarity: 'Common', baseStats: { hp: 115, atk: 45, def: 65 } },
  { id: 36, name: '皮可西', types: ['Fairy'], rarity: 'Rare', baseStats: { hp: 140, atk: 85, def: 75 } },
  { id: 173, name: '波克比', types: ['Fairy'], rarity: 'Common', baseStats: { hp: 35, atk: 30, def: 15 } },
  { id: 174, name: '皮宝宝', types: ['Fairy'], rarity: 'Uncommon', baseStats: { hp: 60, atk: 45, def: 25 } },
  { id: 178, name: '波克基斯', types: ['Fairy', 'Flying'], rarity: 'Rare', baseStats: { hp: 95, atk: 70, def: 70 } },
  
  // 一般系（2张）
  { id: 113, name: '吉利蛋', types: ['Normal'], rarity: 'Common', baseStats: { hp: 250, atk: 5, def: 5 } },
  { id: 114, name: '幸福蛋', types: ['Normal'], rarity: 'Rare', baseStats: { hp: 255, atk: 10, def: 10 } },


  { id: 13, name: '独角虫', types: ['Bug', 'Poison'], rarity: 'Common', baseStats: { hp: 45, atk: 35, def: 30 } },
  { id: 14, name: '铁壳蛹', types: ['Bug', 'Poison'], rarity: 'Uncommon', baseStats: { hp: 50, atk: 25, def: 50 } },
  { id: 15, name: '大针蜂', types: ['Bug', 'Poison'], rarity: 'Rare', baseStats: { hp: 65, atk: 90, def: 40 } },
  { id: 19, name: '小拉达', types: ['Normal'], rarity: 'Common', baseStats: { hp: 30, atk: 56, def: 35 } },
  { id: 20, name: '拉达', types: ['Normal'], rarity: 'Uncommon', baseStats: { hp: 55, atk: 81, def: 60 } },
  { id: 135, name: '雷伊布', types: ['Electric'], rarity: 'Rare', baseStats: { hp: 65, atk: 65, def: 60 } },
  { id: 136, name: '火伊布', types: ['Fire'], rarity: 'Rare', baseStats: { hp: 65, atk: 130, def: 60 } },
  { id: 143, name: '卡比兽', types: ['Normal'], rarity: 'Rare', baseStats: { hp: 160, atk: 110, def: 65 } },
  { id: 445, name: '烈咬陆鲨', types: ['Ground', 'Dragon'], rarity: 'Epic', baseStats: { hp: 108, atk: 130, def: 95 } },
  { id: 571, name: '索罗亚克', types: ['Dark'], rarity: 'Epic', baseStats: { hp: 60, atk: 105, def: 60 } },
  { id: 150, name: '超梦', types: ['Psychic'], rarity: 'Legendary', baseStats: { hp: 106, atk: 110, def: 90 } },
  { id: 151, name: '梦幻', types: ['Psychic'], rarity: 'Legendary', baseStats: { hp: 100, atk: 100, def: 100 } },
  { id: 243, name: '雷公', types: ['Electric'], rarity: 'Legendary', baseStats: { hp: 90, atk: 85, def: 75 } },
  { id: 244, name: '炎帝', types: ['Fire'], rarity: 'Legendary', baseStats: { hp: 115, atk: 115, def: 85 } },
  { id: 245, name: '水君', types: ['Water'], rarity: 'Legendary', baseStats: { hp: 100, atk: 75, def: 115 } },
  { id: 249, name: '洛奇亚', types: ['Psychic', 'Flying'], rarity: 'Legendary', baseStats: { hp: 106, atk: 90, def: 130 } },
  { id: 250, name: '凤王', types: ['Fire', 'Flying'], rarity: 'Legendary', baseStats: { hp: 106, atk: 130, def: 90 } },
  { id: 251, name: '时拉比', types: ['Psychic', 'Grass'], rarity: 'Legendary', baseStats: { hp: 100, atk: 100, def: 100 } },
  { id: 385, name: '基拉祈', types: ['Steel', 'Psychic'], rarity: 'Legendary', baseStats: { hp: 100, atk: 100, def: 100 } },
  { id: 386, name: '代欧奇希斯', types: ['Psychic'], rarity: 'Legendary', baseStats: { hp: 50, atk: 150, def: 50 } }



];

export const RARITY_WEIGHTS: Record<Rarity, number> = {
  Common: 62,
  Uncommon: 25,
  Rare: 8,
  Epic: 4,
  Legendary: 1,
};

export const STAMINA_RECOVERY_MS = 5 * 60 * 1000; // 5分钟恢复1点
export const MAX_STAMINA = 300;

// 稀有度标签映射
export const RARITY_LABELS = {
  Common: 'N',
  Uncommon: 'R',
  Rare: 'RR',
  Epic: 'SR',
  Legendary: 'SSR'
};

// 成就系统
export const ACHIEVEMENTS = [
  { id: 'collect_pokemon', name: '宝可梦收集者', description: '收集50只宝可梦', reward: 1000, target: 50 },
  { id: 'evolve_pokemon', name: '进化大师', description: '进化10只宝可梦', reward: 500, target: 10 },
  { id: 'win_battles', name: '战斗冠军', description: '赢得50场战斗', reward: 1000, target: 50 },
  { id: 'gacha_10x', name: '十连抽爱好者', description: '进行10次十连抽', reward: 800, target: 10 },
  { id: 'synthesis', name: '合成专家', description: '合成20次宝可梦', reward: 600, target: 20 },
  { id: 'equipment_master', name: '装备大师', description: '收集30件装备', reward: 700, target: 30 }
];

// 装备图鉴
export const EQUIPMENT_POKEDEX = [
  { id: 'sword_1', name: '铁剑', type: 'weapon', rarity: 'Common' },
  { id: 'shield_1', name: '铁盾', type: 'defense', rarity: 'Common' },
  { id: 'potion_1', name: '小药水', type: 'consumable', rarity: 'Common' },
  { id: 'sword_2', name: '钢剑', type: 'weapon', rarity: 'Uncommon' },
  { id: 'shield_2', name: '钢盾', type: 'defense', rarity: 'Uncommon' },
  { id: 'potion_2', name: '中药水', type: 'consumable', rarity: 'Uncommon' },
  { id: 'sword_3', name: '圣剑', type: 'weapon', rarity: 'Rare' },
  { id: 'shield_3', name: '圣盾', type: 'defense', rarity: 'Rare' },
  { id: 'potion_3', name: '大药水', type: 'consumable', rarity: 'Rare' }
];
