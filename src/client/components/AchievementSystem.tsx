import React, { useState } from 'react';
import { Achievement } from '@shared/types';
import { ACHIEVEMENTS } from '@shared/achievements';
import { showNotification } from '../utils/NotificationUtils';

interface AchievementSystemProps {
  achievements: Achievement[];
  onClaimReward: (achievementId: string) => void;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({ achievements, onClaimReward }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'incomplete'>('all');

  const filteredAchievements = achievements.filter(ach => {
    if (activeTab === 'completed') return ach.completed;
    if (activeTab === 'incomplete') return !ach.completed;
    return true;
  });

  const getRarityColor = (achievementId: string) => {
    if (achievementId.includes('legendary')) return 'border-yellow-400 bg-yellow-900/20';
    if (achievementId.includes('epic')) return 'border-purple-400 bg-purple-900/20';
    if (achievementId.includes('rare')) return 'border-blue-400 bg-blue-900/20';
    return 'border-gray-400 bg-gray-800/20';
  };

  const getProgressPercentage = (ach: Achievement) => {
    if (!ach.progress || !ach.total) return 0;
    return Math.min(100, (ach.progress / ach.total) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-black text-yellow-400 italic">成就殿堂</h2>
        <p className="text-gray-400 mt-2">完成挑战，获得丰厚奖励！</p>
      </div>

      {/* 成就统计 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/30 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-white">{achievements.filter(a => a.completed).length}</div>
          <div className="text-sm text-gray-400">已完成</div>
        </div>
        <div className="bg-gray-800/30 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-white">{achievements.length}</div>
          <div className="text-sm text-gray-400">总计</div>
        </div>
        <div className="bg-gray-800/30 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {achievements.filter(a => a.completed).reduce((sum, a) => sum + a.reward.gold, 0)}
          </div>
          <div className="text-sm text-gray-400">金币奖励</div>
        </div>
        <div className="bg-gray-800/30 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-400">
            {achievements.filter(a => a.completed && a.reward.items?.length).length}
          </div>
          <div className="text-sm text-gray-400">特殊物品</div>
        </div>
      </div>

      {/* 标签切换 */}
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            activeTab === 'all' 
              ? 'bg-yellow-600 text-white shadow-lg' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          全部 ({achievements.length})
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            activeTab === 'completed' 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          已完成 ({achievements.filter(a => a.completed).length})
        </button>
        <button 
          onClick={() => setActiveTab('incomplete')}
          className={`px-6 py-2 rounded-full font-bold transition-all ${
            activeTab === 'incomplete' 
              ? 'bg-red-600 text-white shadow-lg' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          未完成 ({achievements.filter(a => !a.completed).length})
        </button>
      </div>

      {/* 成就列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map(achievement => {
          const progress = getProgressPercentage(achievement);
          const rarityColor = getRarityColor(achievement.id);
          
          return (
            <div 
              key={achievement.id}
              className={`p-6 rounded-2xl border-2 ${rarityColor} relative overflow-hidden`}
            >
              {/* 稀有度标识 */}
              {achievement.id.includes('legendary') && (
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center rotate-12">
                  <span className="text-black font-black text-xs">传说</span>
                </div>
              )}
              {achievement.id.includes('epic') && (
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center rotate-12">
                  <span className="text-white font-black text-xs">史诗</span>
                </div>
              )}
              {achievement.id.includes('rare') && (
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center rotate-12">
                  <span className="text-white font-black text-xs">稀有</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">{achievement.name}</h3>
                  {achievement.completed && (
                    <span className="text-green-400 font-bold">✓</span>
                  )}
                </div>
                
                <p className="text-gray-400 text-sm">{achievement.description}</p>
                
                {/* 进度条 */}
                {achievement.progress !== undefined && achievement.total !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>进度</span>
                      <span>{achievement.progress}/{achievement.total}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {/* 奖励信息 */}
                <div className="pt-2 border-t border-gray-700/50">
                  <div className="text-sm text-yellow-400 font-bold">
                    奖励: {achievement.reward.gold} 金币
                    {achievement.reward.items && achievement.reward.items.length > 0 && (
                      <span> + {achievement.reward.items.length} 个特殊物品</span>
                    )}
                  </div>
                </div>
                
                {/* 领取按钮 */}
                {achievement.completed && achievement.reward.gold > 0 && (
                  <button
                    onClick={() => onClaimReward(achievement.id)}
                    className="w-full mt-3 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold rounded-lg transition-all"
                  >
                    领取奖励
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 成就说明 */}
      <div className="bg-black/20 p-6 rounded-3xl border border-yellow-500/20 max-w-4xl mx-auto">
        <h3 className="font-bold text-yellow-400 mb-3 text-center">成就系统说明</h3>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>• <span className="text-yellow-400">普通成就</span>：基础游戏目标，奖励适中</li>
          <li>• <span className="text-blue-400">稀有成就</span>：需要一定技巧和时间，奖励丰富</li>
          <li>• <span className="text-purple-400">史诗成就</span>：挑战性较高，奖励非常丰厚</li>
          <li>• <span className="text-yellow-400">传说成就</span>：极难完成，奖励极其珍贵</li>
          <li>• 成就进度会自动追踪，完成后记得领取奖励！</li>
        </ul>
      </div>
    </div>
  );
};

export default AchievementSystem;