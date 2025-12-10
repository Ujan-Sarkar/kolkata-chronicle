import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Star, MapPin, Calendar, X, Trash2 } from 'lucide-react';
import { useStore } from '@/state/store';
import { Modal } from '@/components/Modal';
import { HeritageButton } from '@/components/HeritageButton';
import { HeritageInput, HeritageTextArea } from '@/components/HeritageInput';
import { HeritageSlider } from '@/components/HeritageSlider';
import type { Place } from '@/types';

type FilterType = 'all' | 'cafe' | 'restaurant';

const Passport = () => {
  const { places, addPlace, deletePlace } = useStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlace, setNewPlace] = useState<Omit<Place, 'id'>>({
    name: '',
    type: 'cafe',
    location: '',
    dateVisited: new Date().toISOString().split('T')[0],
    ratings: { vibe: 3, ambience: 3, food: 3, service: 3 },
    tags: [],
    notes: '',
    imageUrl: '',
  });
  const [tagInput, setTagInput] = useState('');

  const filteredPlaces = places.filter(place => 
    filter === 'all' ? true : place.type === filter
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlace.name || !newPlace.location) return;
    
    addPlace(newPlace);
    setIsModalOpen(false);
    setNewPlace({
      name: '',
      type: 'cafe',
      location: '',
      dateVisited: new Date().toISOString().split('T')[0],
      ratings: { vibe: 3, ambience: 3, food: 3, service: 3 },
      tags: [],
      notes: '',
      imageUrl: '',
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newPlace.tags.includes(tagInput.trim())) {
      setNewPlace(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewPlace(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const getAverageRating = (ratings: Place['ratings']) => {
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
        <span className="label-caps text-primary">PLACES</span>
        <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mt-2">
          Swass Passport
        </h1>
        <p className="font-serif-alt text-muted-foreground mt-2">
          A collection of every café and restaurant that holds a place in the story.
        </p>
      </motion.div>

      {/* Filter & Add */}
      <motion.div 
        className="flex flex-wrap items-center justify-between gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex gap-2">
          {(['all', 'cafe', 'restaurant'] as FilterType[]).map((f) => (
            <HeritageButton
              key={f}
              variant={filter === f ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'cafe' ? 'Cafés' : 'Restaurants'}
            </HeritageButton>
          ))}
        </div>

        <motion.button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground border border-primary/30 hover:border-primary transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span className="font-body text-sm">Add Place</span>
        </motion.button>
      </motion.div>

      {/* Places Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredPlaces.map((place, index) => (
            <motion.div
              key={place.id}
              className="glass-card rounded-xl overflow-hidden group card-lift relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              {/* Delete button */}
              <button
                onClick={() => deletePlace(place.id)}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Image */}
              {place.imageUrl && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={place.imageUrl} 
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* Type tag */}
              <div className="absolute top-4 left-4">
                <span className="font-script text-primary bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full border border-primary/30">
                  {place.type === 'cafe' ? 'Café' : 'Restaurant'}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif-alt text-xl text-foreground mb-2">{place.name}</h3>
                
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{place.location}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="font-script text-primary">{place.dateVisited}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="font-display text-foreground">{getAverageRating(place.ratings)}</span>
                  <span className="text-muted-foreground text-sm">/ 5</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {place.tags.map(tag => (
                    <span 
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Notes preview */}
                {place.notes && (
                  <p className="mt-4 text-sm text-muted-foreground line-clamp-2 italic">
                    "{place.notes}"
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredPlaces.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="font-serif-alt text-xl text-muted-foreground">
            No places found. Start adding your favorite spots!
          </p>
        </motion.div>
      )}

      {/* Add Place Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Place"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HeritageInput
              label="Place Name"
              placeholder="e.g., Mrs. Magpie"
              value={newPlace.name}
              onChange={(e) => setNewPlace(prev => ({ ...prev, name: e.target.value }))}
              required
            />

            <div className="space-y-2">
              <label className="label-caps">Type</label>
              <div className="flex gap-2">
                <HeritageButton
                  type="button"
                  variant={newPlace.type === 'cafe' ? 'primary' : 'ghost'}
                  onClick={() => setNewPlace(prev => ({ ...prev, type: 'cafe' }))}
                >
                  Café
                </HeritageButton>
                <HeritageButton
                  type="button"
                  variant={newPlace.type === 'restaurant' ? 'primary' : 'ghost'}
                  onClick={() => setNewPlace(prev => ({ ...prev, type: 'restaurant' }))}
                >
                  Restaurant
                </HeritageButton>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <HeritageInput
              label="Location"
              placeholder="e.g., Park Street, Kolkata"
              value={newPlace.location}
              onChange={(e) => setNewPlace(prev => ({ ...prev, location: e.target.value }))}
              required
            />

            <HeritageInput
              label="Date Visited"
              type="date"
              value={newPlace.dateVisited}
              onChange={(e) => setNewPlace(prev => ({ ...prev, dateVisited: e.target.value }))}
            />
          </div>

          <HeritageInput
            label="Image URL (optional)"
            placeholder="https://..."
            value={newPlace.imageUrl || ''}
            onChange={(e) => setNewPlace(prev => ({ ...prev, imageUrl: e.target.value }))}
          />

          {/* Ratings */}
          <div className="space-y-4">
            <span className="label-caps">Ratings</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HeritageSlider
                label="Vibe"
                value={newPlace.ratings.vibe}
                onChange={(v) => setNewPlace(prev => ({ ...prev, ratings: { ...prev.ratings, vibe: v } }))}
              />
              <HeritageSlider
                label="Ambience"
                value={newPlace.ratings.ambience}
                onChange={(v) => setNewPlace(prev => ({ ...prev, ratings: { ...prev.ratings, ambience: v } }))}
              />
              <HeritageSlider
                label="Food"
                value={newPlace.ratings.food}
                onChange={(v) => setNewPlace(prev => ({ ...prev, ratings: { ...prev.ratings, food: v } }))}
              />
              <HeritageSlider
                label="Service"
                value={newPlace.ratings.service}
                onChange={(v) => setNewPlace(prev => ({ ...prev, ratings: { ...prev.ratings, service: v } }))}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="label-caps">Tags</label>
            <div className="flex gap-2">
              <HeritageInput
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <HeritageButton type="button" onClick={handleAddTag}>Add</HeritageButton>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {newPlace.tags.map(tag => (
                <span 
                  key={tag}
                  className="flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <HeritageTextArea
            label="Notes"
            placeholder="What made this place special..."
            value={newPlace.notes}
            onChange={(e) => setNewPlace(prev => ({ ...prev, notes: e.target.value }))}
          />

          <div className="flex justify-end gap-4 pt-4">
            <HeritageButton 
              type="button" 
              variant="ghost" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </HeritageButton>
            <HeritageButton type="submit">
              Add to Passport
            </HeritageButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Passport;
