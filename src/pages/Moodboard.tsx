import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Image, Quote, Palette, Trash2 } from 'lucide-react';
import { useStore } from '@/state/store';
import { Modal } from '@/components/Modal';
import { HeritageButton } from '@/components/HeritageButton';
import { HeritageInput, HeritageTextArea } from '@/components/HeritageInput';
import type { MoodboardItem } from '@/types';

const Moodboard = () => {
  const { moodboardItems, addMoodboardItem, deleteMoodboardItem } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Omit<MoodboardItem, 'id'>>({
    type: 'image',
    value: '',
    caption: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.value) return;

    addMoodboardItem(newItem);
    setNewItem({ type: 'image', value: '', caption: '' });
    setIsModalOpen(false);
  };

  const typeIcons = {
    image: Image,
    quote: Quote,
    color: Palette,
  };

  // Masonry-like layout with varying heights
  const getItemHeight = (item: MoodboardItem, index: number) => {
    if (item.type === 'color') return 'h-32';
    if (item.type === 'quote') return 'h-auto';
    return index % 3 === 0 ? 'h-64' : 'h-48';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-8 flex items-start justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="label-caps text-primary">MOODBOARD</span>
          <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mt-2">
            Visual Soul
          </h1>
          <p className="font-serif-alt text-muted-foreground mt-2">
            Colors, quotes, and moments that inspire.
          </p>
        </div>

        <HeritageButton onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </HeritageButton>
      </motion.div>

      {/* Moodboard Grid */}
      <motion.div 
        className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence>
          {moodboardItems.map((item, index) => (
            <motion.div
              key={item.id}
              className={`break-inside-avoid glass-card rounded-xl overflow-hidden group relative ${getItemHeight(item, index)}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              layout
            >
              {/* Delete button */}
              <button
                onClick={() => deleteMoodboardItem(item.id)}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {item.type === 'image' && (
                <div className="w-full h-full relative">
                  <img 
                    src={item.value} 
                    alt={item.caption || 'Moodboard image'}
                    className="w-full h-full object-cover"
                  />
                  {item.caption && (
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-espresso/90 to-transparent">
                      <p className="font-script text-primary text-lg">{item.caption}</p>
                    </div>
                  )}
                  {/* Gold border on hover */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 transition-colors rounded-xl" />
                </div>
              )}

              {item.type === 'quote' && (
                <div className="p-6 flex flex-col justify-center h-full min-h-[150px]">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="font-serif-alt text-xl text-foreground italic leading-relaxed">
                    {item.value}
                  </p>
                  {item.caption && (
                    <p className="font-script text-primary mt-4">— {item.caption}</p>
                  )}
                </div>
              )}

              {item.type === 'color' && (
                <div className="h-full flex flex-col">
                  <div 
                    className="flex-1 min-h-[80px]"
                    style={{ backgroundColor: item.value }}
                  />
                  <div className="p-4 bg-card">
                    <p className="font-body text-sm text-muted-foreground uppercase tracking-wide">
                      {item.value}
                    </p>
                    {item.caption && (
                      <p className="font-script text-primary">{item.caption}</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {moodboardItems.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Palette className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="font-serif-alt text-xl text-muted-foreground">
            Your moodboard is empty. Start collecting inspiration!
          </p>
        </motion.div>
      )}

      {/* Add Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add to Moodboard"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type selector */}
          <div className="space-y-2">
            <label className="label-caps">Type</label>
            <div className="flex gap-2">
              {(['image', 'quote', 'color'] as const).map((type) => {
                const Icon = typeIcons[type];
                return (
                  <HeritageButton
                    key={type}
                    type="button"
                    variant={newItem.type === type ? 'primary' : 'ghost'}
                    onClick={() => setNewItem(prev => ({ ...prev, type, value: '' }))}
                    className="flex-1"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </HeritageButton>
                );
              })}
            </div>
          </div>

          {/* Value input based on type */}
          {newItem.type === 'image' && (
            <HeritageInput
              label="Image URL"
              placeholder="https://..."
              value={newItem.value}
              onChange={(e) => setNewItem(prev => ({ ...prev, value: e.target.value }))}
              required
            />
          )}

          {newItem.type === 'quote' && (
            <HeritageTextArea
              label="Quote"
              placeholder="Write something inspiring..."
              value={newItem.value}
              onChange={(e) => setNewItem(prev => ({ ...prev, value: e.target.value }))}
              required
            />
          )}

          {newItem.type === 'color' && (
            <div className="space-y-2">
              <label className="label-caps">Color</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={newItem.value || '#D7B47A'}
                  onChange={(e) => setNewItem(prev => ({ ...prev, value: e.target.value }))}
                  className="w-16 h-16 rounded-lg border-2 border-border cursor-pointer"
                />
                <HeritageInput
                  placeholder="#D7B47A"
                  value={newItem.value}
                  onChange={(e) => setNewItem(prev => ({ ...prev, value: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
          )}

          <HeritageInput
            label="Caption (Optional)"
            placeholder={newItem.type === 'quote' ? 'Attribution' : 'Description'}
            value={newItem.caption || ''}
            onChange={(e) => setNewItem(prev => ({ ...prev, caption: e.target.value }))}
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
              Add to Board
            </HeritageButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Moodboard;
