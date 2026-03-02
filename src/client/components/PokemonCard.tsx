import React, { memo, useMemo } from 'react';
import { Pokemon, Rarity } from '@shared/types';
import { TYPE_COLORS, TYPE_TRANSLATIONS } from '@shared/constants';
import { getCachedPokemonImage } from '../utils/imageCache';
import { useImageLazyLoad } from '../hooks/useImageLazyLoad';
import { calculatePowerScore } from '../utils/PowerCalculator';
import { getExpForNextLevel } from '../utils/expUtils';

// 稀有度标签映射（图标文本）
const RARITY_ICONS: Record<Rarity, string> = {
  Common: 'N',
  Uncommon: 'R', 
  Rare: 'RR',
  Epic: 'SR',
  Legendary: 'SSR'
};

// 稀有度边框颜色映射（白、绿、蓝、紫、金）
const RARITY_BORDER_COLORS: Record<Rarity, string> = {
  Common: '#FFFFFF',      // 白色
  Uncommon: '#4CAF50',    // 绿色
  Rare: '#2196F3',        // 蓝色
  Epic: '#9C27B0',        // 紫色
  Legendary: '#FFD700'    // 金色
};

// 稀有度发光效果
const RARITY_GLOW_EFFECTS: Record<Rarity, string> = {
  Common: 'none',
  Uncommon: '0 0 10px rgba(76, 175, 80, 0.5)',
  Rare: '0 0 15px rgba(33, 150, 243, 0.6)',
  Epic: '0 0 20px rgba(156, 39, 176, 0.7)',
  Legendary: '0 0 25px rgba(255, 215, 0, 0.8)'
};

// 属性图标组件
const HealthIcon = ({ size = "16" }: { size?: string }) => (
  <span style={{ fontSize: size + 'px' }}>❤️</span>
);

const AttackIcon = ({ size = "16" }: { size?: string }) => (
  <span style={{ fontSize: size + 'px' }}>⚔️</span>
);

const DefenseIcon = ({ size = "16" }: { size?: string }) => (
  <span style={{ fontSize: size + 'px' }}>🛡️</span>
);

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: () => void;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'tiny'; // tiny用于进阶和升星页面
  selected?: boolean;
  show3dEffect?: boolean; // 新增：是否显示3D效果
}

