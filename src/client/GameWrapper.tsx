import React, { useState } from 'react';
import App from './App';
import StartScreen from './components/StartScreen';

const GameWrapper: React.FC = () => {
  const [selectedSaveSlot, setSelectedSaveSlot] = useState<string | null>(null);

  const handleSaveSlotSelect = (saveSlot: string) => {
    setSelectedSaveSlot(saveSlot);
  };

  const handleBackToStart = () => {
    setSelectedSaveSlot(null);
  };

  // 如果没有选择存档，显示StartScreen，否则显示App
  if (!selectedSaveSlot) {
    return <StartScreen onSaveSlotSelect={handleSaveSlotSelect} />;
  }

  return <App currentSaveSlot={selectedSaveSlot} onBackToStart={handleBackToStart} />;
};

export default GameWrapper;