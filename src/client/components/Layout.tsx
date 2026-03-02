import React from 'react';

// 滚动条样式
const scrollbarStyles = `
  /* 滚动条宽度 */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  /* 滚动条轨道 */
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  
  /* 滚动条滑块悬停 */
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  gameState: { gold: number; stamina: number; maxStamina: number };
  onOpenSaveLoad?: () => void; // 新增存档管理回调
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, gameState, onOpenSaveLoad }) => {
  const tabs = [
    { id: 'map', icon: '🗺️', label: '挑战地图' },
    { id: 'gacha', icon: '💎', label: '召唤祭坛' },
    { id: 'inventory', icon: '🎒', label: '精灵中心' },
    { id: 'synthesis', icon: '⭐', label: '升星' },
    { id: 'advance', icon: '✨', label: '进阶' },
    { id: 'equipment', icon: '⚔️', label: '装备库' },
    { id: 'equipSynthesis', icon: '🔮', label: '装备合成' },
    { id: 'pokedex', icon: '📚', label: '图鉴' },
    { id: 'achievements', icon: '🏆', label: '成就' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0b0b1a] text-white">
      <style>{scrollbarStyles}</style>
      {/* 桌面端侧边栏 */}
      <nav className="hidden md:flex flex-col w-64 bg-[#16162d] border-r border-white/5 p-6 sticky top-0 h-screen shrink-0">
        <h1 className="text-2xl font-black text-yellow-500 mb-6 italic tracking-tighter">POKEMASTER</h1>
        <div className="space-y-3 flex-1 overflow-y-auto pr-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <span className="text-xl">{tab.icon}</span>
              <span className="font-bold text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">金币</span>
            <span className="text-yellow-400 font-black">{gameState.gold.toLocaleString()}</span>
          </div>
          <div className="space-y-1">
             <div className="flex justify-between text-xs mb-1">
               <span className="text-gray-400 font-bold uppercase">体力</span>
               <span className="text-green-400 font-bold">{gameState.stamina} / {gameState.maxStamina}</span>
             </div>
             <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
               <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(gameState.stamina / gameState.maxStamina) * 100}%` }} />
             </div>
          </div>
          {/* 存档管理按钮 */}
          {onOpenSaveLoad && (
            <button 
              onClick={onOpenSaveLoad}
              className="w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-sm transition-all shadow-lg"
            >
              📁 存档管理
            </button>
          )}
        </div>
      </nav>

      {/* 移动端顶部状态 */}
      <div className="md:hidden flex justify-between items-center p-4 bg-[#16162d] border-b border-white/5 sticky top-0 z-50">
        <span className="font-black text-yellow-500">POKEMASTER</span>
        <div className="flex gap-4 text-xs">
          <span className="text-yellow-400">💰 {gameState.gold}</span>
          <span className="text-green-400">⚡ {gameState.stamina}</span>
        </div>
        {/* 移动端存档管理按钮 */}
        {onOpenSaveLoad && (
          <button 
            onClick={onOpenSaveLoad}
            className="text-purple-400 hover:text-purple-300 text-lg"
            title="存档管理"
          >
            📁
          </button>
        )}
      </div>

      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0b0b1a] to-[#1a1a2e]">{children}</main>

      {/* 移动端底部导航 */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#16162d] border-t border-white/5 p-2 flex justify-around text-xs z-50">
        {tabs.map(tab => (
           <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center p-1 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-500'}`}>
              <span className="text-xl">{tab.icon}</span>
              <span className="scale-75 origin-top">{tab.label}</span>
           </button>
        ))}
        {onOpenSaveLoad && (
          <button 
            onClick={onOpenSaveLoad}
            className={`flex flex-col items-center p-1 ${activeTab === 'save-load' ? 'text-purple-500' : 'text-gray-500'}`}
          >
            <span className="text-xl">📁</span>
            <span className="scale-75 origin-top">存档</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Layout;