import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Target } from 'lucide-react';
import { useStore } from '@/state/store';
import { HeritageButton } from '@/components/HeritageButton';
import { HeritageInput } from '@/components/HeritageInput';

const Goals2025 = () => {
  const { goals, places, addGoal, toggleGoal, deleteGoal } = useStore();
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalPlaceId, setNewGoalPlaceId] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = goals.filter(g => g.completed).length;
  const progress = goals.length > 0 ? (completedCount / goals.length) * 100 : 0;

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;

    addGoal({
      text: newGoalText.trim(),
      completed: false,
      placeId: newGoalPlaceId || undefined,
    });
    setNewGoalText('');
    setNewGoalPlaceId('');
    setIsAdding(false);
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="label-caps text-primary">GOALS 2025</span>
        <h1 className="font-display text-4xl md:text-5xl text-gradient-gold mt-2">
          25 Dreams for '25
        </h1>
        <p className="font-serif-alt text-muted-foreground mt-2">
          Small steps, big adventures. Track your journey through the year.
        </p>
      </motion.div>

      {/* Progress Ring */}
      <motion.div 
        className="flex justify-center mb-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <svg width="220" height="220" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="110"
              cy="110"
              r="90"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <motion.circle
              cx="110"
              cy="110"
              r="90"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--secondary))" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className="font-display text-5xl text-gradient-gold"
              key={completedCount}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {completedCount}
            </motion.span>
            <span className="text-muted-foreground">of {goals.length}</span>
            <span className="font-script text-primary mt-1">completed</span>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 gold-glow rounded-full opacity-30" />
        </div>
      </motion.div>

      {/* Add Goal */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.form
              key="form"
              onSubmit={handleAddGoal}
              className="glass-card rounded-xl p-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <HeritageInput
                    placeholder="What's your goal?"
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="md:w-48">
                  <select
                    className="input-heritage w-full h-full"
                    value={newGoalPlaceId}
                    onChange={(e) => setNewGoalPlaceId(e.target.value)}
                  >
                    <option value="">Link to place...</option>
                    {places.map(place => (
                      <option key={place.id} value={place.id}>{place.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <HeritageButton 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </HeritageButton>
                <HeritageButton type="submit">Add Goal</HeritageButton>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="button"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <HeritageButton onClick={() => setIsAdding(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Goal
              </HeritageButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Goals List */}
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatePresence>
          {goals.map((goal, index) => {
            const linkedPlace = places.find(p => p.id === goal.placeId);
            
            return (
              <motion.div
                key={goal.id}
                className={`glass-card rounded-xl p-4 flex items-center gap-4 group ${
                  goal.completed ? 'opacity-70' : ''
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: index * 0.03 }}
                layout
              >
                {/* Checkbox */}
                <motion.button
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                    goal.completed 
                      ? 'bg-primary border-primary' 
                      : 'border-border hover:border-primary'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {goal.completed && <Check className="w-4 h-4 text-primary-foreground" />}
                </motion.button>

                {/* Goal text */}
                <div className="flex-1">
                  <p className={`font-body ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {goal.text}
                  </p>
                  {linkedPlace && (
                    <p className="text-sm text-primary font-script mt-1">
                      @ {linkedPlace.name}
                    </p>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/20 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {goals.length === 0 && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="font-serif-alt text-xl text-muted-foreground">
            Start setting your goals for 2025!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Goals2025;
