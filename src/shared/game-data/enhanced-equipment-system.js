// Enhanced Equipment System with Skills and Lower Drop Rates
const fs = await import('fs');
const path = await import('path');

// 装备稀有度和掉落率
const EQUIPMENT_DROP_RATES = {
  Common: 0.60,      // 60% 掉落率（降低）
  Uncommon: 0.25,    // 25% 掉落率（降低）  
  Rare: 0.10,        // 10% 掉落率（降低）
  Epic: 0.04,        // 4% 掉落率（降低）
  Legendary: 0.01    // 1% 掉落率（降低）
};

// 装备技能类型
const EQUIPMENT_SKILLS = {
  Weapon: [
    { name: "致命一击", description: "15%几率造成200%伤害", effect: "crit_200" },
    { name: "连击", description: "10%几率额外攻击一次", effect: "double_attack" },
    { name: "破甲", description: "忽略目标20%防御", effect: "ignore_defense" },
    { name: "吸血", description: "造成伤害的10%转化为生命", effect: "lifesteal" }
  ],
  Armor: [
    { name: "格挡", description: "20%几率完全格挡攻击", effect: "block" },
    { name: "反击", description: "受到攻击时10%几率反击", effect: "counter" },
    { name: "坚韧", description: "减少15%受到的伤害", effect: "damage_reduction" },
    { name: "再生", description: "每回合恢复2%最大生命", effect: "regeneration" }
  ],
  Accessory: [
    { name: "先攻", description: "战斗开始时先手攻击", effect: "first_strike" },
    { name: "暴怒", description: "生命低于30%时攻击力+50%", effect: "enrage" },
    { name: "幸运", description: "所有技能触发几率+10%", effect: "luck" },
    { name: "专注", description: "技能冷却时间-1回合", effect: "cooldown_reduction" }
  ]
};

// 强化后的装备属性模板
const ENHANCED_EQUIPMENT_TEMPLATES = {
  Common: {
    Weapon: { atkBonus: 30, defBonus: 15, hpBonus: 40 },
    Armor: { atkBonus: 15, defBonus: 30, hpBonus: 40 },
    Accessory: { atkBonus: 20, defBonus: 20, hpBonus: 100 }
  },
  Uncommon: {
    Weapon: { atkBonus: 60, defBonus: 25, hpBonus: 70 },
    Armor: { atkBonus: 25, defBonus: 60, hpBonus: 70 },
    Accessory: { atkBonus: 40, defBonus: 40, hpBonus: 180 }
  },
  Rare: {
    Weapon: { atkBonus: 100, defBonus: 40, hpBonus: 120 },
    Armor: { atkBonus: 40, defBonus: 100, hpBonus: 120 },
    Accessory: { atkBonus: 70, defBonus: 70, hpBonus: 280 }
  },
  Epic: {
    Weapon: { atkBonus: 160, defBonus: 60, hpBonus: 200 },
    Armor: { atkBonus: 60, defBonus: 160, hpBonus: 200 },
    Accessory: { atkBonus: 110, defBonus: 110, hpBonus: 450 }
  },
  Legendary: {
    Weapon: { atkBonus: 250, defBonus: 90, hpBonus: 320 },
    Armor: { atkBonus: 90, defBonus: 250, hpBonus: 320 },
    Accessory: { atkBonus: 180, defBonus: 180, hpBonus: 700 }
  }
};

// 装备名称模板
const EQUIPMENT_NAMES = {
  Weapon: ['锐利之爪', '龙牙匕首', '火焰剑', '雷电法杖', '冰霜长矛', '暗影镰刀', '神圣权杖'],
  Armor: ['坚硬外壳', '龙鳞铠甲', '火焰护甲', '雷电战袍', '冰霜盔甲', '暗影斗篷', '神圣圣衣'],
  Accessory: ['丝绸围巾', '龙眼宝石', '火焰项链', '雷电耳环', '冰霜戒指', '暗影吊坠', '神圣徽章']
};

