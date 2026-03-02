import React, { useState, useEffect } from 'react';
import { GameState } from '../types';

interface SaveSlot {
  id: string;
  name: string;
  timestamp: number;
  hasData: boolean;
  gameState?: GameState; // 添加gameState字段用于显示统计数据
}

interface SaveLoadManagerProps {
  onNewGame: (slotId: string) => void;
  onLoadGame: (gameState: GameState, slotId: string) => void;
  currentSlot?: string;
}

const SaveLoadManager: React.FC<SaveLoadManagerProps> = ({ 
  onNewGame, 
  onLoadGame, 
  currentSlot 
}) => {
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newSlotName, setNewSlotName] = useState('');

  // 加载所有存档槽位
  useEffect(() => {
    const loadSaves = async () => {
      try {
        const response = await fetch('/api/saves');
        if (response.ok) {
          const saves = await response.json();
          setSaveSlots(saves.map((save: any) => ({
            id: save.id,
            name: save.name || `存档 ${save.id}`,
            timestamp: save.timestamp || 0,
            hasData: save.gameState !== null,
            gameState: save.gameState // 保存gameState用于显示统计数据
          })));
        }
      } catch (error) {
        console.error('Failed to load saves:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSaves();
  }, []);

  const handleLoadSave = async (slotId: string) => {
    try {
      const response = await fetch(`/api/saves/${slotId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.gameState) {
          onLoadGame(data.gameState, slotId);
        }
      }
    } catch (error) {
      console.error('Failed to load save:', error);
    }
  };

  const handleCreateNewSave = async () => {
    if (!newSlotName.trim()) return;
    
    setCreatingNew(true);
    try {
      const response = await fetch('/api/saves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSlotName.trim()
        }),
      });
      
      if (response.ok) {
        const newSave = await response.json();
        onNewGame(newSave.id);
        setNewSlotName('');
      }
    } catch (error) {
      console.error('Failed to create new save:', error);
    } finally {
      setCreatingNew(false);
    }
  };

  const handleDeleteSave = async (slotId: string) => {
    if (!confirm('确定要删除这个存档吗？此操作无法撤销！')) return;
    
    try {
      const response = await fetch(`/api/saves/${slotId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSaveSlots(prev => prev.filter(slot => slot.id !== slotId));
      }
    } catch (error) {
      console.error('Failed to delete save:', error);
    }
  };

  // 获取存档的游戏统计数据
  const getSaveStats = (gameState: GameState | undefined) => {
    if (!gameState) {
      return { pokemonCount: 0, gold: 0 };
    }
    return {
      pokemonCount: gameState.inventory.length,
      gold: gameState.gold
    };
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        <p className="text-gray-400 mt-2">加载存档中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-[#16162d] rounded-2xl border border-white/10">
      <h3 className="text-xl font-bold text-center mb-6 text-purple-400">存档管理</h3>
      
      {/* 创建新存档 */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSlotName}
            onChange={(e) => setNewSlotName(e.target.value)}
            placeholder="输入存档名称"
            className="flex-1 px-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && handleCreateNewSave()}
          />
          <button
            onClick={handleCreateNewSave}
            disabled={!newSlotName.trim() || creatingNew}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg font-bold text-sm transition-colors"
          >
            {creatingNew ? '创建中...' : '新建'}
          </button>
        </div>
      </div>

      {/* 存档列表 */}
      <div className="space-y-3">
        {saveSlots.length === 0 ? (
          <p className="text-gray-500 text-center py-4">暂无存档</p>
        ) : (
          saveSlots.map((slot) => {
            const stats = getSaveStats(slot.gameState);
            return (
              <div
                key={slot.id}
                className={`p-3 rounded-lg border transition-all ${
                  currentSlot === slot.id
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-white/20 bg-black/20 hover:border-white/40'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white truncate">
                      {slot.name}
                    </div>
                    {slot.hasData && slot.timestamp && (
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(slot.timestamp).toLocaleString('zh-CN')}
                      </div>
                    )}
                    {!slot.hasData && (
                      <div className="text-xs text-gray-500 mt-1">空存档</div>
                    )}
                    {/* 显示游戏记录统计 */}
                    {slot.hasData && slot.gameState && (
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-green-400">宝可梦: {stats.pokemonCount}只</span>
                        <span className="text-yellow-400">金币: {stats.gold.toLocaleString()}枚</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-3 flex-shrink-0">
                    {slot.hasData ? (
                      <button
                        onClick={() => handleLoadSave(slot.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs font-bold transition-colors"
                      >
                        载入
                      </button>
                    ) : (
                      <button
                        onClick={() => onNewGame(slot.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-xs font-bold transition-colors"
                      >
                        开始
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSave(slot.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-xs font-bold transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SaveLoadManager;