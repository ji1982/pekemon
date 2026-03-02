import React from 'react';
import { GameState } from '../types';
import SaveSlotSelector from './SaveSlotSelector';

interface StartScreenProps {
  onSaveSlotSelect: (saveSlotId: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onSaveSlotSelect }) => {
  // 处理开始游戏
  const handleStartGame = (saveSlotId: string) => {
    onSaveSlotSelect(saveSlotId);
  };

  // 处理加载游戏
  const handleLoadGame = (gameState: GameState, saveSlotId: string) => {
    onSaveSlotSelect(saveSlotId);
  };

  return (
    <SaveSlotSelector onStartGame={handleStartGame} onLoadGame={handleLoadGame} />
  );
};

export default StartScreen;