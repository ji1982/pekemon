import React, { memo } from 'react';
import { Stage } from '../types';

interface MapModuleProps {
  stages: Stage[];
  unlockedStages: number;
  onStageSelect: (stage: Stage) => void;
}

const MapModule: React.FC<MapModuleProps> = memo(({ stages, unlockedStages, onStageSelect }) => {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <h2 className="text-4xl font-black text-yellow-500 italic">挑战地图</h2>
      <div className="grid gap-6">
        {stages.map((stage) => {
          const isUnlocked = stage.id <= unlockedStages;
          const isNextStage = stage.id === unlockedStages + 1;
          
          return (
            <div 
              key={stage.id} 
              className={`p-6 rounded-3xl border flex items-center justify-between transition-all shadow-xl ${
                isUnlocked 
                  ? 'bg-[#1c1c3a] hover:border-yellow-500/50' 
                  : 'bg-[#1c1c3a]/50 border-gray-600 opacity-60'
              }`}
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                  isUnlocked ? 'bg-blue-600' : 'bg-gray-600'
                }`}>
                  {isUnlocked ? '⚔️' : '🔒'}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isUnlocked ? '' : 'text-gray-400'}`}>
                    {stage.name}
                  </h3>
                  <div className="flex gap-4 text-sm mt-1">
                    <span className={`font-bold ${isUnlocked ? 'text-green-400' : 'text-gray-500'}`}>
                      ⚡ 消耗: {stage.staminaCost}
                    </span>
                    <span className={`font-bold ${isUnlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                      💰 奖励: {stage.goldReward}
                    </span>
                  </div>
                  {!isUnlocked && !isNextStage && (
                    <div className="text-xs text-gray-400 mt-1">
                      需要先通关第 {stage.id - 1} 关
                    </div>
                  )}
                  {!isUnlocked && isNextStage && (
                    <div className="text-xs text-yellow-400 mt-1">
                      下一关！通关第 {unlockedStages} 关后解锁
                    </div>
                  )}
                </div>
              </div>
              {isUnlocked ? (
                <button 
                  className="px-8 py-3 rounded-xl font-black uppercase bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20"
                  onClick={() => onStageSelect(stage)}
                >
                  挑战开始
                </button>
              ) : (
                <div className="px-8 py-3 rounded-xl font-black uppercase bg-gray-600 cursor-not-allowed">
                  未解锁
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default MapModule;
