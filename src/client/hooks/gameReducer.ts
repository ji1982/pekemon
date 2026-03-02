import { GameState, Pokemon, Equipment, Stage } from '../types';
import { MAX_STAMINA } from '@shared/constants';

// Action类型定义
type GameAction =
  | { type: 'SET_GAME_STATE'; payload: GameState }
  | { type: 'UPDATE_GOLD'; payload: number }
  | { type: 'UPDATE_STAMINA'; payload: number }
  | { type: 'ADD_POKEMON'; payload: Pokemon }
  | { type: 'REMOVE_POKEMON'; payload: string }
  | { type: 'UPDATE_POKEMON'; payload: { id: string; pokemon: Partial<Pokemon> } }
  | { type: 'UPDATE_TEAM'; payload: string[] }
  | { type: 'ADD_EQUIPMENT'; payload: Equipment }
  | { type: 'REMOVE_EQUIPMENT'; payload: string }
  | { type: 'EQUIP_ITEM'; payload: { pokemonId: string; slot: keyof Pokemon['equipment']; equipmentId: string | null } }
  | { type: 'UPDATE_POKEDEX'; payload: any[] }
  | { type: 'UPDATE_EQUIPMENT_STATUS'; payload: any[] }
  | { type: 'UPDATE_ACHIEVEMENTS'; payload: any[] }
  | { type: 'UNLOCK_STAGE'; payload: number }
  | { type: 'GACHA_DRAW'; payload: { newPokemons: Pokemon[]; cost: number } }
  | { type: 'BATTLE_RESULT'; payload: { win: boolean; rewards: { gold: number; exp: number; newEquipment?: Equipment } } };

// Reducer函数
export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return action.payload;

    case 'UPDATE_GOLD':
      return {
        ...state,
        gold: Math.max(0, state.gold + action.payload)
      };

    case 'UPDATE_STAMINA':
      return {
        ...state,
        stamina: Math.max(0, Math.min(state.maxStamina, state.stamina + action.payload)),
        lastStaminaUpdate: Date.now()
      };

    case 'ADD_POKEMON':
      return {
        ...state,
        inventory: [...state.inventory, action.payload]
      };

    case 'REMOVE_POKEMON':
      return {
        ...state,
        inventory: state.inventory.filter(poke => poke.id !== action.payload),
        teamIds: state.teamIds.filter(id => id !== action.payload)
      };

    case 'UPDATE_POKEMON':
      return {
        ...state,
        inventory: state.inventory.map(poke =>
          poke.id === action.payload.id
            ? { ...poke, ...action.payload.pokemon }
            : poke
        )
      };

    case 'UPDATE_TEAM':
      // 确保 teamIds 只包含存在于 inventory 中的宝可梦 id
      const validTeamIds = action.payload.filter(id => state.inventory.some(poke => poke.id === id));
      return {
        ...state,
        teamIds: validTeamIds,
        savedTeamIds: validTeamIds
      };

    case 'ADD_EQUIPMENT':
      return {
        ...state,
        equipmentInventory: [...state.equipmentInventory, action.payload]
      };

    case 'REMOVE_EQUIPMENT':
      return {
        ...state,
        equipmentInventory: state.equipmentInventory.filter(equip => equip.id !== action.payload)
      };

    case 'EQUIP_ITEM':
      return {
        ...state,
        inventory: state.inventory.map(poke =>
          poke.id === action.payload.pokemonId
            ? {
                ...poke,
                equipment: {
                  ...poke.equipment,
                  [action.payload.slot]: action.payload.equipmentId
                }
              }
            : poke
        )
      };

    case 'UPDATE_POKEDEX':
      return {
        ...state,
        pokedexStatus: action.payload
      };

    case 'UPDATE_EQUIPMENT_STATUS':
      return {
        ...state,
        equipmentStatus: action.payload
      };

    case 'UPDATE_ACHIEVEMENTS':
      return {
        ...state,
        achievements: action.payload
      };

    case 'UNLOCK_STAGE':
      return {
        ...state,
        unlockedStages: Math.max(state.unlockedStages, action.payload)
      };

    case 'GACHA_DRAW': {
      const { newPokemons, cost } = action.payload;
      console.log('🎰 [Reducer] GACHA_DRAW 处理中:', { newPokemonsCount: newPokemons.length, cost, currentInventoryCount: state.inventory.length, currentGold: state.gold });
      const updatedInventory = [...state.inventory, ...newPokemons.map(poke => ({ ...poke, exp: 0 }))];
      console.log('🎰 [Reducer] 更新后的inventory:', updatedInventory.length);
      console.log('🎰 [Reducer] 新增的宝可梦:', newPokemons.map(p => p.name));
      const updatedPokedexStatus = newPokemons.reduce((acc, poke) => {
        const existing = acc.find(p => p.pokedexId === poke.pokedexId);
        if (existing) {
          return acc.map(p => 
            p.pokedexId === poke.pokedexId 
              ? { ...p, obtained: true, count: p.count + 1, maxStars: Math.max(p.maxStars, poke.stars) }
              : p
          );
        }
        return [...acc, { pokedexId: poke.pokedexId, obtained: true, count: 1, maxStars: poke.stars }];
      }, state.pokedexStatus);
      
      const newState = {
        ...state,
        gold: Math.max(0, state.gold - cost),
        inventory: updatedInventory,
        pokedexStatus: updatedPokedexStatus
      };
      console.log('🎰 [Reducer] 返回新状态:', { gold: newState.gold, inventoryCount: newState.inventory.length });
      return newState;
    }

    case 'BATTLE_RESULT': {
      const { win, rewards, newEquipment } = action.payload;
      console.log('⚔️ [Reducer] BATTLE_RESULT 处理中:', { win, gold: rewards.gold, exp: rewards.exp, hasNewEquipment: !!newEquipment });
      
      if (win) {
        return {
          ...state,
          gold: state.gold + rewards.gold,
          unlockedStages: Math.max(state.unlockedStages, 1)
        };
      } else {
        return state;
      }
    }

    default:
      return state;
  }
};

// 初始游戏状态
export const getInitialGameState = (): GameState => ({
  gold: 2000,
  stamina: MAX_STAMINA,
  maxStamina: MAX_STAMINA,
  lastStaminaUpdate: Date.now(),
  inventory: [
    {
      id: 'starter',
      pokedexId: 4,
      name: '小火龙',
      types: ['Fire'],
      rarity: 'Common',
      stars: 1,
      baseHp: 39,
      baseAtk: 52,
      baseDef: 43,
      level: 1,
      exp: 0,
      equipment: {}
    }
  ],
  teamIds: ['starter'],
  savedTeamIds: ['starter'],
  equipmentInventory: [],
  unlockedStages: 1,
  pokedexStatus: [],
  equipmentStatus: [],
  achievements: []
});
