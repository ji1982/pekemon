import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import { showNotification } from '../utils/NotificationUtils';

interface SaveSlot {
  id: number;
  name: string;
  timestamp: number | null;
  gameState: GameState | null;
}

const MAX_SAVE_SLOTS = 5;

interface SaveSlotSelectorProps {
  onStartGame: (saveSlotId: string) => void;
  onLoadGame: (gameState: GameState, saveSlotId: string) => void;
}

const SaveSlotSelector: React.FC<SaveSlotSelectorProps> = ({ onStartGame, onLoadGame }) => {
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>(() => {
    return Array.from({ length: MAX_SAVE_SLOTS }, (_, i) => ({
      id: i + 1,
      name: `存档 ${i + 1}`,
      timestamp: null,
      gameState: null
    }));
  });
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  // 从后端加载所有存档
  useEffect(() => {
    console.log('Loading saves...');
    loadAllSaves();
  }, []);

  const loadAllSaves = async () => {
    try {
      console.log('Fetching saves from /api/saves');
      const response = await fetch('/api/saves');
      console.log('Response status:', response.status);
      if (response.ok) {
        const savesData = await response.json();
        console.log('Saves data:', savesData);
        const updatedSlots = saveSlots.map(slot => {
          const savedData = savesData.find((s: any) => s.id === slot.id);
          return savedData ? {
            ...slot,
            timestamp: savedData.timestamp,
            gameState: savedData.gameState
          } : slot;
        });
        console.log('Updated slots:', updatedSlots);
        setSaveSlots(updatedSlots);
      } else {
        console.error('Failed to load saves:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to load saves:', error);
    } finally {
      console.log('Loading complete, setting loading to false');
      setLoading(false);
    }
  };

  const handleSelectSlot = async (slotId: number) => {
    const slot = saveSlots.find(s => s.id === slotId);
    if (!slot) {
      return;
    }

    // 如果存档有数据，直接加载游戏
    if (slot.gameState) {
      onLoadGame(slot.gameState, slotId.toString());
      return;
    }

    // 如果是空存档，选中它
    setSelectedSlot(slotId);
  };

  const handleStartGame = () => {
    let targetSlotId: number;
    
    if (selectedSlot !== null) {
      // 使用选中的存档
      targetSlotId = selectedSlot;
    } else {
      // 找第一个空存档
      const emptySlot = saveSlots.find(slot => !slot.gameState);
      if (emptySlot) {
        targetSlotId = emptySlot.id;
      } else {
        // 如果没有空存档，使用第一个存档
        targetSlotId = saveSlots[0].id;
      }
    }
    
    onStartGame(targetSlotId.toString());
  };

  const deleteSlot = async (slotId: number) => {
    try {
      const response = await fetch(`/api/saves/${slotId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedSlots = saveSlots.map(slot => 
          slot.id === slotId 
            ? { ...slot, timestamp: null, gameState: null }
            : slot
        );
        setSaveSlots(updatedSlots);
        showNotification(`🗑️ 存档 ${slotId} 已删除！`, 'success');
        setShowDeleteConfirm(null);
        // 如果删除的是选中的存档，取消选中
        if (selectedSlot === slotId) {
          setSelectedSlot(null);
        }
      } else {
        showNotification(`❌ 删除存档 ${slotId} 失败！`, 'error');
      }
    } catch (error) {
      console.error('Failed to delete save:', error);
      showNotification(`❌ 删除存档 ${slotId} 失败！`, 'error');
    }
  };

  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return '空存档';
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
  };

  const getSaveStatusColor = (timestamp: number | null) => {
    if (!timestamp) return 'text-gray-400';
    return 'text-green-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b1a] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p>正在加载存档...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b0b1a] to-[#1a1a2e] text-white p-4">
      <div className="bg-[#16162d] rounded-3xl border border-yellow-500/30 p-8 max-w-4xl w-full">
        <div className="text-center mb-8 relative">
          <img 
            src="/banner.jpg" 
            alt="POKEMASTER"
            className="w-full h-auto max-h-48 object-contain mx-auto mb-4"
          />
          <p className="text-gray-400 text-lg">选择您的冒险起点</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {saveSlots.map((slot) => (
            <div 
              key={slot.id} 
              onClick={() => handleSelectSlot(slot.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedSlot === slot.id 
                  ? 'bg-yellow-600/20 border-yellow-500 shadow-lg shadow-yellow-500/30 scale-105' 
                  : 'bg-[#1c1c3a] border-white/5 hover:bg-[#222244] hover:border-yellow-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-white">{slot.name}</h3>
                {slot.timestamp && (
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(slot.id);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm cursor-pointer"
                  >
                    🗑️
                  </span>
                )}
              </div>
              
              {slot.gameState ? (
                <div className="space-y-1">
                  <p className="text-xs text-green-400">
                    📦 宝可梦: {slot.gameState.inventory.length}只
                  </p>
                  <p className="text-xs text-yellow-400">
                    💰 金币: {slot.gameState.gold.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-2">
                    {formatTimestamp(slot.timestamp)}
                  </p>
                </div>
              ) : (
                <p className={`text-xs mb-3 ${getSaveStatusColor(slot.timestamp)}`}>
                  空存档
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleStartGame}
            className="px-8 py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-black text-xl rounded-xl transition-all shadow-lg shadow-yellow-600/20"
          >
            🎮 开始游戏
          </button>
        </div>

        {/* 删除确认弹窗 */}
        {showDeleteConfirm !== null && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-[#1a1a2e] rounded-3xl border border-red-500/30 p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-red-400 mb-4 text-center">确认删除</h3>
              <p className="text-center text-gray-300 mb-6">
                确定要删除存档 {showDeleteConfirm} 吗？此操作不可恢复！
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => deleteSlot(showDeleteConfirm)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg"
                >
                  删除
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveSlotSelector;
