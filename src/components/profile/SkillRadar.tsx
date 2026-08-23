'use client';

import { motion } from 'framer-motion';

interface Skill {
  label: string;
  value: number;
  color: string;
}

interface SkillRadarProps {
  skills: Skill[];
  size?: number;
  className?: string;
}

export default function SkillRadar({ skills, size = 280, className = '' }: SkillRadarProps) {
  const center = size / 2;
  const radius = (size / 2) - 40;
  const levels = 5;
  const angleStep = (2 * Math.PI) / skills.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = skills
    .map((skill, i) => {
      const point = getPoint(i, skill.value);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  const gridLevels = Array.from({ length: levels }, (_, i) => {
    const r = ((i + 1) / levels) * radius;
    return skills
      .map((_, j) => {
        const angle = angleStep * j - Math.PI / 2;
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
      })
      .join(' ');
  });

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {gridLevels.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="var(--border-clay)"
            strokeWidth={1}
            opacity={0.4 + (i * 0.12)}
          />
        ))}

        {skills.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="var(--border-clay)"
              strokeWidth={1}
              opacity={0.3}
            />
          );
        })}

        <motion.polygon
          points={polygonPoints}
          fill="rgba(0,107,122,0.15)"
          stroke="var(--peacock-blue)"
          strokeWidth={2.5}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {skills.map((skill, i) => {
          const point = getPoint(i, skill.value);
          const labelPoint = getPoint(i, 115);
          return (
            <g key={i}>
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={5}
                fill={skill.color}
                stroke="white"
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              />
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[11px] font-bold"
                fill="var(--text-dark)"
              >
                {skill.label}
              </text>
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                className="text-[10px] font-black"
                fill={skill.color}
              >
                {skill.value}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
