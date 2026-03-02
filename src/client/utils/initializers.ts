import { POKEDEX, ACHIEVEMENTS, EQUIPMENT_POKEDEX } from '@shared/constants';

export const initializePokedexStatus = () => {
  return POKEDEX.map(entry => ({
    pokedexId: entry.id,
    obtained: false,
    count: 0,
    maxStars: 0
  }));
};

export const initializeEquipmentStatus = () => {
  return EQUIPMENT_POKEDEX.map(entry => ({
    equipmentId: entry.id,
    name: entry.name,
    obtained: false,
    count: 0
  }));
};

export const initializeAchievements = () => {
  return ACHIEVEMENTS.map(ach => ({
    ...ach,
    completed: false
  }));
};
