import { motion } from 'framer-motion';
import { User, Users, Heart, Home, Sparkles, MapPin, Star } from 'lucide-react';
import { useStore } from '@/state/store';
import type { Mode } from '@/types';

const modeConfig: Record<Mode, { 
  label: string; 
  icon: typeof User; 
  color: string;
  description: string;
  tags: string[];
}> = {
  solo: {
    label: 'Solo',
    icon: User,
    color: 'hsl(var(--teal))',
    description: 'Quiet corners and contemplative moments',
    tags: ['cozy', 'quiet', 'reading'],
  },
  friends: {
    label: 'Friends',
    icon: Users,
    color: 'hsl(var(--primary))',
    description: 'Spaces for laughter and long conversations',
    tags: ['social', 'group', 'fun'],
  },
  family: {
    label: 'Family',
    icon: Home,
    color: 'hsl(var(--secondary))',
    description: 'Comfortable spots for generations to gather',
    tags: ['heritage', 'family-friendly', 'classic'],
  },
  date: {
    label: 'Date',
    icon: Heart,
    color: 'hsl(var(--maroon))',
    description: 'Romantic ambiences for special moments',
    tags: ['romantic', 'intimate', 'aesthetic'],
  },
  special: {
    label: 'Special',
    icon: Sparkles,
    color: 'hsl(var(--gold))',
    description: 'Extraordinary places for celebrations',
    tags: ['celebration', 'special', 'iconic'],
  },
};

const Modes = () => {
  const { currentMode, setCurrentMode, places } = useStore();

  const currentConfig = modeConfig[currentMode];

  // Filter places by mode-appropriate tags
  const filteredPlaces = places.filter(place => 
    place.tags.some(tag => 
      currentConfig.tags.some(modeTag => 
        tag.toLowerCase().includes(modeTag) || modeTag.includes(tag.toLowerCase())
      )
    )
  );

  // If no tagged matches, show all places with good ratings
  const displayPlaces = filteredPlaces.length > 0 
    ? filteredPlaces 
    : places.filter(p => {
        const avg = Object.values(p.ratings).reduce((a, b) => a + b, 0) / 4;
        return avg >= 4;
      });

  const getAverageRating = (ratings: { vibe: number; ambience: number; food: number; service: number }) => {
    const values = Object.values(ratings);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="label-caps text-primary">MODES</span>
        <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mt-2">
          Set the Scene
        </h1>
        <p className="font-serif-alt text-muted-foreground mt-2">
          Different moods, different places. Choose your vibe.
        </p>
      </motion.div>

      {/* Mode Tabs */}
      <motion.div 
        className="flex flex-wrap gap-2 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {(Object.keys(modeConfig) as Mode[]).map((mode) => {
          const config = modeConfig[mode];
          const Icon = config.icon;
          const isActive = currentMode === mode;

          return (
            <motion.button
              key={mode}
              onClick={() => setCurrentMode(mode)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all ${
                isActive 
                  ? 'border-current bg-current/10' 
                  : 'border-border hover:border-current/50'
              }`}
              style={{ 
                color: config.color,
                borderColor: isActive ? config.color : undefined,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-body font-medium">{config.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Current Mode Info */}
      <motion.div
        key={currentMode}
        className="glass-card rounded-2xl p-8 mb-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Background accent */}
        <div 
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: currentConfig.color }}
        />

        <div className="relative z-10 flex items-center gap-6">
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: `${currentConfig.color}20` }}
          >
            <currentConfig.icon className="w-10 h-10" style={{ color: currentConfig.color }} />
          </div>
          <div>
            <h2 className="font-display text-3xl" style={{ color: currentConfig.color }}>
              {currentConfig.label} Mode
            </h2>
            <p className="font-serif-alt text-muted-foreground text-lg mt-1">
              {currentConfig.description}
            </p>
            <div className="flex gap-2 mt-3">
              {currentConfig.tags.map(tag => (
                <span 
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full border"
                  style={{ 
                    borderColor: `${currentConfig.color}50`,
                    color: currentConfig.color,
                    backgroundColor: `${currentConfig.color}10`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recommended Places */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="label-caps">Recommended Places</span>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        </div>

        {displayPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayPlaces.map((place, index) => (
              <motion.div
                key={place.id}
                className="glass-card rounded-xl overflow-hidden card-lift"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                {place.imageUrl && (
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={place.imageUrl} 
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-script text-sm" style={{ color: currentConfig.color }}>
                        {place.type === 'cafe' ? 'Café' : 'Restaurant'}
                      </span>
                      <h3 className="font-serif-alt text-lg text-foreground">{place.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="w-4 h-4 fill-primary" />
                      <span className="font-display">{getAverageRating(place.ratings)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                    <MapPin className="w-3 h-3" />
                    {place.location}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {place.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-card rounded-xl">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-serif-alt text-muted-foreground">
              No places match this mode yet. Add some places to your Passport!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Modes;