// 生成强化装备
function generateEnhancedEquipment(rarity) {
  const slots = ['Weapon', 'Armor', 'Accessory'];
  const slot = slots[Math.floor(Math.random() * slots.length)];
  
  // 基础属性
  const template = ENHANCED_EQUIPMENT_TEMPLATES[rarity][slot];
  const baseStats = {
    atkBonus: template.atkBonus,
    defBonus: template.defBonus, 
    hpBonus: template.hpBonus
  };
  
  // 随机名称
  const name = EQUIPMENT_NAMES[slot][Math.floor(Math.random() * EQUIPMENT_NAMES[slot].length)];
  
  // 50%几率有属性亲和
  const hasAffinity = Math.random() > 0.5;
  const types = ['Fire', 'Water', 'Grass', 'Electric', 'Normal', 'Psychic', 'Dragon', 'Fighting', 'Flying'];
  const typeAffinity = hasAffinity ? types[Math.floor(Math.random() * types.length)] : undefined;
  
  // 30%几率有技能（稀有度越高几率越高）
  const skillChance = 0.3 + (rarity === 'Uncommon' ? 0.1 : rarity === 'Rare' ? 0.2 : rarity === 'Epic' ? 0.3 : rarity === 'Legendary' ? 0.4 : 0);
  const hasSkill = Math.random() < skillChance;
  let skill = null;
  
  if (hasSkill && EQUIPMENT_SKILLS[slot]) {
    const skills = EQUIPMENT_SKILLS[slot];
    skill = skills[Math.floor(Math.random() * skills.length)];
  }
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${rarity === 'Legendary' ? '远古' : ''}${name}`,
    slot: slot,
    ...baseStats,
    typeAffinity: typeAffinity,
    rarity: rarity,
    skill: skill
  };
}

// 根据关卡难度确定装备稀有度
function getEquipmentRarityByStage(stageId) {
  if (stageId >= 8) return 'Legendary';
  if (stageId >= 6) return 'Epic';
  if (stageId >= 4) return 'Rare';
  if (stageId >= 2) return 'Uncommon';
  return 'Common';
}

// 战斗胜利后掉落装备（使用新的低掉落率）
function dropEquipmentAfterBattle(stageId) {
  // 先决定是否掉落装备（整体掉落率）
  const equipmentDropChance = 0.3; // 30% 整体掉落率（比之前的60%降低）
  if (Math.random() > equipmentDropChance) {
    return null;
  }
  
  // 确定装备稀有度
  const rarity = getEquipmentRarityByStage(stageId);
  
  // 使用新的掉落率系统
  const rarities = Object.keys(EQUIPMENT_DROP_RATES);
  let totalWeight = 0;
  const weights = [];
  
  for (let r of rarities) {
    const weight = EQUIPMENT_DROP_RATES[r];
    weights.push({ rarity: r, weight: weight, cumulative: totalWeight + weight });
    totalWeight += weight;
  }
  
  const random = Math.random() * totalWeight;
  let selectedRarity = 'Common';
  
  for (let w of weights) {
    if (random <= w.cumulative) {
      selectedRarity = w.rarity;
      break;
    }
  }
  
  // 确保不会掉落比关卡等级更高的装备
  const stageRarity = getEquipmentRarityByStage(stageId);
  const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const stageIndex = rarityOrder.indexOf(stageRarity);
  const selectedIndex = rarityOrder.indexOf(selectedRarity);
  
  if (selectedIndex > stageIndex) {
    selectedRarity = stageRarity;
  }
  
  return generateEnhancedEquipment(selectedRarity);
}

// 测试生成装备
console.log("=== 装备系统测试 ===");
for (let i = 0; i < 10; i++) {
  const equip = generateEnhancedEquipment('Rare');
  console.log(`装备 ${i+1}: ${equip.name} (${equip.rarity}) - ATK:${equip.atkBonus} DEF:${equip.defBonus} HP:${equip.hpBonus}`);
  if (equip.skill) {
    console.log(`  技能: ${equip.skill.name} - ${equip.skill.description}`);
  }
}

console.log("\n=== 掉落率测试 ===");
const dropTestResults = {};
for (let i = 0; i < 1000; i++) {
  const equip = dropEquipmentAfterBattle(5); // 测试关卡5
  if (equip) {
    dropTestResults[equip.rarity] = (dropTestResults[equip.rarity] || 0) + 1;
  }
}

console.log("1000次战斗掉落统计:");
Object.keys(dropTestResults).forEach(rarity => {
  console.log(`${rarity}: ${dropTestResults[rarity]} (${(dropTestResults[rarity]/1000*100).toFixed(1)}%)`);
});

console.log(`未掉落装备: ${1000 - Object.values(dropTestResults).reduce((a,b) => a+b, 0)} (${((1000 - Object.values(dropTestResults).reduce((a,b) => a+b, 0))/1000*100).toFixed(1)}%)`);

export { generateEnhancedEquipment, dropEquipmentAfterBattle, EQUIPMENT_DROP_RATES };