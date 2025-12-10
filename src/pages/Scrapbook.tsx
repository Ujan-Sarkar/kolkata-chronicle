import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, MapPin, Camera, Trash2 } from 'lucide-react';
import { useStore } from '@/state/store';
import { Modal } from '@/components/Modal';
import { HeritageButton } from '@/components/HeritageButton';
import { HeritageInput, HeritageTextArea } from '@/components/HeritageInput';
import type { Memory } from '@/types';

const Scrapbook = () => {
  const { memories, places, addMemory, deleteMemory } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemory, setNewMemory] = useState<Omit<Memory, 'id'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    caption: '',
    placeId: '',
    imageUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemory.title || !newMemory.caption) return;

    addMemory(newMemory);
    setNewMemory({
      title: '',
      date: new Date().toISOString().split('T')[0],
      caption: '',
      placeId: '',
      imageUrl: '',
    });
    setIsModalOpen(false);
  };

  const getPlaceName = (placeId?: string) => places.find(p => p.id === placeId)?.name;

  // Group memories by year/month
  const groupedMemories = memories.reduce((acc, memory) => {
    const date = new Date(memory.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(memory);
    return acc;
  }, {} as Record<string, Memory[]>);

  const sortedGroups = Object.entries(groupedMemories).sort((a, b) => b[0].localeCompare(a[0]));

  const formatGroupHeader = (key: string) => {
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-8 flex items-start justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="label-caps text-primary">SCRAPBOOK</span>
          <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mt-2">
            Memory Lane
          </h1>
          <p className="font-serif-alt text-muted-foreground mt-2">
            Polaroids of moments that matter.
          </p>
        </div>

        <HeritageButton onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Memory
        </HeritageButton>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        {memories.length > 0 && (
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-transparent" />
        )}

        <AnimatePresence>
          {sortedGroups.map(([groupKey, groupMemories], groupIndex) => (
            <motion.div
              key={groupKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="mb-12"
            >
              {/* Month/Year marker */}
              <div className="flex items-center gap-4 mb-6 ml-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary-foreground" />
                </div>
                <h2 className="font-serif-alt text-xl text-foreground">
                  {formatGroupHeader(groupKey)}
                </h2>
              </div>

              {/* Memory cards */}
              <div className="space-y-6 ml-16">
                {groupMemories.map((memory, index) => (
                  <motion.div
                    key={memory.id}
                    className="relative group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Polaroid card */}
                    <div className="glass-card rounded-lg p-4 max-w-md transform rotate-1 hover:rotate-0 transition-transform duration-300 card-lift">
                      {/* Delete button */}
                      <button
                        onClick={() => deleteMemory(memory.id)}
                        className="absolute -top-2 -right-2 z-10 p-2 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Image area */}
                      <div className="aspect-[4/3] bg-muted rounded overflow-hidden mb-4">
                        {memory.imageUrl ? (
                          <img 
                            src={memory.imageUrl} 
                            alt={memory.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-12 h-12 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>

                      {/* Caption */}
                      <h3 className="font-serif-alt text-lg text-foreground mb-2">
                        {memory.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                        {memory.caption}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-script text-primary">{memory.date}</span>
                        {memory.placeId && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {getPlaceName(memory.placeId)}
                          </span>
                        )}
                      </div>

                      {/* Tape effect */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-primary/30 rounded-sm" />
                    </div>

                    {/* Timeline connector */}
                    <div className="absolute top-1/2 -left-12 w-8 h-px bg-border" />
                    <div className="absolute top-1/2 -left-14 w-2 h-2 rounded-full bg-secondary border-2 border-primary -translate-y-1/2" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {memories.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="font-serif-alt text-xl text-muted-foreground">
            Your scrapbook is empty. Start capturing memories!
          </p>
        </motion.div>
      )}

      {/* Add Memory Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Capture a Memory"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <HeritageInput
            label="Memory Title"
            placeholder="e.g., Rainy afternoon at Flurys"
            value={newMemory.title}
            onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
            required
          />

          <HeritageInput
            label="Date"
            type="date"
            value={newMemory.date}
            onChange={(e) => setNewMemory(prev => ({ ...prev, date: e.target.value }))}
          />

          <HeritageTextArea
            label="Caption"
            placeholder="What made this moment special..."
            value={newMemory.caption}
            onChange={(e) => setNewMemory(prev => ({ ...prev, caption: e.target.value }))}
            required
          />

          <div className="space-y-2">
            <label className="label-caps">Place (Optional)</label>
            <select
              className="input-heritage w-full"
              value={newMemory.placeId}
              onChange={(e) => setNewMemory(prev => ({ ...prev, placeId: e.target.value }))}
            >
              <option value="">Select a place...</option>
              {places.map(place => (
                <option key={place.id} value={place.id}>{place.name}</option>
              ))}
            </select>
          </div>

          <HeritageInput
            label="Image URL (Optional)"
            placeholder="https://..."
            value={newMemory.imageUrl || ''}
            onChange={(e) => setNewMemory(prev => ({ ...prev, imageUrl: e.target.value }))}
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
              Save Memory
            </HeritageButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Scrapbook;
