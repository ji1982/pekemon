// 导入类型
import { Stage } from '../types';

// 初始化关卡数据
export const INITIAL_STAGES: Stage[] = [
  { 
    id: 1, name: "真新镇森林", difficulty: 1, staminaCost: 5, goldReward: 100, 
    enemies: [{ pokedexId: 10, name: "绿毛虫", level: 5, types: ["Bug"], hp: 200, atk: 30, def: 20 }] 
  },
  { 
    id: 2, name: "月见山入口", difficulty: 2, staminaCost: 5, goldReward: 250, 
    enemies: [{ pokedexId: 74, name: "小拳石", level: 12, types: ["Rock", "Ground"], hp: 600, atk: 100, def: 150 }] 
  },
  { 
    id: 3, name: "华蓝市水库", difficulty: 4, staminaCost: 8, goldReward: 600, 
    enemies: [{ pokedexId: 130, name: "暴鲤龙", level: 35, types: ["Water", "Flying"], hp: 4500, atk: 550, def: 400 }] 
  },
  { 
    id: 4, name: "神秘超能洞穴", difficulty: 8, staminaCost: 10, goldReward: 2000, 
    enemies: [{ pokedexId: 150, name: "超梦", level: 70, types: ["Psychic"], hp: 35000, atk: 5000, def: 3000 }] 
  },
  { 
    id: 5, name: "火焰之岛火山口", difficulty: 12, staminaCost: 12, goldReward: 3500, 
    enemies: [{ pokedexId: 382, name: "盖欧卡", level: 85, types: ["Water"], hp: 65000, atk: 8000, def: 5000 }] 
  },
  { 
    id: 6, name: "深海遗迹", difficulty: 16, staminaCost: 15, goldReward: 6000, 
    enemies: [{ pokedexId: 383, name: "固拉多", level: 90, types: ["Ground"], hp: 85000, atk: 9500, def: 7000 }] 
  },
  { 
    id: 7, name: "雷电高原", difficulty: 20, staminaCost: 18, goldReward: 10000, 
    enemies: [{ pokedexId: 384, name: "裂空座", level: 95, types: ["Dragon", "Flying"], hp: 120000, atk: 12000, def: 9000 }] 
  },
  { 
    id: 8, name: "古代神殿", difficulty: 25, staminaCost: 22, goldReward: 18000, 
    enemies: [{ pokedexId: 493, name: "阿尔宙斯", level: 100, types: ["Normal"], hp: 180000, atk: 18000, def: 15000 }] 
  },
  { 
    id: 9, name: "时空裂隙", difficulty: 30, staminaCost: 25, goldReward: 30000, 
    enemies: [{ pokedexId: 889, name: "藏玛然特", level: 110, types: ["Steel", "Fighting"], hp: 250000, atk: 25000, def: 20000 }] 
  },
  { 
    id: 10, name: "终极试炼场", difficulty: 40, staminaCost: 30, goldReward: 50000, 
    enemies: [{ pokedexId: 890, name: "无极汰那", level: 120, types: ["Poison", "Flying"], hp: 500000, atk: 50000, def: 40000 }] 
  },
];