// 使用 React.memo 进行性能优化
const PokemonCard: React.FC<PokemonCardProps> = memo(({ 
  pokemon, 
  onClick, 
  className = "", 
  size = "md", 
  selected,
  show3dEffect = false 
}) => {
  // 安全检查
  if (!pokemon || !pokemon.name) {
    const sizeConfig = {
      container: 'w-32 h-44'
    };
    return (
      <div className={`w-32 h-44 bg-gray-800/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-600 ${sizeConfig.container} ${className}`}>
        <span className="text-4xl text-gray-500">?</span>
      </div>
    );
  }

  // 预计算样式，避免重复计算
  const cardStyles = useMemo(() => {
    const border = RARITY_BORDER_COLORS[pokemon.rarity];
    const glow = RARITY_GLOW_EFFECTS[pokemon.rarity];
    
    return { border, glow };
  }, [pokemon.rarity]);

  // 尺寸相关的样式配置
  const sizeConfig = useMemo(() => {
    switch (size) {
      case 'tiny':
        return {
          container: 'w-20 h-28',
          name: 'text-[8px] font-bold',
          level: 'text-[6px] font-bold',
          rarityIcon: 'w-3 h-3 text-[6px]',
          typeIcon: 'w-1.5 h-1.5 text-[4px]',
          powerScore: 'text-[8px] font-black',
          attributeLabel: 'text-[4px]',
          attributeValue: 'text-[4px] font-bold',
          star: 'text-[5px]',
          iconSize: '5'
        };
      case 'xs':
        return {
          container: 'w-24 h-36',
          name: 'text-[10px] font-bold',
          level: 'text-[8px] font-bold',
          rarityIcon: 'w-4 h-4 text-[8px]',
          typeIcon: 'w-3 h-3 text-[6px]',
          powerScore: 'text-[12px] font-black',
          attributeLabel: 'text-[8px]',
          attributeValue: 'text-[10px] font-bold',
          star: 'text-[12px]',
          iconSize: '8'
        };
      case 'sm':
        return {
          container: 'w-32 h-44',
          name: 'text-xs font-bold',
          level: 'text-[10px] font-bold',
          rarityIcon: 'w-5 h-5 text-[10px]',
          typeIcon: 'w-3 h-3 text-[8px]',
          powerScore: 'text-lg font-black',
          attributeLabel: 'text-xs',
          attributeValue: 'text-sm font-bold',
          star: 'text-lg',
          iconSize: '12'
        };
      case 'md':
        return {
          container: 'w-56 h-80',
          name: 'text-sm font-bold',
          level: 'text-xs font-bold',
          rarityIcon: 'w-6 h-6 text-xs',
          typeIcon: 'w-4 h-4 text-[8px]',
          powerScore: 'text-xl font-black',
          attributeLabel: 'text-xs',
          attributeValue: 'text-sm font-bold',
          star: 'text-xl',
          iconSize: '16'
        };
      case 'lg':
        return {
          container: 'w-72 h-[440px]',
          name: 'text-base font-bold',
          level: 'text-sm font-bold',
          rarityIcon: 'w-8 h-8 text-sm',
          typeIcon: 'w-5 h-5 text-xs',
          powerScore: 'text-2xl font-black',
          attributeLabel: 'text-sm',
          attributeValue: 'text-lg font-bold',
          star: 'text-2xl',
          iconSize: '20'
        };
      default:
        return {
          container: 'w-56 h-80',
          name: 'text-sm font-bold',
          level: 'text-xs font-bold',
          rarityIcon: 'w-6 h-6 text-xs',
          typeIcon: 'w-4 h-4 text-[8px]',
          powerScore: 'text-xl font-black',
          attributeLabel: 'text-xs',
          attributeValue: 'text-sm font-bold',
          star: 'text-xl',
          iconSize: '16'
        };
    }
  }, [size]);

  // 计算综合实力评分（包含装备和技能）
  const powerScore = useMemo(() => calculatePowerScore(pokemon), [pokemon]);



  // 使用图片懒加载
  const { src: imageUrl, imgRef } = useImageLazyLoad(pokemon.pokedexId);

  // 稀有度图标样式
  const rarityIconStyle = useMemo(() => {
    const baseClasses = `${sizeConfig.rarityIcon} rounded-full flex items-center justify-center font-black shadow-md`;
    const rarityClasses: Record<Rarity, string> = {
      Common: 'bg-white text-black',
      Uncommon: 'bg-green-500 text-white',
      Rare: 'bg-blue-500 text-white',
      Epic: 'bg-purple-500 text-white',
      Legendary: 'bg-yellow-600 text-black'
    };
    return `${baseClasses} ${rarityClasses[pokemon.rarity]}`;
  }, [pokemon.rarity, sizeConfig.rarityIcon]);

  return (
    <div 
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 shadow-2xl ${sizeConfig.container} ${className} ${selected ? 'ring-4 ring-yellow-400 scale-105 z-10' : ''}`}
      onClick={onClick}
      style={{
        backgroundColor: '#1a1a1a',
        border: `3px solid ${cardStyles.border}`,
        boxShadow: cardStyles.glow
      }}
    >
      {/* 宝可梦图片作为背景 */}
      <div className="absolute inset-0">
        <img 
          ref={imgRef}
          src={imageUrl} 
          className="w-full h-full object-contain" 
          alt={pokemon.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiPkVycjwvdGV4dD48L3N2Zz4=';
          }}
        />
      </div>
      
      {/* 背景遮罩 - 只在文字区域添加半透明背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      
      {/* 内容容器 */}
      <div className="relative z-10 h-full flex flex-col p-2">
        {/* 顶部区域：稀有度图标 + 名称 + 战力 */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-2">
            {/* 稀有度图标 */}
            <div className={rarityIconStyle}>
              {RARITY_ICONS[pokemon.rarity]}
            </div>
            {/* 名称和等级 */}
            <div className="flex-1 min-w-0">
              <div className={sizeConfig.name}>{pokemon.name}</div>
              <div className={`${sizeConfig.level} text-white`}>Lv.{pokemon.level}</div>
            </div>
          </div>
          {/* 战力显示 - 右上角 */}
          <div className={`text-yellow-400 ${sizeConfig.powerScore} font-black`}>
            {powerScore}
          </div>
        </div>
        
        {/* 中央弹性空间 - 减少占用，让底部信息靠下 */}
        <div className="flex-1 min-h-4"></div>
        
        {/* 底部区域：属性值、星级和种类 - 紧凑排列 */}
        <div className="space-y-1">
          {/* 属性值 - 使用图标替代文字 - 统一高度 */}
          <div className="grid grid-cols-3 gap-1">
            <div className="flex items-center justify-center gap-0.5 h-3">
              <HealthIcon size={sizeConfig.iconSize} />
              <span className={`${sizeConfig.attributeValue} text-red-400`}>{pokemon.baseHp}</span>
            </div>
            <div className="flex items-center justify-center gap-0.5 h-3">
              <AttackIcon size={sizeConfig.iconSize} />
              <span className={`${sizeConfig.attributeValue} text-yellow-400`}>{pokemon.baseAtk}</span>
            </div>
            <div className="flex items-center justify-center gap-0.5 h-3">
              <DefenseIcon size={sizeConfig.iconSize} />
              <span className={`${sizeConfig.attributeValue} text-blue-400`}>{pokemon.baseDef}</span>
            </div>
          </div>
          
          {/* 星级显示 - 统一高度 */}
          <div className="flex justify-center h-3 items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`${sizeConfig.star} ${i < pokemon.stars ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
            ))}
          </div>
          
          {/* 宝可梦种类 - 星级下方 - 统一高度 */}
          <div className="flex justify-center gap-1 h-3 items-center">
            {pokemon.types.map(t => (
              <span key={t} className={`${sizeConfig.typeIcon} rounded-full flex items-center justify-center font-bold shadow-sm w-4 h-4`} style={{ backgroundColor: TYPE_COLORS[t] }}>
                {TYPE_TRANSLATIONS[t]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default PokemonCard;