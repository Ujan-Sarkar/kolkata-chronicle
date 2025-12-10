import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, BookOpen, Calendar, MapPin, Trash2 } from 'lucide-react';
import { useStore } from '@/state/store';
import { Modal } from '@/components/Modal';
import { HeritageButton } from '@/components/HeritageButton';
import { HeritageInput, HeritageTextArea } from '@/components/HeritageInput';
import type { Friend, Tale } from '@/types';

const TalesVault = () => {
  const { friends, tales, places, addFriend, deleteFriend, addTale, deleteTale } = useStore();
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isAddTaleOpen, setIsAddTaleOpen] = useState(false);
  
  const [newFriend, setNewFriend] = useState({ name: '', color: '#D7B47A' });
  const [newTale, setNewTale] = useState<Omit<Tale, 'id' | 'friendId'>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    story: '',
    placeId: '',
    imageUrl: '',
  });

  const friendColors = ['#D7B47A', '#7B3230', '#2F4F4F', '#7A5230', '#4A3728'];

  const friendTales = selectedFriend 
    ? tales.filter(t => t.friendId === selectedFriend.id)
    : [];

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriend.name) return;
    
    addFriend({
      name: newFriend.name,
      monogram: newFriend.name[0].toUpperCase(),
      color: newFriend.color,
    });
    setNewFriend({ name: '', color: '#D7B47A' });
    setIsAddFriendOpen(false);
  };

  const handleAddTale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTale.title || !newTale.story || !selectedFriend) return;
    
    addTale({
      ...newTale,
      friendId: selectedFriend.id,
    });
    setNewTale({
      title: '',
      date: new Date().toISOString().split('T')[0],
      story: '',
      placeId: '',
      imageUrl: '',
    });
    setIsAddTaleOpen(false);
  };

  const getTaleCount = (friendId: string) => tales.filter(t => t.friendId === friendId).length;
  const getPlaceName = (placeId?: string) => places.find(p => p.id === placeId)?.name;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="label-caps text-primary">TALES VAULT</span>
        <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mt-2">
          Stories & Friends
        </h1>
        <p className="font-serif-alt text-muted-foreground mt-2">
          Every friendship has a story. Every story deserves to be remembered.
        </p>
      </motion.div>

      <div className="flex gap-8">
        {/* Friends Grid */}
        <motion.div 
          className={`${selectedFriend ? 'w-1/2' : 'w-full'} transition-all duration-500`}
          layout
        >
          <div className="flex items-center justify-between mb-4">
            <span className="label-caps">Friends</span>
            <HeritageButton
              variant="tag"
              size="sm"
              onClick={() => setIsAddFriendOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Friend
            </HeritageButton>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence>
              {friends.map((friend, index) => (
                <motion.div
                  key={friend.id}
                  className={`glass-card rounded-xl p-6 cursor-pointer group card-lift relative ${
                    selectedFriend?.id === friend.id ? 'ring-2 ring-primary' : ''
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedFriend(friend)}
                  layout
                >
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFriend(friend.id);
                      if (selectedFriend?.id === friend.id) setSelectedFriend(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  {/* Monogram */}
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2"
                    style={{ 
                      backgroundColor: `${friend.color}20`,
                      borderColor: friend.color,
                    }}
                  >
                    <span 
                      className="font-display text-2xl"
                      style={{ color: friend.color }}
                    >
                      {friend.monogram}
                    </span>
                  </div>

                  <h3 className="font-serif-alt text-center text-foreground">{friend.name}</h3>
                  <p className="text-center text-sm text-muted-foreground mt-1">
                    {getTaleCount(friend.id)} tales
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {friends.length === 0 && (
            <div className="text-center py-12 glass-card rounded-xl">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-serif-alt text-muted-foreground">
                Add your first friend to start writing tales together.
              </p>
            </div>
          )}
        </motion.div>

        {/* Tales Panel (Slide-in) */}
        <AnimatePresence>
          {selectedFriend && (
            <motion.div
              className="w-1/2 glass-card rounded-xl overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Panel Header */}
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="font-serif-alt text-xl text-foreground">
                    Tales with {selectedFriend.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {friendTales.length} stories together
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <HeritageButton
                    variant="tag"
                    size="sm"
                    onClick={() => setIsAddTaleOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Tale
                  </HeritageButton>
                  <button
                    onClick={() => setSelectedFriend(null)}
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Tales List */}
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {friendTales.length > 0 ? (
                  friendTales.map((tale, index) => (
                    <motion.div
                      key={tale.id}
                      className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group relative"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => deleteTale(tale.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>

                      <h4 className="font-serif-alt text-lg text-foreground pr-8">
                        {tale.title}
                      </h4>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="font-script text-primary">{tale.date}</span>
                        </span>
                        {tale.placeId && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {getPlaceName(tale.placeId)}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-muted-foreground leading-relaxed">
                        {tale.story}
                      </p>

                      {tale.imageUrl && (
                        <div className="mt-4 rounded-lg overflow-hidden">
                          <img 
                            src={tale.imageUrl} 
                            alt={tale.title}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="font-serif-alt text-muted-foreground">
                      No tales yet with {selectedFriend.name}. Write your first one!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Friend Modal */}
      <Modal
        isOpen={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
        title="Add a Friend"
        size="sm"
      >
        <form onSubmit={handleAddFriend} className="space-y-6">
          <HeritageInput
            label="Friend's Name"
            placeholder="e.g., Priya"
            value={newFriend.name}
            onChange={(e) => setNewFriend(prev => ({ ...prev, name: e.target.value }))}
            required
          />

          <div className="space-y-2">
            <label className="label-caps">Monogram Color</label>
            <div className="flex gap-3">
              {friendColors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    newFriend.color === color ? 'scale-110 border-foreground' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewFriend(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <HeritageButton 
              type="button" 
              variant="ghost" 
              onClick={() => setIsAddFriendOpen(false)}
            >
              Cancel
            </HeritageButton>
            <HeritageButton type="submit">
              Add Friend
            </HeritageButton>
          </div>
        </form>
      </Modal>

      {/* Add Tale Modal */}
      <Modal
        isOpen={isAddTaleOpen}
        onClose={() => setIsAddTaleOpen(false)}
        title={`New Tale with ${selectedFriend?.name}`}
        size="md"
      >
        <form onSubmit={handleAddTale} className="space-y-6">
          <HeritageInput
            label="Tale Title"
            placeholder="e.g., The Rainy Evening at Flurys"
            value={newTale.title}
            onChange={(e) => setNewTale(prev => ({ ...prev, title: e.target.value }))}
            required
          />

          <HeritageInput
            label="Date"
            type="date"
            value={newTale.date}
            onChange={(e) => setNewTale(prev => ({ ...prev, date: e.target.value }))}
          />

          <div className="space-y-2">
            <label className="label-caps">Place (Optional)</label>
            <select
              className="input-heritage w-full"
              value={newTale.placeId}
              onChange={(e) => setNewTale(prev => ({ ...prev, placeId: e.target.value }))}
            >
              <option value="">Select a place...</option>
              {places.map(place => (
                <option key={place.id} value={place.id}>{place.name}</option>
              ))}
            </select>
          </div>

          <HeritageTextArea
            label="The Story"
            placeholder="Tell the tale..."
            value={newTale.story}
            onChange={(e) => setNewTale(prev => ({ ...prev, story: e.target.value }))}
            required
          />

          <HeritageInput
            label="Image URL (Optional)"
            placeholder="https://..."
            value={newTale.imageUrl || ''}
            onChange={(e) => setNewTale(prev => ({ ...prev, imageUrl: e.target.value }))}
          />

          <div className="flex justify-end gap-4 pt-4">
            <HeritageButton 
              type="button" 
              variant="ghost" 
              onClick={() => setIsAddTaleOpen(false)}
            >
              Cancel
            </HeritageButton>
            <HeritageButton type="submit">
              Save Tale
            </HeritageButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TalesVault;
