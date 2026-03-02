import { Equipment, PokemonType } from '../types';

// 套装装备图片映射
export const SET_EQUIPMENT_IMAGES: Record<string, string> = {
  // 烈焰之心套装 (Fire)
  '烈焰之剑': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/charcoal.png',
  '烈焰铠甲': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heat-rock.png',
  '烈焰护符': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/focus-sash.png',
  '烈焰头冠': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wide-lens.png',
  '烈焰拳套': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/muscle-band.png',
  '烈焰战靴': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/quick-powder.png',
  
  // 深海之魂套装 (Water)  
  '深海三叉戟': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mystic-water.png',
  '深海鳞甲': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/damp-rock.png',
  '深海珍珠': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/big-pearl.png',
  '深海王冠': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/zoom-lens.png',
  '深海手套': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/expert-belt.png',
  '深海鳍靴': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cleanse-tag.png',
  
  // 大地之力套装 (Ground)
  '大地之锤': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soft-sand.png',
  '大地重甲': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/smooth-rock.png',
  '大地图腾': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rock-incense.png',
  '大地头盔': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron-ball.png',
  '大地拳套': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/grip-claw.png',
  '大地战靴': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/shed-shell.png',
  
  // 雷霆之怒套装 (Electric)
  '雷霆法杖': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/magnet.png',
  '雷霆护盾': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/electric-seed.png',
  '雷霆电池': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cell-battery.png',
  '雷霆头饰': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png',
  '雷霆手套': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-herb.png',
  '雷霆疾靴': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/bright-powder.png',
  
  // 龙族传承套装 (Dragon)
  '龙牙利刃': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-fang.png',
  '龙鳞铠甲': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-scale.png',
  '龙之心': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-tooth.png',
  '龙角头盔': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/protector.png',
  '龙爪手套': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-band.png',
  '龙尾战靴': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lucky-egg.png',
  
  // 超能秘典套装 (Psychic)
  '超能水晶': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/twisted-spoon.png',
  '超能力场': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mental-herb.png',
  '超能核心': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/odd-incense.png',
  '超能头环': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wise-glasses.png',
  '超能手环': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/life-orb.png',
  '超能疾靴': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/focus-band.png'
};

// 套装效果图标
export const SET_EFFECT_ICONS: Record<string, string> = {
  '烈焰之心': '🔥',
  '深海之魂': '🌊', 
  '大地之力': '🌍',
  '雷霆之怒': '⚡',
  '龙族传承': '🐉',
  '超能秘典': '🔮'
};

export const getSetEquipmentImage = (equipmentName: string): string => {
  return SET_EQUIPMENT_IMAGES[equipmentName] || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png';
};

export const getSetEffectIcon = (setName: string): string => {
  return SET_EFFECT_ICONS[setName] || '✨';
};