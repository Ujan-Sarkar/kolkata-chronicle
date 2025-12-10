import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useStore } from '@/state/store';
import { HeritageButton } from '@/components/HeritageButton';

const wheelSegments = [
  { label: 'Random Place', color: '#D7B47A', description: 'Visit a place from your Passport' },
  { label: 'Dessert Time', color: '#7B3230', description: 'Treat yourself to something sweet' },
  { label: 'New Adventure', color: '#2F4F4F', description: 'Explore somewhere completely new' },
  { label: 'Coffee Break', color: '#7A5230', description: 'Find the perfect café moment' },
  { label: 'Write a Tale', color: '#4A3728', description: 'Document a memory with a friend' },
  { label: 'Wildcard', color: '#8B4513', description: 'Do something unexpected today' },
];

const TreatWheel = () => {
  const { places } = useStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<typeof wheelSegments[0] | null>(null);
  const [randomPlace, setRandomPlace] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);
    setRandomPlace(null);

    // Random rotation between 5-10 full spins plus random position
    const spins = 5 + Math.random() * 5;
    const randomDegree = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + randomDegree;

    setRotation(totalRotation);

    // Calculate which segment we landed on
    setTimeout(() => {
      const normalizedDegree = (360 - (totalRotation % 360) + 90) % 360;
      const segmentSize = 360 / wheelSegments.length;
      const segmentIndex = Math.floor(normalizedDegree / segmentSize);
      const landedSegment = wheelSegments[segmentIndex % wheelSegments.length];

      setResult(landedSegment);
      setIsSpinning(false);

      // If it's a random place, pick one from passport
      if (landedSegment.label === 'Random Place' && places.length > 0) {
        const randomIndex = Math.floor(Math.random() * places.length);
        setRandomPlace(places[randomIndex].name);
      }
    }, 4000);
  };

  const reset = () => {
    setResult(null);
    setRandomPlace(null);
  };

  const segmentAngle = 360 / wheelSegments.length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="label-caps text-primary">TREAT WHEEL</span>
        <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mt-2">
          Spin Your Fortune
        </h1>
        <p className="font-serif-alt text-muted-foreground mt-2">
          Let fate decide your next indulgence.
        </p>
      </motion.div>

      <div className="flex flex-col items-center gap-12">
        {/* Wheel Container */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-primary drop-shadow-lg" />
          </div>

          {/* Decorative ring */}
          <div className="absolute inset-[-20px] rounded-full border-4 border-primary/20" />
          <div className="absolute inset-[-10px] rounded-full border-2 border-primary/30" />

          {/* Wheel */}
          <motion.div
            ref={wheelRef}
            className="w-80 h-80 md:w-96 md:h-96 rounded-full relative overflow-hidden shadow-2xl"
            style={{ rotate: rotation }}
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.2, 0.8, 0.3, 1] }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {wheelSegments.map((segment, index) => {
                const startAngle = index * segmentAngle - 90;
                const endAngle = startAngle + segmentAngle;

                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;

                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);

                const largeArc = segmentAngle > 180 ? 1 : 0;

                const pathD = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

                // Text position (middle of segment)
                const midAngle = startAngle + segmentAngle / 2;
                const midRad = (midAngle * Math.PI) / 180;
                const textX = 50 + 32 * Math.cos(midRad);
                const textY = 50 + 32 * Math.sin(midRad);

                return (
                  <g key={segment.label}>
                    <path
                      d={pathD}
                      fill={segment.color}
                      stroke="hsl(var(--background))"
                      strokeWidth="0.5"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="3.5"
                      fontFamily="Space Grotesk"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                    >
                      {segment.label.split(' ').map((word, i) => (
                        <tspan key={i} x={textX} dy={i === 0 ? 0 : '4'}>
                          {word}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}
              {/* Center circle */}
              <circle cx="50" cy="50" r="8" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="1" />
              <circle cx="50" cy="50" r="4" fill="hsl(var(--primary))" />
            </svg>
          </motion.div>

          {/* Glow effect when spinning */}
          {isSpinning && (
            <motion.div
              className="absolute inset-[-40px] rounded-full gold-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
        </motion.div>

        {/* Spin Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={spin}
            disabled={isSpinning}
            className={`
              w-24 h-24 rounded-full flex items-center justify-center
              bg-gradient-to-br from-secondary to-wood border-4 border-primary/50
              shadow-lg hover:shadow-xl transition-all
              ${isSpinning ? 'animate-pulse' : 'hover:scale-105'}
            `}
            whileHover={!isSpinning ? { scale: 1.05 } : {}}
            whileTap={!isSpinning ? { scale: 0.95 } : {}}
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.button>
          <p className="text-center mt-4 font-script text-primary text-lg">
            {isSpinning ? 'Spinning...' : 'Spin'}
          </p>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              className="glass-card rounded-xl p-8 text-center max-w-md"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: result.color }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <h3 className="font-display text-2xl text-foreground mb-2">
                {result.label}
              </h3>
              <p className="font-serif-alt text-muted-foreground mb-4">
                {result.description}
              </p>

              {randomPlace && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 mb-4">
                  <p className="label-caps mb-1">Your destination</p>
                  <p className="font-display text-xl text-primary">{randomPlace}</p>
                </div>
              )}

              <HeritageButton variant="ghost" onClick={reset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Spin Again
              </HeritageButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TreatWheel;
