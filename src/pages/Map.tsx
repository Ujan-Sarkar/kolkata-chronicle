import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Coffee, Utensils, X } from 'lucide-react';
import { useStore } from '@/state/store';
import { KolkataWatermark } from '@/components/KolkataWatermark';
import type { Place } from '@/types';

const Map = () => {
  const { places } = useStore();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);

  // Generate pseudo-random positions for places on the map
  const getPlacePosition = (place: Place, index: number) => {
    const seed = place.id.charCodeAt(0) + index;
    const x = 15 + ((seed * 17) % 70);
    const y = 15 + ((seed * 23) % 60);
    return { x, y };
  };

  const getAverageRating = (ratings: Place['ratings']) => {
    const values = Object.values(ratings);
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="label-caps text-primary">MAP</span>
        <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mt-2">
          Kolkata Atlas
        </h1>
        <p className="font-serif-alt text-muted-foreground mt-2">
          Your personal map of memories across the city.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map Area */}
        <motion.div 
          className="flex-1 relative glass-card rounded-2xl overflow-hidden min-h-[500px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Map background - vintage paper style */}
          <div className="absolute inset-0 bg-gradient-to-br from-ivory/10 via-secondary/5 to-transparent" />
          
          {/* Hooghly River */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 10 0 Q 25 30 20 50 Q 15 70 25 100"
              fill="none"
              stroke="hsl(var(--teal))"
              strokeWidth="3"
              strokeDasharray="5,3"
              opacity="0.3"
            />
            {/* River label */}
            <text x="12" y="45" fill="hsl(var(--teal))" fontSize="2" fontFamily="Parisienne" opacity="0.5">
              Hooghly
            </text>
          </svg>

          {/* Kolkata landmarks watermark */}
          <div className="absolute bottom-4 left-4 w-64 h-40 opacity-10">
            <KolkataWatermark variant="howrah" />
          </div>

          {/* Place Markers */}
          {places.map((place, index) => {
            const pos = getPlacePosition(place, index);
            const isHovered = hoveredPlace === place.id;
            const isSelected = selectedPlace?.id === place.id;

            return (
              <motion.div
                key={place.id}
                className="absolute cursor-pointer"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onMouseEnter={() => setHoveredPlace(place.id)}
                onMouseLeave={() => setHoveredPlace(null)}
                onClick={() => setSelectedPlace(place)}
              >
                <motion.div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
                    place.type === 'cafe' ? 'bg-primary' : 'bg-accent'
                  } ${isSelected ? 'ring-4 ring-foreground/20' : ''}`}
                  animate={{ scale: isHovered || isSelected ? 1.2 : 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {place.type === 'cafe' ? (
                    <Coffee className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Utensils className="w-5 h-5 text-accent-foreground" />
                  )}

                  {/* Pulse effect */}
                  {(isHovered || isSelected) && (
                    <motion.div
                      className={`absolute inset-0 rounded-full ${
                        place.type === 'cafe' ? 'bg-primary' : 'bg-accent'
                      }`}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </motion.div>

                {/* Hover label */}
                <AnimatePresence>
                  {isHovered && !isSelected && (
                    <motion.div
                      className="absolute left-12 top-0 whitespace-nowrap bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border z-10"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <p className="font-serif-alt text-foreground">{place.name}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Selected Place Card */}
          <AnimatePresence>
            {selectedPlace && (
              <motion.div
                className="absolute bottom-4 right-4 w-80 glass-card rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
              >
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-2 right-2 z-10 p-1 rounded-full bg-muted/80 hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>

                {selectedPlace.imageUrl && (
                  <img 
                    src={selectedPlace.imageUrl} 
                    alt={selectedPlace.name}
                    className="w-full h-32 object-cover"
                  />
                )}

                <div className="p-4">
                  <span className="font-script text-primary text-sm">
                    {selectedPlace.type === 'cafe' ? 'Café' : 'Restaurant'}
                  </span>
                  <h3 className="font-serif-alt text-xl text-foreground mt-1">
                    {selectedPlace.name}
                  </h3>
                  <p className="text-muted-foreground text-sm flex items-center gap-1 mt-2">
                    <MapPin className="w-3 h-3" />
                    {selectedPlace.location}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-primary font-display text-lg">
                      ★ {getAverageRating(selectedPlace.ratings)}
                    </span>
                    <span className="text-muted-foreground text-sm">/ 5</span>
                  </div>
                  {selectedPlace.notes && (
                    <p className="text-sm text-muted-foreground mt-3 italic line-clamp-2">
                      "{selectedPlace.notes}"
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="absolute top-4 left-4 glass-card rounded-lg p-3">
            <p className="label-caps mb-2">Legend</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Coffee className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Café</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                  <Utensils className="w-3 h-3 text-accent-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Restaurant</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Places List */}
        <motion.div 
          className="lg:w-80"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-serif-alt text-lg text-foreground mb-4">All Places</h3>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {places.map((place) => (
                <motion.div
                  key={place.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPlace?.id === place.id 
                      ? 'bg-primary/20 border border-primary/30' 
                      : 'hover:bg-muted/50'
                  } ${hoveredPlace === place.id ? 'bg-muted/30' : ''}`}
                  onClick={() => setSelectedPlace(place)}
                  onMouseEnter={() => setHoveredPlace(place.id)}
                  onMouseLeave={() => setHoveredPlace(null)}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      place.type === 'cafe' ? 'bg-primary/20' : 'bg-accent/20'
                    }`}>
                      {place.type === 'cafe' ? (
                        <Coffee className="w-4 h-4 text-primary" />
                      ) : (
                        <Utensils className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-foreground truncate">{place.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{place.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {places.length === 0 && (
              <div className="text-center py-8">
                <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Add places to see them on the map
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Map;
