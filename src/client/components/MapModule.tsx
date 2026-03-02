import React, { memo } from 'react';
import { Stage } from '../types';

interface MapModuleProps {
  stages: Stage[];
  onStageSelect: (stage: Stage) => void;
}

const MapModule: React.FC<MapModuleProps> = memo(({ stages, onStageSelect }) => {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <h2 className="text-4xl font-black text-yellow-500 italic">挑战地图</h2>
      <div className="grid gap-6">
        {stages.map((stage) => {
          return (
            <div key={stage.id} className="p-6 rounded-3xl border flex items-center justify-between transition-all bg-[#1c1c3a] hover:border-yellow-500/50 shadow-xl">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-3xl">⚔️</div>
                <div>
                  <h3 className="text-xl font-bold">{stage.name}</h3>
                  <div className="flex gap-4 text-sm mt-1">
                    <span className="text-green-400 font-bold">⚡ 消耗: {stage.staminaCost}</span>
                    <span className="text-yellow-400 font-bold">💰 奖励: {stage.goldReward}</span>
                  </div>
                </div>
              </div>
              <button 
                className="px-8 py-3 rounded-xl font-black uppercase bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20"
                onClick={() => onStageSelect(stage)}
              >
                挑战开始
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default MapModule;
