
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Pokemon, Stage, PokemonType } from '../types';
import { TYPE_CHART, TYPE_COLORS, TYPE_TRANSLATIONS } from '@shared/constants';
import PokemonCard from './PokemonCard';

interface BattleSystemProps {
  playerTeam: Pokemon[];
  stage: Stage;
  onFinish: (win: boolean, rewards: { gold: number }) => void;
}

const BattleSystem: React.FC<BattleSystemProps> = ({ playerTeam, stage, onFinish }) => {
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(0); // 当前出战的玩家队员索引
  const [isFighting, setIsFighting] = useState(false);
  
  // 队员实时血量
  const [hps, setHps] = useState<number[]>(() => playerTeam.map(p => p.baseHp));
  // 敌人当前血量 (取关卡第一个敌人)
  const enemy = stage.enemies[0];
  const [enemyHp, setEnemyHp] = useState(enemy.hp);

  const calculateDamage = useCallback((attacker: any, defender: any, isPlayerAttacking: boolean) => {
    const atk = isPlayerAttacking ? attacker.baseAtk : attacker.atk;
    const def = isPlayerAttacking ? defender.def : defender.baseDef;
    
    let multiplier = 1;
    const aTypes: PokemonType[] = attacker.types;
    const dTypes: PokemonType[] = defender.types;

    aTypes.forEach(at => {
      dTypes.forEach(dt => {
        multiplier *= (TYPE_CHART[at]?.[dt] ?? 1);
      });
    });

    // 基础伤害 = (攻击 - 防御/2) * 属性系数
    const damage = Math.max(Math.floor(atk * 0.1), Math.floor((atk - def * 0.5) * multiplier * (0.9 + Math.random() * 0.2)));
    return { damage, multiplier };
  }, []);

  const nextTurn = useCallback(() => {
    if (hps[activeIdx] <= 0 || enemyHp <= 0) return;

    // 玩家回合
    const pPoke = playerTeam[activeIdx];
    const { damage: pDmg, multiplier: pMult } = calculateDamage(pPoke, enemy, true);
    
    const pLog = `你的 ${pPoke.name} 造成了 ${pDmg} 点伤害! ${pMult > 1 ? '效果拔群!' : pMult < 1 ? '收效甚微...' : ''}`;
    setBattleLog(prev => [pLog, ...prev].slice(0, 8));
    setEnemyHp(curr => Math.max(0, curr - pDmg));

    if (enemyHp - pDmg <= 0) return;

    // 敌人反击
    setTimeout(() => {
      const { damage: eDmg } = calculateDamage(enemy, pPoke, false);
      const eLog = `野生 ${enemy.name} 发动攻击，造成了 ${eDmg} 点伤害!`;
      setBattleLog(prev => [eLog, ...prev].slice(0, 8));
      
      setHps(curr => {
        const next = [...curr];
        next[activeIdx] = Math.max(0, next[activeIdx] - eDmg);
        return next;
      });
    }, 500);

  }, [activeIdx, hps, enemyHp, playerTeam, enemy, calculateDamage]);

  useEffect(() => {
    if (isFighting && enemyHp > 0 && hps[activeIdx] > 0) {
      const timer = setTimeout(nextTurn, 1500);
      return () => clearTimeout(timer);
    }
    // 如果当前宝可梦倒下但还有下一位
    if (hps[activeIdx] <= 0 && activeIdx < playerTeam.length - 1) {
      const log = `${playerTeam[activeIdx].name} 倒下了! 下一位!`;
      setBattleLog(prev => [log, ...prev].slice(0, 8));
      setActiveIdx(i => i + 1);
    }
  }, [isFighting, enemyHp, hps, activeIdx, nextTurn, playerTeam]);

  useEffect(() => {
    if (enemyHp <= 0) {
      setIsFighting(false);
      setTimeout(() => onFinish(true, { gold: stage.goldReward }), 1000);
    } else if (hps.every(hp => hp <= 0)) {
      setIsFighting(false);
      setTimeout(() => onFinish(false, { gold: 0 }), 1000);
    }
  }, [enemyHp, hps, onFinish, stage.goldReward]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        {/* 玩家小队 */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {playerTeam.map((p, i) => (
              <div key={p.id} className={`transition-all ${i === activeIdx ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}>
                <PokemonCard pokemon={p} size="sm" />
                <div className="mt-2 w-full bg-gray-800 h-2 rounded-full overflow-hidden border border-white/10">
                   <div className="h-full bg-green-500 transition-all" style={{ width: `${(hps[i] / p.baseHp) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="text-xl font-bold text-green-400">玩家小队</div>
        </div>

        <div className="text-6xl font-black italic text-red-600 drop-shadow-2xl">VS</div>

        {/* 敌方单位 */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-72 h-[400px] bg-[#221111] border-4 border-red-900 rounded-3xl flex flex-col p-6 items-center justify-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-red-600/10 to-transparent" />
             <h3 className="text-2xl font-black text-red-500 mb-2">{enemy.name}</h3>
             <img src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${enemy.pokedexId.toString().padStart(3, '0')}.png`} className="w-48 h-48 object-contain mb-4 animate-pulse" alt="" />
             <div className="flex gap-2 mb-2">
                {enemy.types.map(t => (
                  <span key={t} className="px-2 py-1 rounded text-[10px] font-bold" style={{ backgroundColor: TYPE_COLORS[t] }}>{TYPE_TRANSLATIONS[t]}</span>
                ))}
             </div>
             <p className="text-gray-400 font-bold uppercase tracking-widest">Lv. {enemy.level} BOSS</p>
          </div>
          <div className="w-full bg-gray-800 h-6 rounded-full overflow-hidden border border-white/10 relative">
             <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(enemyHp / enemy.hp) * 100}%` }} />
             <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">{Math.ceil(enemyHp)} / {enemy.hp} HP</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {!isFighting && enemyHp > 0 && hps.some(h => h > 0) && (
          <button onClick={() => setIsFighting(true)} className="px-16 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 text-xl tracking-widest">
            进入战斗
          </button>
        )}
        
        <div className="w-full bg-[#0a0a1a] border border-white/5 rounded-3xl p-6 h-40 overflow-y-auto font-mono text-sm">
          <div className="text-gray-500 mb-2 border-b border-white/5 pb-2 uppercase text-xs font-black">战斗日志</div>
          {battleLog.length === 0 && <p className="text-gray-600 italic">等待指令...</p>}
          {battleLog.map((log, i) => (
            <div key={i} className={`py-1 ${log.includes('你的') ? 'text-green-400' : 'text-red-400'}`}>
              &gt; {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleSystem;
