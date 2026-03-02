// GachaEffects.tsx
import React, { useEffect, useState } from 'react';
import styles from './GachaEffects.module.css';

interface GachaEffectsProps {
  isTenPull?: boolean;
}

const GachaEffects: React.FC<GachaEffectsProps> = ({ isTenPull = false }) => {
  const [showLegendary, setShowLegendary] = useState(false);
  
  useEffect(() => {
    if (isTenPull) {
      const timer = setTimeout(() => {
        setShowLegendary(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isTenPull]);

  if (!isTenPull) {
    return (
      <div className={styles.gachaEffect}>
        <div className={styles.spinningCard}>
          <div className={styles.cardFront}>?</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tenPullEffect}>
      {/* 背景光效 */}
      <div className={styles.backgroundGlow}></div>
      
      {/* 十连抽卡片动画 */}
      <div className={styles.tenCardsContainer}>
        {Array.from({ length: 10 }).map((_, index) => (
          <div 
            key={index}
            className={`${styles.tenCard} ${index === 9 ? styles.lastCard : ''}`}
            style={{
              animationDelay: `${index * 0.15}s`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
              zIndex: 10 - index
            }}
          >
            <div className={styles.cardContent}></div>
          </div>
        ))}
      </div>
      
      {/* 传奇提示特效 */}
      {showLegendary && (
        <div className={styles.legendaryAlert}>
          <div className={styles.legendaryText}>✨ 必出稀有以上！✨</div>
        </div>
      )}
      
      {/* 粒子效果 */}
      <div className={styles.particles}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>
      
      {/* 光束效果 */}
      <div className={styles.beamContainer}>
        <div className={styles.beam}></div>
        <div className={styles.beam} style={{ animationDelay: '0.5s' }}></div>
        <div className={styles.beam} style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default GachaEffects;