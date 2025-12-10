import { motion } from 'framer-motion';

interface KolkataWatermarkProps {
  variant?: 'howrah' | 'victoria' | 'tram' | 'combined';
  className?: string;
  opacity?: number;
}

export const KolkataWatermark = ({ 
  variant = 'combined', 
  className = '',
  opacity = 0.05 
}: KolkataWatermarkProps) => {
  // Howrah Bridge SVG path
  const HowrahBridge = () => (
    <svg viewBox="0 0 400 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.5">
      {/* Main arch */}
      <path d="M0 180 Q50 100 100 120 Q150 80 200 100 Q250 80 300 120 Q350 100 400 180" />
      {/* Support beams */}
      <path d="M50 180 L80 120" />
      <path d="M100 180 L100 120" />
      <path d="M150 180 L150 100" />
      <path d="M200 180 L200 100" />
      <path d="M250 180 L250 100" />
      <path d="M300 180 L300 120" />
      <path d="M350 180 L320 120" />
      {/* Cross beams */}
      <path d="M60 150 L140 150" />
      <path d="M160 130 L240 130" />
      <path d="M260 150 L340 150" />
      {/* River line */}
      <path d="M0 190 Q100 195 200 190 Q300 185 400 190" strokeDasharray="5,5" />
    </svg>
  );

  // Victoria Memorial dome
  const VictoriaMemorial = () => (
    <svg viewBox="0 0 300 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.5">
      {/* Main dome */}
      <ellipse cx="150" cy="80" rx="60" ry="50" />
      {/* Dome top */}
      <path d="M150 30 L150 10" />
      <circle cx="150" cy="8" r="3" />
      {/* Building base */}
      <rect x="70" y="80" width="160" height="80" rx="2" />
      {/* Columns */}
      <line x1="90" y1="80" x2="90" y2="160" />
      <line x1="120" y1="80" x2="120" y2="160" />
      <line x1="150" y1="80" x2="150" y2="160" />
      <line x1="180" y1="80" x2="180" y2="160" />
      <line x1="210" y1="80" x2="210" y2="160" />
      {/* Windows */}
      <rect x="100" y="100" width="15" height="25" rx="7" />
      <rect x="140" y="100" width="15" height="25" rx="7" />
      <rect x="180" y="100" width="15" height="25" rx="7" />
      {/* Steps */}
      <path d="M60 160 L240 160 L250 170 L50 170 Z" />
      <path d="M50 170 L250 170 L260 180 L40 180 Z" />
    </svg>
  );

  // Kolkata Tram
  const Tram = () => (
    <svg viewBox="0 0 200 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.5">
      {/* Body */}
      <rect x="20" y="30" width="160" height="50" rx="5" />
      {/* Windows */}
      <rect x="30" y="40" width="20" height="25" rx="2" />
      <rect x="60" y="40" width="20" height="25" rx="2" />
      <rect x="90" y="40" width="20" height="25" rx="2" />
      <rect x="120" y="40" width="20" height="25" rx="2" />
      <rect x="150" y="40" width="20" height="25" rx="2" />
      {/* Roof */}
      <path d="M25 30 Q100 15 175 30" />
      {/* Wheels */}
      <circle cx="50" cy="85" r="8" />
      <circle cx="150" cy="85" r="8" />
      {/* Pantograph */}
      <path d="M100 15 L100 5 L95 0 L105 0 L100 5" />
      {/* Track */}
      <line x1="0" y1="93" x2="200" y2="93" />
    </svg>
  );

  return (
    <motion.div 
      className={`absolute pointer-events-none text-primary ${className}`}
      style={{ opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 2 }}
    >
      {variant === 'howrah' && <HowrahBridge />}
      {variant === 'victoria' && <VictoriaMemorial />}
      {variant === 'tram' && <Tram />}
      {variant === 'combined' && (
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 left-0 w-2/3">
            <HowrahBridge />
          </div>
          <div className="absolute top-0 right-0 w-1/3">
            <VictoriaMemorial />
          </div>
        </div>
      )}
    </motion.div>
  );
};
