import { Equipment } from '../types';
import { 
  WEAPON_IMAGES, 
  ARMOR_IMAGES, 
  ACCESSORY_IMAGES, 
  HELMET_IMAGES, 
  BOOTS_IMAGES, 
  BELT_IMAGES, 
  RING_IMAGES, 
  AMULET_IMAGES,
  TYPE_EQUIPMENT_IMAGES as TYPE_SPECIFIC_IMAGES,
  DEFAULT_EQUIPMENT_IMAGE 
} from './equipmentImagesExtended';

// 装备槽位类型映射
const SLOT_TYPES = {
  'Weapon': '武器',
  'Armor': '护甲', 
  'Accessory': '饰品',
  'Helmet': '头盔',
  'Boots': '靴子',
  'Belt': '腰带',
  'Ring': '戒指',
  'Amulet': '护符'
};

// 根据装备属性生成更精确的图片
export const getEquipmentImage = (equipment: Equipment | string, rarity?: string, name?: string): string => {
  // 处理字符串参数（向后兼容）
  if (typeof equipment === 'string') {
    return DEFAULT_EQUIPMENT_IMAGE;
  }

  const equip = equipment as Equipment;
  const slot = equip.slot;
  const typeAffinity = equip.typeAffinity;
  const equipRarity = rarity || equip.rarity;
  const equipName = name || equip.name;

  // 首先检查是否有类型特定的图片
  if (typeAffinity && TYPE_SPECIFIC_IMAGES[typeAffinity]) {
    const typeImages = TYPE_SPECIFIC_IMAGES[typeAffinity];
    if (slot in typeImages) {
      const imagesForSlot = typeImages[slot as keyof typeof typeImages];
      if (imagesForSlot && imagesForSlot.length > 0) {
        // 根据稀有度选择合适的图片
        const rarityIndex = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].indexOf(equipRarity);
        const imageIndex = Math.min(rarityIndex, imagesForSlot.length - 1);
        return imagesForSlot[imageIndex];
      }
    }
  }

  // 根据槽位类型选择基础图片
  let baseImage = DEFAULT_EQUIPMENT_IMAGE;
  
  switch (slot) {
    case 'Weapon':
      baseImage = WEAPON_IMAGES[Math.floor(Math.random() * WEAPON_IMAGES.length)];
      break;
    case 'Armor':
      baseImage = ARMOR_IMAGES[Math.floor(Math.random() * ARMOR_IMAGES.length)];
      break;
    case 'Accessory':
      baseImage = ACCESSORY_IMAGES[Math.floor(Math.random() * ACCESSORY_IMAGES.length)];
      break;
    case 'Helmet':
      baseImage = HELMET_IMAGES[Math.floor(Math.random() * HELMET_IMAGES.length)];
      break;
    case 'Boots':
      baseImage = BOOTS_IMAGES[Math.floor(Math.random() * BOOTS_IMAGES.length)];
      break;
    case 'Belt':
      baseImage = BELT_IMAGES[Math.floor(Math.random() * BELT_IMAGES.length)];
      break;
    case 'Ring':
      baseImage = RING_IMAGES[Math.floor(Math.random() * RING_IMAGES.length)];
      break;
    case 'Amulet':
      baseImage = AMULET_IMAGES[Math.floor(Math.random() * AMULET_IMAGES.length)];
      break;
  }

  return baseImage;
};

// 为合成系统生成装备图片
export const generateEquipmentImageUrl = (slot: string, rarity: string, typeAffinity?: string): string => {
  const mockEquipment = {
    id: 'temp',
    name: '临时装备',
    slot: slot as any,
    atkBonus: 10,
    defBonus: 10,
    hpBonus: 10,
    rarity: rarity as any,
    typeAffinity: typeAffinity as any
  };
  
  return getEquipmentImage(mockEquipment);
};