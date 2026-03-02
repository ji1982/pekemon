import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { GameState } from '../types';
import { gameReducer, getInitialGameState } from './gameReducer';

interface GameContextType {
  gameState: GameState | null;
  dispatch: React.Dispatch<any>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, getInitialGameState());
  const [loading, setLoading] = React.useState(true);
  
  const contextValue = useMemo(() => ({
    gameState,
    dispatch,
    loading,
    setLoading
  }), [gameState, dispatch, loading, setLoading]);

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};
