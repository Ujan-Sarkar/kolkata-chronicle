import { motion } from 'framer-motion';

interface HeritageSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const HeritageSlider = ({
  label,
  value,
  onChange,
  min = 1,
  max = 5,
}: HeritageSliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="label-caps">{label}</span>
        <span className="font-display text-primary">{value}</span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute h-full bg-gradient-to-r from-secondary to-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg gold-glow"
          style={{ left: `calc(${percentage}% - 8px)` }}
          whileHover={{ scale: 1.2 }}
        />
      </div>
    </div>
  );
};
