import fs from 'fs';
import path from 'path';

// 强化装备模板
const equipmentTemplates = {
  Common: [
    { name: "锐利之爪", slot: "Weapon", atkBonus: 25, defBonus: 10, hpBonus: 30, typeAffinity: null },
    { name: "坚硬外壳", slot: "Armor", atkBonus: 10, defBonus: 25, hpBonus: 30, typeAffinity: null },
    { name: "丝绸围巾", slot: "Accessory", atkBonus: 15, defBonus: 15, hpBonus: 80, typeAffinity: null }
  ],
  Uncommon: [
    { name: "锋利利爪", slot: "Weapon", atkBonus: 45, defBonus: 20, hpBonus: 50, typeAffinity: null },
    { name: "钢铁护甲", slot: "Armor", atkBonus: 20, defBonus: 45, hpBonus: 50, typeAffinity: null },
    { name: "能量项链", slot: "Accessory", atkBonus: 30, defBonus: 30, hpBonus: 120, typeAffinity: null }
  ],
  Rare: [
    { name: "龙之利爪", slot: "Weapon", atkBonus: 75, defBonus: 35, hpBonus: 80, typeAffinity: null },
    { name: "钻石铠甲", slot: "Armor", atkBonus: 35, defBonus: 75, hpBonus: 80, typeAffinity: null },
    { name: "神秘宝石", slot: "Accessory", atkBonus: 50, defBonus: 50, hpBonus: 200, typeAffinity: null }
  ],
  Epic: [
    { name: "神之武器", slot: "Weapon", atkBonus: 120, defBonus: 60, hpBonus: 150, typeAffinity: null },
    { name: "神之护甲", slot: "Armor", atkBonus: 60, defBonus: 120, hpBonus: 150, typeAffinity: null },
    { name: "神之饰品", slot: "Accessory", atkBonus: 90, defBonus: 90, hpBonus: 350, typeAffinity: null }
  ],
  Legendary: [
    { name: "创世神兵", slot: "Weapon", atkBonus: 200, defBonus: 100, hpBonus: 250, typeAffinity: null },
    { name: "创世神甲", slot: "Armor", atkBonus: 100, defBonus: 200, hpBonus: 250, typeAffinity: null },
    { name: "创世神饰", slot: "Accessory", atkBonus: 150, defBonus: 150, hpBonus: 600, typeAffinity: null }
  ]
};

// 稀有度权重
const rarityWeights = {
  Common: 50,
  Uncommon: 30,
  Rare: 15,
  Epic: 4,
  Legendary: 1
};

// 生成随机装备
function generateRandomEquipment(count = 20) {
  const rarities = Object.keys(rarityWeights);
  const weights = Object.values(rarityWeights);
  
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  
  const equipmentInventory = [];
  
  for (let i = 0; i < count; i++) {
    // 随机选择稀有度
    let random = Math.random() * totalWeight;
    let selectedRarity = 'Common';
    
    for (let j = 0; j < rarities.length; j++) {
      if (random < weights[j]) {
        selectedRarity = rarities[j];
        break;
      }
      random -= weights[j];
    }
    
    // 随机选择装备类型
    const templates = equipmentTemplates[selectedRarity];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // 创建装备
    const equipment = {
      id: Math.random().toString(36).substring(2, 11),
      name: template.name,
      slot: template.slot,
      atkBonus: template.atkBonus,
      defBonus: template.defBonus,
      hpBonus: template.hpBonus,
      rarity: selectedRarity
    };
    
    // 50% 概率添加属性亲和
    if (Math.random() < 0.5) {
      const types = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];
      equipment.typeAffinity = types[Math.floor(Math.random() * types.length)];
    }
    
    equipmentInventory.push(equipment);
  }
  
  return equipmentInventory;
}

// 生成强化装备库存
const newEquipmentInventory = generateRandomEquipment(25);

// 读取当前游戏状态
const gameStatePath = path.join(process.cwd(), 'game-data', 'game-state.json');
const gameState = JSON.parse(fs.readFileSync(gameStatePath, 'utf8'));

// 更新装备库存
gameState.equipmentInventory = newEquipmentInventory;

// 保存更新后的游戏状态
fs.writeFileSync(gameStatePath, JSON.stringify(gameState, null, 2));

console.log('✅ 装备属性已成功强化！');
console.log('新装备属性范围:');
console.log('- Common: ATK/DEF 25-45, HP 80-150');
console.log('- Uncommon: ATK/DEF 45-75, HP 120-200');
console.log('- Rare: ATK/DEF 75-120, HP 200-350');
console.log('- Epic: ATK/DEF 120-200, HP 350-600');
console.log('- Legendary: ATK/DEF 200+, HP 600+');