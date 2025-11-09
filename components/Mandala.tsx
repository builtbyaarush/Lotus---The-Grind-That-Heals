import React from 'react';

interface MandalaProps {
  progress: number; // 0-100
  petals: number;
  aura: number; // 0-100
  isPulsing?: boolean;
}

const Mandala = ({ progress, petals, aura, isPulsing = false }: MandalaProps) => {
  const totalPetals = 8;
  const angleStep = 360 / totalPetals;

  const getAuraStyles = (auraValue: number) => {
    let color = '#a8a29e'; // stone-400
    let strokeColor = '#d6d3d1'; // stone-300
    if (auraValue >= 33 && auraValue < 66) {
        color = '#facc15'; // yellow-400
        strokeColor = '#fde047'; // yellow-300
    } else if (auraValue >= 66) {
        color = '#f59e0b'; // amber-500
        strokeColor = '#fbbf24'; // amber-400
    }
    const glowIntensity = 5 + (auraValue / 100) * 15;
    return {
        filter: `drop-shadow(0 0 ${glowIntensity}px ${color})`,
        '--aura-color': color,
        '--aura-stroke-color': strokeColor,
    } as React.CSSProperties;
  };
  
  const auraStyles = getAuraStyles(aura);

  return (
    <div className={`relative w-48 h-48 md:w-64 md:h-64 ${isPulsing ? 'animate-pulse' : ''}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={auraStyles}>
        {/* Glow is now applied via parent div's filter style */}

        {/* Petals */}
        <g 
            className="origin-center transition-transform duration-1000" 
            style={{ 
                transform: `scale(${0.9 + progress / 1000})`,
            }}
        >
          {Array.from({ length: totalPetals }).map((_, i) => (
            <path
              key={i}
              d="M100 25 C 115 50, 115 75, 100 100 C 85 75, 85 50, 100 25 Z"
              transform={`rotate(${i * angleStep} 100 100)`}
              className={`transition-all duration-700 ease-in-out`}
              stroke="var(--aura-stroke-color)"
              fill="var(--aura-color)"
              fillOpacity="0.2"
              strokeWidth="1"
              style={{ opacity: i < petals ? 1 : 0.15 }}
            />
          ))}
        </g>
        
        {/* Center lines */}
         <g className="origin-center animate-spin-slow">
            {Array.from({ length: 12 }).map((_, i) => (
                <line key={i} x1="100" y1="100" x2="100" y2="40" stroke="var(--aura-stroke-color)" strokeWidth="0.5" strokeLinecap="round" />
            ))}
        </g>
        
        <circle cx="100" cy="100" r="15" className="fill-lotus-background" stroke="var(--aura-stroke-color)" strokeWidth="1" />
      </svg>
    </div>
  );
};

export default Mandala;