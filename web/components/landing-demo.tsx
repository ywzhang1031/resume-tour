'use client';

import { useEffect, useId, useState } from 'react';
import { Play, RotateCcw, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

const phases = [
  ['接近地面', '自动或手动降落，感知模块开始检查下方区域。'],
  ['识别水面', '视觉模型识别水面，结合多传感器信息形成判断。'],
  ['输出保护状态', '发布不适宜降落的状态与原因，交给飞控消费。'],
  ['飞控暂停降落', '飞控执行悬停，等待用户选择新的降落位置。'],
];

export function LandingDemo({ animate }: { animate: boolean }) {
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const gradient = useId();
  useEffect(() => {
    if (!playing || !animate) return;
    const timers = [1, 2, 3].map((index) =>
      window.setTimeout(() => setPhase(index), index * 2000),
    );
    timers.push(window.setTimeout(() => setPlaying(false), 8000));
    return () => timers.forEach(window.clearTimeout);
  }, [playing, animate]);
  useEffect(() => {
    if (!animate) setPlaying(false);
  }, [animate]);
  return (
    <section
      className={`landing-demo ${animate ? 'with-motion' : ''}`}
      aria-label="降落保护流程示意"
      onKeyDown={(event) => event.stopPropagation()}
    >
      <div className="demo-heading">
        <span>LANDING PROTECTION</span>
        <span>流程示意 · 非实飞录像</span>
      </div>
      <svg
        viewBox="0 0 480 250"
        role="img"
        aria-label={`${phases[phase][0]}：无人机检测水面并暂停降落`}
      >
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c9f56d" stopOpacity="0.28" />
            <stop offset="1" stopColor="#c9f56d" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path
          d="M0 198 Q65 178 115 193 T220 199 L480 188 V250 H0Z"
          fill="#263221"
        />
        <ellipse cx="250" cy="213" rx="140" ry="25" fill="#294e57" />
        <path
          d="M155 207 Q180 215 208 207 M218 221 Q247 228 277 219 M302 206 Q328 215 352 206"
          fill="none"
          stroke="#75b5bf"
          strokeOpacity=".6"
          strokeWidth="2"
        />
        <path
          d="M240 110 L148 209 Q240 228 334 209 Z"
          fill={`url(#${gradient})`}
          stroke="#c9f56d"
          strokeOpacity={phase > 0 ? '.5' : '.16'}
          strokeDasharray="5 5"
        />
        <g
          className="demo-drone"
          style={{
            transform: `translateY(${phase === 0 ? -26 : phase === 1 ? 0 : -8}px)`,
          }}
        >
          <path
            d="M204 102 L276 118 M204 118 L276 102"
            stroke="#d5dec9"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <rect x="224" y="100" width="32" height="21" rx="8" fill="#d7dfd0" />
          <rect x="237" y="117" width="7" height="6" rx="2" fill="#11160e" />
          <g fill="none" stroke="#a6ba92" strokeWidth="2">
            <ellipse cx="204" cy="101" rx="20" ry="5" />
            <ellipse cx="276" cy="101" rx="20" ry="5" />
            <ellipse cx="204" cy="119" rx="20" ry="5" />
            <ellipse cx="276" cy="119" rx="20" ry="5" />
          </g>
        </g>
        <text x="240" y="242" textAnchor="middle" fill="#b3d6db" fontSize="12">
          水面 / 不适宜降落区域
        </text>
        {phase >= 2 && (
          <g>
            <rect
              x="294"
              y="58"
              width="130"
              height="30"
              rx="7"
              fill="#344323"
              stroke="#697f43"
            />
            <text
              x="359"
              y="77"
              textAnchor="middle"
              fill="#d2f76a"
              fontSize="12"
            >
              {phase === 2 ? '状态：不适宜降落' : '飞控：暂停 / 悬停'}
            </text>
          </g>
        )}
      </svg>
      <div className="demo-progress" aria-label="选择示意步骤">
        {phases.map(([title], index) => (
          <button
            key={title}
            aria-current={phase === index ? 'step' : undefined}
            onClick={() => {
              setPlaying(false);
              setPhase(index);
            }}
          >
            <span>{index + 1}</span>
            {title}
          </button>
        ))}
      </div>
      <div className="demo-caption" aria-live="polite">
        <p>{phases[phase][1]}</p>
        {animate && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (playing) setPlaying(false);
              else {
                setPhase(0);
                setPlaying(true);
              }
            }}
          >
            {playing ? (
              <Pause size={14} />
            ) : phase === 3 ? (
              <RotateCcw size={14} />
            ) : (
              <Play size={14} />
            )}
            {playing ? '暂停' : '播放 8 秒示意'}
          </Button>
        )}
      </div>
    </section>
  );
}
